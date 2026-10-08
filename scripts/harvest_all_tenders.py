import sys
import os
import json
import csv
import time
import re
import urllib.request
import urllib.parse
from http.cookiejar import CookieJar
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://manipurtenders.gov.in"
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'}

class TableCellParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_td = False
        self.in_th = False
        self.rows = []
        self.cur_row = []
        self.cur_cell = []
        self.cur_link = None

    def handle_starttag(self, tag, attrs):
        if tag == 'tr':
            self.cur_row = []
        elif tag in ('td', 'th'):
            self.in_td = True
            self.cur_cell = []
            self.cur_link = None
        elif tag == 'a':
            for k, v in attrs:
                if k == 'href':
                    self.cur_link = v

    def handle_data(self, data):
        if self.in_td:
            self.cur_cell.append(data)

    def handle_endtag(self, tag):
        if tag in ('td', 'th'):
            self.in_td = False
            text = " ".join("".join(self.cur_cell).split())
            if self.cur_link:
                self.cur_row.append({'text': text, 'href': self.cur_link})
            else:
                self.cur_row.append({'text': text, 'href': None})
            self.cur_link = None
        elif tag == 'tr':
            if self.cur_row and any(c['text'] for c in self.cur_row):
                self.rows.append(self.cur_row)

def clean_text(val):
    if not val:
        return ""
    return re.sub(r'\s+', ' ', str(val)).strip()

def parse_currency(val):
    if not val:
        return 0.0
    # Remove currency symbol, commas, and whitespace
    clean = re.sub(r'[^\d.]', '', str(val))
    try:
        return float(clean) if clean else 0.0
    except ValueError:
        return 0.0

def make_session():
    cj = CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    opener.addheaders = [('User-Agent', HEADERS['User-Agent'])]
    # Initialize session
    opener.open(BASE_URL + "/nicgep/app")
    return opener

def get_organisations(opener):
    org_url = BASE_URL + "/nicgep/app?page=FrontEndTendersByOrganisation&service=page"
    resp = opener.open(org_url)
    html = resp.read().decode('utf-8', errors='ignore')
    
    parser = TableCellParser()
    parser.feed(html)
    
    orgs = []
    for r in parser.rows:
        if len(r) == 3:
            s_no = r[0]['text']
            name = r[1]['text']
            cnt = r[2]['text']
            link = r[2]['href']
            if s_no.isdigit() and link:
                orgs.append({
                    's_no': int(s_no),
                    'name': name,
                    'count': int(cnt) if cnt.isdigit() else 0,
                    'href': link.replace('&amp;', '&')
                })
    return orgs

def get_tenders_for_org(opener, org):
    url = BASE_URL + org['href']
    resp = opener.open(url)
    html = resp.read().decode('utf-8', errors='ignore')
    
    parser = TableCellParser()
    parser.feed(html)
    
    tenders = []
    for r in parser.rows:
        if len(r) >= 5 and r[0]['text'].isdigit():
            # Standard row: S.No, Published Date, Closing Date, Opening Date, Title/Ref/ID, Chain
            published_date = r[1]['text']
            closing_date = r[2]['text']
            opening_date = r[3]['text']
            title_cell = r[4]
            chain = r[5]['text'] if len(r) > 5 else org['name']
            
            raw_title = title_cell['text']
            detail_link = title_cell['href']
            
            # Extract Title, Ref, and Tender ID from format: [Title] [Ref][Tender ID]
            m = re.findall(r'\[(.*?)\]', raw_title)
            if len(m) >= 3:
                title = m[0]
                ref_no = m[1]
                tender_id = m[2]
            elif len(m) == 2:
                title = m[0]
                ref_no = m[1]
                tender_id = m[1]
            else:
                title = raw_title
                ref_no = ""
                tender_id = f"TENDER_{org['s_no']}_{r[0]['text']}"
                
            tenders.append({
                's_no': r[0]['text'],
                'tender_id': tender_id,
                'ref_no': ref_no,
                'title': title,
                'org_name': org['name'],
                'org_chain': chain,
                'published_date': published_date,
                'closing_date': closing_date,
                'opening_date': opening_date,
                'detail_link': detail_link.replace('&amp;', '&') if detail_link else None
            })
    return tenders

def get_tender_detail(opener, tender):
    if not tender.get('detail_link'):
        return {}
    
    url = BASE_URL + tender['detail_link']
    resp = opener.open(url)
    html = resp.read().decode('utf-8', errors='ignore')
    
    parser = TableCellParser()
    parser.feed(html)
    
    fields = {}
    for r in parser.rows:
        cells = [clean_text(c['text']) for c in r if clean_text(c['text'])]
        # Match Key-Value pairs
        for i in range(len(cells) - 1):
            k = cells[i].lower()
            v = cells[i+1]
            if 'tender value in' in k:
                fields['tender_value'] = parse_currency(v)
                fields['tender_value_raw'] = v
            elif 'tender fee in' in k:
                fields['tender_fee'] = parse_currency(v)
            elif 'emd amount in' in k:
                fields['emd_amount'] = parse_currency(v)
            elif 'work description' in k:
                fields['work_description'] = v
            elif 'product category' in k:
                fields['product_category'] = v
            elif 'contract type' in k:
                fields['contract_type'] = v
            elif 'period of work' in k:
                fields['period_of_work'] = v
            elif 'bid validity' in k:
                fields['bid_validity'] = v
            elif 'location' in k and 'pre bid' not in k:
                fields['location'] = v
            elif 'pincode' in k:
                fields['pincode'] = v
            elif 'bid submission start date' in k:
                fields['bid_submission_start'] = v
            elif 'bid submission end date' in k:
                fields['bid_submission_end'] = v
            elif 'fee payable to' in k:
                fields['fee_payable_to'] = v
            elif 'emd payable to' in k:
                fields['emd_payable_to'] = v
    return fields

def main():
    print("=" * 60)
    print("CHEIRAP AI - MANIPUR LIVE TENDER HARVESTER")
    print("Target: https://manipurtenders.gov.in/nicgep/app")
    print("=" * 60)
    
    opener = make_session()
    print("[1/3] Fetching list of all organisations...")
    orgs = get_organisations(opener)
    print(f"-> Found {len(orgs)} government departments / agencies with active tenders.")
    
    all_tenders = []
    
    print("[2/3] Extracting tender entries per department...")
    for org in orgs:
        print(f"  Fetching: {org['name']} (Expected: {org['count']})...", end="", flush=True)
        try:
            # Need a fresh session if links are tied to session state
            tenders = get_tenders_for_org(opener, org)
            print(f" Done ({len(tenders)} extracted)")
            for t in tenders:
                all_tenders.append(t)
        except Exception as e:
            print(f" Error: {e}")
            # Refresh opener on error
            opener = make_session()
            
    print(f"-> Extracted {len(all_tenders)} active tenders across Manipur.")
    
    print("[3/3] Deep inspecting tender details (values, EMD, fees, dates)...")
    records = []
    for idx, t in enumerate(all_tenders):
        print(f"  [{idx+1}/{len(all_tenders)}] Deep inspecting Tender ID: {t['tender_id']}...", end="", flush=True)
        try:
            details = get_tender_detail(opener, t)
            record = {**t, **details}
            records.append(record)
            val = record.get('tender_value', 0)
            emd = record.get('emd_amount', 0)
            print(f" OK (Value: ₹{val:,.2f} | EMD: ₹{emd:,.2f})")
        except Exception as e:
            print(f" Warning ({e})")
            records.append(t)
        time.sleep(0.5) # respectful delay
        
    # Save to data/raw/tenders_manipur.json
    json_path = "data/raw/tenders_manipur.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print(f"\n[Saved JSON] -> {json_path} ({len(records)} records)")
    
    # Save to data/raw/tenders_manipur.csv
    csv_path = "data/raw/tenders_manipur.csv"
    if records:
        fieldnames = [
            'tender_id', 'ref_no', 'title', 'org_name', 'org_chain',
            'tender_value', 'tender_value_raw', 'emd_amount', 'tender_fee',
            'product_category', 'contract_type', 'period_of_work', 'bid_validity',
            'location', 'pincode', 'published_date', 'closing_date', 'opening_date',
            'bid_submission_start', 'bid_submission_end', 'work_description',
            'fee_payable_to', 'emd_payable_to', 'detail_link'
        ]
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
            writer.writeheader()
            for r in records:
                writer.writerow(r)
        print(f"[Saved CSV]  -> {csv_path} ({len(records)} rows)")

if __name__ == "__main__":
    main()

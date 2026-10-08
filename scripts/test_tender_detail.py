import sys
import urllib.request
from http.cookiejar import CookieJar
from html.parser import HTMLParser
import re

sys.stdout.reconfigure(encoding='utf-8')

cj = CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')]

base = "https://manipurtenders.gov.in"
# 1. Init
opener.open(base + "/nicgep/app")
# 2. Org list
opener.open(base + "/nicgep/app?page=FrontEndTendersByOrganisation&service=page")
# 3. PHED list
org_resp = opener.open(base + "/nicgep/app?component=%24DirectLink&page=FrontEndTendersByOrganisation&service=direct&session=T&sp=SN4yw4tg0yrUN3vdqFegVGQ%3D%3D")
html = org_resp.read().decode('utf-8', errors='ignore')

# Find first tender view link
m = re.search(r'href=[\"\']([^\"\']*FrontEndViewTender[^\"\']*)[\"\']', html)
if m:
    tender_link = base + m.group(1).replace("&amp;", "&")
    print("Navigating to Tender Detail:", tender_link)
    t_resp = opener.open(tender_link)
    t_html = t_resp.read().decode('utf-8', errors='ignore')
    print("Detail status:", t_resp.status, "HTML length:", len(t_html))
    
    # Let's extract key-value pairs from tables
    class DetailParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.in_td = False
            self.rows = []
            self.cur_row = []
            self.cur_cell = []

        def handle_starttag(self, tag, attrs):
            if tag == 'tr':
                self.cur_row = []
            elif tag in ('td', 'th'):
                self.in_td = True
                self.cur_cell = []

        def handle_data(self, data):
            if self.in_td:
                self.cur_cell.append(data)

        def handle_endtag(self, tag):
            if tag in ('td', 'th'):
                self.in_td = False
                text = " ".join("".join(self.cur_cell).split())
                if text:
                    self.cur_row.append(text)
            elif tag == 'tr':
                if self.cur_row:
                    self.rows.append(self.cur_row)

    parser = DetailParser()
    parser.feed(t_html)
    
    print(f"\n--- Extracted {len(parser.rows)} rows from Tender Details ---")
    for r in parser.rows:
        row_str = " | ".join(r)
        if any(term in row_str.lower() for term in ['tender id', 'tender value', 'fee', 'emd', 'location', 'corrigendum', 'period of work', 'bid submission', 'pincode', 'title']):
            print("KEY FIELD:", row_str)

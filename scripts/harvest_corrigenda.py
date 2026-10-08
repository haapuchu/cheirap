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
opener.open(base + "/nicgep/app")

# Check homepage table for corrigenda and tenders
resp = opener.open(base + "/nicgep/app")
html = resp.read().decode('utf-8', errors='ignore')

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

parser = TableCellParser()
parser.feed(html)

corrigenda = []
for r in parser.rows:
    row_text = " | ".join(c['text'] for c in r)
    if 'corrigendum' in row_text.lower() or 'time extension' in row_text.lower() or 'emd amount' in row_text.lower() or 'pre bid meeting' in row_text.lower():
        if len(r) >= 4 and not any('title' in c['text'].lower() for c in r):
            corrigenda.append({
                'title': r[0]['text'],
                'ref_no': r[1]['text'],
                'closing_date': r[2]['text'],
                'opening_date': r[3]['text'],
                'link': r[0]['href']
            })

print(f"Extracted {len(corrigenda)} live corrigenda from homepage:")
for c in corrigenda:
    print(f"- {c['title']} | Ref: {c['ref_no']} | Closing: {c['closing_date']}")


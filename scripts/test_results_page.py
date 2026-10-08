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

# Check Results of Tenders
res_url = base + "/nicgep/app?page=ResultOfTenders&service=page"
resp = opener.open(res_url)
html = resp.read().decode('utf-8', errors='ignore')
print("Results of Tenders status:", resp.status, "HTML length:", len(html))

class SimpleTableParser(HTMLParser):
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

parser = SimpleTableParser()
parser.feed(html)
print(f"Total rows on Results page: {len(parser.rows)}")
for r in parser.rows[:25]:
    print("ROW:", " | ".join(r))

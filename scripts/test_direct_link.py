import urllib.request
import urllib.parse
from http.cookiejar import CookieJar
from html.parser import HTMLParser

cj = CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')]

base = "https://manipurtenders.gov.in"
home_url = base + "/nicgep/app"
resp = opener.open(home_url)

org_url = base + "/nicgep/app?page=FrontEndTendersByOrganisation&service=page"
resp2 = opener.open(org_url)
html = resp2.read().decode('utf-8', errors='ignore')

# Extract all links that contain DirectLink and FrontEndTendersByOrganisation
import re
direct_links = re.findall(r'<a\s+[^>]*href=[\"\']([^\"\']*DirectLink[^\"\']*)[\"\'][^>]*>(.*?)</a>', html, re.DOTALL)
print(f"Found {len(direct_links)} direct links:")
for href, label in direct_links:
    clean_label = re.sub(r'<[^>]+>', '', label).strip()
    print(f"Label: {clean_label} -> Href: {href}")

# Let's test following the first direct link (PHED)
if direct_links:
    first_href = direct_links[0][0].replace("&amp;", "&")
    test_url = base + first_href
    print(f"\nFetching PHED tenders from: {test_url}")
    resp3 = opener.open(test_url)
    html3 = resp3.read().decode('utf-8', errors='ignore')
    print("PHED tenders page status:", resp3.status, "HTML length:", len(html3))
    
    # Check if there is a table of tenders
    class TenderTableParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.in_td = False
            self.in_th = False
            self.rows = []
            self.current_row = []
            self.current_cell = []
            self.current_link = None

        def handle_starttag(self, tag, attrs):
            if tag == 'tr':
                self.current_row = []
            elif tag in ('td', 'th'):
                self.in_td = True
                self.current_cell = []
            elif tag == 'a':
                for k, v in attrs:
                    if k == 'href':
                        self.current_link = v

        def handle_data(self, data):
            if self.in_td:
                self.current_cell.append(data)

        def handle_endtag(self, tag):
            if tag in ('td', 'th'):
                self.in_td = False
                cell_text = " ".join("".join(self.current_cell).split())
                if self.current_link:
                    self.current_row.append((cell_text, self.current_link))
                    self.current_link = None
                else:
                    self.current_row.append(cell_text)
            elif tag == 'tr':
                if self.current_row and any(self.current_row):
                    self.rows.append(self.current_row)

    parser = TenderTableParser()
    parser.feed(html3)
    print(f"Total rows on PHED page: {len(parser.rows)}")
    for r in parser.rows:
        if len(r) >= 3:
            print("TENDER ROW:", r)

import urllib.request
import urllib.parse
from http.cookiejar import CookieJar
from html.parser import HTMLParser

cj = CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')]

# First visit homepage to initialize session/cookies
home_url = "https://manipurtenders.gov.in/nicgep/app"
resp = opener.open(home_url)
print("Home status:", resp.status)

# Now visit Tenders by Organisation
org_url = "https://manipurtenders.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page"
resp2 = opener.open(org_url)
html = resp2.read().decode('utf-8', errors='ignore')
print("Org page status:", resp2.status, "HTML length:", len(html))

class TableTextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_td = False
        self.in_th = False
        self.in_a = False
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
            self.in_a = True
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

parser = TableTextParser()
parser.feed(html)

print(f"Total rows found: {len(parser.rows)}")
for r in parser.rows[:30]:
    print("ROW:", r)

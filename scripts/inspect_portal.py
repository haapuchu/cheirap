import urllib.request
import re
from html.parser import HTMLParser

url = "https://manipurtenders.gov.in/nicgep/app"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

print(f"Downloaded {len(html)} bytes from {url}")

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.current_tag = None
        self.current_href = None
        self.current_text = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.current_tag = 'a'
            for k, v in attrs:
                if k.lower() == 'href':
                    self.current_href = v
            self.current_text = []

    def handle_data(self, data):
        if self.current_tag == 'a':
            self.current_text.append(data)

    def handle_endtag(self, tag):
        if tag == 'a' and self.current_tag == 'a':
            text = " ".join("".join(self.current_text).split())
            if self.current_href and text:
                self.links.append((text, self.current_href))
            self.current_tag = None
            self.current_href = None
            self.current_text = []

parser = LinkParser()
parser.feed(html)

print(f"Total links extracted: {len(parser.links)}")
for text, href in parser.links:
    if any(k in text.lower() for k in ['tender', 'organisation', 'organization', 'active', 'latest', 'phed', 'pwd', 'more', 'view', 'department']):
        print(f"LINK: {text} -> {href}")

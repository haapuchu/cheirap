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

for page in ["FrontEndTendersByLocation", "FrontEndTendersByClassification", "WebCancelledTenderLists"]:
    url = f"{base}/nicgep/app?page={page}&service=page"
    resp = opener.open(url)
    html = resp.read().decode('utf-8', errors='ignore')
    
    # Check if there are direct links or table counts
    direct_links = re.findall(r'<a\s+[^>]*href=[\"\']([^\"\']*DirectLink[^\"\']*)[\"\'][^>]*>(.*?)</a>', html, re.DOTALL)
    print(f"\nPage: {page} -> Status: {resp.status}, HTML len: {len(html)}, DirectLinks: {len(direct_links)}")
    for href, label in direct_links[:5]:
        clean_label = re.sub(r'<[^>]+>', '', label).strip()
        print(f"  {clean_label} -> {href[:80]}...")

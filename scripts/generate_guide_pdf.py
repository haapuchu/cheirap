import os
import sys
import re
import base64
import markdown
from playwright.sync_api import sync_playwright

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

def load_b64(path):
    if os.path.exists(path):
        with open(path, 'rb') as f:
            ext = os.path.splitext(path)[1].lower().replace('.', '')
            mime = "image/png" if ext == "png" else "image/jpeg"
            return f"data:{mime};base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return ""

def generate_pdf():
    print("================================================================================")
    print("CHEIRAP AI: COMPILING COMPREHENSIVE SYSTEM GUIDE PDF")
    print("================================================================================")

    guide_md_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "CHEIRAP_Comprehensive_System_Guide.md")
    with open(guide_md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Pre-process carousel blocks in markdown
    # Replace ````carousel ... ```` with sequential markdown images
    def carousel_replace(match):
        content = match.group(1)
        slides = re.split(r'<!--\s*slide\s*-->', content)
        res = []
        for i, slide in enumerate(slides):
            cleaned = slide.strip()
            if cleaned:
                res.append(cleaned)
        return "\n\n".join(res)

    md_text = re.sub(r'````carousel\s*(.*?)\s*````', carousel_replace, md_text, flags=re.DOTALL)

    # Convert markdown to HTML
    html_body = markdown.markdown(md_text, extensions=['tables', 'fenced_code', 'toc'])

    # Replace image paths with base64 data URIs
    def img_replacer(match):
        alt = match.group(1)
        src = match.group(2)
        # Check potential relative and absolute paths
        local_src = src
        if local_src.startswith("artifacts/"):
            local_src = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", local_src)
        elif local_src.startswith("C:/") or local_src.startswith("c:/"):
            local_src = local_src.replace("/", "\\")
        
        b64_data = load_b64(local_src)
        if b64_data:
            return f'''<div class="figure-container">
  <img src="{b64_data}" alt="{alt}" class="screenshot-img" />
  <div class="figure-caption"><strong>Figure:</strong> {alt}</div>
</div>'''
        else:
            print(f"Warning: image not found at {local_src}")
            return match.group(0)

    html_body = re.sub(r'<img\s+alt="([^"]*)"\s+src="([^"]*)"\s*/*>', img_replacer, html_body)

    # Load Manipur emblem for header/cover
    emblem_b64 = load_b64(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "web", "public", "manipur_emblem_badge.png"))

    # Construct the complete high-fidelity HTML document
    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CHEIRAP AI (ꯆꯩꯔꯥꯞ) — Complete Architectural, Statutory & Operational System Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Meetei+Mayek:wght@400;600;700&display=swap');

  @page {{
    size: A4 portrait;
    margin: 14mm 12mm 16mm 12mm;
    @bottom-left {{
      content: "CHEIRAP AI (ꯆꯩꯔꯥꯞ) • Pre-Award Vigilance System Guide • Government of Manipur";
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      color: #64748b;
    }}
    @bottom-right {{
      content: "Page " counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      font-weight: 600;
      color: #334155;
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    line-height: 1.5;
    font-size: 9.5pt;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }}

  .font-meetei {{
    font-family: 'Noto Sans Meetei Mayek', 'Inter', sans-serif;
  }}

  /* Cover Masthead */
  .doc-masthead {{
    background: linear-gradient(135deg, #002244 0%, #003366 100%);
    border: 2px solid #D4AF37;
    border-radius: 8px;
    padding: 24px;
    color: #ffffff;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 34, 68, 0.15);
  }}

  .masthead-inner {{
    display: flex;
    align-items: center;
    gap: 18px;
  }}

  .emblem-img {{
    width: 64px;
    height: 64px;
    object-contain: contain;
    background: rgba(255, 255, 255, 0.1);
    padding: 4px;
    border-radius: 50%;
    border: 1px solid #D4AF37;
  }}

  .masthead-title {{
    font-size: 16pt;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    margin: 0 0 4px 0;
  }}

  .masthead-dept {{
    font-size: 8.5pt;
    color: #D4AF37;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }}

  .masthead-sub {{
    font-size: 8.5pt;
    color: #cbd5e1;
    margin-top: 2px;
  }}

  /* Typography */
  h1 {{
    font-size: 16pt;
    font-weight: 800;
    color: #003366;
    border-bottom: 2px solid #003366;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }}

  h2 {{
    font-size: 12pt;
    font-weight: 800;
    color: #003366;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 28px;
    margin-bottom: 12px;
    page-break-after: avoid;
    break-after: avoid;
  }}

  /* Force page break before major chapters for crisp reading */
  h2[id^="chapter-"] {{
    page-break-before: always;
    break-before: page;
    margin-top: 0;
    padding-top: 10px;
    border-bottom: 2px solid #003366;
  }}

  h3 {{
    font-size: 10.5pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 16px;
    margin-bottom: 8px;
    page-break-after: avoid;
    break-after: avoid;
  }}

  h4 {{
    font-size: 9.5pt;
    font-weight: 700;
    color: #1e3a8a;
    margin-top: 12px;
    margin-bottom: 6px;
  }}

  p {{
    margin: 0 0 10px 0;
    text-align: justify;
  }}

  strong {{
    font-weight: 700;
    color: #0f172a;
  }}

  ul, ol {{
    margin: 0 0 12px 0;
    padding-left: 20px;
  }}

  li {{
    margin-bottom: 4px;
  }}

  /* Code & Pre */
  code {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 1.5px 4px;
    border-radius: 3px;
    border: 1px solid #e2e8f0;
  }}

  pre {{
    background-color: #0f172a;
    color: #e2e8f0;
    padding: 12px;
    border-radius: 6px;
    font-size: 8pt;
    overflow-x: auto;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  pre code {{
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
  }}

  /* Tables */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 18px 0;
    font-size: 8pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  th {{
    background-color: #003366;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 7px 9px;
    border: 1px solid #002244;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 0.03em;
  }}

  td {{
    padding: 6px 9px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }}

  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}

  /* Figures & Screenshots */
  .figure-container {{
    margin: 14px 0 18px 0;
    text-align: center;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  .screenshot-img {{
    width: 100%;
    max-width: 100%;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    display: block;
    margin: 0 auto;
  }}

  .figure-caption {{
    font-size: 7.5pt;
    color: #475569;
    margin-top: 5px;
    font-style: italic;
  }}

  /* Links */
  a {{
    color: #003366;
    text-decoration: none;
    font-weight: 600;
  }}

  /* Blockquotes / Alerts */
  blockquote {{
    border-left: 3px solid #003366;
    background-color: #f0f7ff;
    padding: 8px 12px;
    margin: 10px 0;
    font-size: 8.5pt;
    color: #1e293b;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  hr {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
  }}
</style>
</head>
<body>

<div class="doc-masthead">
  <div class="masthead-inner">
    {f'<img src="{emblem_b64}" class="emblem-img" alt="Emblem" />' if emblem_b64 else ''}
    <div>
      <div class="masthead-dept">Government of Manipur • Department of Information Technology</div>
      <h1 class="masthead-title">CHEIRAP AI (<span class="font-meetei">ꯆꯩꯔꯥꯞ</span>) — Master System Guide</h1>
      <div class="masthead-sub">Pre-Award e-Procurement Integrity Monitoring System • State Vigilance Commission Official Dossier</div>
    </div>
  </div>
</div>

{html_body}

</body>
</html>"""

    html_out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts", "CHEIRAP_Comprehensive_System_Guide.html")
    with open(html_out_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"✓ Saved compiled HTML source to: {html_out_path}")

    print("[Playwright] Launching Chromium to render PDF...")
    pdf_out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts", "CHEIRAP_Comprehensive_System_Guide.pdf")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(full_html, wait_until='networkidle')
        page.pdf(
            path=pdf_out_path,
            format='A4',
            print_background=True,
            margin={'top': '14mm', 'bottom': '16mm', 'left': '12mm', 'right': '12mm'},
            display_header_footer=False
        )
        browser.close()
    print(f"✓ Master PDF successfully generated at: {pdf_out_path}")

    # Copy to project root workspace for instant accessibility
    root_pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "CHEIRAP_Comprehensive_System_Guide.pdf")
    import shutil
    shutil.copyfile(pdf_out_path, root_pdf_path)
    print(f"✓ Copied PDF to root workspace: {root_pdf_path}")

if __name__ == "__main__":
    generate_pdf()

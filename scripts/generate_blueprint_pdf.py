import os
import sys
import re
import base64
import markdown
import shutil
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

def generate_blueprint_pdf():
    print("================================================================================")
    print("CHEIRAP AI: COMPILING AI BLUEPRINT & ARCHITECTURE SPECIFICATION PDF")
    print("================================================================================")

    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    blueprint_md_path = os.path.join(root_dir, "CHEIRAP_AI_BLUEPRINT.md")
    
    with open(blueprint_md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Convert markdown to HTML
    html_body = markdown.markdown(md_text, extensions=['tables', 'fenced_code', 'toc'])

    emblem_b64 = load_b64(os.path.join(root_dir, "web", "public", "manipur_emblem_badge.png"))

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CHEIRAP AI (ꯆꯩꯔꯥꯞ) — Architectural Blueprint & System Specification</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+Meetei+Mayek:wght@400;600;700&display=swap');

  @page {{
    size: A4 portrait;
    margin: 14mm 14mm 16mm 14mm;
    @bottom-left {{
      content: "CHEIRAP AI (ꯆꯩꯔꯥꯞ) • Architectural Blueprint • Government of Manipur";
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      color: #64748b;
    }}
    @bottom-right {{
      content: "Page " counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      font-weight: 700;
      color: #002244;
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    line-height: 1.55;
    font-size: 8.8pt;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }}

  .font-meetei {{
    font-family: 'Noto Sans Meetei Mayek', 'Inter', sans-serif;
  }}

  /* Top Masthead */
  .doc-masthead {{
    background: linear-gradient(135deg, #001f3f 0%, #002b55 50%, #001529 100%);
    border: 2px solid #D4AF37;
    border-radius: 8px;
    padding: 14px 18px;
    color: #ffffff;
    margin-bottom: 16px;
    box-shadow: 0 4px 14px rgba(0, 31, 63, 0.15);
  }}

  .masthead-inner {{
    display: flex;
    align-items: center;
    gap: 16px;
  }}

  .emblem-img {{
    width: 58px;
    height: 58px;
    object-fit: contain;
    background: rgba(255, 255, 255, 0.12);
    padding: 4px;
    border-radius: 50%;
    border: 1.5px solid #D4AF37;
    flex-shrink: 0;
  }}

  .masthead-dept {{
    font-size: 7.8pt;
    color: #D4AF37;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }}

  .masthead-title {{
    font-size: 15pt;
    font-weight: 900;
    color: #ffffff;
    margin: 2px 0 3px 0;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }}

  .masthead-sub {{
    font-size: 8.2pt;
    color: #cbd5e1;
    font-weight: 500;
  }}

  /* Headings */
  h1 {{
    font-size: 14pt;
    font-weight: 800;
    color: #002244;
    border-bottom: 2px solid #002244;
    padding-bottom: 4px;
    margin-top: 18px;
    margin-bottom: 10px;
    page-break-after: avoid;
    break-after: avoid;
  }}

  h2 {{
    font-size: 11.5pt;
    font-weight: 800;
    color: #003366;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 3px;
    margin-top: 16px;
    margin-bottom: 8px;
    page-break-after: avoid;
    break-after: avoid;
  }}

  h3 {{
    font-size: 9.8pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 12px;
    margin-bottom: 6px;
    page-break-after: avoid;
    break-after: avoid;
  }}

  p {{
    margin: 0 0 8px 0;
  }}

  ul, ol {{
    margin: 0 0 10px 0;
    padding-left: 20px;
  }}

  li {{
    margin-bottom: 4px;
  }}

  /* Code & Mono */
  code {{
    font-family: 'JetBrains Mono', monospace;
    background-color: #f1f5f9;
    padding: 1.5px 5px;
    border-radius: 4px;
    font-size: 7.8pt;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }}

  pre {{
    background-color: #0f172a;
    color: #f8fafc;
    padding: 10px 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    line-height: 1.45;
    margin: 8px 0 12px 0;
    border-left: 3.5px solid #0284c7;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  pre code {{
    background: transparent;
    color: inherit;
    padding: 0;
    border: none;
    font-size: inherit;
  }}

  /* Tables */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 14px 0;
    font-size: 8pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  th {{
    background-color: #002244;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 6px 8px;
    border: 1px solid #001f3f;
    text-transform: uppercase;
    font-size: 7pt;
    letter-spacing: 0.03em;
  }}

  td {{
    padding: 5px 8px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }}

  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}

  blockquote {{
    margin: 8px 0 12px 0;
    padding: 8px 12px;
    background-color: #f0f7ff;
    border-left: 3.5px solid #003366;
    border-radius: 0 6px 6px 0;
    color: #1e293b;
    font-style: italic;
  }}

  hr {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 14px 0;
  }}
</style>
</head>
<body>

<div class="doc-masthead">
  <div class="masthead-inner">
    {f'<img src="{emblem_b64}" class="emblem-img" alt="State Emblem" />' if emblem_b64 else ''}
    <div>
      <div class="masthead-dept">Government of Manipur • Department of Information Technology</div>
      <h1 class="masthead-title">CHEIRAP AI (<span class="font-meetei">ꯆꯩꯔꯥꯞ</span>) — System Architecture Blueprint</h1>
      <div class="masthead-sub">AI4SEVA Hackathon 2026 • Pre-Award Public Procurement Integrity Radar • GePNIC Architecture</div>
    </div>
  </div>
</div>

<div class="content-body">
{html_body}
</div>

</body>
</html>
"""

    html_out = os.path.join(root_dir, "artifacts", "CHEIRAP_AI_BLUEPRINT.html")
    with open(html_out, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"✓ Saved HTML source: {html_out}")

    pdf_out = os.path.join(root_dir, "artifacts", "CHEIRAP_AI_BLUEPRINT.pdf")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(html_content, wait_until='networkidle')
        page.pdf(
            path=pdf_out,
            format='A4',
            print_background=True,
            margin={'top': '14mm', 'bottom': '16mm', 'left': '14mm', 'right': '14mm'},
            display_header_footer=False
        )
        browser.close()
    print(f"✓ Blueprint PDF successfully generated: {pdf_out}")

    # Copy to workspace root
    root_pdf = os.path.join(root_dir, "CHEIRAP_AI_BLUEPRINT.pdf")
    shutil.copyfile(pdf_out, root_pdf)
    print(f"✓ Copied to root workspace: {root_pdf}")

    # Copy to brain artifact directory
    active_brain_dir = r"C:\Users\singh\.gemini\antigravity-ide\brain\5358bf05-2dd2-4509-af70-70835cbc296c"
    if os.path.exists(active_brain_dir):
        brain_pdf = os.path.join(active_brain_dir, "CHEIRAP_AI_BLUEPRINT.pdf")
        shutil.copyfile(pdf_out, brain_pdf)
        print(f"✓ Copied to active brain artifact dir: {brain_pdf}")

if __name__ == "__main__":
    generate_blueprint_pdf()

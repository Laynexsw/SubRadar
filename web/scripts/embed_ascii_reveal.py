"""
SubRadar — Embed Ascii Reveal (Dither + Decode Engine) into code.html
"""
import os

WEB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORE_JS = os.path.join(WEB_DIR, 'js', 'ascii-reveal-core.js')
CODE_HTML = os.path.join(WEB_DIR, 'code.html')

def embed():
    with open(CORE_JS, 'r', encoding='utf-8') as f:
        core_code = f.read()

    # Strip export statement for inline script
    if 'export{' in core_code:
        core_code = core_code.split('export{')[0].strip()
    elif 'export {' in core_code:
        core_code = core_code.split('export {')[0].strip()

    bundle_script = f"""<script id="sr-bundle-ascii-reveal-js">
/* =========================================================================
   SubRadar — Ascii Reveal Dither + Decode Engine
   Direct Port of quanhoangindex/ascii-reveal
   ========================================================================= */
(function () {{
{core_code}

  var ditherDecodePreset = {{
    ramp: " ░▒▓█.:-=+*#%@",
    scramble: "░▒▓█0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=?/",
    mode: "ramp",
    color: "mono",
    cells: [20, 14, 10, 7, 5],
    tick: 55
  }};

  window.srDitherDecodePreset = ditherDecodePreset;

  function initPageAsciiReveal() {{
    var revealFn = window.createAsciiReveal;
    if (typeof revealFn !== 'function') return;

    var targets = [
      {{ sel: '#site-header .header-island-inner', origin: 'center', delay: 0, speed: 1.3 }},
      {{ sel: '[data-od-id="hero"] > div:not(.relative)', origin: 'top-left', delay: 0, speed: 1.2 }},
      {{ sel: '#hero-mock-window', origin: 'top-left', delay: 70, speed: 1.15 }},
      {{ sel: '[data-od-id="sorun"]', origin: 'center', delay: 130, speed: 1.15 }},
      {{ sel: '#ekstre-laboratuvari', origin: 'center', delay: 180, speed: 1.15 }},
      {{ sel: '#hesaplayici', origin: 'center', delay: 240, speed: 1.15 }},
      {{ sel: '#karsilastirma', origin: 'center', delay: 300, speed: 1.15 }},
      {{ sel: '#ozellikler', origin: 'center', delay: 360, speed: 1.15 }},
      {{ sel: '#isletim-sistemleri', origin: 'center', delay: 420, speed: 1.15 }},
      {{ sel: '#fiyatlandirma', origin: 'center', delay: 480, speed: 1.15 }},
      {{ sel: '#faq', origin: 'center', delay: 540, speed: 1.15 }}
    ];

    targets.forEach(function (item) {{
      var els = document.querySelectorAll(item.sel);
      els.forEach(function (el) {{
        if (!el || el.closest('.hidden')) return;
        setTimeout(function () {{
          try {{
            var ctrl = revealFn(el, {{
              preset: ditherDecodePreset,
              duration: 'fast',
              speed: item.speed || 1.15,
              origin: item.origin || 'center'
            }});
            ctrl.reveal().catch(function () {{}});
          }} catch (err) {{
            console.warn('[Ascii Reveal on load]', item.sel, err);
          }}
        }}, item.delay);
      }});
    }});
  }}

  window.srInitAsciiRevealLoader = initPageAsciiReveal;

  if (document.readyState === 'loading') {{
    document.addEventListener('DOMContentLoaded', initPageAsciiReveal);
  }} else {{
    initPageAsciiReveal();
  }}
}})();
</script>"""

    with open(CODE_HTML, 'r', encoding='utf-8') as f:
        code_html = f.read()

    # If already embedded, replace it
    if '<script id="sr-bundle-ascii-reveal-js">' in code_html:
        start_tag = '<script id="sr-bundle-ascii-reveal-js">'
        end_tag = '</script>'
        start_idx = code_html.find(start_tag)
        end_idx = code_html.find(end_tag, start_idx) + len(end_tag)
        code_html = code_html[:start_idx] + bundle_script + code_html[end_idx:]
        print("Updated existing ascii reveal bundle in code.html")
    else:
        # Insert before <script id="sr-pwa-sw">
        marker = '<script id="sr-pwa-sw">'
        if marker in code_html:
            code_html = code_html.replace(marker, bundle_script + '\n\n' + marker)
            print("Inserted ascii reveal bundle before sr-pwa-sw")
        else:
            code_html = code_html.replace('</body>', bundle_script + '\n</body>')
            print("Inserted ascii reveal bundle before </body>")

    with open(CODE_HTML, 'w', encoding='utf-8') as f:
        f.write(code_html)

    print("Successfully embedded ascii reveal bundle into code.html")

if __name__ == '__main__':
    embed()

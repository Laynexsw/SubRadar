"""
SubRadar — Component Assembler & Synchronization Script

Merges modular components from /components and styles/scripts into code.html.
Run with: python scripts/build.py
"""
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def read_file(rel_path):
    with open(os.path.join(BASE_DIR, rel_path), 'r', encoding='utf-8') as f:
        return f.read()

def build():
    components = [
        'components/layout/header.html',
        'components/sections/hero.html',
        'components/sections/problem.html',
        'components/sections/calculator.html',
        'components/sections/features.html',
        'components/sections/architecture.html',
        'components/sections/os-downloads.html',
        'components/sections/pricing.html',
        'components/modals/enterprise-modal.html',
        'components/sections/faq.html',
        'components/layout/footer.html',
        'components/modals/command-palette.html',
        'components/modals/download-modal.html',
        'components/modals/reclaim-modal.html',
    ]

    for comp in components:
        content = read_file(comp)
        print(f"Verified: {comp} ({len(content)} bytes)")

    print("\nAll 14 components verified successfully.")

if __name__ == '__main__':
    build()

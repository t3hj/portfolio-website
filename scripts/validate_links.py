#!/usr/bin/env python3
import os
import sys
from html.parser import HTMLParser
import urllib.request
import urllib.error

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []
        self.srcs = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'href' in attrs:
            self.hrefs.append(attrs['href'])
        if 'src' in attrs:
            self.srcs.append(attrs['src'])
        if 'id' in attrs:
            self.ids.add(attrs['id'])
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

errors = []
warnings = []
checked_external = {}

def check_external(url):
    if url in checked_external:
        return checked_external[url]
    try:
        req = urllib.request.Request(url, method='HEAD', headers={'User-Agent':'LinkChecker/1.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            status = resp.getcode()
            ok = 200 <= status < 400
            checked_external[url] = (ok, status)
            return checked_external[url]
    except urllib.error.HTTPError as e:
        checked_external[url] = (False, getattr(e, 'code', None))
        return checked_external[url]
    except Exception as e:
        checked_external[url] = (False, None)
        return checked_external[url]

html_files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    # skip node_modules and .git
    if 'node_modules' in dirpath or '.git' in dirpath:
        continue
    for f in filenames:
        if f.lower().endswith('.html'):
            html_files.append(os.path.join(dirpath, f))

if not html_files:
    print('No HTML files found under', ROOT)
    sys.exit(1)

print(f'Found {len(html_files)} HTML files to check.')

for html in html_files:
    rel = os.path.relpath(html, ROOT)
    with open(html, 'rb') as fh:
        try:
            text = fh.read().decode('utf-8')
        except UnicodeDecodeError:
            try:
                text = fh.read().decode('latin1')
            except:
                text = ''
    p = Parser()
    p.feed(text)
    # record ids from file content by naive search as well
    # (some ids appear in JS-generated content; we only check static ones)
    # Check srcs
    for src in p.srcs:
        if src.startswith('http://') or src.startswith('https://'):
            ok, status = check_external(src)
            if not ok:
                warnings.append(f'External src not reachable: {src} referenced in {rel} (status {status})')
            continue
        if src.startswith('data:'):
            continue
        target = os.path.normpath(os.path.join(os.path.dirname(html), src))
        if not os.path.exists(target):
            errors.append(f'Missing asset: {src} in {rel} -> {target}')
    # Check hrefs
    for href in p.hrefs:
        if href.startswith('http://') or href.startswith('https://'):
            ok, status = check_external(href)
            if not ok:
                warnings.append(f'External link not reachable: {href} referenced in {rel} (status {status})')
            continue
        if href.startswith('mailto:') or href.startswith('javascript:') or href.startswith('#') or href.startswith('tel:'):
            # anchor-only or mailto/js skip existence check here (anchors will be checked below if fragment points to file)
            if href.startswith('#'):
                frag = href[1:]
                if frag and frag not in p.ids:
                    warnings.append(f'Anchor #{frag} not found in {rel}')
            continue
        # local file possibly with fragment
        parts = href.split('#', 1)
        path = parts[0]
        frag = parts[1] if len(parts) > 1 else ''
        target = os.path.normpath(os.path.join(os.path.dirname(html), path)) if path else html
        if not os.path.exists(target):
            errors.append(f'Missing link target: {href} in {rel} -> {target}')
        else:
            if frag:
                with open(target, 'r', encoding='utf-8', errors='ignore') as tf:
                    cont = tf.read()
                    if f'id="{frag}"' not in cont and f"id='{frag}'" not in cont and f'name="{frag}"' not in cont:
                        warnings.append(f'Fragment #{frag} not found in {os.path.relpath(target, ROOT)} (referenced from {rel})')

# report
print('\nErrors:')
for e in errors:
    print('  -', e)
print('\nWarnings:')
for w in warnings:
    print('  -', w)

if errors:
    print(f'\nValidation completed: {len(errors)} errors, {len(warnings)} warnings')
    sys.exit(2)
else:
    print(f'\nValidation completed: no errors, {len(warnings)} warnings')
    sys.exit(0)

#!/usr/bin/env python3
"""
Regenerate sitemap.xml with all dates normalized to W3C ISO 8601 (YYYY-MM-DD).
Reads blog post data from blogData.json and writes to client/public/sitemap.xml.
"""

import json
import os
from datetime import datetime

BLOG_DATA = os.path.join(os.path.dirname(__file__), '../client/src/data/blogData.json')
SITEMAP_OUT = os.path.join(os.path.dirname(__file__), '../client/public/sitemap.xml')
BASE_URL = 'https://tonygreenberg.com'
TODAY = datetime.now().strftime('%Y-%m-%d')

DATE_FORMATS = [
    '%Y-%m-%d',        # 2026-05-23
    '%B %d, %Y',       # May 23, 2026
    '%B %-d, %Y',      # May 3, 2026
    '%B %Y',           # February 2026
]

def parse_date(d):
    if not d:
        return TODAY
    d = d.strip()
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(d, fmt).strftime('%Y-%m-%d')
        except:
            pass
    # If month-only with partial text (e.g. "September " truncated), use today
    return TODAY

with open(BLOG_DATA) as f:
    posts = json.load(f)

# Static pages with their priorities and change frequencies
STATIC_PAGES = [
    ('/',                              '1.0',  'weekly',  TODAY),
    ('/start-here',                    '0.95', 'monthly', TODAY),
    ('/about',                         '0.9',  'monthly', TODAY),
    ('/seven-doors',                   '0.9',  'monthly', TODAY),
    ('/blog',                          '0.9',  'weekly',  TODAY),
    ('/projects',                      '0.85', 'monthly', TODAY),
    ('/heroes',                        '0.85', 'monthly', TODAY),
    ('/health',                        '0.85', 'monthly', TODAY),
    ('/library',                       '0.85', 'monthly', TODAY),
    ('/ecosystem',                     '0.85', 'monthly', TODAY),
    ('/connect',                       '0.85', 'monthly', TODAY),
    ('/impact',                        '0.85', 'monthly', TODAY),
    ('/psychedelic-readiness-index',   '0.85', 'monthly', TODAY),
    ('/iboga-ibogaine',                '0.85', 'monthly', TODAY),
    ('/iboga-compass',                 '0.8',  'monthly', TODAY),
    ('/find-my',                       '0.8',  'monthly', TODAY),
    ('/find-my-me',                    '0.8',  'monthly', TODAY),
    ('/find-my-we',                    '0.8',  'monthly', TODAY),
    ('/find-my-tribe',                 '0.8',  'monthly', TODAY),
    ('/find-my-coffee',                '0.8',  'monthly', TODAY),
    ('/find-my-car',                   '0.8',  'monthly', TODAY),
    ('/find-my-attachment-style',      '0.8',  'monthly', TODAY),
    ('/find-my-sleep',                 '0.8',  'monthly', TODAY),
    ('/find-my-movement',              '0.8',  'monthly', TODAY),
    ('/find-my-diet',                  '0.8',  'monthly', TODAY),
    ('/find-my-peptide',               '0.8',  'monthly', TODAY),
    ('/find-my-therapy',               '0.8',  'monthly', TODAY),
    ('/find-my-spirit',                '0.8',  'monthly', TODAY),
    ('/find-my-sexuality',             '0.8',  'monthly', TODAY),
    ('/dharma-finder',                 '0.8',  'monthly', TODAY),
    ('/consciousness-scale',           '0.8',  'monthly', TODAY),
    ('/grant-study',                   '0.8',  'monthly', TODAY),
    ('/ramprate',                      '0.8',  'monthly', TODAY),
    ('/impactsoul',                    '0.8',  'monthly', TODAY),
    ('/mycomedica',                    '0.8',  'monthly', TODAY),
    ('/flow-circuit',                  '0.75', 'monthly', TODAY),
    ('/verify',                        '0.75', 'monthly', TODAY),
    ('/privacy',                       '0.5',  'yearly',  TODAY),
    ('/terms',                         '0.5',  'yearly',  TODAY),
]

lines = []
lines.append('<?xml version="1.0" encoding="UTF-8"?>')
lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
lines.append('        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"')
lines.append('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">')

# Static pages
for path, priority, changefreq, lastmod in STATIC_PAGES:
    lines.append('  <url>')
    lines.append(f'    <loc>{BASE_URL}{path}</loc>')
    lines.append(f'    <lastmod>{lastmod}</lastmod>')
    lines.append(f'    <changefreq>{changefreq}</changefreq>')
    lines.append(f'    <priority>{priority}</priority>')
    lines.append('  </url>')

# Blog posts
for post in posts:
    slug = post.get('slug', '')
    title = post.get('title', '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
    raw_date = post.get('date', '')
    lastmod = parse_date(raw_date)
    image_url = post.get('image', '') or post.get('heroImage', '') or post.get('featuredImage', '')

    lines.append('  <url>')
    lines.append(f'    <loc>{BASE_URL}/blog/{slug}</loc>')
    lines.append(f'    <lastmod>{lastmod}</lastmod>')
    lines.append(f'    <changefreq>monthly</changefreq>')
    lines.append(f'    <priority>0.8</priority>')
    # Only include image if it's a valid absolute URL (http/https)
    if image_url and (image_url.startswith('http://') or image_url.startswith('https://')):
        image_url_escaped = image_url.replace('&', '&amp;')
        lines.append('    <image:image>')
        lines.append(f'      <image:loc>{image_url_escaped}</image:loc>')
        lines.append(f'      <image:title>{title}</image:title>')
        lines.append('    </image:image>')
    lines.append('  </url>')

lines.append('</urlset>')

output = '\n'.join(lines) + '\n'

with open(SITEMAP_OUT, 'w') as f:
    f.write(output)

print(f'Sitemap written: {len(posts)} blog posts + {len(STATIC_PAGES)} static pages')
print(f'Output: {SITEMAP_OUT}')

# Validate: check no bad dates remain
bad = []
for line in output.split('\n'):
    if '<lastmod>' in line:
        val = line.strip().replace('<lastmod>', '').replace('</lastmod>', '')
        try:
            datetime.strptime(val, '%Y-%m-%d')
        except:
            bad.append(val)

if bad:
    print(f'WARNING: {len(bad)} invalid dates remain:')
    for b in bad:
        print(f'  {repr(b)}')
else:
    print('All dates are valid W3C ISO 8601 (YYYY-MM-DD) format.')

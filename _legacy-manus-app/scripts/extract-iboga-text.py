import re

files = [
    '/home/ubuntu/tonyg-site/client/src/pages/pri/iboga-module.ts',
    '/home/ubuntu/tonyg-site/client/src/pages/pri/iboga-facility-data.ts',
    '/home/ubuntu/tonyg-site/client/src/pages/pri/iboga-compass-data.ts',
]

total_chars = 0
for f in files:
    with open(f) as fh:
        content = fh.read()
    # Extract string values after common text field names
    pattern = r'(?:description|body|text|title|name|label|excerpt|summary|content|question|option|note|warning|detail|info|heading|subheading):\s*["\`](.*?)["\`]\s*[,}]'
    strings = re.findall(pattern, content, re.DOTALL)
    chars = sum(len(s) for s in strings)
    total_chars += chars
    print(f'{f.split("/")[-1]}: {len(strings)} text fields, {chars} chars')
    # Print first 3 examples
    for s in strings[:3]:
        print(f'  "{s[:80]}..."')

print(f'\nTotal: {total_chars} chars of indexable text')

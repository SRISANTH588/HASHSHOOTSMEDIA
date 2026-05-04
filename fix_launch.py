path = "/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: change script type="module" to regular script for instant execution
content = content.replace(
    '  <!-- APP LAUNCH SCREEN \u2014 Premium Gold Edition -->\n  <script type="module">\n    (async function(){',
    '  <!-- APP LAUNCH SCREEN \u2014 Premium Gold Edition -->\n  <script>\n    (function(){'
)
print("Fix1:", '  <script>\n    (function(){' in content)

# Fix 2: remove the async Firebase background block entirely
marker = '      // Refresh Firebase config in background'
idx = content.find(marker)
if idx != -1:
    end_marker = '      })();'
    end_idx = content.find(end_marker, idx)
    if end_idx != -1:
        content = content[:idx] + content[end_idx + len(end_marker):]
        print("Fix2: async block removed")
    else:
        print("Fix2: end marker not found")
else:
    print("Fix2: start marker not found")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")

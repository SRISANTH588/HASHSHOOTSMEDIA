path = "/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The onerror line uses single quotes inside a JS single-quoted string
# Need to escape the inner single quotes with backslash
import re

# Find and fix the onerror pattern - replace unescaped single quotes around linear-gradient
bad  = """onerror="this.parentElement.style.background='linear-gradient(135deg,#1a1408,#0a0a0a)'" />'\n"""
good = """onerror="this.parentElement.style.background=\\'linear-gradient(135deg,#1a1408,#0a0a0a)\\'" />'\n"""

if bad in content:
    content = content.replace(bad, good)
    print("Fixed onerror")
else:
    # Try finding it differently
    idx = content.find("onerror=\"this.parentElement.style.background=")
    if idx != -1:
        end = content.find("/>'\n", idx)
        old_chunk = content[idx:end+4]
        print("Found chunk:", repr(old_chunk[:100]))
        # Replace single quotes around the gradient value
        new_chunk = old_chunk.replace(
            "background='linear-gradient(135deg,#1a1408,#0a0a0a)'",
            "background=\\'linear-gradient(135deg,#1a1408,#0a0a0a)\\'"
        )
        content = content[:idx] + new_chunk + content[idx+len(old_chunk):]
        print("Fixed via index")
    else:
        print("NOT FOUND")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
r = subprocess.run(['node', 'extract_js.js'], cwd='/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE', capture_output=True, text=True)
r2 = subprocess.run(['node', '--check', '/tmp/launch_test.js'], capture_output=True, text=True)
print(r2.stdout or r2.stderr or "SYNTAX OK")

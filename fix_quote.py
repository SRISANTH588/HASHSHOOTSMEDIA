path = "/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

bad  = "onerror=\"this.parentElement.style.background='linear-gradient(135deg,#1a1408,#0a0a0a)'\""
good = 'onerror="this.parentElement.style.background=\'linear-gradient(135deg,#1a1408,#0a0a0a)\'"'

if bad in content:
    content = content.replace(bad, good)
    print("Fixed onerror quote issue")
else:
    print("Not found, trying alternate...")
    idx = content.find("onerror")
    while idx != -1:
        snippet = content[idx:idx+120]
        if "linear-gradient" in snippet:
            print("Found at:", idx)
            print(repr(snippet))
            break
        idx = content.find("onerror", idx+1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")

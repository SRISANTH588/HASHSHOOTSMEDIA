path = "/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken string concatenation on line 1632
# The issue is: '</div>'+'\n          '<div ...
# Should be:   '</div>'+\n          '<div ...
bad  = "          '<div style=\"position:absolute;inset:0;background:radial-gradient(ellipse 75% 55% at 50% 45%,rgba(201,168,76,0.11) 0%,transparent 65%);\"></div>'+'\n          '<div style=\"position:absolute;top:50%;left:50%"
good = "          '<div style=\"position:absolute;inset:0;background:radial-gradient(ellipse 75% 55% at 50% 45%,rgba(201,168,76,0.11) 0%,transparent 65%);\"></div>'+\n          '<div style=\"position:absolute;top:50%;left:50%"

if bad in content:
    content = content.replace(bad, good, 1)
    print("Syntax fix applied")
else:
    print("Pattern not found, searching...")
    idx = content.find("transparent 65%);\"></div>")
    print("Found at:", idx)
    print(repr(content[idx:idx+60]))

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")

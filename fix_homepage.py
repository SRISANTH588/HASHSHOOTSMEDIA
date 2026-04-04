import re

with open('index.html', 'r') as f:
    content = f.read()

# Increase all inline max-width:1200px to 1400px in section wrappers
content = content.replace('max-width:1200px;margin:0 auto', 'max-width:1400px;margin:0 auto')
content = content.replace('max-width:1200px; margin:0 auto', 'max-width:1400px; margin:0 auto')
content = content.replace('max-width: 1200px; margin: 0 auto', 'max-width: 1400px; margin: 0 auto')

# Increase inline max-width:1100px (hiw-inner, etc)
content = content.replace('max-width:1100px;margin:0 auto', 'max-width:1300px;margin:0 auto')
content = content.replace('max-width: 1100px; margin: 0 auto', 'max-width: 1300px; margin: 0 auto')

# Increase max-width:1000px (app-cta)
content = content.replace('max-width:1000px;margin:0 auto', 'max-width:1200px;margin:0 auto')
content = content.replace('max-width: 1000px; margin: 0 auto', 'max-width: 1200px; margin: 0 auto')

with open('index.html', 'w') as f:
    f.write(content)

print("Done")

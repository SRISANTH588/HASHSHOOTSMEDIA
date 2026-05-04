path = "/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the launch script block and clean all unicode comment chars
import re

si = content.find('<!-- APP LAUNCH SCREEN - Premium Gold Edition -->')
ei = content.rfind('</body>\n</html>') + len('</body>\n</html>')

launch_block = content[si:ei]

# Replace unicode em-dash sequences in JS comments with plain ASCII
launch_block = launch_block.replace('\u2500\u2500', '--')
launch_block = launch_block.replace('\u2550\u2550', '==')
launch_block = launch_block.replace('\u2550', '=')
launch_block = launch_block.replace('\u2500', '-')
launch_block = launch_block.replace('\u2192', '->')
launch_block = launch_block.replace('\u2014', '--')
launch_block = launch_block.replace('\u2013', '-')

content = content[:si] + launch_block

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Validate
import subprocess
result = subprocess.run(['node', '-e', '''
const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const si = html.indexOf('APP LAUNCH SCREEN');
const chunk = html.slice(si, si+60000);
const s = chunk.indexOf('<script>') + 8;
const e = chunk.lastIndexOf('</script>');
const js = chunk.slice(s,e);
try { new Function(js); console.log('SYNTAX OK'); } catch(err){ console.error('ERROR:',err.message); }
'''], capture_output=True, text=True, cwd='/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE')
print(result.stdout.strip() or result.stderr.strip())

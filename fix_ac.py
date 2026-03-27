path = "/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: new(window.AudioContext...) needs space after new
content = content.replace(
    '_ac=new(window.AudioContext||window.webkitAudioContext)()',
    '_ac=new (window.AudioContext||window.webkitAudioContext)()'
)
print("Fix1 done:", '_ac=new (window.AudioContext' in content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Now validate
import subprocess, sys
result = subprocess.run(['node', '-e', '''
const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const si = html.indexOf('APP LAUNCH SCREEN');
const chunk = html.slice(si, si+60000);
const s = chunk.indexOf('<script>') + 8;
const e = chunk.lastIndexOf('</script>');
const js = chunk.slice(s,e);
try { new Function(js); console.log('SYNTAX OK'); } catch(err){ console.error('ERROR:',err.message); }
'''], capture_output=True, text=True)
print(result.stdout.strip())
print(result.stderr.strip())

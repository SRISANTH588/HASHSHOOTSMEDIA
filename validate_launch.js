const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const si = html.indexOf('APP LAUNCH SCREEN');
const chunk = html.slice(si, si+60000);
const s = chunk.indexOf('<script>') + 8;
const e = chunk.lastIndexOf('</script>');
const js = chunk.slice(s,e);
try {
  new Function(js);
  console.log('SYNTAX OK - launch screen is valid JS');
} catch(err) {
  console.error('SYNTAX ERROR:', err.message);
  // Find line number
  const lines = js.split('\n');
  const match = err.stack.match(/<anonymous>:(\d+)/);
  if(match){
    const ln = parseInt(match[1]);
    console.log('Around line', ln, ':');
    for(let i=Math.max(0,ln-3);i<Math.min(lines.length,ln+2);i++){
      console.log(i+1, lines[i]);
    }
  }
}

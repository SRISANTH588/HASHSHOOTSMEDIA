const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const si = html.indexOf('APP LAUNCH SCREEN');
const chunk = html.slice(si, si+60000);
const s = chunk.indexOf('<script>') + 8;
const e = chunk.lastIndexOf('</script>');
const js = chunk.slice(s,e);

// Find 'linear' outside strings
let inStr=false, strChar='', i=0;
while(i<js.length){
  const c=js[i];
  if(!inStr && (c==='"'||c==="'")){inStr=true;strChar=c;}
  else if(inStr && c===strChar && js[i-1]!=='\\'){inStr=false;}
  else if(!inStr && js.slice(i,i+6)==='linear'){
    const ctx=js.slice(Math.max(0,i-80),i+80);
    console.log('Found bare linear at pos',i);
    console.log(ctx);
    break;
  }
  i++;
}
if(i>=js.length) console.log('No bare linear found');

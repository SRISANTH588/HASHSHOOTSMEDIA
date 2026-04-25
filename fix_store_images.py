with open('admin.html', 'r') as f:
    content = f.read()

old = """      var fsItems = remaining.map(function(t){ return Object.assign({}, t, { image: t.image && t.image.startsWith('http') ? t.image : '' }); });
      if(window.fbUpdate) fbUpdate('settings', 'tshirts', {items: fsItems});"""

new = """      if(window.fbUpdate) fbUpdate('settings', 'tshirts', {items: remaining});"""

if old in content:
    content = content.replace(old, new)
    with open('admin.html', 'w') as f:
        f.write(content)
    print('deleteTshirt fix: True')
else:
    print('deleteTshirt fix: Not found')

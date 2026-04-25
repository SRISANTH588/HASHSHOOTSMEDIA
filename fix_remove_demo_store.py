with open('staff.html', 'r') as f:
    content = f.read()

# Remove dashboard stat box for demos
content = content.replace(
    '        <div class="stat-box"><div class="num" id="statDemos">0</div><div class="lbl">Demo Sessions</div></div>\n',
    ''
)

# Remove dashboard quick-link card for demos
start = content.find('        <div onclick="switchTab(\'demos\',document.querySelector(\'[onclick*=demos]\')')
end = content.find('</div>\n', start)
end = content.find('</div>\n', end + 1)  # close outer div
if start != -1 and end != -1:
    content = content[:start] + content[end + 7:]
    print('Removed staff demo dashboard card')
else:
    print('Staff demo dashboard card not found', start, end)

# Remove store firebase listeners
content = content.replace(
    "        try{ fbListenDoc('settings', 'store_settings',function(data){ localStorage.setItem('hs_store_settings', JSON.stringify(data)); if(document.getElementById('sec-store') && document.getElementById('sec-store').classList.contains('active')) renderStore(); }); }catch(e){}\n",
    ''
)
content = content.replace(
    "        try{ fbListenDoc('settings', 'tshirts',       function(data){ if(data.items){ localStorage.setItem('hs_tshirts', JSON.stringify(data.items)); localStorage.setItem('hs_products', JSON.stringify(data.items)); } if(document.getElementById('sec-store') && document.getElementById('sec-store').classList.contains('active')) renderStore(); }); }catch(e){}\n",
    ''
)
content = content.replace(
    "        try{ fbListenDoc('settings', 'idcard',        function(data){ localStorage.setItem('hs_idcard', JSON.stringify(data)); if(document.getElementById('sec-store') && document.getElementById('sec-store').classList.contains('active')) renderStore(); }); }catch(e){}\n",
    ''
)

with open('staff.html', 'w') as f:
    f.write(content)
print('Staff cleanup done')

# ── ADMIN.HTML cleanup ──
with open('admin.html', 'r') as f:
    content = f.read()

# Remove demoTabBtn reference in switchTab logic
content = content.replace(
    "        'demo': 'demoTabBtn', 'shoot-reels': 'shootReelsTabBtn', 'app-feedback': 'appFeedbackTabBtn',",
    "        'shoot-reels': 'shootReelsTabBtn', 'app-feedback': 'appFeedbackTabBtn',"
)
content = content.replace(
    "        'homepage': 'homepageTabBtn', 'wedding-plans': 'weddingPlansTabBtn', 'store': 'storeTabBtn',",
    "        'homepage': 'homepageTabBtn', 'wedding-plans': 'weddingPlansTabBtn',"
)

# Remove the demoTabBtn switchTab call
content = content.replace(
    "      var demoBtn = document.getElementById('demoTabBtn');\n      switchTab('demo', demoBtn);\n",
    ''
)

with open('admin.html', 'w') as f:
    f.write(content)
print('Admin cleanup done')

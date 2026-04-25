with open('admin.html', 'r') as f:
    content = f.read()

# Fix 1: switch from map+return to forEach+try/catch+_html
content = content.replace(
    "var _html = '';\n      list.forEach(function(a){\n        try {\n        var status = a.status || 'assigned';",
    "var _html = '';\n      list.forEach(function(a){\n        try {\n        var status = a.status || 'assigned';"
)

# Fix 2: a.status.charAt crash — use safe status variable
content = content.replace(
    "a.status.charAt(0).toUpperCase()+a.status.slice(1)",
    "status.charAt(0).toUpperCase()+status.slice(1)"
)

# Fix 3: remaining a.status === checks inside the card HTML (WhatsApp buttons)
content = content.replace(
    "(a.status==='done'||a.status==='completed'||a.status==='paid') ? '<button onclick=\"sendStepMsg",
    "(status==='done'||status==='completed'||status==='paid') ? '<button onclick=\"sendStepMsg"
)
content = content.replace(
    "a.status==='paid' ? '<button onclick=\"sendStepMsg",
    "status==='paid' ? '<button onclick=\"sendStepMsg"
)

# Fix 4: change return to _html +=
content = content.replace(
    "        return '<div style=\"background:#111;border:1px solid rgba(201,168,76,0.12);border-left:3px solid '+color+';border-radius:12px;padding:1.1rem 1.25rem;margin-bottom:0.75rem;\">'\n          + '<div style=\"display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem;\">'\n          + '<div>'\n          + '<div style=\"font-size:0.62rem;font-weight:800;color:rgba(201,168,76,0.6);letter-spacing:2px;text-transform:uppercase;margin-bottom:0.2rem;\">Order ID:",
    "        _html += '<div style=\"background:#111;border:1px solid rgba(201,168,76,0.12);border-left:3px solid '+color+';border-radius:12px;padding:1.1rem 1.25rem;margin-bottom:0.75rem;\">'\n          + '<div style=\"display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem;\">'\n          + '<div>'\n          + '<div style=\"font-size:0.62rem;font-weight:800;color:rgba(201,168,76,0.6);letter-spacing:2px;text-transform:uppercase;margin-bottom:0.2rem;\">Order ID:"
)

# Fix 5: close forEach with try/catch and set innerHTML
content = content.replace(
    "          + '</div>';\n      }).join('');\n    }\n\n    function adminVideoSection(a){",
    "          + '</div>';\n        } catch(err){ console.error('card err', a && a.id, err); }\n      });\n      el.innerHTML = _html;\n    }\n\n    function adminVideoSection(a){"
)

with open('admin.html', 'w') as f:
    f.write(content)

# Verify
checks = [
    "a.status.charAt(0)" not in content,
    "_html += '<div style=\"background:#111" in content,
    "} catch(err){ console.error('card err'" in content,
    "el.innerHTML = _html;" in content,
]
print("Fixes applied:", checks)

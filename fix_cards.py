import re

# ── index.html ────────────────────────────────────────────────────────────
path = '/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old_idx = (
    "          /* founders */\n"
    "          '<div style=\"background:rgba(255,255,255,.02);border:1px solid rgba(201,168,76,.14);border-radius:24px;padding:1.75rem 2rem;margin-bottom:1.75rem;backdrop-filter:blur(20px);\">'+\n"
    "            '<div style=\"display:flex;flex-direction:column;gap:1.5rem;\">'+\n"
    "\n"
    "              /* founder 1 */\n"
    "              '<div style=\"display:flex;align-items:center;gap:1.25rem;\">'+\n"
    "                '<div style=\"position:relative;flex-shrink:0;\">'+\n"
    "                  '<div style=\"position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(#c9a84c,#fff,#c9a84c,#a07830,#c9a84c);animation:_rot 3s linear infinite;border-radius:50%;\"></div>'+\n"
    "                  '<img src=\"'+fp1+'\" onerror=\"this.parentNode.innerHTML='<div style=&quot;position:relative;width:82px;height:82px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#a07830);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;color:#000;&quot;>B</div>'\" style=\"position:relative;width:82px;height:82px;border-radius:50%;object-fit:cover;border:3px solid #060606;display:block;\" />'+\n"
    "                '</div>'+\n"
    "                '<div style=\"text-align:left;\">'+\n"
    "                  '<div style=\"font-size:1.35rem;font-weight:900;color:#fff;letter-spacing:-.5px;\">'+f1+'</div>'+\n"
    "                  '<div style=\"font-size:.75rem;color:#c9a84c;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-top:.2rem;\">'+f1t+'</div>'+\n"
    "                '</div>'+\n"
    "              '</div>'+\n"
    "\n"
    "              /* separator */\n"
    "              '<div style=\"display:flex;align-items:center;gap:.75rem;\">'+\n"
    "                '<div style=\"flex:1;height:1px;background:rgba(201,168,76,.1);\"></div>'+\n"
    "                '<div style=\"width:5px;height:5px;border-radius:50%;background:#c9a84c;opacity:.3;\"></div>'+\n"
    "                '<div style=\"flex:1;height:1px;background:rgba(201,168,76,.1);\"></div>'+\n"
    "              '</div>'+\n"
    "\n"
    "              /* founder 2 */\n"
    "              '<div style=\"display:flex;align-items:center;gap:1.25rem;\">'+\n"
    "                '<div style=\"position:relative;flex-shrink:0;\">'+\n"
    "                  '<div style=\"position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(#c9a84c,#fff,#c9a84c,#a07830,#c9a84c);animation:_rotR 3s linear infinite;border-radius:50%;\"></div>'+\n"
    "                  '<img src=\"'+fp2+'\" onerror=\"this.parentNode.innerHTML='<div style=&quot;position:relative;width:82px;height:82px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#a07830);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:900;color:#000;&quot;>G</div>'\" style=\"position:relative;width:82px;height:82px;border-radius:50%;object-fit:cover;border:3px solid #060606;display:block;\" />'+\n"
    "                '</div>'+\n"
    "                '<div style=\"text-align:left;\">'+\n"
    "                  '<div style=\"font-size:1.35rem;font-weight:900;color:#fff;letter-spacing:-.5px;\">'+f2+'</div>'+\n"
    "                  '<div style=\"font-size:.75rem;color:#c9a84c;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-top:.2rem;\">'+f2t+'</div>'+\n"
    "                '</div>'+\n"
    "              '</div>'+\n"
    "\n"
    "            '</div>'+\n"
    "          '</div>'+"
)

new_cards = (
    "          /* founder cards */\n"
    "          '<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.75rem;\">'+\n"
    "\n"
    "            /* card 1 */\n"
    "            '<div style=\"background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.18);border-radius:20px;padding:1.5rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1rem;backdrop-filter:blur(20px);position:relative;overflow:hidden;\">'+\n"
    "              '<div style=\"position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);\"></div>'+\n"
    "              '<div style=\"position:relative;\">'+\n"
    "                '<div style=\"position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(#c9a84c,#fff,#c9a84c,#a07830,#c9a84c);animation:_rot 3s linear infinite;\"></div>'+\n"
    "                '<img src=\"'+fp1+'\" style=\"position:relative;width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #060606;display:block;\"/>'+\n"
    "              '</div>'+\n"
    "              '<div style=\"text-align:center;\">'+\n"
    "                '<div style=\"font-size:1.1rem;font-weight:900;color:#fff;letter-spacing:-.3px;\">'+f1+'</div>'+\n"
    "                '<div style=\"font-size:.68rem;color:#c9a84c;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-top:.3rem;\">'+f1t+'</div>'+\n"
    "              '</div>'+\n"
    "            '</div>'+\n"
    "\n"
    "            /* card 2 */\n"
    "            '<div style=\"background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.18);border-radius:20px;padding:1.5rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1rem;backdrop-filter:blur(20px);position:relative;overflow:hidden;\">'+\n"
    "              '<div style=\"position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);\"></div>'+\n"
    "              '<div style=\"position:relative;\">'+\n"
    "                '<div style=\"position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(#c9a84c,#fff,#c9a84c,#a07830,#c9a84c);animation:_rotR 3s linear infinite;\"></div>'+\n"
    "                '<img src=\"'+fp2+'\" style=\"position:relative;width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #060606;display:block;\"/>'+\n"
    "              '</div>'+\n"
    "              '<div style=\"text-align:center;\">'+\n"
    "                '<div style=\"font-size:1.1rem;font-weight:900;color:#fff;letter-spacing:-.3px;\">'+f2+'</div>'+\n"
    "                '<div style=\"font-size:.68rem;color:#c9a84c;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-top:.3rem;\">'+f2t+'</div>'+\n"
    "              '</div>'+\n"
    "            '</div>'+\n"
    "\n"
    "          '</div>'+"
)

if old_idx in c:
    c = c.replace(old_idx, new_cards, 1)
    print('index.html founders updated')
else:
    print('index.html pattern NOT FOUND')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# ── admin.html ────────────────────────────────────────────────────────────
path2 = '/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/admin.html'
with open(path2, 'r', encoding='utf-8') as f:
    ca = f.read()

old_adm = (
    "            '<div style=\"display:flex;flex-direction:column;gap:1.25rem;\">'+\n"
    "              '<div style=\"display:flex;align-items:center;gap:1rem;\">'+\n"
    "              '<img src=\"'+(cfg.founderPhoto||'srisanth.jpeg')+'\" style=\"width:76px;height:76px;border-radius:50%;object-fit:cover;border:3px solid #c9a84c;box-shadow:0 0 20px rgba(201,168,76,0.4);flex-shrink:0;\"/>'+\n"
    "              '<div style=\"text-align:left;\"><div style=\"font-size:1.3rem;font-weight:900;color:#fff;\">'+(cfg.founder||'Boddu Srisanth')+'</div><div style=\"font-size:0.78rem;color:#c9a84c;font-weight:700;letter-spacing:1px;\">'+(cfg.founderTitle||'Founder & CEO')+'</div></div>'+\n"
    "              '</div>'+\n"
    "              '<div style=\"height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.25),transparent);\"></div>'+\n"
    "              '<div style=\"display:flex;align-items:center;gap:1rem;\">'+\n"
    "              '<img src=\"'+(cfg.cofounderPhoto||'sumanth.jpeg')+'\" style=\"width:76px;height:76px;border-radius:50%;object-fit:cover;border:3px solid #c9a84c;box-shadow:0 0 20px rgba(201,168,76,0.4);flex-shrink:0;\"/>'+\n"
    "              '<div style=\"text-align:left;\"><div style=\"font-size:1.3rem;font-weight:900;color:#fff;\">'+(cfg.cofounder||'Gulimi Sumanth')+'</div><div style=\"font-size:0.78rem;color:#c9a84c;font-weight:700;letter-spacing:1px;\">'+(cfg.cofounderTitle||'Managing Director')+'</div></div>'+\n"
    "              '</div>'+\n"
    "            '</div>'+\n"
    "          '</div>'+"
)

new_adm = (
    "            '<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;\">'+\n"
    "              '<div style=\"background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,76,0.18);border-radius:18px;padding:1.25rem 1rem;display:flex;flex-direction:column;align-items:center;gap:0.85rem;position:relative;overflow:hidden;\">'+\n"
    "                '<div style=\"position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);\"></div>'+\n"
    "                '<div style=\"position:relative;\">'+\n"
    "                  '<div style=\"position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(#c9a84c,#fff,#c9a84c,#a07830,#c9a84c);animation:hsSH 3s linear infinite;\"></div>'+\n"
    "                  '<img src=\"'+(cfg.founderPhoto||'srisanth.jpeg')+'\" style=\"position:relative;width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #080808;display:block;\"/>'+\n"
    "                '</div>'+\n"
    "                '<div style=\"text-align:center;\">'+\n"
    "                  '<div style=\"font-size:1rem;font-weight:900;color:#fff;\">'+(cfg.founder||'Boddu Srisanth')+'</div>'+\n"
    "                  '<div style=\"font-size:0.65rem;color:#c9a84c;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-top:0.2rem;\">'+(cfg.founderTitle||'Founder & CEO')+'</div>'+\n"
    "                '</div>'+\n"
    "              '</div>'+\n"
    "              '<div style=\"background:rgba(255,255,255,0.03);border:1px solid rgba(201,168,76,0.18);border-radius:18px;padding:1.25rem 1rem;display:flex;flex-direction:column;align-items:center;gap:0.85rem;position:relative;overflow:hidden;\">'+\n"
    "                '<div style=\"position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);\"></div>'+\n"
    "                '<div style=\"position:relative;\">'+\n"
    "                  '<div style=\"position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(#c9a84c,#fff,#c9a84c,#a07830,#c9a84c);animation:hsSH 3s linear infinite reverse;\"></div>'+\n"
    "                  '<img src=\"'+(cfg.cofounderPhoto||'sumanth.jpeg')+'\" style=\"position:relative;width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #080808;display:block;\"/>'+\n"
    "                '</div>'+\n"
    "                '<div style=\"text-align:center;\">'+\n"
    "                  '<div style=\"font-size:1rem;font-weight:900;color:#fff;\">'+(cfg.cofounder||'Gulimi Sumanth')+'</div>'+\n"
    "                  '<div style=\"font-size:0.65rem;color:#c9a84c;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-top:0.2rem;\">'+(cfg.cofounderTitle||'Managing Director')+'</div>'+\n"
    "                '</div>'+\n"
    "              '</div>'+\n"
    "            '</div>'+\n"
    "          '</div>'+"
)

if old_adm in ca:
    ca = ca.replace(old_adm, new_adm, 1)
    print('admin.html founders updated')
else:
    print('admin.html pattern NOT FOUND')

with open(path2, 'w', encoding='utf-8') as f:
    f.write(ca)

print('All done')

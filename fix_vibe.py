with open('index.html', 'r') as f:
    content = f.read()

# Find the second vibe-section (the duplicate with display:none)
marker = '<section class="vibe-section" id="vibe" style="display:none;">'
second = content.find(marker)
if second != -1:
    end_marker = "      loadVibeFromFirestore();\n    })();\n  </script>"
    end_pos = content.find(end_marker, second)
    if end_pos != -1:
        end_pos += len(end_marker)
        # walk back to remove preceding <!-- NAVBAR --> comment
        nav_comment = "  <!-- NAVBAR -->\n\n  "
        if content[:second].endswith(nav_comment):
            second -= len(nav_comment)
        content = content[:second] + content[end_pos:]
        print("Duplicate vibe section removed")
    else:
        print("End marker not found")
else:
    print("No duplicate found")

# Also fix onSnapshot -> getDocs on the remaining vibe section
old = "          fbStore.onSnapshot(fbStore.collection(db,'vibe_items'), function(snap){\n            _vibeItems = [];\n            snap.forEach(function(d){ _vibeItems.push(Object.assign({id:d.id},d.data())); });\n            renderVibe();\n          });"
new = "          var snap = await fbStore.getDocs(fbStore.collection(db,'vibe_items'));\n          _vibeItems = [];\n          snap.forEach(function(d){ _vibeItems.push(Object.assign({id:d.id},d.data())); });\n          renderVibe();"
if old in content:
    content = content.replace(old, new, 1)
    print("onSnapshot replaced with getDocs")
else:
    print("onSnapshot already fixed or not found")

with open('index.html', 'w') as f:
    f.write(content)

print("Done")

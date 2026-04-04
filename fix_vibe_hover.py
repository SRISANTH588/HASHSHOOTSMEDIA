with open('vibe.html', 'r') as f:
    content = f.read()

# 1. Add hoverPlay/hoverStop functions and rewrite renderVibe
old = """    function renderVibe(){
      _filtered = currentCat === 'all' ? _vibeItems : _vibeItems.filter(function(i){ return i.category === currentCat; });
      _sliderIdx = 0;
      if(!_filtered.length){
        slider.innerHTML = '<div class=\"vibe-empty\" style=\"flex:1;\"><i class=\"fas fa-photo-video\"></i><p>No content yet. Check back soon!</p></div>';
        arrowL.classList.add('hidden'); arrowR.classList.add('hidden');
        return;
      }
      slider.innerHTML = _filtered.map(function(item, idx){
        var thumbSrc = getThumb(item);
        var thumb = thumbSrc
          ? '<img class=\"vibe-thumb\" src=\"'+thumbSrc+'\" alt=\"'+item.title+'\" loading=\"lazy\"/>'
          : '<div class=\"vibe-thumb-placeholder\"><i class=\"fas fa-play-circle\"></i><span>'+item.category+'</span></div>';
        return '<div class=\"vibe-card\" onclick=\"openLb('+idx+')\">'
          +'<div class=\"vibe-thumb-wrap\">'+thumb
          +'<div class=\"vibe-play-overlay\"><div class=\"vibe-play-btn\"><i class=\"fas fa-play\"></i></div></div>'
          +'</div>'
          +'<div class=\"vibe-info\"><div class=\"vibe-info-title\">'+item.title+'</div>'
          +'<div class=\"vibe-info-cat\"><i class=\"fas fa-film\"></i>'+item.category+'</div></div>'
          +'</div>';
      }).join('');
      slider.style.transform = 'translateX(0)';
      updateArrows();
    }"""

new = """    function hoverPlay(idx){
      var vid = document.getElementById('vvid_'+idx);
      var img = document.getElementById('vthumb_'+idx);
      if(!vid) return;
      vid.style.opacity='1'; vid.style.zIndex='2';
      if(img){ img.style.opacity='0'; }
      vid.play().catch(function(){});
    }

    function hoverStop(idx){
      var vid = document.getElementById('vvid_'+idx);
      var img = document.getElementById('vthumb_'+idx);
      if(!vid) return;
      vid.pause(); vid.currentTime=0;
      vid.style.opacity='0'; vid.style.zIndex='1';
      if(img){ img.style.opacity='1'; }
    }

    function renderVibe(){
      _filtered = currentCat === 'all' ? _vibeItems : _vibeItems.filter(function(i){ return i.category === currentCat; });
      _sliderIdx = 0;
      if(!_filtered.length){
        slider.innerHTML = '<div class=\"vibe-empty\" style=\"flex:1;\"><i class=\"fas fa-photo-video\"></i><p>No content yet. Check back soon!</p></div>';
        arrowL.classList.add('hidden'); arrowR.classList.add('hidden');
        return;
      }
      slider.innerHTML = _filtered.map(function(item, idx){
        var thumbSrc = getThumb(item);
        var videoUrl = item.url || item.cloudUrl || '';
        var mediaHtml = '';
        if(thumbSrc && videoUrl){
          mediaHtml =
            '<img id=\"vthumb_'+idx+'\" src=\"'+thumbSrc+'\" alt=\"'+item.title+'\" loading=\"lazy\" style=\"position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 0.3s;z-index:1;\"/>'
            +'<video id=\"vvid_'+idx+'\" src=\"'+videoUrl+'\" muted loop playsinline preload=\"none\" style=\"position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.3s;z-index:1;\"></video>';
        } else if(thumbSrc){
          mediaHtml = '<img id=\"vthumb_'+idx+'\" src=\"'+thumbSrc+'\" alt=\"'+item.title+'\" loading=\"lazy\" style=\"width:100%;height:100%;object-fit:cover;\"/>';
        } else if(videoUrl){
          mediaHtml = '<video id=\"vvid_'+idx+'\" src=\"'+videoUrl+'\" muted loop playsinline preload=\"none\" style=\"width:100%;height:100%;object-fit:cover;\"></video>';
        } else {
          mediaHtml = '<div class=\"vibe-thumb-placeholder\"><i class=\"fas fa-play-circle\"></i><span>'+item.category+'</span></div>';
        }
        return '<div class=\"vibe-card\" onclick=\"openLb('+idx+')\" onmouseenter=\"hoverPlay('+idx+')\" onmouseleave=\"hoverStop('+idx+')\">'
          +'<div class=\"vibe-thumb-wrap\" style=\"position:relative;\">'+mediaHtml
          +'<div class=\"vibe-play-overlay\"><div class=\"vibe-play-btn\"><i class=\"fas fa-play\"></i></div></div>'
          +'</div>'
          +'<div class=\"vibe-info\"><div class=\"vibe-info-title\">'+item.title+'</div>'
          +'<div class=\"vibe-info-cat\"><i class=\"fas fa-film\"></i>'+item.category+'</div></div>'
          +'</div>';
      }).join('');
      slider.style.transform = 'translateX(0)';
      updateArrows();
    }"""

if old in content:
    content = content.replace(old, new)
    print("renderVibe updated")
else:
    print("ERROR: renderVibe not found - checking snippet...")
    # find partial match
    idx = content.find('function renderVibe()')
    print(f"renderVibe found at char: {idx}")
    print(repr(content[idx:idx+200]))

# 2. Fix testimonial cards to show thumbnail + hover play
old_testi = """        var videoUrl = v.cloudUrl || v.url || '';
        if(videoUrl){
          card.innerHTML =
            '<video src=\"'+videoUrl+'\" controls preload=\"metadata\" style=\"width:100%;aspect-ratio:9/16;object-fit:cover;display:block;background:#000;\"></video>'
            +'<div class=\"vibe-info\"><div class=\"vibe-info-title\">'+v.clientName+'</div>'+(v.caption?'<div class=\"vibe-info-cat\">'+v.caption+'</div>':'')+'</div>';
        } else {
          card.innerHTML =
            '<div style=\"width:100%;aspect-ratio:9/16;background:#0a0a0a;display:flex;align-items:center;justify-content:center;color:#c9a84c;font-size:2.5rem;\"><i class=\"fas fa-play-circle\"></i></div>'
            +'<div class=\"vibe-info\"><div class=\"vibe-info-title\">'+v.clientName+'</div>'+(v.caption?'<div class=\"vibe-info-cat\">'+v.caption+'</div>':'')+'</div>';
        }"""

new_testi = """        var videoUrl = v.cloudUrl || v.url || '';
        var tid = 'tv_'+Date.now()+'_'+Math.random().toString(36).slice(2);
        // Generate thumbnail from Cloudinary video URL
        var thumbUrl = videoUrl
          ? videoUrl.replace('/video/upload/', '/video/upload/so_0,w_400,h_600,c_fill,f_jpg/').replace(/\\.(mp4|mov|webm|avi)/i, '.jpg')
          : '';
        if(videoUrl){
          card.innerHTML =
            '<div style=\"position:relative;width:100%;aspect-ratio:9/16;overflow:hidden;background:#000;\">'
            +(thumbUrl ? '<img id=\"timg_'+tid+'\" src=\"'+thumbUrl+'\" style=\"position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 0.3s;z-index:1;\" onerror=\"this.style.display=\\'none\\'\"/>' : '')
            +'<video id=\"tvid_'+tid+'\" src=\"'+videoUrl+'\" muted loop playsinline preload=\"none\" style=\"position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.3s;z-index:1;\"></video>'
            +'<div style=\"position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;\"><div style=\"width:52px;height:52px;background:rgba(201,168,76,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#000;\"><i class=\"fas fa-play\"></i></div></div>'
            +'</div>'
            +'<div class=\"vibe-info\"><div class=\"vibe-info-title\">'+v.clientName+'</div>'+(v.caption?'<div class=\"vibe-info-cat\">'+v.caption+'</div>':'')+'</div>';
          card.onmouseenter = function(){
            var vid=document.getElementById('tvid_'+tid), img=document.getElementById('timg_'+tid);
            if(vid){ vid.style.opacity='1'; vid.play().catch(function(){}); }
            if(img) img.style.opacity='0';
          };
          card.onmouseleave = function(){
            var vid=document.getElementById('tvid_'+tid), img=document.getElementById('timg_'+tid);
            if(vid){ vid.pause(); vid.currentTime=0; vid.style.opacity='0'; }
            if(img) img.style.opacity='1';
          };
        } else {
          card.innerHTML =
            '<div style=\"width:100%;aspect-ratio:9/16;background:#0a0a0a;display:flex;align-items:center;justify-content:center;color:#c9a84c;font-size:2.5rem;\"><i class=\"fas fa-play-circle\"></i></div>'
            +'<div class=\"vibe-info\"><div class=\"vibe-info-title\">'+v.clientName+'</div>'+(v.caption?'<div class=\"vibe-info-cat\">'+v.caption+'</div>':'')+'</div>';
        }"""

if old_testi in content:
    content = content.replace(old_testi, new_testi)
    print("Testimonial cards updated")
else:
    print("ERROR: testimonial section not found")

with open('vibe.html', 'w') as f:
    f.write(content)

print("Done")

// hs-cloudinary.js — OG Shoots Cloudinary Upload Helper

const CLOUD_NAME = 'dqmjfw1qb';

// ml_default is Cloudinary's built-in unsigned preset — always exists
// hs_unsigned and hs_clean are custom presets you may have created
const PRESETS_TO_TRY = ['ml_default', 'hs_unsigned', 'hs_clean'];

var _workingPreset = localStorage.getItem('hs_cloud_preset') || null;

function tryUpload(file, folder, preset, onProgress) {
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    if (folder) formData.append('folder', 'ogshoots/' + folder);

    var resourceType = file.type && file.type.startsWith('video/') ? 'video' : 'image';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/' + resourceType + '/upload');

    if (onProgress) {
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var res = JSON.parse(xhr.responseText);
          resolve({
            url: res.secure_url,
            publicId: res.public_id,
            thumbnail: res.secure_url,
            format: res.format || '',
            bytes: res.bytes || 0
          });
        } catch(e) { reject(new Error('Parse error: ' + xhr.responseText.slice(0,200))); }
      } else {
        var msg = 'HTTP ' + xhr.status;
        try { msg = JSON.parse(xhr.responseText).error.message; } catch(e) {}
        reject(new Error(msg));
      }
    };
    xhr.onerror = function() { reject(new Error('Network error — check internet connection')); };
    xhr.ontimeout = function() { reject(new Error('Upload timed out')); };
    xhr.timeout = 300000; // 5 min timeout for large videos
    xhr.send(formData);
  });
}

window.cloudinaryUpload = async function(file, folder, onProgress) {
  // Clear bad cached preset so we always retry fresh
  if (_workingPreset) {
    try {
      var result = await tryUpload(file, folder, _workingPreset, onProgress);
      return result;
    } catch(e) {
      _workingPreset = null;
      localStorage.removeItem('hs_cloud_preset');
      if (e.message && e.message.toLowerCase().indexOf('network') > -1) throw e;
      console.warn('[Cloudinary] Cached preset failed:', e.message, '— retrying all presets');
    }
  }

  var errors = [];
  for (var i = 0; i < PRESETS_TO_TRY.length; i++) {
    try {
      var res = await tryUpload(file, folder, PRESETS_TO_TRY[i], onProgress);
      _workingPreset = PRESETS_TO_TRY[i];
      localStorage.setItem('hs_cloud_preset', _workingPreset);
      console.log('[Cloudinary] Working preset:', _workingPreset);
      return res;
    } catch(e) {
      errors.push(PRESETS_TO_TRY[i] + ': ' + e.message);
      if (e.message && e.message.toLowerCase().indexOf('network') > -1) throw e;
      console.warn('[Cloudinary] Preset', PRESETS_TO_TRY[i], 'failed:', e.message);
    }
  }

  // All presets failed — throw with full details so admin can see what's wrong
  throw new Error(
    'All Cloudinary presets failed.\n\n' + errors.join('\n') +
    '\n\nFix: Go to Cloudinary Dashboard → Settings → Upload → Upload Presets → Add "hs_unsigned" as unsigned preset.'
  );
};

console.log('[OG Shoots] Cloudinary ready — cloud: ' + CLOUD_NAME);

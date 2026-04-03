// hs-cloudinary.js — OG Shoots Cloudinary Upload Helper

const CLOUD_NAME = 'dqmjfw1qb';
const PRESETS_TO_TRY = ['hs_unsigned', 'hs_clean', 'ml_default'];

// Cache the working preset so we don't retry failed ones on subsequent uploads
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
        } catch(e) { reject(new Error('Parse error')); }
      } else {
        var msg = 'Upload failed';
        try { msg = JSON.parse(xhr.responseText).error.message; } catch(e) {}
        reject(new Error(msg));
      }
    };
    xhr.onerror = function() { reject(new Error('Network error')); };
    xhr.send(formData);
  });
}

window.cloudinaryUpload = async function(file, folder, onProgress) {
  // Use cached working preset first — skips failed preset retries
  if (_workingPreset) {
    try {
      var result = await tryUpload(file, folder, _workingPreset, onProgress);
      return result;
    } catch(e) {
      // Cached preset stopped working — clear and fall through to retry all
      _workingPreset = null;
      localStorage.removeItem('hs_cloud_preset');
      if (e.message && e.message.toLowerCase().indexOf('network') > -1) throw e;
    }
  }

  // Try each preset, stop at first success
  var lastErr = null;
  for (var i = 0; i < PRESETS_TO_TRY.length; i++) {
    try {
      var res = await tryUpload(file, folder, PRESETS_TO_TRY[i], onProgress);
      // Cache the working preset for future uploads
      _workingPreset = PRESETS_TO_TRY[i];
      localStorage.setItem('hs_cloud_preset', _workingPreset);
      console.log('[Cloudinary] Working preset cached:', _workingPreset);
      return res;
    } catch(e) {
      lastErr = e;
      if (e.message && e.message.toLowerCase().indexOf('network') > -1) throw e;
      console.warn('[Cloudinary] Preset', PRESETS_TO_TRY[i], 'failed:', e.message);
    }
  }
  throw lastErr || new Error('All upload presets failed');
};

console.log('[OG Shoots] Cloudinary ready');

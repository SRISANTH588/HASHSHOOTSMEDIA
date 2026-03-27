// hs-cloudinary.js — OG Shoots Cloudinary Upload Helper

const CLOUD_NAME = 'dqmjfw1qb';

// Only these presets are tried — all must be unsigned with NO eager transformations
const PRESETS_TO_TRY = ['hs_unsigned', 'hs_clean', 'ml_default'];

async function tryUpload(file, folder, preset, onProgress) {
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    // Only append folder — no eager, no transformation params
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
  var lastErr = null;
  for (var i = 0; i < PRESETS_TO_TRY.length; i++) {
    try {
      var result = await tryUpload(file, folder, PRESETS_TO_TRY[i], onProgress);
      console.log('[Cloudinary] Uploaded with preset:', PRESETS_TO_TRY[i]);
      return result;
    } catch(e) {
      lastErr = e;
      // If error is about eager/signed params, try next preset
      // If it's a network error, stop immediately
      if (e.message && e.message.toLowerCase().indexOf('network') > -1) throw e;
      console.warn('[Cloudinary] Preset', PRESETS_TO_TRY[i], 'failed:', e.message, '— trying next...');
    }
  }
  throw lastErr || new Error('All upload presets failed');
};

console.log('[OG Shoots] Cloudinary ready — auto-fallback across presets');

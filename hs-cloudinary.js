// hs-cloudinary.js — OG Shoots Cloudinary Upload Helper

const CLOUD_NAME = 'dqmjfw1qb';
const UPLOAD_PRESET = 'hs_unsigned';

window.cloudinaryUpload = function(file, folder, onProgress) {
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    // Do NOT send folder — preset has fixed folder 'hashshoots' in Cloudinary settings

    var resourceType = (file.type && file.type.startsWith('video/')) ? 'video' : 'image';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/' + resourceType + '/upload');
    xhr.timeout = 300000; // 5 min for large videos

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
        var msg = 'Upload failed (HTTP ' + xhr.status + ')';
        try { msg = JSON.parse(xhr.responseText).error.message; } catch(e) {}
        reject(new Error(msg));
      }
    };
    xhr.onerror   = function() { reject(new Error('Network error — check internet connection')); };
    xhr.ontimeout = function() { reject(new Error('Upload timed out — file may be too large')); };
    xhr.send(formData);
  });
};

console.log('[OG Shoots] Cloudinary ready — preset: ' + UPLOAD_PRESET);

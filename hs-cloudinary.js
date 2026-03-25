// hs-cloudinary.js — Cloudinary Upload Helper — 1080p High Quality

const CLOUD_NAME = 'dqmjfw1qb';
const UPLOAD_PRESET = 'hs_unsigned';

window.cloudinaryUpload = async function(file, folder, onProgress) {
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'hashshoots/' + folder);

    if (file.type.startsWith('video/')) {
      // Auto-convert to 1080p max, high quality, keep aspect ratio
      formData.append('eager', 'w_1920,h_1080,c_limit,q_auto:best,vc_h264');
      formData.append('eager_async', 'true');
    } else {
      // Images — full quality, max 2048px wide
      formData.append('quality', '95');
      formData.append('fetch_format', 'auto');
    }

    var xhr = new XMLHttpRequest();
    var resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/' + resourceType + '/upload');

    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = function() {
      if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        var originalUrl = res.secure_url;

        // Thumbnail from video at 1 second mark
        var thumbnail = res.resource_type === 'video'
          ? originalUrl.replace('/upload/', '/upload/so_1,w_400,h_711,c_fill,q_auto/').replace(/\.[^.]+$/, '.jpg')
          : originalUrl.replace('/upload/', '/upload/w_400,h_711,c_fill,q_auto/');

        resolve({
          url: originalUrl,
          publicId: res.public_id,
          thumbnail: thumbnail,
          width: res.width,
          height: res.height,
          format: res.format,
          bytes: res.bytes
        });
      } else {
        var errMsg = xhr.responseText;
        try { errMsg = JSON.parse(xhr.responseText).error.message; } catch(e) {}
        reject(new Error(errMsg));
      }
    };

    xhr.onerror = function() { reject(new Error('Network error — check your internet connection')); };
    xhr.send(formData);
  });
};

console.log('[HashShoots] Cloudinary ready — 1080p High Quality Mode — Cloud:', CLOUD_NAME);

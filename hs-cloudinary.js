// hs-cloudinary.js — Cloudinary Upload Helper — FULL QUALITY (4K)

const CLOUD_NAME = 'dqmjfw1qb';
const UPLOAD_PRESET = 'hs_unsigned';

window.cloudinaryUpload = async function(file, folder, onProgress) {
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'hashshoots/' + folder);

    // Preserve original quality — no compression, no format conversion
    if (file.type.startsWith('video/')) {
      formData.append('quality', 'auto:best');   // best quality
      formData.append('video_codec', 'auto');     // keep original codec
    } else {
      formData.append('quality', '100');          // 100% image quality
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
        // Return original URL — NO quality transformation applied to URL
        var originalUrl = res.secure_url;
        // Thumbnail: auto-generated from video at 1 second, full width
        var thumbnail = res.resource_type === 'video'
          ? originalUrl.replace('/upload/', '/upload/so_1,w_400,h_711,c_fill/').replace(/\.[^.]+$/, '.jpg')
          : originalUrl.replace('/upload/', '/upload/w_400,h_711,c_fill/');
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
        try { errMsg = JSON.parse(xhr.responseText).error.message; } catch(e){}
        reject(new Error(errMsg));
      }
    };

    xhr.onerror = function() { reject(new Error('Network error — check your internet connection')); };
    xhr.send(formData);
  });
};

console.log('[HashShoots] Cloudinary ready — Full Quality Mode — Cloud:', CLOUD_NAME);

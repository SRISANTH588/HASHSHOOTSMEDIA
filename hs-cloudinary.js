// hs-cloudinary.js — Cloudinary Video/Image Upload Helper for Hash Shoots

const CLOUD_NAME = 'dqmjfw1qb';
const UPLOAD_PRESET = 'hs_unsigned'; // We'll use unsigned uploads (no secret needed on frontend)

// Upload a file to Cloudinary and return the URL
window.cloudinaryUpload = async function(file, folder, onProgress) {
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'hashshoots/' + folder);

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
        resolve({ url: res.secure_url, publicId: res.public_id, thumbnail: res.secure_url.replace('/upload/', '/upload/w_400,h_600,c_fill/') });
      } else {
        reject(new Error('Upload failed: ' + xhr.responseText));
      }
    };

    xhr.onerror = function() { reject(new Error('Network error')); };
    xhr.send(formData);
  });
};

console.log('[HashShoots] Cloudinary ready — Cloud:', CLOUD_NAME);

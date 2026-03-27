// hs-cloudinary.js — Cloudinary Upload Helper — Clean Unsigned Preset

const CLOUD_NAME = 'dqmjfw1qb';
const UPLOAD_PRESET = 'hs_clean'; // New clean unsigned preset

window.cloudinaryUpload = async function(file, folder, onProgress) {
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    if (folder) {
      formData.append('folder', 'ogshoots/' + folder);
    }

    var xhr = new XMLHttpRequest();
    var resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/' + resourceType + '/upload');

    if (onProgress) {
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
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
            width: res.width || 0,
            height: res.height || 0,
            format: res.format || '',
            bytes: res.bytes || 0
          });
        } catch (parseError) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        var errMsg = 'Upload failed';
        try { 
          var errorData = JSON.parse(xhr.responseText);
          errMsg = errorData.error?.message || errorData.message || 'HTTP ' + xhr.status;
        } catch(e) {
          errMsg = 'HTTP ' + xhr.status + ': ' + xhr.responseText;
        }
        reject(new Error(errMsg));
      }
    };

    xhr.onerror = function() { 
      reject(new Error('Network error during upload')); 
    };
    
    xhr.send(formData);
  });
};

console.log('[OG Shoots] Cloudinary ready with clean unsigned preset: hs_clean');
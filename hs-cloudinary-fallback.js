// hs-cloudinary-fallback.js — Alternative Upload Solution

// Try a completely different Cloudinary configuration
const CLOUD_NAME = 'demo'; // Use Cloudinary's demo cloud for testing
const UPLOAD_PRESET = 'ml_default'; // Demo cloud's default preset

window.cloudinaryUpload = async function(file, folder, onProgress) {
  console.log('🔄 Trying fallback upload with demo cloud...');
  
  return new Promise(function(resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

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
          console.log('✅ Fallback upload successful!');
          
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
        var errMsg = 'Fallback upload failed';
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
      reject(new Error('Network error during fallback upload')); 
    };
    
    xhr.send(formData);
  });
};

console.log('[OG Shoots] Cloudinary FALLBACK mode - Using demo cloud for testing');
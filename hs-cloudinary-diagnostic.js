// hs-cloudinary-diagnostic.js — Cloudinary Configuration Diagnostic

const CLOUD_NAME = 'dqmjfw1qb';

// Test function to check Cloudinary configuration
window.testCloudinaryConfig = async function() {
  console.log('🔍 Starting Cloudinary Diagnostic...');
  console.log('Cloud Name:', CLOUD_NAME);
  
  // Test 1: Check if cloud exists
  try {
    const response = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/sample.jpg`);
    if (response.ok) {
      console.log('✅ Cloud exists and is accessible');
    } else {
      console.log('❌ Cloud not accessible:', response.status);
      return;
    }
  } catch (error) {
    console.log('❌ Network error accessing cloud:', error.message);
    return;
  }
  
  // Test 2: Check upload presets
  const presets = ['hs_unsigned', 'hs_basic', 'ml_default'];
  
  for (const preset of presets) {
    console.log(`\n🧪 Testing preset: ${preset}`);
    await testUploadPreset(preset);
  }
  
  console.log('\n📋 Diagnostic Complete');
};

async function testUploadPreset(presetName) {
  // Create a minimal test blob (1x1 pixel image)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1, 1);
  
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'test.png');
      formData.append('upload_preset', presetName);
      
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.text();
        
        if (response.ok) {
          console.log(`✅ ${presetName}: SUCCESS`);
          const data = JSON.parse(result);
          console.log(`   URL: ${data.secure_url}`);
        } else {
          console.log(`❌ ${presetName}: FAILED`);
          console.log(`   Status: ${response.status}`);
          console.log(`   Error: ${result}`);
          
          // Parse error details
          try {
            const errorData = JSON.parse(result);
            if (errorData.error) {
              console.log(`   Details: ${errorData.error.message}`);
            }
          } catch (e) {
            // Error response wasn't JSON
          }
        }
      } catch (error) {
        console.log(`❌ ${presetName}: NETWORK ERROR`);
        console.log(`   ${error.message}`);
      }
      
      resolve();
    }, 'image/png');
  });
}

// Simple upload function that uses the working preset
window.cloudinaryUpload = async function(file, folder, onProgress) {
  // First run diagnostic to find working preset
  console.log('Running quick preset check...');
  
  const workingPreset = await findWorkingPreset();
  if (!workingPreset) {
    throw new Error('No working upload preset found. Run testCloudinaryConfig() for details.');
  }
  
  console.log(`Using working preset: ${workingPreset}`);
  
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', workingPreset);
    
    if (folder) {
      formData.append('folder', 'ogshoots/' + folder);
    }

    const xhr = new XMLHttpRequest();
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);

    if (onProgress) {
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = function() {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve({
          url: res.secure_url,
          publicId: res.public_id,
          thumbnail: res.secure_url,
          width: res.width || 0,
          height: res.height || 0,
          format: res.format || '',
          bytes: res.bytes || 0
        });
      } else {
        let errMsg = 'Upload failed';
        try { 
          const errorData = JSON.parse(xhr.responseText);
          errMsg = errorData.error?.message || errorData.message || `HTTP ${xhr.status}`;
        } catch(e) {
          errMsg = `HTTP ${xhr.status}: ${xhr.responseText}`;
        }
        reject(new Error(errMsg));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
};

async function findWorkingPreset() {
  const presets = ['hs_basic', 'hs_unsigned', 'ml_default'];
  
  for (const preset of presets) {
    try {
      // Quick test with minimal data
      const formData = new FormData();
      formData.append('file', new Blob(['test'], {type: 'text/plain'}));
      formData.append('upload_preset', preset);
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        return preset;
      }
    } catch (error) {
      continue;
    }
  }
  
  return null;
}

console.log('🔧 Cloudinary Diagnostic Tool Loaded');
console.log('Run testCloudinaryConfig() in console to diagnose issues');
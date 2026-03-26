// Enhanced fix for staff videos not appearing in admin page
// This script ensures immediate sync and visibility

(function() {
  console.log('[Staff Video Sync] Initializing enhanced sync...');
  
  // Enhanced sync function with better error handling
  function syncStaffVideoToFirebase(videoData) {
    if (!window.fbSave) {
      console.warn('[Staff Video Sync] Firebase not available, video saved locally only');
      return Promise.resolve(null);
    }
    
    return window.fbSave('staff_videos', videoData).then(function(docId) {
      console.log('[Staff Video Sync] Video synced to Firebase:', docId);
      
      // Update local storage with Firebase ID
      var videos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
      var videoIndex = videos.findIndex(v => v.id === videoData.id);
      if (videoIndex !== -1) {
        videos[videoIndex]._fbId = docId;
        localStorage.setItem('hs_staff_videos', JSON.stringify(videos));
        console.log('[Staff Video Sync] Local storage updated with Firebase ID');
      }
      
      return docId;
    }).catch(function(error) {
      console.error('[Staff Video Sync] Failed to sync to Firebase:', error);
      // Still save locally even if Firebase fails
      return null;
    });
  }
  
  // Enhanced saveStaffVideos function
  function enhancedSaveStaffVideos(videos) {
    // Save to localStorage first
    localStorage.setItem('hs_staff_videos', JSON.stringify(videos));
    console.log('[Staff Video Sync] Videos saved to localStorage:', videos.length);
    
    // Sync latest video to Firebase
    if (videos.length > 0) {
      var latestVideo = videos[videos.length - 1];
      if (!latestVideo._fbId) {
        syncStaffVideoToFirebase(latestVideo);
      }
    }
  }
  
  // Override existing function or create new one
  window.saveStaffVideos = enhancedSaveStaffVideos;
  
  // For staff page - ensure immediate sync on upload
  if (window.location.pathname.includes('staff.html')) {
    console.log('[Staff Video Sync] Staff page detected, setting up upload hooks');
    
    // Hook into the upload completion
    var originalUploadStaffVideo = window.uploadStaffVideo;
    if (originalUploadStaffVideo) {
      window.uploadStaffVideo = function() {
        console.log('[Staff Video Sync] Upload initiated...');
        return originalUploadStaffVideo.apply(this, arguments);
      };
    }
  }
  
  // For admin page - set up real-time listener and manual refresh
  if (window.location.pathname.includes('admin.html')) {
    console.log('[Staff Video Sync] Admin page detected, setting up Firebase listener');
    
    // Function to manually refresh from Firebase
    window.refreshStaffVideosFromFirebase = function() {
      if (!window.fbListen) {
        console.warn('[Staff Video Sync] Firebase not available for listening');
        return;
      }
      
      console.log('[Staff Video Sync] Manually refreshing from Firebase...');
      
      // Get all staff videos from Firebase
      window.fbListen('staff_videos', function(docs) {
        console.log('[Staff Video Sync] Received', docs.length, 'videos from Firebase');
        
        var localVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
        var updated = false;
        
        docs.forEach(function(doc) {
          var existingIndex = localVideos.findIndex(v => 
            String(v.id) === String(doc.id) || 
            String(v._fbId) === String(doc._fbId) ||
            (v.staffId === doc.staffId && v.title === doc.title && v.uploadedAt === doc.uploadedAt)
          );
          
          if (existingIndex === -1) {
            // Add new video from Firebase
            var videoData = {
              id: doc.id || doc._fbId || Date.now(),
              _fbId: doc._fbId || doc.id,
              title: doc.title || 'Untitled Video',
              category: doc.category || 'Staff Upload',
              staffId: doc.staffId,
              staffName: doc.staffName,
              fileName: doc.fileName,
              sizeMB: doc.sizeMB,
              uploadedAt: doc.uploadedAt,
              cloudUrl: doc.cloudUrl,
              thumbnail: doc.thumbnail,
              shootDate: doc.shootDate,
              shootTime: doc.shootTime,
              assignId: doc.assignId,
              isFeedback: doc.isFeedback
            };
            localVideos.push(videoData);
            updated = true;
            console.log('[Staff Video Sync] Added new video from Firebase:', videoData.title);
          } else {
            // Update existing video with Firebase data
            var existingVideo = localVideos[existingIndex];
            var hasChanges = false;
            
            // Check for updates
            Object.keys(doc).forEach(function(key) {
              if (key !== 'createdAt' && existingVideo[key] !== doc[key]) {
                existingVideo[key] = doc[key];
                hasChanges = true;
              }
            });
            
            if (hasChanges) {
              updated = true;
              console.log('[Staff Video Sync] Updated existing video:', existingVideo.title);
            }
          }
        });
        
        if (updated) {
          localStorage.setItem('hs_staff_videos', JSON.stringify(localVideos));
          console.log('[Staff Video Sync] Local storage updated with', localVideos.length, 'total videos');
          
          // Refresh admin displays
          if (window.renderStaffVideosAdmin) {
            window.renderStaffVideosAdmin();
          }
          if (window.renderShootReelsAdmin) {
            window.renderShootReelsAdmin();
          }
        }
      }, 'uploadedAt');
    };
    
    // Auto-refresh every 10 seconds
    setInterval(function() {
      if (window.refreshStaffVideosFromFirebase) {
        window.refreshStaffVideosFromFirebase();
      }
    }, 10000);
    
    // Initial refresh after page load
    setTimeout(function() {
      if (window.refreshStaffVideosFromFirebase) {
        window.refreshStaffVideosFromFirebase();
      }
    }, 2000);
  }
  
  // Global function to force sync all videos
  window.forceSyncAllVideos = function() {
    var videos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
    console.log('[Staff Video Sync] Force syncing', videos.length, 'videos');
    
    videos.forEach(function(video) {
      if (!video._fbId) {
        syncStaffVideoToFirebase(video);
      }
    });
  };
  
  // Debug function
  window.debugStaffVideoSync = function() {
    var videos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
    console.log('=== STAFF VIDEO SYNC DEBUG ===');
    console.log('Total videos in localStorage:', videos.length);
    console.log('Videos with Firebase ID:', videos.filter(v => v._fbId).length);
    console.log('Videos without Firebase ID:', videos.filter(v => !v._fbId).length);
    console.log('Firebase available:', !!window.fbSave);
    console.log('Current page:', window.location.pathname);
    
    videos.forEach(function(video, index) {
      console.log(`Video ${index + 1}:`, {
        id: video.id,
        title: video.title,
        staff: video.staffName,
        hasFirebaseId: !!video._fbId,
        uploadedAt: video.uploadedAt
      });
    });
    
    return videos;
  };
  
  console.log('[Staff Video Sync] Enhanced sync loaded successfully');
})();
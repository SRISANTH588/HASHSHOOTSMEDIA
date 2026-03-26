// Fix for staff videos not appearing in admin page
// Add this script to both staff.html and admin.html

(function() {
  // Ensure staff videos are properly synced to Firebase when uploaded
  function syncStaffVideoToFirebase(videoData) {
    if (window.fbSave) {
      window.fbSave('staff_videos', videoData).then(function(docId) {
        console.log('Staff video synced to Firebase:', docId);
        // Update local storage with Firebase ID
        var videos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
        var video = videos.find(v => v.id === videoData.id);
        if (video) {
          video._fbId = docId;
          localStorage.setItem('hs_staff_videos', JSON.stringify(videos));
        }
      }).catch(function(error) {
        console.error('Failed to sync staff video to Firebase:', error);
      });
    }
  }

  // Override the saveStaffVideos function to ensure Firebase sync
  if (window.saveStaffVideos) {
    var originalSaveStaffVideos = window.saveStaffVideos;
    window.saveStaffVideos = function(videos) {
      originalSaveStaffVideos(videos);
      // Sync the latest video to Firebase
      if (videos.length > 0) {
        var latestVideo = videos[videos.length - 1];
        if (!latestVideo._fbId) {
          syncStaffVideoToFirebase(latestVideo);
        }
      }
    };
  }

  // For admin page - listen to Firebase staff_videos collection
  if (window.location.pathname.includes('admin.html')) {
    // Set up Firebase listener for staff videos
    if (window.fbListen) {
      window.fbListen('staff_videos', function(docs) {
        var localVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
        
        docs.forEach(function(doc) {
          var existingIndex = localVideos.findIndex(v => 
            v.id === doc.id || v._fbId === doc._fbId
          );
          
          if (existingIndex === -1) {
            // Add new video from Firebase
            var videoData = {
              id: doc.id || doc._fbId,
              _fbId: doc._fbId,
              title: doc.title,
              category: doc.category,
              staffId: doc.staffId,
              staffName: doc.staffName,
              fileName: doc.fileName,
              sizeMB: doc.sizeMB,
              uploadedAt: doc.uploadedAt,
              cloudUrl: doc.cloudUrl,
              thumbnail: doc.thumbnail,
              shootDate: doc.shootDate,
              shootTime: doc.shootTime,
              assignId: doc.assignId
            };
            localVideos.push(videoData);
          } else {
            // Update existing video with Firebase data
            Object.assign(localVideos[existingIndex], doc);
          }
        });
        
        localStorage.setItem('hs_staff_videos', JSON.stringify(localVideos));
        
        // Refresh admin videos display if function exists
        if (window.renderStaffVideosAdmin) {
          window.renderStaffVideosAdmin();
        }
      }, 'uploadedAt');
    }
  }

  console.log('[Fix] Staff videos sync enhancement loaded');
})();
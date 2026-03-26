// COMPREHENSIVE FIX: Staff uploads not appearing in admin panel
// This script addresses all sync issues between staff uploads and admin view

(function() {
  console.log('🔧 [Staff Upload Fix] Initializing comprehensive fix...');
  
  // === CORE ISSUE FIXES ===
  
  // 1. Enhanced Firebase sync with retry mechanism
  function syncToFirebaseWithRetry(collection, data, maxRetries = 3) {
    if (!window.fbSave) {
      console.warn('[Staff Upload Fix] Firebase not available');
      return Promise.resolve(null);
    }
    
    function attemptSync(retryCount = 0) {
      return window.fbSave(collection, data).then(function(docId) {
        console.log(`[Staff Upload Fix] Successfully synced to ${collection}:`, docId);
        return docId;
      }).catch(function(error) {
        console.error(`[Staff Upload Fix] Sync attempt ${retryCount + 1} failed:`, error);
        
        if (retryCount < maxRetries) {
          console.log(`[Staff Upload Fix] Retrying in ${(retryCount + 1) * 1000}ms...`);
          return new Promise(resolve => {
            setTimeout(() => resolve(attemptSync(retryCount + 1)), (retryCount + 1) * 1000);
          });
        } else {
          console.error('[Staff Upload Fix] Max retries reached, sync failed');
          return null;
        }
      });
    }
    
    return attemptSync();
  }
  
  // 2. Enhanced staff video save function
  function enhancedSaveStaffVideos(videos) {
    // Always save to localStorage first
    localStorage.setItem('hs_staff_videos', JSON.stringify(videos));
    console.log('[Staff Upload Fix] Saved to localStorage:', videos.length, 'videos');
    
    // Sync latest video to Firebase if it doesn't have an ID
    if (videos.length > 0) {
      const latestVideo = videos[videos.length - 1];
      if (!latestVideo._fbId && !latestVideo._syncing) {
        latestVideo._syncing = true; // Prevent duplicate syncs
        
        syncToFirebaseWithRetry('staff_videos', latestVideo).then(function(docId) {
          if (docId) {
            // Update the video with Firebase ID
            const updatedVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
            const videoIndex = updatedVideos.findIndex(v => v.id === latestVideo.id);
            if (videoIndex !== -1) {
              updatedVideos[videoIndex]._fbId = docId;
              delete updatedVideos[videoIndex]._syncing;
              localStorage.setItem('hs_staff_videos', JSON.stringify(updatedVideos));
              console.log('[Staff Upload Fix] Updated video with Firebase ID:', docId);
            }
          }
        });
      }
    }
    
    // Trigger admin refresh if on admin page
    if (window.location.pathname.includes('admin.html')) {
      setTimeout(function() {
        if (window.renderStaffVideosAdmin) window.renderStaffVideosAdmin();
        if (window.renderShootReelsAdmin) window.renderShootReelsAdmin();
      }, 500);
    }
  }
  
  // 3. Enhanced admin refresh function
  function enhancedAdminRefresh() {
    if (!window.location.pathname.includes('admin.html')) return;
    
    console.log('[Staff Upload Fix] Refreshing admin displays...');
    
    // Get all data
    const videos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
    const assigns = JSON.parse(localStorage.getItem('hs_assigned_shoots') || '[]');
    const staff = JSON.parse(localStorage.getItem('hs_staff') || '[]');
    
    console.log('[Staff Upload Fix] Data counts:', {
      videos: videos.length,
      assigns: assigns.length,
      staff: staff.length
    });
    
    // Update notification badges
    updateNotificationBadges(videos, assigns);
    
    // Refresh displays
    try {
      if (window.renderStaffVideosAdmin) {
        window.renderStaffVideosAdmin();
        console.log('[Staff Upload Fix] Staff Videos tab refreshed');
      }
      
      if (window.renderShootReelsAdmin) {
        window.renderShootReelsAdmin();
        console.log('[Staff Upload Fix] Shoot Reels tab refreshed');
      }
    } catch (error) {
      console.error('[Staff Upload Fix] Error refreshing displays:', error);
    }
  }
  
  // 4. Update notification badges
  function updateNotificationBadges(videos, assigns) {
    try {
      // Shoot Reels badge
      const shootReelsBtn = document.getElementById('shootReelsTabBtn');
      if (shootReelsBtn) {
        const badge = shootReelsBtn.querySelector('.notif') || shootReelsBtn.querySelector('#shootReelsNotifBadge');
        if (badge) {
          const pendingReview = videos.filter(v => {
            if (!v.assignId) return false;
            const assign = assigns.find(a => a.id == v.assignId);
            return assign && assign.status === 'done';
          }).length;
          
          badge.textContent = pendingReview;
          badge.style.display = pendingReview > 0 ? 'inline' : 'none';
          console.log('[Staff Upload Fix] Updated Shoot Reels badge:', pendingReview);
        }
      }
      
      // Staff Videos count
      const staffVideosCount = document.getElementById('staffVideosCount');
      if (staffVideosCount) {
        staffVideosCount.textContent = videos.length + ' video(s)';
      }
      
      // Shoot Reels count
      const shootReelsCount = document.getElementById('shootReelsCount');
      if (shootReelsCount) {
        const shootVideos = videos.filter(v => 
          v.assignId || v.category === 'Shoot Delivery' || v.category === 'Shoot Feedback' || v.isFeedback
        );
        shootReelsCount.textContent = shootVideos.length + ' video(s)';
      }
      
    } catch (error) {
      console.error('[Staff Upload Fix] Error updating badges:', error);
    }
  }
  
  // 5. Firebase listener for real-time updates
  function setupFirebaseListener() {
    if (!window.fbListen || !window.location.pathname.includes('admin.html')) return;
    
    console.log('[Staff Upload Fix] Setting up Firebase listener...');
    
    try {
      window.fbListen('staff_videos', function(docs) {
        console.log('[Staff Upload Fix] Received Firebase update:', docs.length, 'videos');
        
        const localVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
        let hasUpdates = false;
        
        docs.forEach(function(doc) {
          // Check if video already exists locally
          const existingIndex = localVideos.findIndex(v => 
            String(v.id) === String(doc.id) || 
            String(v._fbId) === String(doc._fbId) ||
            (v.staffId === doc.staffId && v.title === doc.title && Math.abs(new Date(v.uploadedAt) - new Date(doc.uploadedAt)) < 60000)
          );
          
          if (existingIndex === -1) {
            // New video from Firebase
            const videoData = {
              id: doc.id || Date.now(),
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
            hasUpdates = true;
            console.log('[Staff Upload Fix] Added new video from Firebase:', videoData.title);
          }
        });
        
        if (hasUpdates) {
          localStorage.setItem('hs_staff_videos', JSON.stringify(localVideos));
          enhancedAdminRefresh();
        }
      }, 'uploadedAt');
      
    } catch (error) {
      console.error('[Staff Upload Fix] Error setting up Firebase listener:', error);
    }
  }
  
  // === GLOBAL FUNCTIONS ===
  
  // Override existing functions
  if (typeof window.saveStaffVideos === 'function') {
    window.saveStaffVideos = enhancedSaveStaffVideos;
    console.log('[Staff Upload Fix] Overrode saveStaffVideos function');
  } else {
    window.saveStaffVideos = enhancedSaveStaffVideos;
    console.log('[Staff Upload Fix] Created saveStaffVideos function');
  }
  
  // Manual refresh function for admin
  window.refreshStaffVideosFromFirebase = function() {
    console.log('[Staff Upload Fix] Manual refresh triggered');
    enhancedAdminRefresh();
    
    // Also try to sync any unsynced videos
    const videos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
    const unsyncedVideos = videos.filter(v => !v._fbId && !v._syncing);
    
    if (unsyncedVideos.length > 0) {
      console.log('[Staff Upload Fix] Found', unsyncedVideos.length, 'unsynced videos, attempting sync...');
      unsyncedVideos.forEach(video => {
        video._syncing = true;
        syncToFirebaseWithRetry('staff_videos', video).then(docId => {
          if (docId) {
            const updatedVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
            const index = updatedVideos.findIndex(v => v.id === video.id);
            if (index !== -1) {
              updatedVideos[index]._fbId = docId;
              delete updatedVideos[index]._syncing;
              localStorage.setItem('hs_staff_videos', JSON.stringify(updatedVideos));
            }
          }
        });
      });
    }
  };
  
  // Debug function
  window.debugStaffVideoSync = function() {
    const videos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
    const assigns = JSON.parse(localStorage.getItem('hs_assigned_shoots') || '[]');
    const staff = JSON.parse(localStorage.getItem('hs_staff') || '[]');
    
    console.log('=== STAFF VIDEO DEBUG ===');
    console.log('Total videos:', videos.length);
    console.log('Total assignments:', assigns.length);
    console.log('Total staff:', staff.length);
    console.log('Firebase available:', !!window.fbSave);
    console.log('Current page:', window.location.pathname);
    
    const shootVideos = videos.filter(v => 
      v.assignId || v.category === 'Shoot Delivery' || v.category === 'Shoot Feedback' || v.isFeedback
    );
    console.log('Shoot-related videos:', shootVideos.length);
    
    // Check grid content
    const grid = document.getElementById('shootReelsAdminGrid');
    if (grid) {
      console.log('Grid children count:', grid.children.length);
      console.log('Grid innerHTML length:', grid.innerHTML.length);
    }
    
    // Show video details
    videos.forEach((video, index) => {
      console.log(`Video ${index + 1}:`, {
        id: video.id,
        title: video.title,
        staff: video.staffName,
        category: video.category,
        assignId: video.assignId,
        hasFirebaseId: !!video._fbId,
        uploadedAt: video.uploadedAt
      });
    });
    
    return { videos, assigns, staff, shootVideos };
  };
  
  // Create test data function
  window.createTestStaffVideos = function() {
    console.log('[Staff Upload Fix] Creating test data...');
    
    // Create test staff
    const testStaff = [
      { id: 1001, name: 'John Creator', role: 'creator', username: 'john_creator' },
      { id: 1002, name: 'Sarah Editor', role: 'editor', username: 'sarah_editor' }
    ];
    localStorage.setItem('hs_staff', JSON.stringify(testStaff));
    
    // Create test assignments
    const testAssigns = [
      {
        id: 3001,
        staffId: 1001,
        staffName: 'John Creator',
        service: 'Wedding Photography',
        clientName: 'Alice & Bob',
        city: 'Mumbai',
        date: '2024-01-20',
        time: '10:00',
        status: 'done',
        credit: 5000,
        assignedAt: new Date(Date.now() - 86400000).toLocaleString()
      },
      {
        id: 3002,
        staffId: 1002,
        staffName: 'Sarah Editor',
        service: 'Portrait Session',
        clientName: 'Charlie Brown',
        city: 'Delhi',
        date: '2024-01-21',
        time: '14:00',
        status: 'assigned',
        credit: 2500,
        assignedAt: new Date(Date.now() - 43200000).toLocaleString()
      }
    ];
    localStorage.setItem('hs_assigned_shoots', JSON.stringify(testAssigns));
    
    // Create test videos
    const testVideos = [
      {
        id: Date.now() - 2000,
        title: 'Wedding Highlight Reel',
        category: 'Shoot Delivery',
        staffId: 1001,
        staffName: 'John Creator',
        fileName: 'wedding_highlight.mp4',
        sizeMB: '45.2',
        uploadedAt: new Date(Date.now() - 3600000).toLocaleString(),
        assignId: 3001,
        cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
        thumbnail: 'https://res.cloudinary.com/demo/video/upload/sample.jpg'
      },
      {
        id: Date.now() - 1000,
        title: 'Client Feedback Video',
        category: 'Shoot Feedback',
        staffId: 1001,
        staffName: 'John Creator',
        fileName: 'client_feedback.mp4',
        sizeMB: '12.8',
        uploadedAt: new Date(Date.now() - 1800000).toLocaleString(),
        assignId: 3001,
        isFeedback: true,
        cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4'
      },
      {
        id: Date.now(),
        title: 'Portrait Session Reel',
        category: 'Shoot Delivery',
        staffId: 1002,
        staffName: 'Sarah Editor',
        fileName: 'portrait_session.mp4',
        sizeMB: '28.5',
        uploadedAt: new Date().toLocaleString(),
        assignId: 3002,
        cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4'
      }
    ];
    
    localStorage.setItem('hs_staff_videos', JSON.stringify(testVideos));
    
    console.log('[Staff Upload Fix] Test data created successfully');
    console.log('- Staff:', testStaff.length);
    console.log('- Assignments:', testAssigns.length);
    console.log('- Videos:', testVideos.length);
    
    // Refresh displays
    enhancedAdminRefresh();
    
    return { staff: testStaff, assigns: testAssigns, videos: testVideos };
  };
  
  // === INITIALIZATION ===
  
  // Set up based on current page
  if (window.location.pathname.includes('admin.html')) {
    console.log('[Staff Upload Fix] Admin page detected');
    
    // Set up Firebase listener
    setTimeout(setupFirebaseListener, 2000);
    
    // Auto-refresh every 15 seconds
    setInterval(enhancedAdminRefresh, 15000);
    
    // Initial refresh
    setTimeout(enhancedAdminRefresh, 1000);
    
  } else if (window.location.pathname.includes('staff.html')) {
    console.log('[Staff Upload Fix] Staff page detected');
    
    // Hook into upload completion
    const originalUploadStaffVideo = window.uploadStaffVideo;
    if (originalUploadStaffVideo) {
      window.uploadStaffVideo = function() {
        console.log('[Staff Upload Fix] Upload initiated...');
        const result = originalUploadStaffVideo.apply(this, arguments);
        
        // Ensure sync happens after upload
        setTimeout(function() {
          const videos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
          if (videos.length > 0) {
            enhancedSaveStaffVideos(videos);
          }
        }, 1000);
        
        return result;
      };
    }
  }
  
  console.log('✅ [Staff Upload Fix] Comprehensive fix loaded successfully');
  console.log('📋 Available functions:');
  console.log('- refreshStaffVideosFromFirebase() - Manual refresh');
  console.log('- debugStaffVideoSync() - Debug information');
  console.log('- createTestStaffVideos() - Create test data');
  
})();
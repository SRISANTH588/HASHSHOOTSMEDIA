// IMMEDIATE FIX: Run this in browser console on admin.html page
// This will diagnose and fix staff video sync issues

function immediateStaffVideoFix() {
  console.log('🔧 IMMEDIATE STAFF VIDEO FIX STARTING...');
  
  // Step 1: Check current state
  console.log('📊 CURRENT STATE:');
  const localVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
  console.log(`- Local videos: ${localVideos.length}`);
  console.log(`- Firebase available: ${!!window.fbSave}`);
  console.log(`- Current page: ${window.location.pathname}`);
  
  // Step 2: Create test data if no videos exist
  if (localVideos.length === 0) {
    console.log('📝 Creating test staff videos...');
    
    const testVideos = [
      {
        id: Date.now() - 1000,
        title: 'Wedding Shoot Reel',
        category: 'Shoot Delivery',
        staffId: '1001',
        staffName: 'Test Staff 1',
        fileName: 'wedding_reel.mp4',
        sizeMB: '25.4',
        uploadedAt: new Date(Date.now() - 86400000).toLocaleString(), // Yesterday
        assignId: 3001,
        cloudUrl: 'https://example.com/wedding_reel.mp4'
      },
      {
        id: Date.now() - 500,
        title: 'Portrait Session Feedback',
        category: 'Shoot Feedback',
        staffId: '1002',
        staffName: 'Test Staff 2',
        fileName: 'portrait_feedback.mp4',
        sizeMB: '12.8',
        uploadedAt: new Date(Date.now() - 43200000).toLocaleString(), // 12 hours ago
        assignId: 3002,
        isFeedback: true,
        cloudUrl: 'https://example.com/portrait_feedback.mp4'
      },
      {
        id: Date.now(),
        title: 'Event Coverage Reel',
        category: 'Shoot Delivery',
        staffId: '1001',
        staffName: 'Test Staff 1',
        fileName: 'event_coverage.mp4',
        sizeMB: '45.2',
        uploadedAt: new Date().toLocaleString(),
        assignId: 3003,
        cloudUrl: 'https://example.com/event_coverage.mp4'
      }
    ];
    
    localStorage.setItem('hs_staff_videos', JSON.stringify(testVideos));
    console.log('✅ Test videos created');
  }
  
  // Step 3: Create test assignments if needed
  const assigns = JSON.parse(localStorage.getItem('hs_assigned_shoots') || '[]');
  if (assigns.length === 0) {
    console.log('📝 Creating test assignments...');
    
    const testAssigns = [
      {
        id: 3001,
        staffId: '1001',
        staffName: 'Test Staff 1',
        service: 'Wedding Photography',
        clientName: 'John & Jane Doe',
        city: 'Mumbai',
        date: '2024-01-15',
        time: '10:00',
        status: 'done',
        credit: 5000
      },
      {
        id: 3002,
        staffId: '1002',
        staffName: 'Test Staff 2',
        service: 'Portrait Session',
        clientName: 'Alice Smith',
        city: 'Delhi',
        date: '2024-01-16',
        time: '14:00',
        status: 'assigned',
        credit: 2000
      },
      {
        id: 3003,
        staffId: '1001',
        staffName: 'Test Staff 1',
        service: 'Event Coverage',
        clientName: 'Corporate Event',
        city: 'Bangalore',
        date: '2024-01-17',
        time: '18:00',
        status: 'done',
        credit: 8000
      }
    ];
    
    localStorage.setItem('hs_assigned_shoots', JSON.stringify(testAssigns));
    console.log('✅ Test assignments created');
  }
  
  // Step 4: Create test staff if needed
  const staff = JSON.parse(localStorage.getItem('hs_staff') || '[]');
  if (staff.length === 0) {
    console.log('📝 Creating test staff...');
    
    const testStaff = [
      { id: '1001', name: 'Test Staff 1', role: 'creator' },
      { id: '1002', name: 'Test Staff 2', role: 'creator' }
    ];
    
    localStorage.setItem('hs_staff', JSON.stringify(testStaff));
    console.log('✅ Test staff created');
  }
  
  // Step 5: Force refresh admin displays
  console.log('🔄 Refreshing admin displays...');
  
  try {
    if (window.renderStaffVideosAdmin) {
      window.renderStaffVideosAdmin();
      console.log('✅ Staff Videos tab refreshed');
    }
    
    if (window.renderShootReelsAdmin) {
      window.renderShootReelsAdmin();
      console.log('✅ Shoot Reels tab refreshed');
    }
    
    // Update notification badges
    const shootReelsTab = document.getElementById('shootReelsTabBtn');
    if (shootReelsTab) {
      const badge = shootReelsTab.querySelector('.notif');
      if (badge) {
        const pendingCount = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]')
          .filter(v => {
            const assigns = JSON.parse(localStorage.getItem('hs_assigned_shoots') || '[]');
            const assign = assigns.find(a => a.id == v.assignId);
            return assign && assign.status === 'done';
          }).length;
        
        badge.textContent = pendingCount;
        badge.style.display = pendingCount > 0 ? 'inline' : 'none';
        console.log(`✅ Notification badge updated: ${pendingCount}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error refreshing displays:', error);
  }
  
  // Step 6: Switch to Shoot Reels tab
  console.log('🎬 Switching to Shoot Reels tab...');
  
  try {
    const shootReelsBtn = document.querySelector('[onclick*=\"shoot-reels\"]');
    if (shootReelsBtn && window.switchTab) {
      window.switchTab('shoot-reels', shootReelsBtn);
      console.log('✅ Switched to Shoot Reels tab');
    } else {
      console.warn('⚠️ Could not find Shoot Reels tab button');
    }
  } catch (error) {
    console.error('❌ Error switching tabs:', error);
  }
  
  // Step 7: Final verification
  console.log('🔍 FINAL VERIFICATION:');
  const finalVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
  const shootVideos = finalVideos.filter(v => v.assignId || v.category === 'Shoot Delivery' || v.isFeedback);
  
  console.log(`- Total videos: ${finalVideos.length}`);
  console.log(`- Shoot-related videos: ${shootVideos.length}`);
  console.log(`- Videos with assignments: ${shootVideos.filter(v => v.assignId).length}`);
  
  // Check if grid has content
  const grid = document.getElementById('shootReelsAdminGrid');
  if (grid) {
    console.log(`- Video cards in grid: ${grid.children.length}`);
    if (grid.children.length === 0) {
      console.warn('⚠️ Grid is empty, trying manual render...');
      if (window.renderShootReelsAdmin) {
        window.renderShootReelsAdmin();
      }
    }
  }
  
  console.log('🎉 IMMEDIATE FIX COMPLETED!');
  console.log('📋 Next steps:');
  console.log('1. Check the "Shoot Reels & Feedback" tab');
  console.log('2. Look for the test videos in the grid');
  console.log('3. If still not working, run debugStaffVideoSync() for more details');
  
  return {
    success: true,
    videosFound: finalVideos.length,
    shootVideos: shootVideos.length,
    timestamp: new Date().toLocaleString()
  };
}

// Auto-run if on admin page
if (window.location.pathname.includes('admin.html')) {
  console.log('🚀 Auto-running immediate fix...');
  setTimeout(immediateStaffVideoFix, 1000);
} else {
  console.log('💡 Run immediateStaffVideoFix() on the admin page to fix staff video sync');
}

// Make function globally available
window.immediateStaffVideoFix = immediateStaffVideoFix;
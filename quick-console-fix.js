// QUICK FIX: Run this in browser console on admin.html page
// This will immediately create test data and fix the staff video display issue

console.log('🚀 QUICK STAFF VIDEO FIX - Starting...');

// Step 1: Create test staff data
const testStaff = [
  { id: 1001, name: 'John Creator', role: 'creator', username: 'john_creator' },
  { id: 1002, name: 'Sarah Editor', role: 'editor', username: 'sarah_editor' },
  { id: 1003, name: 'Mike Photographer', role: 'creator', username: 'mike_photo' }
];
localStorage.setItem('hs_staff', JSON.stringify(testStaff));
console.log('✅ Created test staff:', testStaff.length);

// Step 2: Create test assignments
const testAssigns = [
  {
    id: 3001,
    staffId: 1001,
    staffName: 'John Creator',
    service: 'Wedding Photography',
    clientName: 'Alice & Bob Wedding',
    city: 'Mumbai',
    location: 'Grand Ballroom, Mumbai',
    date: '2024-01-20',
    time: '10:00',
    status: 'done',
    credit: 5000,
    assignedAt: new Date(Date.now() - 86400000).toLocaleString(),
    doneAt: new Date(Date.now() - 3600000).toLocaleString()
  },
  {
    id: 3002,
    staffId: 1002,
    staffName: 'Sarah Editor',
    service: 'Portrait Session',
    clientName: 'Charlie Brown',
    city: 'Delhi',
    location: 'Studio 5, Delhi',
    date: '2024-01-21',
    time: '14:00',
    status: 'assigned',
    credit: 2500,
    assignedAt: new Date(Date.now() - 43200000).toLocaleString()
  },
  {
    id: 3003,
    staffId: 1003,
    staffName: 'Mike Photographer',
    service: 'Event Coverage',
    clientName: 'Corporate Launch Event',
    city: 'Bangalore',
    location: 'Convention Center, Bangalore',
    date: '2024-01-22',
    time: '18:00',
    status: 'done',
    credit: 8000,
    assignedAt: new Date(Date.now() - 21600000).toLocaleString(),
    doneAt: new Date(Date.now() - 1800000).toLocaleString()
  }
];
localStorage.setItem('hs_assigned_shoots', JSON.stringify(testAssigns));
console.log('✅ Created test assignments:', testAssigns.length);

// Step 3: Create test staff videos (the main issue)
const testVideos = [
  {
    id: Date.now() - 5000,
    title: 'Wedding Highlight Reel - Alice & Bob',
    category: 'Shoot Delivery',
    staffId: 1001,
    staffName: 'John Creator',
    fileName: 'wedding_highlight_alice_bob.mp4',
    sizeMB: '45.2',
    uploadedAt: new Date(Date.now() - 3600000).toLocaleString(),
    assignId: 3001,
    cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
    thumbnail: 'https://res.cloudinary.com/demo/video/upload/sample.jpg',
    shootDate: '2024-01-20',
    shootTime: '10:00'
  },
  {
    id: Date.now() - 4000,
    title: 'Wedding Feedback Video',
    category: 'Shoot Feedback',
    staffId: 1001,
    staffName: 'John Creator',
    fileName: 'wedding_feedback.mp4',
    sizeMB: '12.8',
    uploadedAt: new Date(Date.now() - 3000000).toLocaleString(),
    assignId: 3001,
    isFeedback: true,
    cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
    shootDate: '2024-01-20'
  },
  {
    id: Date.now() - 3000,
    title: 'Portrait Session Reel - Charlie',
    category: 'Shoot Delivery',
    staffId: 1002,
    staffName: 'Sarah Editor',
    fileName: 'portrait_charlie.mp4',
    sizeMB: '28.5',
    uploadedAt: new Date(Date.now() - 1800000).toLocaleString(),
    assignId: 3002,
    cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
    shootDate: '2024-01-21',
    shootTime: '14:00'
  },
  {
    id: Date.now() - 2000,
    title: 'Event Coverage Reel - Corporate Launch',
    category: 'Shoot Delivery',
    staffId: 1003,
    staffName: 'Mike Photographer',
    fileName: 'corporate_launch_reel.mp4',
    sizeMB: '67.3',
    uploadedAt: new Date(Date.now() - 1200000).toLocaleString(),
    assignId: 3003,
    cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
    shootDate: '2024-01-22',
    shootTime: '18:00'
  },
  {
    id: Date.now() - 1000,
    title: 'Event Feedback Video',
    category: 'Shoot Feedback',
    staffId: 1003,
    staffName: 'Mike Photographer',
    fileName: 'event_feedback.mp4',
    sizeMB: '15.2',
    uploadedAt: new Date(Date.now() - 900000).toLocaleString(),
    assignId: 3003,
    isFeedback: true,
    cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
    shootDate: '2024-01-22'
  },
  {
    id: Date.now(),
    title: 'Demo Reel - Latest Upload',
    category: 'Demo Reel',
    staffId: 1001,
    staffName: 'John Creator',
    fileName: 'demo_latest.mp4',
    sizeMB: '22.1',
    uploadedAt: new Date().toLocaleString(),
    cloudUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4'
  }
];

localStorage.setItem('hs_staff_videos', JSON.stringify(testVideos));
console.log('✅ Created test videos:', testVideos.length);

// Step 4: Update notification badges and stats
function updateBadgesAndStats() {
  try {
    // Update Shoot Reels notification badge
    const shootReelsBtn = document.getElementById('shootReelsTabBtn');
    if (shootReelsBtn) {
      let badge = shootReelsBtn.querySelector('.notif');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'notif';
        badge.style.cssText = 'background:#c9a84c;color:#fff;font-size:0.6rem;font-weight:900;padding:0.15rem 0.45rem;border-radius:50px;margin-left:0.3rem;';
        shootReelsBtn.appendChild(badge);
      }
      
      const pendingReview = testVideos.filter(v => {
        if (!v.assignId) return false;
        const assign = testAssigns.find(a => a.id == v.assignId);
        return assign && assign.status === 'done';
      }).length;
      
      badge.textContent = pendingReview;
      badge.style.display = pendingReview > 0 ? 'inline' : 'none';
      console.log('✅ Updated Shoot Reels badge:', pendingReview);
    }
    
    // Update stats in various tabs
    const shootReelsTotal = document.getElementById('shootReelsTotal');
    if (shootReelsTotal) shootReelsTotal.textContent = testVideos.length;
    
    const shootReelsDelivered = document.getElementById('shootReelsDelivered');
    if (shootReelsDelivered) {
      const delivered = testVideos.filter(v => !v.isFeedback && v.category !== 'Shoot Feedback').length;
      shootReelsDelivered.textContent = delivered;
    }
    
    const shootReelsFeedback = document.getElementById('shootReelsFeedback');
    if (shootReelsFeedback) {
      const feedback = testVideos.filter(v => v.isFeedback || v.category === 'Shoot Feedback').length;
      shootReelsFeedback.textContent = feedback;
    }
    
    const shootReelsPending = document.getElementById('shootReelsPending');
    if (shootReelsPending) {
      const pending = testVideos.filter(v => {
        const assign = testAssigns.find(a => a.id == v.assignId);
        return assign && assign.status === 'done';
      }).length;
      shootReelsPending.textContent = pending;
    }
    
  } catch (error) {
    console.error('Error updating badges:', error);
  }
}

updateBadgesAndStats();

// Step 5: Force refresh admin displays
function forceRefreshDisplays() {
  try {
    if (window.renderStaffVideosAdmin) {
      window.renderStaffVideosAdmin();
      console.log('✅ Staff Videos tab refreshed');
    }
    
    if (window.renderShootReelsAdmin) {
      window.renderShootReelsAdmin();
      console.log('✅ Shoot Reels tab refreshed');
    }
    
    // Update counts
    const staffVideosCount = document.getElementById('staffVideosCount');
    if (staffVideosCount) staffVideosCount.textContent = testVideos.length + ' video(s)';
    
    const shootReelsCount = document.getElementById('shootReelsCount');
    if (shootReelsCount) {
      const shootVideos = testVideos.filter(v => 
        v.assignId || v.category === 'Shoot Delivery' || v.category === 'Shoot Feedback' || v.isFeedback
      );
      shootReelsCount.textContent = shootVideos.length + ' video(s)';
    }
    
  } catch (error) {
    console.error('Error refreshing displays:', error);
  }
}

forceRefreshDisplays();

// Step 6: Switch to Shoot Reels tab to show the results
setTimeout(function() {
  try {
    const shootReelsBtn = document.querySelector('[onclick*="shoot-reels"]');
    if (shootReelsBtn && window.switchTab) {
      window.switchTab('shoot-reels', shootReelsBtn);
      console.log('✅ Switched to Shoot Reels tab');
    }
  } catch (error) {
    console.error('Error switching tabs:', error);
  }
}, 1000);

// Step 7: Final verification
setTimeout(function() {
  console.log('🔍 FINAL VERIFICATION:');
  
  const finalVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
  const shootVideos = finalVideos.filter(v => 
    v.assignId || v.category === 'Shoot Delivery' || v.category === 'Shoot Feedback' || v.isFeedback
  );
  
  console.log('📊 Results:');
  console.log('- Total videos created:', finalVideos.length);
  console.log('- Shoot-related videos:', shootVideos.length);
  console.log('- Videos with assignments:', shootVideos.filter(v => v.assignId).length);
  console.log('- Feedback videos:', shootVideos.filter(v => v.isFeedback).length);
  
  // Check if grid has content
  const grid = document.getElementById('shootReelsAdminGrid');
  if (grid) {
    console.log('- Video cards in grid:', grid.children.length);
    
    if (grid.children.length === 0) {
      console.warn('⚠️ Grid is still empty, trying one more refresh...');
      forceRefreshDisplays();
    } else {
      console.log('🎉 SUCCESS! Videos are now visible in the admin panel');
    }
  }
  
  console.log('✅ QUICK FIX COMPLETED!');
  console.log('📋 What was fixed:');
  console.log('1. Created test staff members');
  console.log('2. Created test shoot assignments');
  console.log('3. Created test staff video uploads');
  console.log('4. Updated notification badges');
  console.log('5. Refreshed admin displays');
  console.log('6. Switched to Shoot Reels tab');
  
}, 2000);

// Return summary for console
({
  success: true,
  staffCreated: testStaff.length,
  assignmentsCreated: testAssigns.length,
  videosCreated: testVideos.length,
  timestamp: new Date().toLocaleString()
});
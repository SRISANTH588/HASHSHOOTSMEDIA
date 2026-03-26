// Test script for Shoot Reels & Feedback Admin Tab
// Run this in browser console on admin.html page

function testShootReelsTab() {
  console.log('🧪 Testing Shoot Reels & Feedback Tab...');
  
  // 1. Create test data
  console.log('📝 Creating test data...');
  
  // Create test staff
  const testStaff = [
    { id: 1001, name: 'John Photographer', role: 'creator' },
    { id: 1002, name: 'Sarah Videographer', role: 'creator' }
  ];
  localStorage.setItem('hs_staff', JSON.stringify(testStaff));
  
  // Create test bookings
  const testBookings = [
    { id: 2001, name: 'Alice Johnson', phone: '+91 9876543210', city: 'Mumbai', service: 'Wedding Photography' },
    { id: 2002, name: 'Bob Smith', phone: '+91 9876543211', city: 'Delhi', service: 'Portrait Session' }
  ];
  localStorage.setItem('hs_bookings', JSON.stringify(testBookings));
  
  // Create test assignments
  const testAssignments = [
    {
      id: 3001,
      bookingId: 2001,
      staffId: 1001,
      staffName: 'John Photographer',
      service: 'Wedding Photography',
      clientName: 'Alice Johnson',
      city: 'Mumbai',
      date: '2024-01-15',
      time: '10:00',
      status: 'done',
      credit: 5000,
      assignedAt: '2024-01-10 09:00:00'
    },
    {
      id: 3002,
      bookingId: 2002,
      staffId: 1002,
      staffName: 'Sarah Videographer',
      service: 'Portrait Session',
      clientName: 'Bob Smith',
      city: 'Delhi',
      date: '2024-01-16',
      time: '14:00',
      status: 'assigned',
      credit: 2000,
      assignedAt: '2024-01-11 11:00:00'
    }
  ];
  localStorage.setItem('hs_assigned_shoots', JSON.stringify(testAssignments));
  
  // Create test videos
  const testVideos = [
    {
      id: 4001,
      assignId: 3001,
      title: 'Wedding Highlights Reel',
      category: 'Shoot Delivery',
      staffId: 1001,
      staffName: 'John Photographer',
      fileName: 'wedding_highlights.mp4',
      sizeMB: '45.2',
      uploadedAt: '2024-01-15 18:30:00',
      cloudUrl: 'https://example.com/video1.mp4'
    },
    {
      id: 4002,
      assignId: 3001,
      title: 'Wedding Feedback Video',
      category: 'Shoot Feedback',
      staffId: 1001,
      staffName: 'John Photographer',
      fileName: 'wedding_feedback.mp4',
      sizeMB: '12.8',
      uploadedAt: '2024-01-15 19:00:00',
      isFeedback: true,
      cloudUrl: 'https://example.com/feedback1.mp4'
    },
    {
      id: 4003,
      assignId: 3002,
      title: 'Portrait Session Reel',
      category: 'Shoot Delivery',
      staffId: 1002,
      staffName: 'Sarah Videographer',
      fileName: 'portrait_session.mp4',
      sizeMB: '28.5',
      uploadedAt: '2024-01-16 16:45:00',
      cloudUrl: 'https://example.com/video2.mp4'
    }
  ];
  localStorage.setItem('hs_staff_videos', JSON.stringify(testVideos));
  
  console.log('✅ Test data created successfully');
  
  // 2. Test tab switching
  console.log('🔄 Testing tab switching...');
  try {
    if (typeof switchTab === 'function') {
      const tabBtn = document.querySelector('[onclick*="shoot-reels"]');
      if (tabBtn) {
        switchTab('shoot-reels', tabBtn);
        console.log('✅ Tab switched successfully');
      } else {
        console.error('❌ Shoot reels tab button not found');
      }
    } else {
      console.error('❌ switchTab function not found');
    }
  } catch (error) {
    console.error('❌ Tab switching failed:', error);
  }
  
  // 3. Test render function
  console.log('🎨 Testing render function...');
  try {
    if (typeof renderShootReelsAdmin === 'function') {
      renderShootReelsAdmin();
      console.log('✅ Render function executed successfully');
      
      // Check if videos are displayed
      const grid = document.getElementById('shootReelsAdminGrid');
      if (grid && grid.children.length > 0) {
        console.log(`✅ ${grid.children.length} video cards rendered`);
      } else {
        console.warn('⚠️ No video cards found in grid');
      }
      
      // Check stats
      const totalEl = document.getElementById('shootReelsTotal');
      const reelsEl = document.getElementById('shootReelsDelivered');
      const feedbackEl = document.getElementById('shootReelsFeedback');
      const pendingEl = document.getElementById('shootReelsPending');
      
      if (totalEl) console.log(`📊 Total videos: ${totalEl.textContent}`);
      if (reelsEl) console.log(`🎬 Shoot reels: ${reelsEl.textContent}`);
      if (feedbackEl) console.log(`📋 Feedback videos: ${feedbackEl.textContent}`);
      if (pendingEl) console.log(`⏳ Pending review: ${pendingEl.textContent}`);
      
    } else {
      console.error('❌ renderShootReelsAdmin function not found');
    }
  } catch (error) {
    console.error('❌ Render function failed:', error);
  }
  
  // 4. Test filters
  console.log('🔍 Testing filters...');
  try {
    const staffFilter = document.getElementById('shootReelsFilterStaff');
    const typeFilter = document.getElementById('shootReelsFilterType');
    const statusFilter = document.getElementById('shootReelsFilterStatus');
    const searchInput = document.getElementById('shootReelsSearch');
    
    if (staffFilter) {
      console.log(`✅ Staff filter found with ${staffFilter.options.length} options`);
    }
    if (typeFilter) {
      console.log(`✅ Type filter found with ${typeFilter.options.length} options`);
    }
    if (statusFilter) {
      console.log(`✅ Status filter found with ${statusFilter.options.length} options`);
    }
    if (searchInput) {
      console.log('✅ Search input found');
    }
  } catch (error) {
    console.error('❌ Filter testing failed:', error);
  }
  
  // 5. Test action functions
  console.log('⚡ Testing action functions...');
  const actionFunctions = [
    'downloadShootVideo',
    'approveShootVideo',
    'deleteShootVideo',
    'exportShootReelsData'
  ];
  
  actionFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      console.log(`✅ ${funcName} function available`);
    } else {
      console.error(`❌ ${funcName} function not found`);
    }
  });
  
  // 6. Test notification badge
  console.log('🔔 Testing notification badge...');
  const badge = document.getElementById('shootReelsNotifBadge');
  if (badge) {
    console.log(`✅ Notification badge found, count: ${badge.textContent}`);
  } else {
    console.error('❌ Notification badge not found');
  }
  
  console.log('🎉 Test completed! Check the Shoot Reels & Feedback tab to see the results.');
  
  // Return test summary
  return {
    testData: {
      staff: testStaff.length,
      bookings: testBookings.length,
      assignments: testAssignments.length,
      videos: testVideos.length
    },
    status: 'completed',
    timestamp: new Date().toLocaleString()
  };
}

// Auto-run test if this script is loaded
if (typeof window !== 'undefined' && window.location.pathname.includes('admin.html')) {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(testShootReelsTab, 2000);
    });
  } else {
    setTimeout(testShootReelsTab, 1000);
  }
}

// Make function globally available
window.testShootReelsTab = testShootReelsTab;

console.log('🧪 Shoot Reels Tab Test Script Loaded');
console.log('💡 Run testShootReelsTab() to execute the test');
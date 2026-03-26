// Debug script for staff video visibility issues
// Add this to browser console to diagnose the problem

function debugStaffVideos() {
  console.log('=== STAFF VIDEOS DEBUG ===');
  
  // Check localStorage
  const localVideos = JSON.parse(localStorage.getItem('hs_staff_videos') || '[]');
  console.log('📁 Local Storage Videos:', localVideos.length);
  localVideos.forEach((video, index) => {
    console.log(`  ${index + 1}. ${video.title} (Staff: ${video.staffName}, ID: ${video.id})`);
  });
  
  // Check if we're on admin or staff page
  const isAdmin = window.location.pathname.includes('admin.html');
  const isStaff = window.location.pathname.includes('staff.html');
  console.log('📄 Current Page:', isAdmin ? 'Admin' : isStaff ? 'Staff' : 'Other');
  
  // Check Firebase connection
  console.log('🔥 Firebase Available:', !!window.fbSave);
  console.log('☁️ Cloudinary Available:', !!window.cloudinaryUpload);
  
  // Check DOM elements
  if (isAdmin) {
    const grid = document.getElementById('staffVideosAdminGrid');
    const count = document.getElementById('staffVideosCount');
    console.log('🎯 Admin Grid Element:', !!grid);
    console.log('🔢 Admin Count Element:', !!count);
    
    if (grid) {
      console.log('📊 Grid Content:', grid.innerHTML.length > 0 ? 'Has content' : 'Empty');
    }
  }
  
  // Check staff list
  const staffList = JSON.parse(localStorage.getItem('hs_staff') || '[]');
  console.log('👥 Staff Members:', staffList.length);
  
  // Check assigned shoots
  const assigns = JSON.parse(localStorage.getItem('hs_assigned_shoots') || '[]');
  console.log('📋 Assigned Shoots:', assigns.length);
  
  // Check if renderStaffVideosAdmin function exists
  console.log('🔧 Render Function Available:', typeof window.renderStaffVideosAdmin === 'function');
  
  // Try to manually trigger render if on admin page
  if (isAdmin && typeof window.renderStaffVideosAdmin === 'function') {
    console.log('🔄 Manually triggering render...');
    try {
      window.renderStaffVideosAdmin();
      console.log('✅ Render completed successfully');
    } catch (error) {
      console.error('❌ Render failed:', error);
    }
  }
  
  console.log('=== DEBUG COMPLETE ===');
}

// Auto-run debug if this script is loaded
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugStaffVideos);
  } else {
    setTimeout(debugStaffVideos, 1000);
  }
}

// Make function globally available
window.debugStaffVideos = debugStaffVideos;
# Shoot Reels & Feedback Admin Tab

## Overview
A dedicated admin tab for viewing, managing, and processing staff-uploaded shoot reels and feedback videos with advanced filtering, approval workflows, and payment processing.

## Features

### 📊 Dashboard Statistics
- **Total Videos**: Count of all shoot-related videos
- **Shoot Reels**: Videos uploaded as final deliverables
- **Feedback Videos**: Videos uploaded as proof of completion
- **Pending Review**: Videos awaiting admin approval

### 🔍 Advanced Filtering
- **Staff Filter**: View videos by specific staff member
- **Type Filter**: Separate shoot reels from feedback videos
- **Status Filter**: Filter by assignment status (In Progress, Completed, Paid)
- **Search**: Text search across client names, services, and locations

### 🎬 Video Management
- **Video Preview**: Inline video player with controls
- **Type Badges**: Visual indicators for Reel vs Feedback videos
- **Status Indicators**: Color-coded status badges
- **Assignment Details**: Full context of the shoot assignment

### ⚡ Quick Actions
- **View**: Open video in new tab (for cloud-hosted videos)
- **Download**: Download video file locally
- **Approve & Pay**: One-click approval with automatic payment release
- **Delete**: Remove video with confirmation

### 📈 Export Functionality
- **CSV Export**: Export all video data with assignment details
- **Comprehensive Data**: Includes video metadata, assignment info, and status

## Video Types

### 🎥 Shoot Reels
- Final edited videos delivered to clients
- Uploaded after shoot completion
- Linked to specific assignments
- Require approval for payment release

### 📋 Feedback Videos
- Proof-of-completion videos
- Show staff at event location in dress code
- Required before marking shoots as done
- Include client feedback collection

## Workflow

### 1. Staff Upload Process
```
Staff completes shoot → Uploads reel → Uploads feedback video → Marks as done
```

### 2. Admin Review Process
```
Video appears in admin tab → Admin reviews → Approves & releases payment
```

### 3. Status Progression
```
In Progress → Pending Review → Completed → Paid
```

## Status Indicators

| Status | Color | Description |
|--------|-------|-------------|
| In Progress | 🟠 Orange | Shoot assigned, work in progress |
| Pending Review | 🟣 Purple | Videos uploaded, awaiting approval |
| Completed | 🟢 Green | Approved by admin |
| Paid | 🔵 Blue | Payment released to staff |

## Assignment Integration

### Linked Data
- **Service Details**: Type of shoot, client info
- **Location**: Shoot location and date
- **Staff Info**: Assigned staff member details
- **Payment**: Credit amount and status

### Automatic Updates
- Status changes sync across all tabs
- Payment release updates staff wallets
- Notifications update in real-time

## Technical Implementation

### Data Sources
- `hs_staff_videos` - Video metadata and files
- `hs_assigned_shoots` - Assignment details
- `hs_bookings` - Client information
- `hs_wallet_*` - Staff payment tracking

### Storage
- **Video Files**: IndexedDB (local) + Cloudinary (cloud)
- **Metadata**: localStorage + Firebase sync
- **Payments**: localStorage + Firebase sync

### Real-time Updates
- Firebase listeners for new uploads
- Automatic refresh on status changes
- Live notification badges

## Usage Guide

### Accessing the Tab
1. Login as admin
2. Navigate to "Shoot Reels & Feedback" tab
3. Tab shows notification badge if videos need review

### Reviewing Videos
1. Use filters to find specific videos
2. Click video to play inline
3. Review assignment details
4. Use action buttons as needed

### Approving & Paying
1. Find videos with "Pending Review" status
2. Click "Approve & Pay" button
3. Confirm payment release
4. Payment automatically credited to staff wallet

### Exporting Data
1. Apply desired filters
2. Click "Export" button
3. CSV file downloads with all visible data

## Troubleshooting

### Videos Not Appearing
- Check if staff properly uploaded videos
- Verify Firebase sync is working
- Ensure assignment IDs match

### Payment Issues
- Check staff wallet configuration
- Verify assignment has credit amount set
- Ensure Firebase sync is active

### Video Playback Problems
- Check if video is uploaded to Cloudinary
- Verify IndexedDB storage isn't full
- Try refreshing the page

## Security Features

### Access Control
- Admin-only access to approval functions
- Staff can only upload, not approve
- Payment release requires admin confirmation

### Data Validation
- Video file type validation
- Assignment verification before approval
- Payment amount verification

### Audit Trail
- All approvals logged with admin name
- Payment history tracked
- Status changes timestamped

## Performance Optimizations

### Lazy Loading
- Videos load on demand
- Thumbnails generated automatically
- Pagination for large datasets

### Caching
- Video metadata cached locally
- Assignment data cached for quick access
- Real-time updates minimize full reloads

### Storage Management
- Automatic cleanup of old video data
- Cloud storage for large files
- Local storage for quick access

## Future Enhancements

### Planned Features
- Bulk approval for multiple videos
- Video quality analysis
- Automatic thumbnail generation
- Client feedback integration
- Advanced analytics dashboard

### Integration Possibilities
- WhatsApp notifications for approvals
- Email reports for completed shoots
- Calendar integration for shoot scheduling
- Client portal for video delivery

## API Integration

### Firebase Collections
- `staff_videos` - Video metadata
- `assigned_shoots` - Assignment tracking
- `wallets` - Payment management

### Cloudinary Integration
- Video upload and hosting
- Automatic thumbnail generation
- Video optimization and compression

### Real-time Sync
- Bidirectional data synchronization
- Conflict resolution for concurrent edits
- Offline capability with sync on reconnect
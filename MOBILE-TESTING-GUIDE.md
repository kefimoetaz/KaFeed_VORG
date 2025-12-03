# Mobile Testing Guide 📱

## Quick Test Checklist

### Before Deploying
```bash
cd frontend
npm run dev
```

Open in browser: http://localhost:5173

### Test in Browser DevTools

1. **Open DevTools**: Press `F12` or `Ctrl+Shift+I`
2. **Toggle Device Mode**: Press `Ctrl+Shift+M`
3. **Select Device**: 
   - iPhone 12 Pro (390x844)
   - iPhone SE (375x667)
   - Samsung Galaxy S20 (360x800)
   - iPad (768x1024)

### What to Test

#### ✅ Mobile (< 768px)
- [ ] Bottom navigation visible and working
- [ ] Hamburger menu opens/closes sidebar
- [ ] Top navbar shows logo + search
- [ ] No horizontal scroll
- [ ] Posts display full-width
- [ ] Images scale properly
- [ ] Forms are touch-friendly
- [ ] Buttons are easy to tap

#### ✅ Tablet (768-1023px)
- [ ] Sidebar accessible via hamburger
- [ ] Content centered properly
- [ ] Bottom nav still visible

#### ✅ Desktop (1024px+)
- [ ] Left sidebar always visible
- [ ] Right sidebar visible on XL screens (1280px+)
- [ ] Bottom nav hidden
- [ ] All features accessible

### Test User Flows

#### 1. Registration (Mobile)
```
1. Open /register on mobile view
2. Fill form (username, email, password)
3. Tap Register button
4. Should redirect to feed
```

#### 2. Navigation (Mobile)
```
1. Tap bottom nav icons
2. Each should navigate correctly:
   - Home icon → Feed
   - Messages → Messages page
   - Friends → Friends page
   - Media → Media page
   - Explore → Explore page
```

#### 3. Create Post (Mobile)
```
1. Tap hamburger menu (top-left)
2. Tap "Create Post" button
3. Fill text + upload image
4. Submit
5. Should appear in feed
```

#### 4. Interactions (Mobile)
```
1. Tap Like button → should animate
2. Tap Comment → keyboard should appear
3. Type comment → submit
4. Tap Share → modal should open
5. Tap user avatar → go to profile
```

### Common Mobile Issues to Check

#### Input Focus
- [ ] Inputs don't zoom on iOS (16px font minimum)
- [ ] Keyboard doesn't cover submit buttons
- [ ] Can scroll while keyboard is open

#### Touch Targets
- [ ] All buttons at least 44x44px
- [ ] Enough spacing between clickable elements
- [ ] No accidental taps

#### Performance
- [ ] Smooth scrolling
- [ ] No lag when opening menus
- [ ] Images load quickly
- [ ] Animations are smooth (60fps)

#### Layout
- [ ] No content cut off
- [ ] No horizontal scroll
- [ ] Proper spacing on all screen sizes
- [ ] Text is readable (not too small)

### Test on Real Devices

#### iOS (Safari)
```
1. Deploy to Vercel
2. Open on iPhone
3. Test all features
4. Check for iOS-specific issues
```

#### Android (Chrome)
```
1. Deploy to Vercel
2. Open on Android phone
3. Test all features
4. Check for Android-specific issues
```

### Performance Testing

#### Lighthouse (Chrome DevTools)
```
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Mobile"
4. Run audit
5. Aim for:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+
```

### Network Testing

Test on slow connections:
```
1. DevTools → Network tab
2. Select "Slow 3G" or "Fast 3G"
3. Test app loading and interactions
4. Ensure loading states work
```

### Orientation Testing

```
1. Test in portrait mode (default)
2. Rotate to landscape
3. Check layout adapts properly
4. All features still accessible
```

## Deploy & Test

### Deploy to Vercel
```bash
cd frontend
vercel --prod
```

### Get QR Code for Mobile Testing
```bash
# Install qrcode-terminal
npm install -g qrcode-terminal

# Generate QR code
qrcode-terminal "https://your-app.vercel.app"
```

Scan with phone camera to open instantly!

## Debugging Mobile Issues

### View Console on Mobile

#### iOS Safari
1. Connect iPhone to Mac
2. Safari → Develop → [Your iPhone] → [Your Page]

#### Android Chrome
1. Connect Android to computer
2. Chrome → chrome://inspect
3. Click "Inspect" on your device

### Common Fixes

#### Issue: Zoom on Input Focus (iOS)
```css
/* Already fixed in index.css */
input { font-size: 16px !important; }
```

#### Issue: Horizontal Scroll
```css
/* Check for elements with fixed widths */
body { overflow-x: hidden; }
```

#### Issue: Bottom Nav Covered by Browser UI
```css
/* Already handled with pb-20 */
main { padding-bottom: 5rem; }
```

## Mobile-Specific Features to Add Later

### 1. Pull to Refresh
```bash
npm install react-pull-to-refresh
```

### 2. Swipe Gestures
```bash
npm install react-swipeable
```

### 3. Share API (Native)
```javascript
if (navigator.share) {
  navigator.share({
    title: 'Check this post',
    url: window.location.href
  });
}
```

### 4. Install Prompt (PWA)
```javascript
// Add to manifest.json
// Show "Add to Home Screen" prompt
```

### 5. Haptic Feedback
```javascript
if (navigator.vibrate) {
  navigator.vibrate(10); // 10ms vibration
}
```

---

## Quick Mobile Test Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod
```

Happy testing! 🚀📱

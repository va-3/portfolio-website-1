# Cross-Browser Testing Checklist
## Post-Implementation Verification Guide

**Last Updated**: January 27, 2026
**Commit**: 2f4b6db - PDF.js viewer and mobile compatibility fixes

---

## ✅ Completed Tests

### Desktop Browsers
- [x] **Chrome/Brave** - PDF renders correctly, navigation works
- [x] **Mobile Emulation** - DevTools testing passed for iPhone/Android
- [x] **Dark Mode** - PDF color inversion working
- [x] **Keyboard Navigation** - Arrow keys, space, ESC functional

---

## 🧪 Real Device Testing Required

### iOS Safari (High Priority)

**Test Devices**: iPhone 14/15, iPad Pro

**Resume Preview (Before Fullscreen)**:
- [ ] Resume image shows fully without cropping bottom
- [ ] No sticky hover states when tapping
- [ ] Download button responds with immediate feedback
- [ ] Tapping preview opens fullscreen modal

**Fullscreen Modal**:
- [ ] PDF renders clearly on canvas (no black boxes)
- [ ] Full resume visible without scrolling
- [ ] Navigation buttons (prev/next) are clickable
- [ ] Page counter shows "1/1" correctly
- [ ] Download button in top-right works
- [ ] Tapping grey background closes modal
- [ ] Swiping or gestures don't break layout

**Performance**:
- [ ] Modal opens within 2 seconds (PDF.js loading)
- [ ] No lag when navigating pages
- [ ] Orientation change (portrait/landscape) re-renders correctly

**Dark Mode**:
- [ ] Toggle dark mode
- [ ] PDF colors invert properly
- [ ] Navigation controls remain visible

---

### Android Chrome (High Priority)

**Test Devices**: Pixel 7, Samsung Galaxy S23

**Resume Preview (Before Fullscreen)**:
- [ ] Resume image shows fully without cropping
- [ ] No sticky hover effects after tapping
- [ ] Download button provides touch feedback
- [ ] Tapping opens fullscreen modal

**Fullscreen Modal**:
- [ ] PDF renders on canvas without errors
- [ ] Full resume visible in viewport
- [ ] Navigation controls visible at bottom
- [ ] Page counter accurate
- [ ] Download button functional
- [ ] Back button or background tap closes modal

**Performance**:
- [ ] Initial load time acceptable
- [ ] Smooth rendering, no jank
- [ ] Rotation handled gracefully

**Dark Mode**:
- [ ] Dark mode toggle works
- [ ] PDF inversion applied correctly

---

### Desktop Browsers (Lower Priority)

**Firefox**:
- [ ] PDF renders correctly
- [ ] Navigation controls work
- [ ] Keyboard shortcuts functional
- [ ] Dark mode working

**Safari (macOS)**:
- [ ] PDF displays properly
- [ ] Touch bar integration (if applicable)
- [ ] Mission Control doesn't break modal

**Edge**:
- [ ] PDF rendering correct
- [ ] All features functional

---

## 🐛 Known Issues to Watch For

### Potential Mobile Issues:
1. **PDF.js Worker Loading**: If PDF doesn't render, check console for worker errors
2. **Container Dimensions**: If PDF is blank, container might not have dimensions yet
3. **Memory Issues**: Large resumes on low-end devices might be slow
4. **Touch Conflicts**: Pinch-to-zoom might interfere (currently disabled in viewport meta)

### Console Logs to Check:
```
✅ "PDF.js loaded successfully"
✅ "PDF document loaded, total pages: 1"
✅ "Container dimensions: { containerWidth: XXX, containerHeight: XXX }"
✅ "PDF viewer initialized successfully"
```

### Red Flags (Errors):
- ❌ "Failed to load PDF.js"
- ❌ "PDF canvas not found"
- ❌ Worker version mismatch
- ❌ CORS errors

---

## 📊 Testing Tools

### Browser DevTools
```bash
# Desktop Testing
1. Open http://localhost:8000
2. Press F12 (DevTools)
3. Click device toolbar icon
4. Select "iPhone 14 Pro" or "Pixel 7"
5. Test all features
```

### Real Device Testing
```bash
# Find your computer's local IP
ipconfig getifaddr en0  # macOS
ip addr show           # Linux

# On mobile device, navigate to:
http://YOUR_IP:8000
```

### Network Testing (Optional)
- [ ] Test on 3G/4G (not just WiFi)
- [ ] Test with slow network throttling
- [ ] Check total page size (PDF.js adds ~200KB)

---

## 🚀 Deployment for Testing

### Option 1: Netlify Deploy (Recommended)
```bash
git push origin main
# Netlify auto-deploys from GitHub
# URL: https://vishnuanapalli.com
```

### Option 2: Local Network
```bash
# Already running on http://localhost:8000
# Access from mobile via http://YOUR_LOCAL_IP:8000
```

---

## 📝 Issue Reporting Template

If you find issues, document them like this:

```markdown
**Device**: iPhone 15 Pro, iOS 17.2
**Browser**: Safari
**Issue**: PDF shows black box instead of content

**Console Errors**:
[Paste console errors here]

**Screenshots**:
[Attach screenshots]

**Steps to Reproduce**:
1. Open portfolio
2. Tap resume preview
3. Modal opens but canvas is black
```

---

## ✅ Success Criteria

**Minimum Viable**:
- [ ] PDF renders on iOS Safari
- [ ] PDF renders on Android Chrome
- [ ] Mobile users can view full resume
- [ ] No console errors

**Optimal**:
- [ ] All 13 browser/device combinations pass
- [ ] < 2 second load time on mobile
- [ ] Dark mode works everywhere
- [ ] Smooth animations, no jank

---

## 🔄 Next Phase: Playwright Automation

Once manual testing confirms everything works:
1. Install Playwright
2. Create automated test suite covering all browsers
3. Set up CI/CD with GitHub Actions
4. Visual regression testing

---

## 📞 Testing Support

**Debugging Tips**:
- Always check browser console (F12)
- Test in incognito/private mode first
- Clear cache if seeing old behavior
- Check Network tab for failed CDN loads

**Key Files**:
- `js/pdf-viewer.js` - PDF rendering logic
- `css/styles.css` - Lines 2732+ for hover/touch queries
- `index.html` - Lines 283-323 for PDF modal structure

**Rollback Plan**:
If critical issues found, revert to previous commit:
```bash
git revert 2f4b6db
git push origin main
```

---

**Ready to test on real devices!** 🎉

# How to Run PM Sequence GSAP

## Quick Start

### 1. **Start the Development Server**

```bash
cd "/Users/nerupudinho/Downloads/The Cursor way/Initatives/PM in the Loop/pm-sequence-gsap"
npm run dev
```

### 2. **Open in Browser**

Go to: **http://localhost:3000**

The server is currently running on **port 3000**.

---

## If You See a Blank Screen

### Troubleshooting Steps:

#### 1. **Check Browser Console**
- Open Developer Tools (F12 or Cmd+Option+I)
- Look for any error messages in the Console tab
- Common errors: GSAP loading issues, React hydration errors

#### 2. **Hard Refresh the Page**
- **Mac**: Cmd + Shift + R
- **Windows/Linux**: Ctrl + Shift + R
- This clears the cache and reloads all assets

#### 3. **Restart the Server**
```bash
# Stop the server (Ctrl+C in the terminal)
# Then remove build cache
rm -rf .next
# Start again
npm run dev
```

#### 4. **Check if Multiple Servers are Running**
```bash
# Kill all Next.js dev servers
pkill -f "next dev"
# Then start fresh
npm run dev
```

#### 5. **Verify GSAP Installation**
```bash
# Check if GSAP is installed
npm list gsap @gsap/react
# Should show:
# └── gsap@3.14.2
# └── @gsap/react@2.1.2
```

---

## What to Expect

When the app loads correctly, you should see:

1. **Title**: "Choose Your Problem"
2. **Instructions**: "Swipe right or tap ✓ to select • Swipe left or tap ✕ to skip"
3. **Card Stack**: 4 visible cards stacked behind each other
4. **Buttons**: Red X button (left) and Green ✓ button (right)
5. **Counter**: "5 problems remaining" at the bottom

---

## How to Use

### Desktop (Mouse):
- **Drag**: Click and drag cards left or right
- **Buttons**: Click X to skip, ✓ to select

### Mobile (Touch):
- **Swipe**: Swipe left to skip, right to select
- **Tap**: Tap buttons to trigger actions

### Features:
- Cards rotate as you drag
- Smooth animations when swiping
- Last card can't be skipped (shows warning)
- Cards advance automatically after swipe

---

## Current Status

✅ **Server Running**: http://localhost:3000
✅ **GSAP Fixed**: Dynamic import for Draggable plugin
✅ **No Build Errors**: Clean compilation
✅ **Ready to Test**: All features implemented

---

## Recent Fixes

- Fixed GSAP Draggable import to load dynamically
- Cleared .next cache to remove lock files
- Restarted server cleanly on port 3000

---

## Need More Help?

If you're still seeing a blank screen:
1. Share any error messages from the browser console
2. Check if JavaScript is enabled in your browser
3. Try a different browser (Chrome, Firefox, Safari)
4. Make sure you're accessing http://localhost:3000 (not 3001)




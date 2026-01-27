# Phase 1 Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# MS Clarity Analytics
# Get your project ID from https://clarity.microsoft.com
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id_here

# Optional: Substack Publication URL
# If you want to customize the newsletter popup URL
# NEXT_PUBLIC_SUBSTACK_URL=https://yourpublication.substack.com
```

## Setup Steps

### 1. MS Clarity Setup ✅ DONE

Your Clarity Project ID: `v6zecvji77`

**Local Development:**
1. Create `.env.local` file in the project root
2. Add: `NEXT_PUBLIC_CLARITY_PROJECT_ID=v6zecvji77`

**Netlify Deployment:**
1. Go to Netlify dashboard → Site settings → Environment variables
2. Add: `NEXT_PUBLIC_CLARITY_PROJECT_ID` = `v6zecvji77`
3. Redeploy the site

### 2. Substack Setup

1. Get your Substack publication URL (e.g., `https://yourname.substack.com`)
2. Update the `defaultSubstackUrl` in `components/NewsletterPopup.tsx` OR
3. Pass it as a prop: `<NewsletterPopup substackUrl="https://yourname.substack.com" />`

### 3. Netlify Deployment

1. Go to Netlify dashboard → Site settings → Environment variables
2. Add: `NEXT_PUBLIC_CLARITY_PROJECT_ID` with your Clarity project ID
3. Redeploy the site

## Features Added

✅ Newsletter popup appears after 30 seconds
✅ Popup is dismissible with "Don't show again" option
✅ MS Clarity analytics tracking (heatmaps, clicks, user behavior)
✅ GSAP animations matching existing design style

## Testing

1. Run `npm run dev`
2. Wait 30 seconds on the page
3. Popup should appear with smooth animation
4. Test dismissal and "don't show again" functionality
5. Check MS Clarity dashboard after 5 minutes to see tracking data

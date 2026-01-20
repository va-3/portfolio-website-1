# Deployment Guide

## Quick Reference

**Platform**: Netlify
**Auto-deploy**: Enabled on `main` branch
**Build time**: 30-60 seconds
**Site**: https://vishnuanapalli.com

## Critical Configuration

### DO NOT CHANGE
- `BUILD_IMAGE = "focal"` in netlify.toml (prevents build hangs)
- `.mise.toml` file (safeguard for mise issues)
- `.tool-versions` file (version manager config)

### Safe to Change
- `NODE_VERSION` in netlify.toml (Node.js version)
- `command` in netlify.toml (build script)
- Any HTML/CSS/JS/image files

## Deployment Process

Every push to `main` triggers automatic deployment:
1. Netlify detects commit
2. Pulls latest code
3. Installs Node.js 20.11.0
4. Runs build command (currently just an echo)
5. Bundles serverless function (netlify/functions/chat.js)
6. Deploys to CDN
7. Site live in 1-2 minutes

## Build Issues?

If builds hang, see `NETLIFY_BUILD_FIX.md` for detailed troubleshooting.

Quick check:
```bash
grep BUILD_IMAGE netlify.toml
# Should show: BUILD_IMAGE = "focal"
```

## Testing Changes

1. **Local testing**: Open `index.html` in browser
2. **Push to main**: Auto-deploys to production
3. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. **Wait for CDN**: 1-2 minutes for full propagation

## Environment Variables

Set in Netlify dashboard → Site settings → Environment variables:
- `OPENAI_API_KEY`: For Dobby chatbot functionality

## Rollback Procedure

If deployment breaks the site:
```bash
# Find working commit
git log --oneline -10

# Revert to that commit
git reset --hard <commit-hash>

# Force push (CAUTION: only do this if you're the sole developer)
git push --force origin main
```

Netlify will auto-deploy the reverted version.

---

**Questions?** See `NETLIFY_BUILD_FIX.md` for detailed build configuration info.

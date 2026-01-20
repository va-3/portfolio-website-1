# Netlify Build Fix - PERMANENT SOLUTION ✅ WORKING

**Issue**: Builds were hanging at "Starting to install dependencies" with mise trying to install Python 3.14.2, Ruby 3.4.8, and Go 1.25.6

**Root Cause**: Netlify's Noble (Ubuntu 24.04) build image has a global `~/.config/mise/config.toml` that forces installation of these tools, even though this static site only needs Node.js.

**✅ SOLUTION IMPLEMENTED**: Switched to Focal (Ubuntu 20.04) build image via `BUILD_IMAGE = "focal"` in netlify.toml

---

## ✅ Working Solution (January 2026)

**Configuration in `netlify.toml`:**
```toml
[build.environment]
  BUILD_IMAGE = "focal"  # This is the critical line
  NODE_VERSION = "20.11.0"
```

**Result**: Builds complete in 30-60 seconds consistently. No more hangs.

**Why it works**: Focal (Ubuntu 20.04) uses traditional nvm for Node.js instead of mise, completely avoiding the problem.

---

## ⚠️ DO NOT CHANGE These Files

The following files are **critical** for preventing build hangs. Do NOT delete or modify them without understanding the consequences:

### 1. `netlify.toml` - Build Configuration
**Critical line**: `BUILD_IMAGE = "focal"`

If you remove this line, builds will revert to Noble (Ubuntu 24.04) and start hanging again.

### 2. `.mise.toml` - Mise Override Config
Even though we use Focal (which doesn't have mise), this file stays as a safeguard in case the build image changes.

### 3. `.tool-versions` - Tool Version File
Empty file that signals "no additional tools needed" to any version managers.

---

## Attempted Fixes (For Historical Reference)

These were tried but didn't work on Noble image:

### ❌ Attempt 1: Environment Variables (netlify.toml)
```toml
[build.environment]
  MISE_DISABLED = "1"
  MISE_SKIP_INSTALL = "1"
  MISE_IDIOMATIC_VERSION_FILE = "false"
  MISE_PYTHON_INSTALL = "false"
  MISE_RUBY_INSTALL = "false"
  MISE_GO_INSTALL = "false"
```

### ✅ Attempt 2: Local .mise.toml Override
Created `.mise.toml` with empty tools section to override global config.

### ✅ Attempt 3: Empty .tool-versions File
Created `.tool-versions` to signal "no additional tools needed."

---

## Deployment Checklist - Future Reference

Before deploying changes to this site:

- [ ] Verify `BUILD_IMAGE = "focal"` is still in netlify.toml
- [ ] Don't delete `.mise.toml` or `.tool-versions`
- [ ] Node.js version updates should only change `NODE_VERSION` in netlify.toml
- [ ] If switching to Noble image, expect build hangs (not recommended)

## Troubleshooting Future Issues

### If builds suddenly start hanging again:

1. **Check build image**: Look for this in deploy logs:
   ```
   build-image version: [hash] (focal)  ← Should say "focal"
   ```

2. **Verify netlify.toml**: Ensure `BUILD_IMAGE = "focal"` is present

3. **Check for file changes**: Make sure `.mise.toml` wasn't accidentally deleted

### If you want to try Noble image again (not recommended):

1. Remove `BUILD_IMAGE = "focal"` from netlify.toml
2. Expect first deploy to take 10-15 minutes as it builds Python/Ruby/Go from source
3. May still hang - this is why we use Focal

---

## Why This Matters

**Noble Image** (Ubuntu 24.04):
- ✅ Latest security updates
- ❌ Uses mise tool manager (causes hanging)
- ❌ Global config can't be easily overridden

**Focal Image** (Ubuntu 20.04):
- ✅ Proven stable for static sites
- ✅ No mise - uses traditional nvm/rbenv
- ✅ Fast deployments (30-60 seconds)
- ⚠️ Older Ubuntu version (still supported until 2025)

---

## Expected Deployment Timeline

**With Fix Working**:
```
2:56:08 AM: Starting to install dependencies
2:56:09 AM: Installing Node.js 20.11.0
2:56:15 AM: Node.js installation complete
2:56:16 AM: Running build command
2:56:17 AM: Build complete
2:56:20 AM: Bundling functions
2:56:25 AM: Deploying to production
2:56:35 AM: Deploy successful ✅
```
**Total time**: 30-60 seconds

**Without Fix (Hanging)**:
```
2:56:09 AM: mise ~/.config/mise/config.toml tools: python@3.14.2
2:56:09 AM: mise ~/.config/mise/config.toml tools: ruby@3.4.8
2:56:10 AM: mise ~/.config/mise/config.toml tools: go@1.25.6
[HANGS HERE - timeout after 15 minutes] ❌
```

---

## Files Involved in Fix

1. **`.mise.toml`** - Local mise configuration (overrides global)
2. **`.tool-versions`** - Tool version file (signals no extra tools)
3. **`netlify.toml`** - Build configuration with environment variables

**DO NOT DELETE THESE FILES** - They are critical for preventing build hangs.

---

## Testing the Fix

After deployment completes:
1. Check deploy time: Should be < 2 minutes
2. Verify logs show: "Installing Node.js 20.11.0" (not Python/Ruby/Go)
3. Test site functionality: Video, modals, Dobby chatbot all work

---

## Contact Support If Needed

If builds continue to hang after trying ALL fixes above:

**Netlify Support**:
- Email: support@netlify.com
- Forum: https://answers.netlify.com/
- Mention: "Noble build image mise global config causing hangs"
- Reference: Site name, deploy ID, and this document

**Request**:
"Please disable mise tool auto-detection for my site, or switch my site to the Focal build image."

---

## Prevention for Future Projects

For new Netlify projects using Noble image:
1. Create `.mise.toml` with empty `[tools]` section IMMEDIATELY
2. Add `MISE_DISABLED=1` to netlify.toml environment
3. Test first deploy carefully

Or simply use Focal build image from the start:
```toml
[build]
  environment = { BUILD_IMAGE = "focal" }
```

---

## What Good Deployments Look Like

**Expected timeline**: 30-60 seconds total

```
3:XX:XX AM: build-image version: [hash] (focal)          ← Focal image ✅
3:XX:XX AM: Starting to prepare the repo for build
3:XX:XX AM: Installing Node.js 20.11.0 using nvm          ← Using nvm, not mise ✅
3:XX:XX AM: Node.js installation complete
3:XX:XX AM: Running build command
3:XX:XX AM: Build complete
3:XX:XX AM: Bundling functions
3:XX:XX AM: Site is live ✅
```

**Red flags** (bad deployment):
```
3:XX:XX AM: build-image version: [hash] (noble)           ← Wrong image ❌
3:XX:XX AM: mise ~/.config/mise/config.toml tools         ← Mise detected ❌
3:XX:XX AM: [HANGS HERE]                                  ← Build timeout ❌
```

If you see "noble" or "mise" in logs, immediately check netlify.toml for the `BUILD_IMAGE` setting.

---

## Summary

**Problem**: Noble build image + mise = build hangs
**Solution**: Focal build image = fast, reliable builds
**Status**: ✅ Working as of January 20, 2026
**Maintenance**: Keep `BUILD_IMAGE = "focal"` in netlify.toml

---

**Last Updated**: January 20, 2026
**Deployment Status**: ✅ WORKING - Builds complete in 30-60 seconds
**Current Build Image**: Focal (Ubuntu 20.04)

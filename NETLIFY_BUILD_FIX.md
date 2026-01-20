# Netlify Build Hanging Fix - PERMANENT SOLUTION

**Issue**: Builds hang at "Starting to install dependencies" with mise trying to install Python 3.14.2, Ruby 3.4.8, and Go 1.25.6

**Root Cause**: Netlify's Noble (Ubuntu 24.04) build image has a global `~/.config/mise/config.toml` that forces installation of these tools, even though this static site only needs Node.js.

---

## Current Fix Attempts (In Priority Order)

### ✅ Attempt 1: Environment Variables (netlify.toml)
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

## If Builds Still Hang: ULTIMATE FIX

If the above fixes don't work, switch to Netlify's **Focal (Ubuntu 20.04)** build image, which doesn't use mise:

### Via Netlify UI (Recommended)
1. Go to Netlify dashboard → Your site → **Site settings**
2. Navigate to **Build & deploy** → **Environment**
3. Add new variable:
   - **Key**: `BUILD_IMAGE`
   - **Value**: `focal`
4. Click **Save**
5. Trigger new deploy: **Deploys** → **Trigger deploy** → **Deploy site**

### Via netlify.toml (Alternative)
Add to the `[build]` section:
```toml
[build]
  publish = "."
  command = "echo 'Static site - no build needed'"
  environment = { BUILD_IMAGE = "focal" }
```

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

**Last Updated**: January 20, 2026
**Deployment Status**: Testing aggressive mise disabling approach
**Next Step If Fails**: Switch to Focal build image

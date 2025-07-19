# Markdown Testing Guide

## Quick Commands

### Test all markdown files in project:

```powershell
# Test all .md files
npx markdownlint-cli2 "**/*.md"

# Test specific file
npx markdownlint-cli2 "FIREBASE_DEPLOYMENT_GUIDE.md"

# Fix automatically (limited fixes)
npx markdownlint-cli2-fix "FIREBASE_DEPLOYMENT_GUIDE.md"
```

### VS Code Integration

With the `markdownlint` extension installed, you'll see:

- Red squiggly lines under errors
- Hover tooltips explaining issues
- Problems panel showing all issues

## Common Issues Found in Your File:

1. **Line too long (MD013)** - Lines should be max 80 characters
2. **Emphasis as heading (MD036)** - Use `###` instead of `**bold text**`
3. **Missing language for code blocks (MD040)** - Specify language after ```
4. **Trailing punctuation in headings (MD026)** - Remove `:` from headings
5. **Missing blank lines around headings (MD022)** - Add blank lines before/after

## Quick Fixes for Your File:

```markdown
1) instead of:

**Option A: If z-control QR Code Generator App is in a SEPARATE Firebase project**

use:

### Option A: If z-control QR Code Generator App is in a SEPARATE Firebase project

2) instead of:

### Common Issues:

use:

### Common Issues

3)Instead of:
'```
{
"hosting": [

use:

```json
{
  "hosting": [
```

## Auto-fix What's Possible:

```powershell
npx markdownlint-cli2-fix "**/*.md"
```

This will automatically fix spacing, blank lines, and other simple issues.

# Firestore Backup and Restore Guide

This guide explains how to backup and restore Firestore collections for the z-control Multi Language Translator project.

## Table of Contents

- [Overview](#overview)
- [Project Information](#project-information)
- [Backup Methods](#backup-methods)
  - [Method 1: Firebase Console (Recommended for Beginners)](#method-1-firebase-console-recommended-for-beginners)
  - [Method 2: gcloud CLI (Advanced)](#method-2-gcloud-cli-advanced)
- [Restore Methods](#restore-methods)
  - [Option A: Import to New Database (Safest)](#option-a-import-to-new-database-safest)
  - [Option B: Delete and Import (Caution Required)](#option-b-delete-and-import-caution-required)
  - [Option C: Using gcloud CLI (Most Control)](#option-c-using-gcloud-cli-most-control)
- [gcloud CLI Setup](#gcloud-cli-setup)
- [Best Practices](#best-practices)

## Overview

Firestore backups are essential for:

- Protecting data before making manual changes
- Testing corrections or bug fixes
- Recovering from accidental deletions or modifications
- Creating snapshots before deployments

**Important Limitation:** Firestore import creates a NEW database or overwrites existing collections. You cannot selectively merge data into an existing collection.

## Project Information

- **Project ID:** `z-control-4070`
- **Backup Bucket:** `z-control-4070-firestore-backups`
- **Region:** `us-central1` (recommended)
- **Collections:**
  - `MLT_translations_statistics` (main translation statistics)
  - `githubAnalyticsTraffic` (GitHub analytics)
  - `githubAnalyticsTrafficHistory` (historical GitHub analytics)

## Backup Methods

### Method 1: Firebase Console (Recommended for Beginners)

**Step-by-Step:**

1. **Create Backup Bucket (One-Time Setup):**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to **Cloud Storage** → **Buckets**
   - Click **Create Bucket**
   - Name: `z-control-4070-firestore-backups`
   - Location: `us-central1` (single region)
   - Storage class: Standard
   - Click **Create**

2. **Export Collection:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select project: `z-control-4070`
   - Navigate to **Firestore Database** → **Data**
   - Click on the collection you want to backup (e.g., `MLT_translations_statistics`)
   - Click **⋮ (three dots menu)** → **Export collection**
   - Select bucket: `z-control-4070-firestore-backups`
   - Click **Export**

3. **Backup Structure:**
   ```
   z-control-4070-firestore-backups/
   ├── 2026-02-27T10-30-45_12345/    (timestamp_randomID)
   │   ├── all_namespaces/
   │   │   └── kind_MLT_translations_statistics/
   │   │       ├── all_namespaces_kind_MLT_translations_statistics.export_metadata
   │   │       └── output-0 (actual data)
   │   └── 2026-02-27T10-30-45_12345.overall_export_metadata
   ```

**Notes:**

- Each export creates a separate timestamped folder
- Backups include all documents and subcollections, but you must specify all subcollection names

### Method 2: gcloud CLI (Advanced)

**Export Single Collection:**

```powershell
gcloud firestore export gs://z-control-4070-firestore-backups/backup-2026-02-27 \
  --collection-ids=MLT_translations_statistics,users,meta \
  --project=z-control-4070
```

**Export Multiple Collections:**

```powershell
gcloud firestore export gs://z-control-4070-firestore-backups/backup-2026-02-27 \
  --collection-ids=MLT_translations_statistics,githubAnalyticsTrafficHistory \
  --project=z-control-4070
```

**Export Entire Database:**

```powershell
gcloud firestore export gs://z-control-4070-firestore-backups/full-backup-2026-02-27 \
  --project=z-control-4070
```

## Restore Methods

### Option A: Import to New Database (Safest)

**Use Case:** Test backup integrity before applying to production

1. **Create Temporary Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project (e.g., `z-control-test`)
   - Enable Firestore

2. **Import Backup:**
   - Go to Cloud Console → Firestore → **Import/Export**
   - Click **Import**
   - Browse to backup folder: `gs://z-control-4070-firestore-backups/2026-02-27T10-30-45_12345/`
   - Select target database: your temporary project
   - Click **Import**

3. **Verify Data:**
   - Check Firestore console to confirm data looks correct

4. **Migrate to Production (if needed):**
   - Use Cloud Functions or scripts to copy verified data to production
   - Or manually recreate documents if dataset is small

**Pros:** No risk to production data  
**Cons:** Requires manual migration

### Option B: Delete and Import (Caution Required)

**Use Case:** Restore production collection from backup

**⚠️ Warning:** This deletes your current collection. Always create a fresh backup first!

1. **Create Safety Backup:**
   - Export current collection again
   - Wait for confirmation before proceeding

2. **Delete Existing Collection:**
   - Firebase Console → Firestore → Data
   - Select collection → **⋮** → **Delete collection**
   - Confirm deletion

3. **Import from Backup:**
   - Cloud Console → Firestore → **Import/Export**
   - Click **Import**
   - Browse to backup: `gs://z-control-4070-firestore-backups/2026-02-27T10-30-45_12345/`
   - Click **Import**

4. **Verify:**
   - Check Firestore console to confirm data restored correctly

**Pros:** Direct restoration to production  
**Cons:** Deletes current data

### Option C: Using gcloud CLI (Most Control)

**⚠️ Warning:** These commands modify production data. Test in emulator first!

**Delete Collection:**

```powershell
gcloud firestore delete --collection=MLT_translations_statistics \
  --project=z-control-4070
```

**Import from Backup:**

```powershell
gcloud firestore import gs://z-control-4070-firestore-backups/2026-02-27T10-30-45_12345/ \
  --project=z-control-4070
```

**Combined Command (Delete + Import):**

```powershell
# Delete
gcloud firestore delete --collection=MLT_translations_statistics --project=z-control-4070

# Wait for completion, then import
gcloud firestore import gs://z-control-4070-firestore-backups/2026-02-27T10-30-45_12345/ \
  --project=z-control-4070
```

## gcloud CLI Setup

### Installation (Windows)

1. **Download Google Cloud SDK:**
   - Visit: https://cloud.google.com/sdk/docs/install
   - Download `GoogleCloudSDKInstaller.exe`
   - Run installer with default settings

2. **Initialize gcloud:**

   ```powershell
   # Opens browser for authentication
   gcloud init

   # Follow prompts:
   # 1. Log in with your Google account
   # 2. Select project: z-control-4070
   # 3. Set default region: us-central1
   ```

3. **Verify Installation:**

   ```powershell
   # Check version
   gcloud --version

   # List projects
   gcloud projects list

   # Check current project
   gcloud config get-value project
   ```

### Usage Locations

**Option 1: Local PowerShell (Recommended)**

- Press `Win + X` → Select "Windows PowerShell" or "Terminal"
- Or search "PowerShell" in Start menu
- Run commands from any directory

**Option 2: Google Cloud Shell (Web-Based)**

- Go to https://console.cloud.google.com
- Click **Cloud Shell icon** (terminal icon, top-right)
- Terminal opens in browser with gcloud pre-installed
- No local installation needed

### Configuration

**Set Default Project:**

```powershell
gcloud config set project z-control-4070
```

**Set Default Region:**

```powershell
gcloud config set functions/region us-central1
```

**List All Configurations:**

```powershell
gcloud config list
```

## Best Practices

### Before Making Changes

1. **Always test with emulator first** for code changes
2. **Create fresh backup** before any manual Firestore modifications
3. **Document the reason** for the backup (naming convention suggestion):
   ```
   backup-2026-02-27-before-user-cleanup
   backup-2026-02-27-pre-migration
   ```

### Backup Schedule

**Recommended Frequency:**

- **Before deployments:** Always
- **Before manual changes:** Always
- **Routine backups:** Weekly (can be automated with Cloud Scheduler)
- **Before major testing:** Always

### Storage Management

**Monitor Backup Size:**

- Check Cloud Storage bucket periodically
- Delete old backups after 30-90 days (depending on needs)
- Keep critical milestone backups indefinitely

**Cost Considerations:**

- Standard storage: ~$0.020 per GB/month
- Export operations: Free
- Import operations: Free
- Download charges may apply for large restores

### Safety Checklist

Before restoring from backup:

- [ ] Verify backup timestamp is correct
- [ ] Create fresh backup of current state
- [ ] Test restore in emulator or temporary database first
- [ ] Confirm backup contains expected data
- [ ] Have rollback plan ready
- [ ] Notify team members (if applicable)

### Testing Workflow

1. **Create backup** of production data
2. **Test in emulator** with backup data
3. **Verify changes** work as expected
4. **Apply changes** to production
5. **Create new backup** after successful changes

## Troubleshooting

### Export Fails

**Error:** Permission denied

- **Solution:** Ensure you have Firestore Admin role in IAM

**Error:** Bucket not found

- **Solution:** Verify bucket name and permissions

### Import Fails

**Error:** Collection already exists

- **Solution:** Delete collection first, or import to new database

**Error:** Invalid backup path

- **Solution:** Ensure path includes the timestamped folder with metadata files

### gcloud Authentication Issues

**Error:** Not authenticated

```powershell
gcloud auth login
gcloud auth application-default login
```

**Error:** Wrong project selected

```powershell
gcloud config set project z-control-4070
```

## Additional Resources
- [z-control Firestore Export/Import Troubleshooting Guide](./FIRESTORE_EXPORT_IMPORT_TROUBLESHOOTING.md)

- [Firestore Export/Import Documentation](https://cloud.google.com/firestore/docs/manage-data/export-import)
- [gcloud Firestore Commands](https://cloud.google.com/sdk/gcloud/reference/firestore)
- [Cloud Storage Pricing](https://cloud.google.com/storage/pricing)
- [Best Practices for Firestore](https://cloud.google.com/firestore/docs/best-practices)

## Future Enhancements

Consider implementing:

- **Automated backups** with Cloud Scheduler + Cloud Functions
- **Backup/restore UI** in programmer device settings
- **Backup notifications** via email or Slack
- **Backup retention policy** (auto-delete old backups)
- **Incremental backups** for large collections

---

**Last Updated:** 2026-02-27  
**Project:** z-control Multi Language Translator  
**Maintained by:** Development Team

# Firestore Export/Import Troubleshooting Guide

## Overview

This document describes the problems encountered and solutions for exporting Firestore collections from production project `z-control-4070` to test project `test-backup-restore-fa941` (ID: `test-backup-restore-fa941`), including all commands used and their explanations.

## Table of Contents

- [Overview](#overview)
- [Key Findings](#key-findings)
  - [Problem 1: Collection Filtering Exports Empty Data](#problem-1-collection-filtering-exports-empty-data)
  - [Problem 2: Full Database Export Includes Unwanted Collections](#problem-2-full-database-export-includes-unwanted-collections)
  - [Problem 3: Subcollections Not Exported with Single Collection Filter](#problem-3-subcollections-not-exported-with-single-collection-filter)
  - [Problem 4: Nested Folder Structure on Copy](#problem-4-nested-folder-structure-on-copy)
- [Commands Used - Detailed Explanations](#commands-used---detailed-explanations)
  - [1. Initial Export Attempt (Collection Filter Only)](#1-initial-export-attempt-collection-filter-only)
  - [2. Check Operation Status](#2-check-operation-status)
  - [3. List Collection Structure](#3-list-collection-structure)
  - [4. Check Data File Sizes](#4-check-data-file-sizes)
  - [5. Full Database Export (All Collections)](#5-full-database-export-all-collections)
  - [6. Copy Backup Between Buckets (Correct Way)](#6-copy-backup-between-buckets-correct-way)
  - [7. Set Project Context](#7-set-project-context)
  - [8. Import Backup to Different Project](#8-import-backup-to-different-project)
  - [9. Clean Up Unwanted Collections](#9-clean-up-unwanted-collections)
- [Complete Workflow - Working Example](#complete-workflow---working-example)
  - [Export with Subcollections](#export-with-subcollections)
  - [Import to Test Project](#import-to-test-project)
- [Finding Subcollection Names](#finding-subcollection-names)
  - [Method 1: Firebase Console](#method-1-firebase-console)
  - [Method 2: Query Firestore](#method-2-query-firestore)
- [Best Practices Going Forward](#best-practices-going-forward)
  - [Export Strategy](#export-strategy)
  - [Bucket Organization](#bucket-organization)
  - [Naming Convention](#naming-convention)
- [Troubleshooting Checklist](#troubleshooting-checklist)
- [Common Commands Reference](#common-commands-reference)
- [Important Notes](#important-notes)
- [Additional Resources](#additional-resources)

## Key Findings

### Problem 1: Collection Filtering Exports Empty Data

**Issue:** When exporting with `--collection-ids=MLT_translations_statistics`, the export resulted in **0 bytes** data file (`output-0`), even though the collection contains documents.

**Root Cause:** The `--collection-ids` filter only exports **root-level documents** in the collection, not subcollections. Since `MLT_translations_statistics` is structured as a root collection with documents that have **subcollections**, root documents may be empty or sparse.

**Evidence:**

```bash
# Empty export (0 bytes)
gcloud firestore export gs://z-control-4070-firestore-backups/backup-debug \
  --collection-ids=MLT_translations_statistics \
  --project=z-control-4070

# Result: output-0 file was 0 bytes
gsutil ls -lh gs://z-control-4070-firestore-backups/backup-debug/all_namespaces/kind_MLT_translations_statistics/output-0
       0 B  2026-02-28T08:07:10Z  output-0
```

### Problem 2: Full Database Export Includes Unwanted Collections

**Issue:** When exporting the full database (no `--collection-ids` filter), all collections were exported including:

- `githubAnalyticsTraffic` (Landing Page app)
- `githubAnalyticsTrafficHistory` (Landing Page app)
- `MLT_translations_statistics` (MLT app - desired)

**Solution:** Explicitly list root collection + all subcollection names in `--collection-ids` to export only the desired data.

### Problem 3: Subcollections Not Exported with Single Collection Filter

**Issue:** Exporting with `--collection-ids=MLT_translations_statistics` does not include subcollections like `userMapping` (which contains documents under user IDs).

**Solution:** Include all subcollection names in the export:

```bash
# Correct approach
gcloud firestore export gs://z-control-4070-firestore-backups/mlt-only \
  --collection-ids=MLT_translations_statistics,users,meta \
  --project=z-control-4070
```

### Problem 4: Nested Folder Structure on Copy

**Issue:** When copying from source to destination bucket with trailing slash, the folder structure was duplicated:

```
gs://source/backup-with-subcollections/   (trailing slash)
→ gs://destination/backup-with-subcollections/backup-with-subcollections/  (nested)
```

**Solution:** Copy without trailing slashes:

```bash
# WRONG - creates nested structure
gsutil -m cp -r gs://source/backup/ \
  gs://destination/backup/

# CORRECT - flat copy
gsutil -m cp -r gs://source/backup \
  gs://destination/
```

## Commands Used - Detailed Explanations

### 1. Initial Export Attempt (Collection Filter Only)

```bash
gcloud firestore export gs://z-control-4070-firestore-backups/backup-debug \
  --collection-ids=MLT_translations_statistics \
  --project=z-control-4070
```

**Explanation:**

- `gcloud firestore export` - Initiates Firestore export operation
- `gs://z-control-4070-firestore-backups/backup-debug` - Result path in Cloud Storage bucket
- `--collection-ids=MLT_translations_statistics` - **Only export this root collection** (NOT subcollections!)
- `--project=z-control-4070` - Source project

**Output:** `operationState: PROCESSING` then returned quickly (deceptive)

### 2. Check Operation Status

```bash
gcloud firestore operations describe ASBkZjQzMDI0NDFiM2MtODkzYS02NmE0LTQ3NGEtOGUzYjJlZDIkGnNlbmlsZXBpcAkKMxI \
  --project=z-control-4070
```

**Explanation:**

- `gcloud firestore operations describe` - Check status of long-running operation
- `ASBkZj...` - Operation ID from export command output
- Returns: `operationState: SUCCESSFUL` or `PROCESSING` or `FAILED`

**Expected Output:**

```yaml
done: true
metadata:
  operationState: SUCCESSFUL # Important - confirms completion
  progressDocuments:
    completedWork: "43" # Number of documents exported
    estimatedWork: "43"
  progressBytes:
    completedWork: "82350" # Bytes of data exported
    estimatedWork: "86746"
```

### 3. List Collection Structure

```bash
gsutil ls -lh gs://z-control-4070-firestore-backups/backup-with-subcollections/all_namespaces/
```

**Explanation:**

- `gsutil ls` - List files in Cloud Storage bucket
- `-lh` - Long format, human-readable sizes
- Shows all collections in backup by checking `kind_*` folders

**Expected Output:**

```
gs://z-control-4070-firestore-backups/backup-with-subcollections/all_namespaces/all_kinds/
```

### 4. Check Data File Sizes

```bash
gsutil ls -lh gs://z-control-4070-firestore-backups/backup-with-subcollections/all_namespaces/all_kinds/
```

**Explanation:**

- Lists metadata and data files
- `all_namespaces_all_kinds.export_metadata` - Export metadata (86 B)
- `output-0` - Actual data file (should be > 0 bytes)

**Signs of Success:**

- `output-0` is **not 0 bytes**
- File size is reasonable for your data (e.g., 80 KiB)

**Signs of Failure:**

```
       0 B  2026-02-28T08:07:10Z  output-0  # EMPTY!
```

### 5. Full Database Export (All Collections)

```bash
gcloud firestore export gs://z-control-4070-firestore-backups/backup-with-subcollections \
  --project=z-control-4070
```

**Explanation:**

- No `--collection-ids` filter = export everything
- Includes all root collections and their subcollections
- **WARNING:** This can include unrelated collections!

**When to Use:**

- Testing backup/restore workflow
- Full database disaster recovery
- Data archival

**When NOT to Use:**

- Selective backups (use explicit `--collection-ids` instead)

### 6. Copy Backup Between Buckets (Correct Way)

```bash
gsutil -m cp -r gs://z-control-4070-firestore-backups/backup-with-subcollections \
  gs://test-backup-restore-firestore-backups/
```

**Explanation:**

- `gsutil -m cp` - Copy with parallel transfers (`-m` flag)
- `-r` - Recursive copy (includes subdirectories)
- `gs://source/backup-with-subcollections` - **NO trailing slash** (important!)
- `gs://destination/` - **Trailing slash** indicates target is directory

**Result Structure:**

```
gs://test-backup-restore-firestore-backups/backup-with-subcollections/
├── all_namespaces/
├── backup-with-subcollections.overall_export_metadata
```

**Common Mistake (Creates Nested Structure):**

```bash
# WRONG
gsutil -m cp -r gs://source/backup/ \
  gs://destination/backup/
# Result: gs://destination/backup/backup/ (nested!)
```

### 7. Set Project Context

```bash
gcloud config set project test-backup-restore-fa941
```

**Explanation:**

- Sets default project for all subsequent `gcloud` commands
- Scope: current Cloud Shell session only

**Verify Current Project:**

```bash
gcloud config get-value project
# Output: test-backup-restore-fa941
```

### 8. Import Backup to Different Project

```bash
gcloud firestore import gs://test-backup-restore-firestore-backups/backup-with-subcollections/backup-with-subcollections \
  --project=test-backup-restore-fa941
```

**Explanation:**

- `gcloud firestore import` - Import previously exported backup
- Full path must include the `backup-with-subcollections.overall_export_metadata` file location
- Overwrites/merges data in target database

**Output:**

```yaml
done: true
metadata:
  inputUriPrefix: gs://test-backup-restore-firestore-backups/backup-with-subcollections/backup-with-subcollections
  operationState: SUCCESSFUL
  progressDocuments:
    completedWork: "43" # 43 documents restored
```

### 9. Clean Up Unwanted Collections

```bash
gcloud firestore delete --collection=githubAnalyticsTraffic \
  --project=test-backup-restore-fa941
```

**Explanation:**

- Deletes entire collection (no way to undo from command - safe delete)
- Use this when full export included unrelated collections

**Repeat for each unwanted collection:**

```bash
gcloud firestore delete --collection=githubAnalyticsTrafficHistory \
  --project=test-backup-restore-fa941
```

## Complete Workflow - Working Example

### Export with Subcollections

```bash
# 1. Set source project (if not already set)
gcloud config set project z-control-4070

# 2. Export only MLT collections (replace with your actual subcollection names!)
gcloud firestore export gs://z-control-4070-firestore-backups/mlt-only/2026-02-28 \
  --collection-ids=MLT_translations_statistics,users,meta \
  --project=z-control-4070

# 3. Wait and verify export succeeded (check operation status)
gcloud firestore operations describe OPERATION_ID --project=z-control-4070

# 4. Confirm data size
gsutil ls -lh gs://z-control-4070-firestore-backups/mlt-only/2026-02-28/all_namespaces/all_kinds/
```

### Import to Test Project

```bash
# 1. Copy to test bucket (without trailing slash on source!)
gsutil -m cp -r gs://z-control-4070-firestore-backups/mlt-only/2026-02-28 \
  gs://test-backup-restore-firestore-backups/

# 2. Switch to test project
gcloud config set project test-backup-restore-fa941

# 3. Import
gcloud firestore import gs://test-backup-restore-firestore-backups/mlt-only/2026-02-28

# 4. Verify in Firebase Console
#    Select test-backup-restore-fa941 → Firestore → Data
#    Should see MLT_translations_statistics and subcollections
```

## Finding Subcollection Names

Since `--collection-ids` requires all subcollection names, you need to identify them first.

**Method 1: Firebase Console**

1. Go to https://console.firebase.google.com
2. Select `z-control-4070` project
3. Navigate to Firestore Database → Data
4. Click on `MLT_translations_statistics`
5. Look for subcollections listed under documents
6. Note the subcollection names

**Method 2: Query Firestore**

```bash
gcloud firestore collections list --project=z-control-4070
```

**For z-control-4070 MLT app, typical structure:**

```
MLT_translations_statistics (root collection)
├── documents (root level - if any)
└── Subcollections:
    ├── userMapping
    ├── users
    ├── meta
```

## Best Practices Going Forward

### Export Strategy

**For production backups:**

```bash
# Always export full database (includes all subcollections automatically)
gcloud firestore export gs://z-control-4070-firestore-backups/full-$(date +%Y-%m-%d) \
  --project=z-control-4070
```

**For selective exports (MLT only):**

```bash
# List all relevant collections and subcollections
gcloud firestore export gs://z-control-4070-firestore-backups/mlt-only-$(date +%Y-%m-%d) \
  --collection-ids=MLT_translations_statistics,users,meta \
  --project=z-control-4070
```

### Bucket Organization

**Recommended structure:**

```
z-control-4070-firestore-backups/
├── full/
│   ├── 2026-02-28/
│   ├── 2026-03-01/
├── mlt-only/
│   ├── 2026-02-28/
├── github-only/
    ├── 2026-02-28/
```

### Naming Convention

**Use timestamps and descriptors:**

```bash
gs://bucket/backup-YYYY-MM-DD-description
gs://bucket/full-backup-2026-02-28
gs://bucket/mlt-only-2026-02-28-before-cleanup
```

## Troubleshooting Checklist

| Problem                        | Check                          | Solution                                                          |
| ------------------------------ | ------------------------------ | ----------------------------------------------------------------- |
| Export shows 0 bytes           | Operation status, data size    | Verify `--collection-ids` includes subcollections                 |
| Import fails: file not found   | Bucket path (trailing slashes) | Remove trailing slash from source path                            |
| Import shows wrong collections | Export command used            | Did you use full export? Use selective `--collection-ids`         |
| Permission denied on bucket    | Project context                | Ensure you're in correct project with `gcloud config set project` |
| Nested folders after copy      | gsutil cp command syntax       | Remove trailing slash from source bucket                          |
| Operation stuck in PROCESSING  | Wait 60+ seconds               | Use `gcloud firestore operations describe` to check               |

## Common Commands Reference

```bash
# Check current project
gcloud config get-value project

# Set project
gcloud config set project PROJECT_ID

# List collections
gcloud firestore collections list --project=PROJECT_ID

# Check operation status
gcloud firestore operations describe OPERATION_ID --project=PROJECT_ID

# List backup bucket contents
gsutil ls -r gs://bucket-name/

# Check file sizes
gsutil ls -lh gs://bucket-name/path/**

# Copy between buckets (correct syntax!)
gsutil -m cp -r gs://source/backup gs://destination/

# Delete collection
gcloud firestore delete --collection=COLLECTION_NAME --project=PROJECT_ID

# Export all collections
gcloud firestore export gs://bucket/backup --project=SOURCE_PROJECT

# Export specific collections (list all needed!)
gcloud firestore export gs://bucket/backup --collection-ids=col1,subcol1,subcol2 --project=SOURCE_PROJECT

# Import backup
gcloud firestore import gs://bucket/backup --project=TARGET_PROJECT
```

## Important Notes

1. **Subcollections must be explicitly listed** - `--collection-ids` does NOT automatically include subcollections
2. **Full exports include everything** - If you use `gcloud firestore export` without `--collection-ids`, all collections are exported
3. **Import overwrites/merges** - Use test projects to verify before importing to production
4. **No partial restores** - Import either restores everything or nothing; can't cherry-pick documents
5. **Trailing slashes matter** - `gsutil cp -r source/ dest/` creates nested structure; use `source dest/` instead

## Additional Resources

- [Firestore Export/Import Docs](https://cloud.google.com/firestore/docs/manage-data/export-import)
- [gcloud firestore Command Reference](https://cloud.google.com/sdk/gcloud/reference/firestore)
- [gsutil Command Reference](https://cloud.google.com/storage/docs/gsutil)
- [Cloud Storage Best Practices](https://cloud.google.com/storage/docs/best-practices)

---

**Last Updated:** 2026-02-28  
**Project:** z-control Multi Language Translator  
**Related:** Landing Page project  
**Document Purpose:** Guide for exporting MLT collections from production and importing to test environments

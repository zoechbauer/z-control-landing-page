# Backup of Non-Committed Files and Folders

This guide explains how to use the provided PowerShell scripts to back up non-committed files and folders from your development projects. These scripts help you safeguard important configuration and environment files before deleting or migrating projects.

## Purpose

The backup scripts are designed to copy files and folders that are typically not committed to version control, such as:

- `.github`
- `.vscode`
- `.env.local`
- `src/index_DEBUG_FIREBASE-config.html`

## Example Projects

Scripts and instructions are provided for:

- Calculator project
- z-control landing-page project

## How to Use

1. Open PowerShell in your project directory.
2. Run the backup script:
   ```
   .\tools\backup_non_committed_files.ps1
   ```
3. If you encounter script execution errors, run:
   ```
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\tools\backup_non_committed_files.ps1
   ```

## Notes

- The default backup locations are:
  - `C:\SOURCE-ACTIVE\BACKUP_NON_COMMITTED_FILES\Calculator`
  - `C:\SOURCE-ACTIVE\BACKUP_NON_COMMITTED_FILES\Landing-Page`
- You can modify the scripts to include additional folders or change the backup path as needed.
- Each example project includes a README and instructions in its `tools` folder.

## Additional Information

For more details, see the README files in each example project in the source repository.

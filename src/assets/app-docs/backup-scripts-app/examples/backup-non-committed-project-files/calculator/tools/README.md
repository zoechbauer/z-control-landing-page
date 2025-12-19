# Tools Folder

This folder contains utility scripts and documentation for project maintenance and backup.

## Files

- **backup_non_committed_files.ps1**  
  PowerShell script to back up non-committed files and folders (such as `.github` and `.vscode`) from the project directory to a safe backup location.  
  Use this script before deleting or migrating the project to avoid losing important configuration files.

- **backup_non_committed_files.txt**  
  Instructions for running the backup script.  
  Includes steps for handling PowerShell execution policy errors.

## Usage

1. Open PowerShell in the project directory.
2. Run the backup script:
   ```
   .\tools\backup_non_committed_files.ps1
   ```
3. If you get script execution errors, run:
   ```
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\tools\backup_non_committed_files.ps1
   ```

## Notes

- The backup location is set to `C:\SOURCE-ACTIVE\BACKUP_NON_COMMITTED_FILES\Calculator` by default.
- You can modify the script to include additional folders or change the backup path as needed.
- These files are included in the repository to ensure backup instructions and scripts are always available.

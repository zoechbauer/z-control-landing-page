# Backup of Development Projects

This guide explains how to use the provided PowerShell and batch scripts to back up your development project folders and files. These scripts help you safeguard your work by copying all relevant files and folders, with flexible logging options and parameterized automation support.

## Purpose

The backup scripts are designed to:
- Recursively copy all content from a source directory to a backup destination.
- Exclude folders commonly not needed in backups, such as `.angular`, `node_modules`, `www`, and `dist`.
- Log processed items (folders and/or files) to a CSV file for audit and verification.

## Note on Project Types

**This script is targeted for Angular and IONIC projects.**  
For other project types, you may need to add additional folders to the excluded list to avoid backing up unnecessary files (such as build outputs, dependencies, or IDE folders).

To customize the excluded folders, edit the following part of the PowerShell script (`backup-dev.ps1`):

```powershell
# Excluded folder names
$excludeFolders = @(".angular", "node_modules", "www", "dist")
```

For example, to exclude `.next` and `.venv` for Next.js or Python projects:

```powershell
$excludeFolders = @(".angular", "node_modules", "www", "dist", ".next", ".venv")
```

## Script Overview

### Files

- **backup-dev.ps1**  
  PowerShell script that performs the backup and logging.  
  Accepts parameters for source, backup destination, log file, and logging mode.  
  Allows you to specify whether to log only folders or both folders and files.

- **backup-dev-task.bat**  
  Batch file to run the PowerShell script.  
  Accepts parameters for source, backup destination, logging mode (`FoldersOnly` or `FoldersAndFiles`), and log file.  
  Can be used interactively or scheduled as a Windows Task for automated backups.

- **logging-examples/logging-folders-and-files**  
  Contains sample log files (`BACKUP.csv`, `BACKUP.xlsx`) generated when using the `FoldersAndFiles` logging mode.

- **logging-examples/logging-folders-only**  
  Contains sample log files (`BACKUP.csv`, `BACKUP.xlsx`) generated when using the `FoldersOnly` logging mode.

- **parameter-examples/terminal-log.txt**  
  Contains real usage examples and outputs for reference.

## How to Use

1. Open a command prompt in the `backup-dev-projects/scripts` folder.
2. Run the batch file with desired parameters:
   ```
   backup-dev-task.bat
   ```
   Or with custom parameters:
   ```
   backup-dev-task.bat "C:\MyProject" "D:\Backups\MyProject" "FoldersAndFiles" "D:\Backups\MyProject\backup.csv"
   ```
   - Parameters:  
     1. Source folder  
     2. Backup destination  
     3. Logging mode (`FoldersOnly` or `FoldersAndFiles`)  
     4. Log file path

   If no parameters are provided, defaults are used.

3. The batch file will execute the PowerShell script with the specified parameters.

4. To run the PowerShell script directly with custom parameters:
   ```
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\backup-dev.ps1" -Source "C:\MyProject" -BackupDest "D:\Backups\MyProject" -LogMode FoldersAndFiles -LogFile "D:\Backups\MyProject\backup.csv"
   ```

## Scheduled Task

- You can use `backup-dev-task.bat` in a Windows Scheduled Task to automate backups.
- Set the task to run the batch file at your preferred schedule.
- Ensure the user account running the task has permission to access the source and backup directories.

## Parameters

| Parameter     | Description                                                              | Default Value      | Notes                                |
|---------------|--------------------------------------------------------------------------|--------------------|--------------------------------------|
| `-Source`     | Path to the source folder to back up.                                    | Current directory  | Can be relative or absolute.         |
| `-BackupDest` | Path to the backup destination folder.                                   | `.\BACKUP`         | Can be relative or absolute.         |
| `-LogMode`    | Logging mode: `FoldersOnly` or `FoldersAndFiles`.                        | `FoldersOnly`      | Uses ValidateSet for safety.         |
| `-LogFile`    | Path to the log file (CSV) to write backup results.                      | `.\BACKUP.csv`     | Will be created/overwritten.         |

## Real Usage Examples

See `parameter-examples/terminal-log.txt` for real-world script runs and outputs.

**Summary of scenarios:**
- Running with all default parameters.
- Specifying only the source directory.
- Specifying all parameters, including custom log mode and log file.
- Handling of invalid `LogMode` values (shows error and valid options).

## Output

- **Log files**: CSV files listing all folders (and optionally files) backed up.
- **Backup**: Copies source folder contents to the destination, preserving structure.

## Logging Modes

- **FoldersOnly**: Logs only folder names.
- **FoldersAndFiles**: Logs both folders and files.

## Example Output

See `logging-examples/logging-folders-and-files/BACKUP.csv` and `logging-examples/logging-folders-only/BACKUP.csv` for sample log outputs.

## Notes

- The param block is at the top of the PowerShell script for compatibility.
- Batch file passes parameters in the correct order and with correct names.
- All scripts are tested with PowerShell 5 and 7.
- Obsolete scripts have been removed for clarity and maintainability.

---

_Last updated: December 16, 2025_
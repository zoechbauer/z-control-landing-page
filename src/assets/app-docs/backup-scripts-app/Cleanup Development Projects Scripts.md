# Cleanup Development Projects Scripts Usage Guide

This guide explains how to use the provided PowerShell and batch scripts to clean up development project folders. These scripts help you reclaim disk space and keep your dev environments tidy by removing large or unnecessary folders (such as `node_modules`, `www`, `dist`, and `.angular`) from project directories. The scripts support flexible logging options and can be run interactively or scheduled for automation.

---

## Purpose

The cleanup scripts are designed to:
- Recursively search a specified directory and remove all folders named `.angular`, `node_modules`, `www`, or `dist` at any depth.
- Log each deleted folder (and optionally, all files within) to a CSV file for audit and verification.
- Support two logging modes: log only deleted folders, or log both folders and files.

---

## Files

- **cleanup-dev.ps1**  
  PowerShell script that performs the cleanup and logging.  
  Allows you to specify whether to log only folders or both folders and files.

- **cleanup-dev-task.bat**  
  Batch file to run the PowerShell script.  
  Accepts a source path, logging mode parameter (`FoldersOnly` or `FoldersAndFiles`), and an optional log file path.  
  Can be used interactively or scheduled as a Windows Task for automated cleanups.

---

## How to Use

1. Open a command prompt in the `clean-dev-projects` folder.
2. Run the batch file with the desired options:
   ```
   cleanup-dev-task.bat [SourcePath] [FoldersOnly|FoldersAndFiles] [LogFilePath]
   ```
   - If no parameters are provided, it defaults to cleaning `C:\SOURCE-ACTIVE-DIV`, logging both folders and files, and writing the log to `CLEANUP.csv` in the script directory.
   - Examples:
     ```
     cleanup-dev-task.bat D:\Projects FoldersOnly
     cleanup-dev-task.bat "C:\My Projects" FoldersAndFiles "C:\Logs\cleanup-log.csv"
     ```
   - **Note:** If your paths contain spaces, enclose them in quotes.

3. The batch file will execute the PowerShell script with the specified options.

4. To run the PowerShell script directly with custom parameters:
   ```
   "C:\Program Files\PowerShell\7\pwsh.exe" -NoProfile -ExecutionPolicy Bypass -File ".\cleanup-dev.ps1" -source "C:\SOURCE-ACTIVE-DIV" -logFile "C:\SOURCE-ACTIVE-DIV\cleanup.csv" -LogMode FoldersAndFiles
   ```
   - `-source` specifies the root directory to clean.
   - `-logFile` sets the output CSV log file path.
   - `-LogMode` can be `FoldersOnly` or `FoldersAndFiles`.

---

## Scheduled Task

- You can use `cleanup-dev-task.bat` in a Windows Scheduled Task to automate cleanups.
- Set the task to run the batch file at your preferred schedule (e.g., weekly or monthly).
- Ensure the user account running the task has permission to access and modify the target directories.

---

## Notes

- The script only deletes folders with exact names: `.angular`, `node_modules`, `www`, or `dist` (case-insensitive).
- The log file records each deleted folder and, if enabled, all files within, with columns: timestamp, name, type, directory, deleted, and full path.
- The log file is overwritten on each run.
- Use `FoldersOnly` to log only deleted folders, or `FoldersAndFiles` to log both folders and files.
- You can customize the source path and log file location via parameters or by editing the batch/script defaults.
- The default log file is `CLEANUP.csv` in the same directory as the batch script.

---

## Example Log Entry

```
Timestamp;Name;Type;Directory;Deleted;Full Path
2025-12-14 15:27:01;node_modules;Folder;C:\Projects\MyApp;true;C:\Projects\MyApp\node_modules
2025-12-14 15:27:02;index.js;File;C:\Projects\MyApp\node_modules\lib;true;C:\Projects\MyApp\node_modules\lib\index.js
```

---

_Last updated: December 15, 2025_
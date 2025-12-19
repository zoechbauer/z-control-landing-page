# Log Disk Space Scripts Usage Guide

This guide explains how to use the provided PowerShell scripts to log disk space usage. These scripts help you monitor disk drive sizes or folder sizes within a specified directory, which is useful for auditing storage and identifying large folders.

## Purpose

The backup scripts are designed to:
- Scan a specified directory or disk drive and log the size of each folder.
- Optionally include subfolders up to a specified depth (including unlimited depth), controlled by a single `SearchDepth` parameter.
- Output the results to a CSV file for easy review and further processing.

## Files

- **log-folder-sizes.bat**  
  Batch file to launch the PowerShell script for logging folder sizes.  
  Supports specifying the root path, search depth (including unlimited depth), and log file location.

- **log-folder-sizes.ps1**  
  PowerShell script that scans the specified directory and logs the size of each folder (and optionally subfolders) to a CSV file.  
  Handles access errors gracefully and supports both PowerShell 5 and 7.

## Usage

1. Open a terminal in this directory.
2. Run the batch file with your desired parameters:
   ```
   log-folder-sizes.bat [SearchPath] [SearchDepth] [LogFilePath]
   ```
   - **SearchPath**: The root directory to scan (default: `C:\SOURCE-ACTIVE`).
   - **SearchDepth**: Depth for subfolder search (`0` = top-level only, `-1` = unlimited, any other positive number = that depth).
   - **LogFilePath**: Path to the CSV log file (default: `FolderSizesLog.csv` in the script directory).

   **Examples:**
   ```
   log-folder-sizes.bat
   log-folder-sizes.bat C:\SOURCE-ACTIVE 3
   log-folder-sizes.bat C:\SOURCE-ACTIVE -1
   log-folder-sizes.bat C: 3 "C:\Logs\FolderSizesLog.csv"
   ```

3. The results will be saved to:
   - `FolderSizesLog.csv` (semicolon-separated)

## Script Details

### log-folder-sizes.bat

- Calls PowerShell 7 (`pwsh.exe`) to run the logging script.
- Accepts parameters for the search path, search depth, and log file location.
- Example usage is included in the comments at the top of the file.

### log-folder-sizes.ps1

- Scans the specified directory and logs the size of each folder.
- Subfolder inclusion is determined by the `SearchDepth` parameter:
  - `0` = only top-level folders
  - `-1` = unlimited depth (all subfolders)
  - Any other positive number = that depth
- Handles access-denied errors and logs them accordingly.
- Outputs results to a CSV file for easy review and further processing.
- Compatible with both PowerShell 5 and 7.

## Additional Information

For more details, see the README file in the log-disk-space folder in the source repository.

---
_Last updated: December 15, 2025_
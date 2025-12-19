# Upgrading from Windows PowerShell 5 to PowerShell 7

## Why Upgrade?

PowerShell 7 (pwsh) is cross-platform, faster, and has many new features compared to Windows PowerShell 5.1. It can run side-by-side with Windows PowerShell.

---

## How to Install PowerShell 7

1. **Download the Installer**
   - Go to: [PowerShell Releases on GitHub](https://github.com/PowerShell/PowerShell/releases)
   - Download the latest `.msi` for Windows (e.g., `PowerShell-7.x.x-win-x64.msi`).

2. **Run the Installer**
   - Double-click the `.msi` file.
   - Accept the defaults (recommended install path: `C:\Program Files\PowerShell\7\`).
   - Optionally, check "Add to PATH" and "Add to context menu" during installation.

3. **Verify Installation**
   - Open a new terminal (Command Prompt or Run dialog).
   - Type:  
     ```
     pwsh
     ```
   - Check the version:  
     ```powershell
     $PSVersionTable.PSVersion
     ```

---

## Using PowerShell 7 in VS Code

1. **Set PowerShell 7 as Default Terminal**
   - Open VS Code.
   - Open the Command Palette (`Ctrl+Shift+P`), type:  
     ```
     Terminal: Select Default Profile
     ```
   - Choose `PowerShell 7` or `pwsh` if available.

2. **If Not Listed, Add Manually**
   - Open settings (`File` → `Preferences` → `Settings`).
   - Click the `{}` icon (Open Settings JSON).
   - Add or update:
     ```json
     "terminal.integrated.profiles.windows": {
       "PowerShell 7": {
         "path": "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
         "icon": "terminal-powershell"
       }
     },
     "terminal.integrated.defaultProfile.windows": "PowerShell 7"
     ```
   - Save and restart VS Code.

---

## Using PowerShell 7 in Batch Files

- In your `.bat` file, call PowerShell 7 explicitly:
  ```bat
  "C:\Program Files\PowerShell\7\pwsh.exe" -NoProfile -ExecutionPolicy Bypass -File "your-script.ps1"
  ```

---

## Using PowerShell 7 in Windows Scheduled Tasks

1. **Create a New Task**
   - Open Task Scheduler.
   - Create a new task.

2. **Set the Program/Script**
   - Program/script:  
     ```
     C:\Program Files\PowerShell\7\pwsh.exe
     ```

3. **Set the Arguments**
   - Add arguments (replace with your script path):  
     ```
     -NoProfile -ExecutionPolicy Bypass -File "C:\Path\To\YourScript.ps1"
     ```

4. **Finish and Save**

---

## Notes

- PowerShell 7 (`pwsh.exe`) and Windows PowerShell 5.1 (`powershell.exe`) can coexist.
- Always use `pwsh` for PowerShell 7 in scripts, tasks, and VS Code for consistency.
- You can check your current version in any terminal with:
  ```powershell
  $PSVersionTable.PSVersion
  ```
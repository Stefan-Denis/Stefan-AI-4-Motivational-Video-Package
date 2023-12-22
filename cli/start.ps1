# Check if the app is running from server
if ($args -contains '--nonIntegratedTerminal') {
    # Run the app in a new powershell window when started from the app GUI
    Start-Process powershell -ArgumentList '-NoExit', '-Command "& node ..\out\main\main.js"; Pause; exit' -Wait
}

# Check if the app is running in VSCode or not
elseif ($env:TERM_PROGRAM -eq 'vscode') {
    # Clear the Terminal
    Clear-Host

    # Run the app
    & node ..\out\main\main.js
    Read-Host 'Press Enter to continue...'

    # Cleanup the Terminal and exit the app
    Clear-Host
    exit
}

# Check if the app is being ran by terminal
else {
    # Clear the Terminal
    Clear-Host

    # Run the app
    & node ..\out\main\main.js
    Read-Host 'Press Enter to continue...'

    # Cleanup the Terminal and exit the app
    Clear-Host
    exit
}
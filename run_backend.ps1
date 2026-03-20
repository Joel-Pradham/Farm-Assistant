$pythonPath = "C:\Users\User\AppData\Local\Programs\Python\Python311\python.exe"

if (Test-Path $pythonPath) {
    Write-Host "Starting Terra Intelligence Backend..." -ForegroundColor Cyan
    
    # Temporarily add Python and its Scripts folder to the PATH for this session
    $env:Path = "C:\Users\User\AppData\Local\Programs\Python\Python311;C:\Users\User\AppData\Local\Programs\Python\Python311\Scripts;" + $env:Path
    
    # Run uvicorn from root so the `api` module is found
    & $pythonPath -m uvicorn api.main:app --port 8000 --reload
} else {
    Write-Host "Python not found at $pythonPath. Please restart your terminal or reinstall Python." -ForegroundColor Red
}

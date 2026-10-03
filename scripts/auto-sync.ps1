# VIONEX Real-Time Git Repository Synchronization Daemon (PowerShell)
$RepoPath = Split-Path -Parent $PSScriptRoot
Set-Location $RepoPath

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  VIONEX Real-Time Git Repository Synchronization Daemon" -ForegroundColor Cyan
Write-Host "  Watching: $RepoPath" -ForegroundColor DarkGray
Write-Host "  Remote:   https://github.com/SIVABALAJISleo/VIONEX (main)" -ForegroundColor DarkGray
Write-Host "======================================================" -ForegroundColor Cyan

function Sync-GitRepo {
    $status = git status --porcelain
    if (-not $status) {
        Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Working tree clean. No changes to push." -ForegroundColor DarkGray
        return
    }

    Write-Host "`n======================================================" -ForegroundColor Yellow
    Write-Host "[Auto-Sync] Detected file changes:" -ForegroundColor Yellow
    $status | ForEach-Object { Write-Host "  • $_" -ForegroundColor DarkYellow }

    Write-Host "[Auto-Sync] Staging changes..." -ForegroundColor White
    git add -A

    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $commitMsg = "auto-sync: update codebase [$timestamp]"
    Write-Host "[Auto-Sync] Committing: '$commitMsg'..." -ForegroundColor White
    git commit -m $commitMsg

    Write-Host "[Auto-Sync] Pushing to origin main..." -ForegroundColor White
    git push origin main

    Write-Host "[Auto-Sync] Successfully synchronized with GitHub!" -ForegroundColor Green
    Write-Host "======================================================`n" -ForegroundColor Yellow
}

# Initial synchronization check
Sync-GitRepo

Write-Host "[Auto-Sync] Watcher is actively monitoring for file modifications (15s debounce)..." -ForegroundColor Green

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $RepoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$script:pendingChange = $false
$script:lastChangeTime = [DateTime]::MinValue

$action = {
    param($source, $e)
    $path = $e.FullPath
    if ($path -match '\\.git\\' -or $path -match '\\.next\\' -or $path -match '\\node_modules\\') {
        return
    }
    $script:pendingChange = $true
    $script:lastChangeTime = [DateTime]::Now
}

Register-ObjectEvent $watcher 'Changed' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Created' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Deleted' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Renamed' -Action $action | Out-Null

try {
    while ($true) {
        Start-Sleep -Seconds 2
        if ($script:pendingChange -and (([DateTime]::Now - $script:lastChangeTime).TotalSeconds -ge 15)) {
            $script:pendingChange = $false
            Sync-GitRepo
        }
    }
} finally {
    $watcher.Dispose()
}

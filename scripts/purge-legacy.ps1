# Removes the old app builder's files and reports leftover references.
# Dry run by default. Run from the project root:
#   powershell -ExecutionPolicy Bypass -File scripts\purge-legacy.ps1          (shows what would happen)
#   powershell -ExecutionPolicy Bypass -File scripts\purge-legacy.ps1 -Apply   (actually deletes)
# Make a backup zip of the folder before using -Apply.

param([switch]$Apply)

$remove = @(
    ".lovable",
    "bunfig.toml",
    "bun.lock",
    "bun.lockb",
    "drizzle",
    "drizzle.config.ts",
    "roadmap.md",
    "supabase\config.toml",
    "src\integrations\lovable",
    "src\lib\lovable-error-reporting.ts",
    "src\integrations\supabase\previewAuthStorage.ts"
)

if ($Apply) {
    Write-Host "Deleting legacy files..." -ForegroundColor Cyan
} else {
    Write-Host "DRY RUN. Nothing will be deleted. Use -Apply to delete." -ForegroundColor Yellow
}

foreach ($path in $remove) {
    if (Test-Path $path) {
        if ($Apply) {
            Remove-Item $path -Recurse -Force
            Write-Host "Deleted   $path" -ForegroundColor Green
        } else {
            Write-Host "Would delete   $path" -ForegroundColor Yellow
        }
    }
}

# .env is listed separately so you notice it
if (Test-Path ".env") {
    Write-Host "`n.env exists. It holds keys for the old backend. Delete it and create a new one from .env.example." -ForegroundColor Red
}

Write-Host "`nScanning for leftover references..." -ForegroundColor Cyan

$words = @("lovable", "gptengineer", "flowmind", "tanstack_start_ts", "r2.dev")
$skip = 'node_modules|\\\.git\\|\\legacy\\|\\dist\\|\\docs\\|\\scripts\\|package-lock\.json'

$hits = Get-ChildItem -Recurse -File -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch $skip } |
    Select-String -Pattern $words -SimpleMatch -ErrorAction SilentlyContinue

if ($hits) {
    $hits | ForEach-Object { Write-Host ("{0}:{1}  {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()) }
    Write-Host "`nFound $($hits.Count) leftover reference(s). Remove them before finishing." -ForegroundColor Red
} else {
    Write-Host "No leftover references found." -ForegroundColor Green
}

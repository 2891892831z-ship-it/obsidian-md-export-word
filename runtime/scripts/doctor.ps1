[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"
$runtimeRoot = Split-Path -Parent $PSScriptRoot
$failures = [System.Collections.Generic.List[string]]::new()

function Test-RequiredFile {
    param([string]$RelativePath, [string]$Label)
    $target = Join-Path $runtimeRoot $RelativePath
    if (Test-Path -LiteralPath $target) {
        Write-Output "[OK] $Label"
        return
    }
    $failures.Add("${Label}: $target")
    Write-Output "[FAIL] $Label"
}

Test-RequiredFile "runtime-manifest.json" "Runtime manifest"
Test-RequiredFile "scripts\md_export_word_template.py" "Python exporter"
Test-RequiredFile "scripts\true_scripts.lua" "True-script Lua filter"
Test-RequiredFile "zotero.lua" "Zotero Lua filter"
Test-RequiredFile "Pandoc&pandoc-crossref\pandoc.exe" "Pandoc"
Test-RequiredFile "Pandoc&pandoc-crossref\pandoc-crossref.exe" "pandoc-crossref"
$templateDirectory = Join-Path $runtimeRoot "Word-Template"
$templates = @(
    Get-ChildItem -LiteralPath $templateDirectory -Filter "*.docx" -File -ErrorAction SilentlyContinue |
        Where-Object { -not $_.Name.StartsWith("~$") }
)
if ($templates.Count -gt 0) {
    Write-Output "[OK] Word templates ($($templates.Count))"
}
else {
    $failures.Add("No Word template was found")
    Write-Output "[FAIL] Word templates"
}

$manifestPath = Join-Path $runtimeRoot "runtime-manifest.json"
if (Test-Path -LiteralPath $manifestPath) {
    try {
        $manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
        foreach ($property in $manifest.files.PSObject.Properties) {
            $target = Join-Path $runtimeRoot $property.Name.Replace("/", "\")
            if (-not (Test-Path -LiteralPath $target)) {
                $failures.Add("Manifest file is missing: $($property.Name)")
                continue
            }
            $actual = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant()
            $expected = [string]$property.Value
            if ($actual -ne $expected.ToLowerInvariant()) {
                $failures.Add("SHA-256 mismatch: $($property.Name)")
            }
        }
        if ($manifest.files.PSObject.Properties.Count -gt 0) {
            Write-Output "[OK] Runtime SHA-256"
        }
    }
    catch {
        $failures.Add("Could not verify runtime manifest: $($_.Exception.Message)")
    }
}

$venvPython = Join-Path $runtimeRoot ".venv\Scripts\python.exe"
if (Test-Path -LiteralPath $venvPython) {
    & $venvPython -c "import sys,lxml; print('[OK] Python ' + sys.version.split()[0] + '; lxml ' + lxml.__version__)"
    if ($LASTEXITCODE -ne 0) {
        $failures.Add("Python virtual environment or lxml is unavailable")
    }
}
else {
    $failures.Add("Python virtual environment is not installed")
    Write-Output "[FAIL] Python virtual environment"
}

$pandoc = Join-Path $runtimeRoot "Pandoc&pandoc-crossref\pandoc.exe"
if (Test-Path -LiteralPath $pandoc) {
    & $pandoc --version | Select-Object -First 1
}
$crossref = Join-Path $runtimeRoot "Pandoc&pandoc-crossref\pandoc-crossref.exe"
if (Test-Path -LiteralPath $crossref) {
    & $crossref --version
}

if ($failures.Count -gt 0) {
    Write-Output ("Doctor failed: " + ($failures -join "; "))
    exit 2
}

Write-Output "Doctor passed: runtime files, Python, lxml, Pandoc, and pandoc-crossref are ready."
exit 0

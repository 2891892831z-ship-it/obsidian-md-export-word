[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$PandocExe,
    [Parameter(Mandatory = $true)]
    [string]$CrossrefExe,
    [string]$OutputDirectory
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path $repoRoot "dist"
}
$outputRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
$repoPrefix = $repoRoot.TrimEnd("\") + "\"
if (-not $outputRoot.StartsWith($repoPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw "The output directory must be inside the repository: $outputRoot"
}

$pandocPath = (Resolve-Path -LiteralPath $PandocExe).Path
$crossrefPath = (Resolve-Path -LiteralPath $CrossrefExe).Path
$stage = Join-Path $outputRoot "runtime-package"
$assetName = "md-export-word-runtime-windows-x64.zip"
$checksumName = "SHA256SUMS-windows-x64.txt"
$archive = Join-Path $outputRoot $assetName

New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
if (Test-Path -LiteralPath $stage) {
    Remove-Item -LiteralPath $stage -Recurse -Force
}
if (Test-Path -LiteralPath $archive) {
    Remove-Item -LiteralPath $archive -Force
}

New-Item -ItemType Directory -Path $stage -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $repoRoot "runtime") -Destination $stage -Recurse
$stageRuntime = Join-Path $stage "runtime"
$binDir = Join-Path $stageRuntime "Pandoc&pandoc-crossref"
if (Test-Path -LiteralPath (Join-Path $stageRuntime ".venv")) {
    Remove-Item -LiteralPath (Join-Path $stageRuntime ".venv") -Recurse -Force
}
if (Test-Path -LiteralPath $binDir) {
    Remove-Item -LiteralPath $binDir -Recurse -Force
}
Get-ChildItem -LiteralPath $stageRuntime -Recurse -Directory -Filter "__pycache__" |
    Sort-Object FullName -Descending |
    Remove-Item -Recurse -Force
Get-ChildItem -LiteralPath $stageRuntime -Recurse -File -Filter "*.pyc" |
    Remove-Item -Force
New-Item -ItemType Directory -Path $binDir -Force | Out-Null
Copy-Item -LiteralPath $pandocPath -Destination (Join-Path $binDir "pandoc.exe")
Copy-Item -LiteralPath $crossrefPath -Destination (Join-Path $binDir "pandoc-crossref.exe")

$manifestPath = Join-Path $stageRuntime "runtime-manifest.json"
$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$manifest.platform = "windows-x64"
$hashes = [ordered]@{}
Get-ChildItem -LiteralPath $stageRuntime -Recurse -File |
    Where-Object { $_.FullName -ne $manifestPath -and $_.FullName -notlike "*\.venv\*" } |
    Sort-Object FullName |
    ForEach-Object {
        $relative = $_.FullName.Substring($stageRuntime.Length + 1).Replace("\", "/")
        $hashes[$relative] = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    }
$manifest.files = $hashes
$manifestJson = $manifest | ConvertTo-Json -Depth 8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($manifestPath, $manifestJson + [Environment]::NewLine, $utf8NoBom)

Compress-Archive -LiteralPath $stageRuntime -DestinationPath $archive -CompressionLevel Optimal
$archiveHash = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
"$archiveHash  $assetName" |
    Set-Content -LiteralPath (Join-Path $outputRoot $checksumName) -Encoding ASCII

Remove-Item -LiteralPath $stage -Recurse -Force
Write-Output "Runtime package: $archive"
Write-Output "SHA256: $archiveHash"

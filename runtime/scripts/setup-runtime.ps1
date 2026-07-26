[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$runtimeRoot = Split-Path -Parent $PSScriptRoot
$venvPython = Join-Path $runtimeRoot ".venv\Scripts\python.exe"
$requirements = Join-Path $runtimeRoot "requirements.txt"

function Resolve-Python {
    $pyLauncher = Get-Command "py.exe" -ErrorAction SilentlyContinue
    if ($pyLauncher) {
        & $pyLauncher.Source -3 -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)"
        if ($LASTEXITCODE -eq 0) {
            return [PSCustomObject]@{
                Executable = $pyLauncher.Source
                Arguments = @("-3")
            }
        }
    }

    $python = Get-Command "python.exe" -ErrorAction SilentlyContinue
    if ($python) {
        & $python.Source -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)"
        if ($LASTEXITCODE -eq 0) {
            return [PSCustomObject]@{
                Executable = $python.Source
                Arguments = @()
            }
        }
    }

    throw "Python 3.10 or newer was not found. Install 64-bit Python from https://www.python.org/downloads/windows/."
}

if (-not (Test-Path -LiteralPath $requirements)) {
    throw "Missing requirements file: $requirements"
}

if (-not (Test-Path -LiteralPath $venvPython)) {
    $pythonCommand = Resolve-Python
    $pythonExe = $pythonCommand.Executable
    $pythonArgs = @($pythonCommand.Arguments)
    & $pythonExe @pythonArgs -m venv (Join-Path $runtimeRoot ".venv")
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create the Python virtual environment."
    }
}

& $venvPython -m pip install --disable-pip-version-check --upgrade pip
if ($LASTEXITCODE -ne 0) {
    throw "Failed to upgrade pip."
}

& $venvPython -m pip install --disable-pip-version-check --requirement $requirements
if ($LASTEXITCODE -ne 0) {
    throw "Failed to install Python dependencies."
}

& $venvPython -c "import lxml; print('Python runtime ready; lxml=' + lxml.__version__)"
if ($LASTEXITCODE -ne 0) {
    throw "The lxml import test failed."
}

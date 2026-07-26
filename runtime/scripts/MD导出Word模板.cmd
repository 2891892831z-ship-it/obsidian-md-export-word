@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 >nul
set "PYTHONUTF8=1"
set "PYTHONDONTWRITEBYTECODE=1"
set "PYTHON_ARGS="
if /i "%MD_EXPORT_WORD_NONINTERACTIVE%"=="1" set "PYTHON_ARGS=--yes"
if /i "%MD_EXPORT_WORD_NONINTERACTIVE%"=="1" if /i not "%MD_EXPORT_WORD_AUTO_OPEN%"=="1" set "PYTHON_ARGS=%PYTHON_ARGS% --no-open"
if defined MD_EXPORT_WORD_MODE set "PYTHON_ARGS=%PYTHON_ARGS% --mode %MD_EXPORT_WORD_MODE%"

set "EXPORT_SCRIPT=%~dp0md_export_word_template.py"
set "INPUT_MD=%~1"

if not exist "%EXPORT_SCRIPT%" (
    echo [错误] 未找到导出程序：
    echo %EXPORT_SCRIPT%
    pause
    exit /b 2
)

if not defined INPUT_MD (
    for /f "usebackq delims=" %%I in (`powershell.exe -NoProfile -STA -Command "Add-Type -AssemblyName System.Windows.Forms; $dlg = New-Object System.Windows.Forms.OpenFileDialog; $dlg.Title = '选择要导出的 Markdown 文件'; $dlg.Filter = 'Markdown 文件 (*.md)^|*.md'; $dlg.Multiselect = $false; if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Write($dlg.FileName) }"`) do set "INPUT_MD=%%I"
)

if not defined INPUT_MD (
    echo 未选择 Markdown 文件，操作已取消。
    timeout /t 2 >nul
    exit /b 0
)

if /i not "%~x1"==".md" if not "%~1"=="" (
    echo [错误] 请拖入 .md 文件，而不是 Word 或其他文件。
    pause
    exit /b 2
)

set "RUNTIME_ROOT=%~dp0.."
set "VENV_PYTHON=%RUNTIME_ROOT%\.venv\Scripts\python.exe"

if exist "%VENV_PYTHON%" (
    "%VENV_PYTHON%" -B "%EXPORT_SCRIPT%" "%INPUT_MD%" %PYTHON_ARGS%
) else (
    where py.exe >nul 2>&1
    if not errorlevel 1 (
        py.exe -3 -B "%EXPORT_SCRIPT%" "%INPUT_MD%" %PYTHON_ARGS%
    ) else (
        where python.exe >nul 2>&1
        if errorlevel 1 (
            echo [错误] 未找到可用的 Python。
            echo 请在 Obsidian 命令面板运行：
            echo MD Export Word: Install or repair Word export runtime
            pause
            exit /b 2
        )
        python.exe -B "%EXPORT_SCRIPT%" "%INPUT_MD%" %PYTHON_ARGS%
    )
)

set "EXPORT_RC=%ERRORLEVEL%"
if not "%EXPORT_RC%"=="0" (
    echo.
    echo 导出未完成，错误代码：%EXPORT_RC%
    echo 请按上面的提示修正 Markdown、图片或 Zotero 后重试。
) else (
    echo.
    echo 程序已结束，请以上方结果为准。
)
if /i "%MD_EXPORT_WORD_NONINTERACTIVE%"=="1" exit /b %EXPORT_RC%
pause
exit /b %EXPORT_RC%

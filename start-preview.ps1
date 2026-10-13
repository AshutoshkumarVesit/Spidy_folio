$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
if (Get-Command node -ErrorAction SilentlyContinue) {
    & node (Join-Path $PSScriptRoot 'server.mjs')
} elseif (Test-Path -LiteralPath $bundledNode) {
    & $bundledNode (Join-Path $PSScriptRoot 'server.mjs')
} else {
    throw 'Node.js 22 or newer is needed for the portfolio and Spidy backend.'
}

$ErrorActionPreference = "Stop"
$indexPath = ".\index.html"
$kalkPath = ".\kalk-ncix.html"

Write-Host "Reading files..."
$indexContent = Get-Content -Path $indexPath -Raw -Encoding UTF8
$kalkContent = Get-Content -Path $kalkPath -Raw -Encoding UTF8

function Get-FontString {
    param ($content, $varName)
    # Regex to match: const VARNAME = "value";
    # We use [^"]* to capture the content inside quotes
    $pattern = "const $varName = ""([^""]*)"";"
    if ($content -match $pattern) {
        return $matches[0] # Returns the full definition line
    }
    throw "Variable $varName not found in index.html"
}

try {
    $fullBook = Get-FontString $indexContent "GOTHAM_BOOK_B64"
    $fullBold = Get-FontString $indexContent "GOTHAM_BOLD_B64"
    $fullMedium = Get-FontString $indexContent "GOTHAM_MEDIUM_B64"

    Write-Host "Found fonts. Replacing in kalk-ncix.html..."

    # Perform replacements
    # We use Regex.Replace method explicitly to avoid PowerShell -replace operator nuances with special chars in replacement if any
    
    $kalkContent = [System.Text.RegularExpressions.Regex]::Replace($kalkContent, 'const GOTHAM_BOOK_B64 = ".*?";', $fullBook)
    $kalkContent = [System.Text.RegularExpressions.Regex]::Replace($kalkContent, 'const GOTHAM_BOLD_B64 = ".*?";', $fullBold)
    $kalkContent = [System.Text.RegularExpressions.Regex]::Replace($kalkContent, 'const GOTHAM_MEDIUM_B64 = ".*?";', $fullMedium)

    Set-Content -Path $kalkPath -Value $kalkContent -Encoding UTF8
    Write-Host "Successfully updated fonts in kalk-ncix.html"
} catch {
    Write-Error $_
    exit 1
}

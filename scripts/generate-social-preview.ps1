$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$assetPath = Join-Path $PSScriptRoot '..\public\social-preview.png'
$bitmap = New-Object System.Drawing.Bitmap 1200, 630
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function Draw-Label([string]$Text, [float]$X, [float]$Y, [float]$Size, [string]$Color, [bool]$Bold = $false) {
    $weight = if ($Bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
    $font = [System.Drawing.Font]::new('Segoe UI', $Size, $weight, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($Color))
    $graphics.DrawString($Text, $font, $brush, $X, $Y)
    $font.Dispose()
    $brush.Dispose()
}

try {
    $rect = [System.Drawing.Rectangle]::new(0, 0, 1200, 630)
    $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, [System.Drawing.ColorTranslator]::FromHtml('#110e0c'), [System.Drawing.ColorTranslator]::FromHtml('#372219'), 25)
    $graphics.FillRectangle($background, $rect)
    $background.Dispose()

    $gridPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(10, 240, 169, 124), 1)
    for ($x = 0; $x -lt 1200; $x += 60) { $graphics.DrawLine($gridPen, $x, 0, $x, 630) }
    for ($y = 0; $y -lt 630; $y += 60) { $graphics.DrawLine($gridPen, 0, $y, 1200, $y) }
    $gridPen.Dispose()

    $accent = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#f0a97c'))
    $graphics.FillRectangle($accent, 0, 0, 1200, 6)
    $logo = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $logo.AddArc(960, 70, 56, 56, 180, 90)
    $logo.AddArc(1074, 70, 56, 56, 270, 90)
    $logo.AddArc(1074, 184, 56, 56, 0, 90)
    $logo.AddArc(960, 184, 56, 56, 90, 90)
    $logo.CloseFigure()
    $graphics.FillPath($accent, $logo)
    $logo.Dispose()
    $accent.Dispose()

    Draw-Label 'b.' 993 75 108 '#110e0c' $true
    Draw-Label 'ROBLOX DEVELOPMENT / PORTFOLIO' 72 64 19 '#f0a97c'
    Draw-Label 'BeeMoO' 66 119 108 '#f4ece6' $true
    Draw-Label 'Roblox developer / generalist' 73 259 36 '#f0a97c'
    Draw-Label 'Gameplay, UI & connected game systems.' 75 320 26 '#c2b3a8'

    $rule = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(45, 240, 169, 124), 1)
    $graphics.DrawLine($rule, 76, 412, 1124, 412)
    $graphics.DrawLine($rule, 405, 445, 405, 523)
    $graphics.DrawLine($rule, 785, 445, 785, 523)
    $rule.Dispose()

    Draw-Label '6+ years' 73 444 34 '#f4ece6' $true
    Draw-Label 'building in Roblox' 76 492 20 '#b7aaa0'
    Draw-Label '19.9M+ visits' 453 444 34 '#f4ece6' $true
    Draw-Label 'across featured games' 456 492 20 '#b7aaa0'
    Draw-Label '4+ releases' 834 444 34 '#f4ece6' $true
    Draw-Label 'teams / studios / solo' 837 492 20 '#b7aaa0'
    Draw-Label 'ahmedamer29.github.io/beemoo-roblox-portfolio' 76 574 19 '#b7aaa0'

    $bitmap.Save($assetPath, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Fetch a public-domain / CC0 photo set for the Lost Draw Outfitters concept.
# Strictly filters to PD/CC0 licenses (no attribution obligation). Downloads
# ~1600px JPGs into public/outfitter/ and writes CREDITS.txt with sources.
# Re-runnable: pass -Force to overwrite existing files.
param([switch]$Force)

$ua  = "BosqueWorksConceptBot/1.0 (cody@bosqueworks.com)"
$out = "C:\Users\cbogl\Projects\portfolio\public\outfitter"
New-Item -ItemType Directory -Force -Path $out | Out-Null

# Each target: output name + ordered list of search queries (first that yields a
# PD/CC0 landscape-ish JPG wins). Multiple queries give graceful fallback.
$targets = @(
  @{ name = "hero-country"; queries = @("Texas Hill Country landscape Highsmith", "Texas ranch land Highsmith", "Texas prairie landscape") },
  @{ name = "whitetail";    queries = @("White-tailed deer buck", "Odocoileus virginianus buck", "white-tailed deer male") },
  @{ name = "exotics";      queries = @("Aoudad Barbary sheep", "Ammotragus lervia", "Axis deer chital") },
  @{ name = "waterfowl";    queries = @("Mallard ducks flying", "ducks in flight wetland", "mallard drake water") },
  @{ name = "heritage";     queries = @("Texas ranch windmill Highsmith", "Texas ranch gate Highsmith", "Texas barn ranch Highsmith") }
)

$credits = @("Lost Draw Outfitters (concept) — photo sources", "Auto-selected from Wikimedia Commons, filtered to Public Domain / CC0.", "")

function Get-Candidate($query) {
  $u = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$([uri]::EscapeDataString($query))&gsrnamespace=6&gsrlimit=25&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1600&format=json"
  try { $resp = Invoke-RestMethod -Uri $u -Headers @{ "User-Agent" = $ua } -TimeoutSec 30 } catch { return $null }
  if (-not $resp.query.pages) { return $null }
  foreach ($p in $resp.query.pages.PSObject.Properties.Value | Sort-Object index) {
    $ii = $p.imageinfo[0]
    if (-not $ii) { continue }
    if ($p.title.ToLower() -notmatch '\.(jpg|jpeg)$') { continue }
    $lic = "$($ii.extmetadata.LicenseShortName.value)"
    if ($lic -notmatch 'Public domain|CC0|PD-') { continue }
    if ([int]$ii.thumbwidth -lt 1000) { continue }
    $artist = "$($ii.extmetadata.Artist.value)" -replace '<[^>]+>', '' -replace '\s+', ' '
    return @{ title = $p.title; lic = $lic; url = $ii.thumburl; desc = $ii.descriptionurl; artist = $artist.Trim() }
  }
  return $null
}

foreach ($t in $targets) {
  $dest = Join-Path $out "$($t.name).jpg"
  if ((Test-Path $dest) -and -not $Force) { Write-Host "SKIP $($t.name) (exists)"; continue }
  $pick = $null
  foreach ($q in $t.queries) { $pick = Get-Candidate $q; if ($pick) { break } }
  if ($pick) {
    try {
      Invoke-WebRequest -Uri $pick.url -Headers @{ "User-Agent" = $ua } -OutFile $dest -TimeoutSec 90
      $sizeKB = [math]::Round((Get-Item $dest).Length / 1KB)
      Write-Host "OK   $($t.name).jpg  [$($pick.lic)]  ${sizeKB}KB  <= $($pick.title)"
      $credits += "$($t.name).jpg"
      $credits += "  source : $($pick.desc)"
      $credits += "  license: $($pick.lic)"
      if ($pick.artist) { $credits += "  author : $($pick.artist)" }
      $credits += ""
    } catch { Write-Host "FAIL $($t.name): download error — $($_.Exception.Message)" }
  } else {
    Write-Host "MISS $($t.name): no PD/CC0 JPG found across queries"
  }
}

$credits | Out-File -FilePath (Join-Path $out "CREDITS.txt") -Encoding utf8
Write-Host "`nDone. Files in $out"

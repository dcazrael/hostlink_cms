#!/usr/bin/env bash
set -euo pipefail

URL="${1:-https://www.hostlink.jp/}"
RUNS="${2:-5}"
TS="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="lighthouse-reports/prod-home-${TS}"

if ! command -v lighthouse >/dev/null 2>&1; then
  echo "lighthouse CLI not found."
  echo "Install with: npm i -g lighthouse"
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "Running ${RUNS} mobile Lighthouse tests against ${URL}"
for i in $(seq 1 "$RUNS"); do
  echo "Run ${i}/${RUNS}..."
  lighthouse "$URL" \
    --quiet \
    --chrome-flags="--headless --incognito --disable-extensions --no-sandbox" \
    --form-factor=mobile \
    --throttling-method=simulate \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json \
    --output-path="${OUT_DIR}/run-${i}.json"
done

echo "Saved reports to ${OUT_DIR}"
echo "Computing medians..."

node - "$OUT_DIR" <<'NODE'
const fs = require('fs')
const path = require('path')

const dir = process.argv[2]
const files = fs
  .readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((name) => path.join(dir, name))

if (files.length === 0) {
  console.error('No Lighthouse JSON files found.')
  process.exit(1)
}

const readMetric = (report, id) => {
  const audit = report.audits?.[id]
  return typeof audit?.numericValue === 'number' ? audit.numericValue : NaN
}

const toSeconds = (ms) => Number((ms / 1000).toFixed(2))
const toMillis = (ms) => Number(ms.toFixed(0))

const rows = files.map((file) => {
  const report = JSON.parse(fs.readFileSync(file, 'utf8'))
  return {
    file: path.basename(file),
    perf: report.categories?.performance?.score ?? NaN,
    lcp: readMetric(report, 'largest-contentful-paint'),
    fcp: readMetric(report, 'first-contentful-paint'),
    si: readMetric(report, 'speed-index'),
    tbt: readMetric(report, 'total-blocking-time'),
    cls: readMetric(report, 'cumulative-layout-shift'),
  }
})

const median = (values) => {
  const valid = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b)
  if (valid.length === 0) return NaN
  const mid = Math.floor(valid.length / 2)
  if (valid.length % 2 === 0) return (valid[mid - 1] + valid[mid]) / 2
  return valid[mid]
}

const medians = {
  perf: median(rows.map((r) => r.perf)),
  lcp: median(rows.map((r) => r.lcp)),
  fcp: median(rows.map((r) => r.fcp)),
  si: median(rows.map((r) => r.si)),
  tbt: median(rows.map((r) => r.tbt)),
  cls: median(rows.map((r) => r.cls)),
}

console.log('\nPer-run metrics:')
for (const row of rows) {
  console.log(
    [
      row.file,
      `perf=${Number.isFinite(row.perf) ? Math.round(row.perf * 100) : 'n/a'}`,
      `LCP=${Number.isFinite(row.lcp) ? toSeconds(row.lcp) + 's' : 'n/a'}`,
      `FCP=${Number.isFinite(row.fcp) ? toSeconds(row.fcp) + 's' : 'n/a'}`,
      `SI=${Number.isFinite(row.si) ? toSeconds(row.si) + 's' : 'n/a'}`,
      `TBT=${Number.isFinite(row.tbt) ? toMillis(row.tbt) + 'ms' : 'n/a'}`,
      `CLS=${Number.isFinite(row.cls) ? row.cls.toFixed(3) : 'n/a'}`,
    ].join(' | '),
  )
}

console.log('\nMedian metrics:')
console.log(`Performance: ${Math.round(medians.perf * 100)}`)
console.log(`LCP: ${toSeconds(medians.lcp)}s`)
console.log(`FCP: ${toSeconds(medians.fcp)}s`)
console.log(`Speed Index: ${toSeconds(medians.si)}s`)
console.log(`TBT: ${toMillis(medians.tbt)}ms`)
console.log(`CLS: ${medians.cls.toFixed(3)}`)
NODE

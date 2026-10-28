// Rows of objects as CSV: a header of every key seen, each cell quoted, missing values left empty.
export const toCsv = rows => {
  const headers = [...new Set(rows.flatMap(row => Object.keys(row)))]
  const cell = value => `"${String(value ?? '').replace(/"/g, '""')}"`
  return [headers, ...rows.map(row => headers.map(key => row[key]))]
    .map(line => line.map(cell).join(','))
    .join('\n')
}

// Downloads the rows as a CSV file; the BOM lets Excel read non-ASCII text as UTF-8.
export const downloadCsv = (rows, filename) => {
  const url = URL.createObjectURL(new Blob(['﻿', toCsv(rows)], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

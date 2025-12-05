// PDF Export utilities using browser print API

export const exportToPDF = (elementId?: string) => {
  // Add print-specific styles
  const style = document.createElement('style')
  style.textContent = `
    @media print {
      @page {
        size: A4;
        margin: 1cm;
      }
      
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      /* Hide navigation and non-printable elements */
      nav, header, footer, .no-print {
        display: none !important;
      }
      
      /* Ensure content fits */
      .print-container {
        width: 100%;
        max-width: none;
      }
      
      /* Page breaks */
      .page-break {
        page-break-after: always;
      }
      
      .avoid-break {
        page-break-inside: avoid;
      }
    }
  `
  document.head.appendChild(style)

  // Trigger print
  window.print()

  // Remove the style after printing
  setTimeout(() => {
    document.head.removeChild(style)
  }, 1000)
}

export const downloadAsCSV = (data: any[], filename: string) => {
  // Convert data to CSV
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

export const printElement = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (!element) return

  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) return

  printWindow.document.write('<html><head><title>Print</title>')
  printWindow.document.write('<style>')
  printWindow.document.write(`
    body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
  `)
  printWindow.document.write('</style></head><body>')
  printWindow.document.write(element.innerHTML)
  printWindow.document.write('</body></html>')
  printWindow.document.close()
  
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}


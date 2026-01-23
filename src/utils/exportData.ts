// CSV Export utility
export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header.toLowerCase().replace(/ /g, '_')] || row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// PDF Export utility (simple HTML-based PDF)
export const exportToPDF = (content: string, filename: string, title: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          color: #1a1a1a;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 10px;
        }
        h2 {
          color: #333;
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .date {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin: 20px 0;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .metric {
          display: inline-block;
          margin: 10px 20px 10px 0;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #0066cc;
        }
        .metric-label {
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { padding: 20px; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <span class="date">Generated: ${new Date().toLocaleDateString()}</span>
      </div>
      ${content}
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

// Export health records
export const exportHealthRecords = (records: any[]) => {
  const headers = ['Name', 'Type', 'Date', 'Doctor', 'Hospital', 'Notes'];
  const data = records.map(r => ({
    name: r.name,
    type: r.type,
    date: r.date,
    doctor: r.doctor || '-',
    hospital: r.hospital || '-',
    notes: r.notes || '-'
  }));
  
  exportToCSV(data, `health-records-${new Date().toISOString().split('T')[0]}`, headers);
};

// Export vitals data
export const exportVitals = (vitals: any[], type: 'csv' | 'pdf' = 'csv') => {
  if (type === 'csv') {
    const headers = ['Type', 'Value', 'Date', 'Time', 'Notes'];
    const data = vitals.map(v => ({
      type: v.type,
      value: v.value2 ? `${v.value}/${v.value2}` : v.value,
      date: v.date,
      time: v.time,
      notes: v.notes || '-'
    }));
    
    exportToCSV(data, `vitals-${new Date().toISOString().split('T')[0]}`, headers);
  } else {
    const tableRows = vitals.map(v => `
      <tr>
        <td>${v.type}</td>
        <td>${v.value2 ? `${v.value}/${v.value2}` : v.value}</td>
        <td>${v.date}</td>
        <td>${v.time}</td>
        <td>${v.notes || '-'}</td>
      </tr>
    `).join('');

    const content = `
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Value</th>
            <th>Date</th>
            <th>Time</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    exportToPDF(content, `vitals-${new Date().toISOString().split('T')[0]}`, 'Health Vitals Report');
  }
};

// Export weekly/monthly health report
export const exportHealthReport = (
  vitals: any[],
  reminders: any[],
  period: 'weekly' | 'monthly'
) => {
  const now = new Date();
  const periodStart = new Date();
  periodStart.setDate(now.getDate() - (period === 'weekly' ? 7 : 30));

  const filteredVitals = vitals.filter(v => new Date(v.date) >= periodStart);
  
  // Calculate averages
  const vitalsByType: Record<string, number[]> = {};
  filteredVitals.forEach(v => {
    if (!vitalsByType[v.type]) vitalsByType[v.type] = [];
    vitalsByType[v.type].push(v.value);
  });

  const averages = Object.entries(vitalsByType).map(([type, values]) => ({
    type,
    average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
    count: values.length
  }));

  // Calculate medication adherence
  let totalDoses = 0;
  let takenDoses = 0;
  reminders.forEach(r => {
    if (r.active) {
      const days = period === 'weekly' ? 7 : 30;
      totalDoses += r.times.length * days;
      takenDoses += r.takenToday?.length || 0;
    }
  });
  const adherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  const content = `
    <div class="section">
      <h2>📊 Summary</h2>
      <div class="metric">
        <div class="metric-value">${filteredVitals.length}</div>
        <div class="metric-label">Vitals Recorded</div>
      </div>
      <div class="metric">
        <div class="metric-value">${adherence}%</div>
        <div class="metric-label">Medication Adherence</div>
      </div>
      <div class="metric">
        <div class="metric-value">${reminders.filter(r => r.active).length}</div>
        <div class="metric-label">Active Reminders</div>
      </div>
    </div>

    <h2>📈 Vital Averages</h2>
    <table>
      <thead>
        <tr>
          <th>Vital Type</th>
          <th>Average</th>
          <th>Readings</th>
        </tr>
      </thead>
      <tbody>
        ${averages.map(a => `
          <tr>
            <td>${a.type.replace('_', ' ').toUpperCase()}</td>
            <td>${a.average}</td>
            <td>${a.count}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>💊 Active Medications</h2>
    <table>
      <thead>
        <tr>
          <th>Medicine</th>
          <th>Dosage</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        ${reminders.filter(r => r.active).map(r => `
          <tr>
            <td>${r.medicineName}</td>
            <td>${r.dosage}</td>
            <td>${r.frequency}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const title = `${period === 'weekly' ? 'Weekly' : 'Monthly'} Health Report`;
  exportToPDF(content, `health-report-${period}-${now.toISOString().split('T')[0]}`, title);
};

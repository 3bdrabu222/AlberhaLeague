const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const workbook = XLSX.readFile('Fantasy Alberha League.xlsx');

console.log('Sheet names:', workbook.SheetNames);

// Convert each sheet to JSON
const data = {};
workbook.SheetNames.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  data[sheetName] = jsonData;
  console.log(`\n${sheetName}:`, JSON.stringify(jsonData, null, 2));
});

// Save the raw data for inspection
fs.writeFileSync('excel-data-raw.json', JSON.stringify(data, null, 2));
console.log('\n✅ Data saved to excel-data-raw.json');

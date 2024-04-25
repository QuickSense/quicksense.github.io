<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CSV Data with Filtering</title>
    <style>
        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        th, td {
            padding: 5px;
            text-align: left;
        }
    </style>
</head>
<body>
    <label for="filterColumn">Filter by column:</label>
    <select id="filterColumn"></select>
    <label for="filterValue">Enter filter value:</label>
    <input type="text" id="filterValue">
    <button onclick="applyFilter()">Apply Filter</button>

    <table id="dataTable">
        <!-- CSV data will be inserted here as a table -->
    </table>

    <script>
        // Function to read and parse the CSV file
        function readAndParseCSV(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvData = e.target.result;
                const rows = csvData.split('\n').map(row => row.split(','));
                const header = rows[0];
                const data = rows.slice(1).map(row => {
                    const rowData = {};
                    row.forEach((field, i) => {
                        rowData[header[i]] = field;
                    });
                    return rowData;
                });
                // Store data in global variable for access in other functions
                window.csvData = data;
                // Generate filter options
                const filterSelect = document.getElementById('filterColumn');
                header.forEach((col, i) => {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = col;
                    filterSelect.appendChild(option);
                });
                // Display initial table
                displayTable(data);
            };
            reader.readAsText(file);
        }

        // Function to display the CSV data as an HTML table
        function displayTable(data) {
            const table = document.getElementById('dataTable');
            table.innerHTML = '';
            const headerRow = table.insertRow();
            header.forEach((col, i) => {
                const headerCell = document.createElement('th');
                headerCell.textContent = col;
                headerRow.appendChild(headerCell);
            });
            data.forEach(rowData => {
                const row = table.insertRow();
                header.forEach((col, i) => {
                    const cell = row.insertCell();
                    cell.textContent = rowData[col];
                });
            });
        }

        // Function to apply the filter to the CSV data
        function applyFilter() {
            const filterColumn = document.getElementById('filterColumn').value;
            const filterValue = document.getElementById('filterValue').value;
            const filteredData = window.csvData.filter(row => row[header[filterColumn]] === filterValue);
            displayTable(filteredData);
        }

        // Event listener for file input change
        document.getElementById('csvFileInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                readAndParseCSV(file);
            }
        });
    </script>
</body>
</html>

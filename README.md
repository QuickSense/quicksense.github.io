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
        // 假设你已经有了CSV文件的内容，这里用一个示例字符串代替
        const csvContent = `Year,City,University,Category,Major,Score1,Score2\n2023,Chongqing,East China Normal University,Physics,Computer Science and Technology,641,552\n...`;

        // 解析CSV内容为对象数组
        function parseCSV(csv) {
            const lines = csv.split('\n');
            const headers = lines[0].split(',');
            const rows = lines.slice(1).map(line => {
                const cells = line.split(',');
                const row = {};
                cells.forEach((cell, index) => {
                    row[headers[index]] = cell;
                });
                return row;
            });
            return rows;
        }

        // 动态生成筛选列的选项
        function generateFilterOptions(data) {
            const filterColumnSelect = document.getElementById('filterColumn');
            data[0] && Object.keys(data[0]).forEach((key, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = key;
                filterColumnSelect.appendChild(option);
            });
        }

        // 应用筛选
        function applyFilter() {
            const filterColumn = document.getElementById('filterColumn').value;
            const filterValue = document.getElementById('filterValue').value;
            const filteredData = data.filter(row => row[headers[filterColumn]] === filterValue);

            // 更新表格
            displayTable(filteredData);
        }

        // 显示表格
        function displayTable(data) {
            const table = document.getElementById('dataTable');
            table.innerHTML = ''; // 清除旧表格
            // 添加表头
            const headerRow = table.insertRow();
            header.forEach((headerName, index) => {
                const headerCell = document.createElement('th');
                headerCell.textContent = headerName;
                headerRow.appendChild(headerCell);
            });
            // 添加数据行
            data.forEach(rowData => {
                const row = table.insertRow();
                Object.values(rowData).forEach(value => {
                    const cell = row.insertCell();
                    cell.textContent = value;
                });
            });
        }

        // 初始化数据和筛选列选项
        const data = parseCSV(csvContent);
        const header = data.length ? Object.keys(data[0]) : [];
        generateFilterOptions(data);
        displayTable(data);
    </script>
</body>
</html>

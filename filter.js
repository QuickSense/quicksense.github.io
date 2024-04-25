<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CSV to Markdown with Filtering</title>
</head>
<body>
    <select id="filterColumn"></select>
    <input type="text" id="filterValue" placeholder="Enter filter value">
    <button onclick="applyFilter()">Apply Filter</button>
    <div id="markdownTable"><!-- Markdown table will be inserted here --></div>

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
            const uniqueValues = [...new Set(data.map(row => row[Object.keys(row)[0]]))];
            const filterColumnSelect = document.getElementById('filterColumn');
            uniqueValues.forEach(value => {
                const option = document.createElement('option');
                option.textContent = value;
                option.value = value;
                filterColumnSelect.appendChild(option);
            });
        }

        // 应用筛选
        function applyFilter() {
            const filterValue = document.getElementById('filterValue').value;
            const filteredData = data.filter(row => Object.values(row).join().includes(filterValue));
            updateMarkdownTable(filteredData);
        }

        // 更新Markdown表格
        function updateMarkdownTable(data) {
            let markdownTable = '<table><tr>';
            markdownTable += Object.keys(data[0]).map(key => `<th>${key}</th>`).join('');
            markdownTable += '</tr>';
            data.forEach(row => {
                markdownTable += `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`;
            });
            markdownTable += '</table>';
            document.getElementById('markdownTable').innerHTML = markdownTable;
        }

        // 初始化数据和筛选列选项
        const data = parseCSV(csvContent);
        generateFilterOptions(data);
    </script>
</body>
</html>

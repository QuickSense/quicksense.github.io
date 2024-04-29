<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CSV Data Table</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #eaeaea;
        }
        #filter-section {
            margin-bottom: 10px;
        }
        #comparison-box table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        #comparison-box th, #comparison-box td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        #comparison-box th {
            background-color: #f2f2f2;
        }
        .comparison-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #f5f5f5;
            padding: 5px;
            margin-bottom: 5px;
            border-radius: 3px;
        }
        .comparison-header button {
            margin-left: 10px;
        }
        .dark-mode {
            background-color: #121212;
            color: #f9981c;
        }
        .dark-mode table {
            border-color: #303030;
        }
        .dark-mode th {
            background-color: #1e1e1e;
        }
        .dark-mode tr:nth-child(even) {
            background-color: #1c1c1c;
        }
        .dark-mode tr:hover {
            background-color: #2a2a2a;
        }
        .dark-mode #search-input {
            background-color: #080808;
            color: #f9981c;
            border: 1px solid #0c0000;
        }
        .dark-mode #search-input:focus {
            background-color: #383838;
            color: #033335;
            border-color: #555555;
        }
    </style>
</head>
<body>
    <div id="filter-section">
        <input type="text" id="search-input" placeholder="输入关键词搜索...">
        <button id="search-btn">搜索</button>
        <input type="text" id="find-input" placeholder="输入关键词查找高亮...">
        <button id="find-btn">查找高亮</button>
        <button id="clear-highlight-btn">取消高亮</button>
        <button id="toggle-darkmode">切换深色模式</button>
    </div>
    
    <div id="comparison-box">
        <div class="comparison-header">
            <h3>对比框</h3>
            <button id="clear-comparison">清除所有对比项</button>
        </div>
        <table id="comparison-table">
            <thead>
                <tr>
                    <th>年度</th>
                    <th>省份</th>
                    <th>学校</th>
                    <th>录取批次</th>
                    <th>文/理（选科要求）</th>
                    <th>专业</th>
                    <th>录取最低分</th>
                    <th>省内排名</th>
                    <th>本科线（本一）</th>
                    <th>本二线</th>
                </tr>
            </thead>
            <tbody>
                <!-- 对比内容将通过JavaScript动态添加 -->
            </tbody>
        </table>
    </div>

    <h2>数据表</h2>
    <table id="data-table">
        <thead>
            <tr>
                <th>年度</th>
                <th>省份</th>
                <th>学校</th>
                <th>录取批次</th>
                <th>文/理（选科要求）</th>
                <th>专业</th>
                <th>录取最低分</th>
                <th>省内排名</th>
                <th>本科线（本一）</th>
                <th>本二线</th>
            </tr>
        </thead>
        <tbody>
            <!-- 数据行将通过JavaScript动态添加 -->
        </tbody>
    </table>

    <script>
        // 使用FileReader API读取CSV文件
        function readCSV(file, callback) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var rows = e.target.result.split(/\r\n|\n/);
                var parsedData = [];
                parsedData.push(rows[0].split(',')); // 头部
                for (var i = 1; i < rows.length; i++) {
                    if (rows[i]) {
                        parsedData.push(rows[i].split(','));
                    }
                }
                callback(parsedData);
            };
            reader.readAsText(file);
        }

        // 将数据行动态添加到表格中
        function populateTable(data) {
            var tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // 清空表格
            data.forEach(function(row) {
                var tr = document.createElement('tr');
                row.forEach(function(value, index) {
                    var td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                    // 不含操作按钮的列
                    if (index === row.length - 1) {
                        var btn = document.createElement('button');
                        btn.textContent = '添加到对比框';
                        btn.onclick = function() {
                            addToComparison(row);
                        };
                        td.appendChild(btn);
                    }
                });
                tableBody.appendChild(tr);
            });
        }


        // 更新 addToComparison 函数以创建表格行
        function addToComparison(row) {
            if (comparisonData.length >= 100) {
                alert('对比框中的项数已达到最大限制（20项）');
                return;
            }
            var comparisonTableBody = document.getElementById('comparison-table').getElementsByTagName('tbody')[0];
            var tr = document.createElement('tr');
            row.forEach(function(value) {
                var td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            // 删除按钮
            var deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.onclick = function() {
                removeFromComparison(tr);
            };
            var tdButton = document.createElement('td');
            tdButton.appendChild(deleteButton);
            tr.appendChild(tdButton);

            comparisonTableBody.appendChild(tr);
            comparisonData.push(row); // 将当前行数据添加到全局数组
        }

        // 删除特定对比项的函数
        function removeFromComparison(trElement) {
            var index = comparisonData.findIndex(function(row) {
                // 假设每一行数据都是唯一的，可以通过行数据查找
                return row.join('') === Array.from(trElement.getElementsByTagName('td')).slice(0, -1).map(td => td.textContent).join('');
            });
            if (index > -1) {
                comparisonData.splice(index, 1); // 从对比数据中移除
                trElement.remove(); // 从DOM中移除
            }
        }


        // 搜索表
        function searchTable() {
            var input, filter, table, tr, td, i, j, txtValue;
            input = document.getElementById("search-input");
            filter = input.value.toUpperCase();
            table = document.getElementById("data-table");
            tr = table.getElementsByTagName("tr");

            for (i = 1; i < tr.length; i++) { // 跳过表头
                tr[i].style.display = "none"; // 先全部隐藏
                td = tr[i].getElementsByTagName("td");
                for (j = 0; j < td.length; j++) {
                    if (td[j]) {
                        txtValue = td[j].textContent || td[j].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = ""; // 显示匹配的行
                        }
                    }
                }
            }
        }
        function sortTable(tableId, columnIndex, ascending = true) {
            var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
            table = document.getElementById(tableId);
            switching = true;
            // 设置排序方向
            dir = ascending ? "asc" : "desc";
            while (switching) {
                switching = false;
                rows = table.rows;
                for (i = 1; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    x = rows[i].getElementsByTagName("TD")[columnIndex];
                    y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
                    if (dir == "asc") {
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir == "desc") {
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
                if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchcount++;
                } else {
                    if (switchcount == 0 && !ascending) {
                        // 如果第一次没有排序成功，并且是降序，则自动变为升序
                        ascending = true;
                        switching = true;
                    }
                }
            }
        }

        // 绑定排序事件
        function bindSortEvent(tableId) {
            var ths = document.querySelectorAll(`#${tableId} th`);
            ths.forEach(th => {
                th.addEventListener('click', function() {
                    var columnIndex = Array.prototype.indexOf.call(ths, th);
                    sortTable(tableId, columnIndex);
                });
            });
        }

        // 查找高亮
        function findInTable() {
            var input, filter, table, tr, td, i, j, txtValue;
            input = document.getElementById("find-input");
            filter = input.value.toUpperCase();
            table = document.getElementById("data-table");
            tr = table.getElementsByTagName("tr");

            // 先移除之前的高亮
            for (i = 1; i < tr.length; i++) {
                tr[i].style.backgroundColor = "";
                tr[i].style.display = ""; // 确保所有行都是可见的
            }

            for (i = 1; i < tr.length; i++) { // 跳过表头
                td = tr[i].getElementsByTagName("td");
                for (j = 0; j < td.length; j++) {
                    if (td[j]) {
                        txtValue = td[j].textContent || td[j].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.backgroundColor = "yellow"; // 高亮显示
                            break;
                        }
                    }
                }
            }
        }

        // 取消高亮
        function clearHighlight() {
            var table = document.getElementById("data-table");
            var trs = table.getElementsByTagName("tr");
            for (var i = 1; i < trs.length; i++) { // 跳过表头
                trs[i].style.backgroundColor = "";
            }
        }

        // 切换深色模式
        function toggleDarkMode() {
            var body = document.body;
            body.classList.toggle('dark-mode');
        }
        var comparisonData = []; // 全局数组，存储对比框的数据
        // 页面加载时读取CSV文件并填充表格
        document.addEventListener('DOMContentLoaded', function() {
            readCSV('demo.csv', populateTable);
            document.getElementById('filter-section').appendChild(csvFileInput);

            // 绑定按钮事件
            document.getElementById('search-btn').addEventListener('click', searchTable);
            document.getElementById('find-btn').addEventListener('click', findInTable);
            document.getElementById('clear-highlight-btn').addEventListener('click', clearHighlight);
            document.getElementById('toggle-darkmode').addEventListener('click', toggleDarkMode);
            bindSortEvent('data-table');
            bindSortEvent('comparison-table');
        });
    </script>
</body>
</html>

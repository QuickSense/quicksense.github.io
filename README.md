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
        /* 默认的亮色主题样式保持不变 */

        /* 深色模式样式 */
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
        
        /* 深色模式下搜索框聚焦时的样式 */
        .dark-mode #search-input:focus {
            background-color: #383838;
            color: #033335;
            border-color: #555555;}
        /* 其他需要改变颜色的元素... */
    </style>
</head>
<body>
    <div id="filter-section">
        <input type="text" id="search-input" placeholder="输入关键词搜索...">
        <button onclick="searchTable()">搜索</button>
        <input type="text" id="find-input" placeholder="输入关键词查找高亮...">
        <button onclick="findInTable()">查找高亮</button>
        <button onclick="clearHighlight()">取消高亮</button>
        <div id="filter-section">
            <!-- ... 其他输入框和按钮 ... -->
            <button id="toggle-darkmode">切换深色模式</button>
        </div>
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
                    <!-- 其他列 -->
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
                <!-- 根据CSV数据添加其他列 -->
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
                // 解析CSV数据
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

        // 更新 populateTable 函数以包含操作按钮
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

        // 之前的JavaScript代码保持不变
        var comparisonData = []; // 全局数组，存储对比框的数据

        // 更新 addToComparison 函数以创建表格行
        function addToComparison(row) {
            if (comparisonData.length >= 20) {
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
        

        // 页面加载时读取CSV文件并填充表格
        document.addEventListener('DOMContentLoaded', function() {
            // 之前的页面加载事件代码保持不变
            // 监听搜索框输入
            var csvFileInput = document.createElement('input');
            document.getElementById('search-input').addEventListener('input', searchTable);

            // 清除所有对比项的按钮事件
            document.getElementById('clear-comparison').addEventListener('click', function() {
                var comparisonTableBody = document.getElementById('comparison-table').getElementsByTagName('tbody')[0];
                while (comparisonTableBody.firstChild) {
                    comparisonTableBody.removeChild(comparisonTableBody.firstChild);
                }
                comparisonData = []; // 清空全局数组
            });
        });
        // 页面加载时读取CSV文件并填充表格
        document.addEventListener('DOMContentLoaded', function() {
            var csvFileInput = document.createElement('input');
            csvFileInput.type = 'file';
            csvFileInput.accept = '.csv';
            csvFileInput.addEventListener('change', function(e) {
                var file = e.target.files[0];
                readCSV(file, populateTable);
            });
            

            // 监听搜索框输入
            document.getElementById('search-input').addEventListener('input', searchTable);
        });

        var ths = document.querySelectorAll('#data-table th');
        ths.forEach(function(th, index) {
            th.addEventListener('click', function() {
                sortTable(index, this.textContent);
            });
        });


        document.getElementById('search-input').addEventListener('input', searchTable);

        // 监听查找框按钮点击事件
        document.getElementById('find-input').addEventListener('click', findInTable);

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
                            break;
                        }
                    }
                }
            }
        }

        document.addEventListener('DOMContentLoaded', function() {

        
            document.getElementById('clear-comparison').addEventListener('click', clearComparison);
        });
        
        var ascending = true;
        
        function sortTable(columnIndex, columnText) {
            var table = document.getElementById("data-table");
            var rows = table.rows;
            var sortedRows = Array.from(rows).slice(1); // 去掉表头
            sortedRows.sort(function(a, b) {
                var x = a.cells[columnIndex].textContent.trim();
                var y = b.cells[columnIndex].textContent.trim();
                return ascending ? x.localeCompare(y) : y.localeCompare(x);
            });
        
            for (var i = 0; i < sortedRows.length; i++) {
                table.tBodies[0].appendChild(sortedRows[i]);
            }
            ascending = !ascending; // 切换排序方向
        }


        function findInTable() {
            var input, filter, table, tr, td, i, j, txtValue;
            input = document.getElementById("find-input");
            filter = input.value.toUpperCase();
            table = document.getElementById("data-table");
            tr = table.getElementsByTagName("tr");
        
            // 先移除之前的高亮
            for (i = 1; i < tr.length; i++) {
                tr[i].style.backgroundColor = "";
            }
        
            for (i = 1; i < tr.length; i++) { // 跳过表头
                tr[i].style.display = "none"; // 先全部隐藏
                td = tr[i].getElementsByTagName("td");
                for (j = 0; j < td.length; j++) {
                    if (td[j]) {
                        txtValue = td[j].textContent || td[j].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = ""; // 显示匹配的行
                            tr[i].style.backgroundColor = "yellow"; // 高亮显示
                            break;
                        }
                    }
                }
            }
        }

        function clearHighlight() {
            var table = document.getElementById("data-table");
            var trs = table.getElementsByTagName("tr");
            for (var i = 1; i < trs.length; i++) { // 跳过表头
                trs[i].style.backgroundColor = "";
            }
        }

        function handleFileSelect(event) {
            var file = event.target.files[0];
            readCSV(file, populateTable);
        }
        
        // 修改后的 readFixedCSV 函数
        function readFixedCSV(filename, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', filename, true);
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var rows = xhr.responseText.split(/\r\n|\n/);
                        var parsedData = [];
                        // 解析CSV数据
                        parsedData.push(rows[0].split(',')); // 头部
                        for (var i = 1; i < rows.length; i++) {
                            if (rows[i]) {
                                parsedData.push(rows[i].split(','));
                            }
                        }
                        callback(parsedData);
                    } else {
                        console.error('Could not load the CSV file.');
                    }
                }
            };
            xhr.onerror = function(e) {
                console.error('Failed to read the CSV file.');
            };
            xhr.send(null);
        }

        function clearComparison() {
            var comparisonTableBody = document.getElementById('comparison-table').getElementsByTagName('tbody')[0];
            while (comparisonTableBody.firstChild) {
                comparisonTableBody.removeChild(comparisonTableBody.firstChild);
            }
            comparisonData = []; // 清空全局数组

        }
        // 页面加载完成后执行的事件处理函数
        document.addEventListener('DOMContentLoaded', function() {
            // 调用 readFixedCSV 函数读取 CSV 文件
            readFixedCSV('data_web.csv', populateTable);
            // 为清除所有对比项的按钮添加点击事件
            document.getElementById('clear-comparison').addEventListener('click', clearComparison);

            // 为搜索输入框添加输入事件
            document.getElementById('search-input').addEventListener('input', searchTable);

            // 为深色模式切换按钮添加点击事件
            document.getElementById('toggle-darkmode').addEventListener('click', function() {
                var body = document.body;
                body.classList.toggle('dark-mode');
            });
        ;})
 
    </script>
</body>
</html>

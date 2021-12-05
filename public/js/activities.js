function sortTable(theTable, colNumber) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = theTable;
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 0; i < rows.length-1; i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[colNumber];
            y = rows[i + 1].getElementsByTagName("TD")[colNumber];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

sortTable(document.getElementById("sortThis"), 0);
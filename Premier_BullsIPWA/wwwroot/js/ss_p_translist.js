ssp.webdb.getTransferList = function (keywords) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblTransferList  WHERE LISTNAME LIKE "%' + keywords + '%" OR PRINTNAME LIKE "%' + keywords + '%" ORDER BY LISTNAME ', [], loadTransferList, ssp.webdb.onError);
    });
}

function searchtransferlist() {
    ssp.webdb.getTransferList($("#searchtransfers").val())
}

function loadTransferList(tx, rs, formname) {

    var tableOutput = '<table class="datatable paginate sortable full">';
        tableOutput += '<thead>';
        tableOutput += '<tr>';
        tableOutput += '<th>Name</th>';
        tableOutput += '<th>ID</th>';
        if ($('#headername').html() == 'Transfer') {
            tableOutput += '<th style="width:35px"></th>';
        }
        tableOutput += '</tr></thead><tbody>';
        for (var i = 0; i < rs.rows.length; i++) {
            tableOutput += '<tr><td>' +  rs.rows.item(i).LISTNAME + '</td>';
            tableOutput += '<td>' +  rs.rows.item(i).PRINTNAME + '</td>';
            if ($('#headername').html() == 'Transfer') {
                tableOutput += '<td><ul class="action-buttons">';
                tableOutput += '<li><a href="#" class="button button-gray no-text" onclick="ssp.webdb.setTransferTech(\'' + rs.rows.item(i).LISTNAME + '\',\'' + rs.rows.item(i).PRINTNAME + '\')"><span class="add"></span>Select</a></li>';
                tableOutput += '</ul></td>';
            }
            tableOutput += '</tr>'; 
        }
        tableOutput += '</tbody></table>';
        $('#transfertable').html(tableOutput);

    //$("table.datatable").paginate({ rows: 10, buttonClass: 'button-blue' });
    $("table.datatable").tablesort();
}



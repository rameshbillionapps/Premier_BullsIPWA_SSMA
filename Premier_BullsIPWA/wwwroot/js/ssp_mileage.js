ssp.webdb.MileageDisplay = function () {
    //alert('display mileage');
    $('#dtpMileageDate').val('');
    $('#txtMileageBegin').val('');
    $('#txtMileageEnd').val('');
    $('#chkMileagePersonal').attr('checked', false);
    //get last mileage and today's date
    var myDate = new Date();
		
    $('#dtpMileageDate').val(formatDate(Math.round(new Date().getTime() / 1000))); 
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT MILEAGEEND FROM tblMileage ORDER BY MILEAGEEND DESC', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                $('#txtMileageBegin').val(rs.rows.item(0).MILEAGEEND);
                //$('#txtMileageBegin').attr("disabled", true); 
                } else {$('#txtMileageBegin').val(window.localStorage.getItem('ssp_lastmileage'));}
            }, ssp.webdb.onError);
    });
}

ssp.webdb.MileageAdd = function () {

    if (!sspValidateDate(formatEpoch($('#dtpMileageDate').val()))) {
        alert('cannot save - invalid date');
        return false;
    }
    else if ($('#txtMileageBegin').val() * 1 > $('#txtMileageEnd').val() * 1) {
        alert('cannot save - begin larger than end');
		return false;
    }
    else if ($('#txtMileageBegin').val().length == 0) {
        alert('you must enter starting mileage');
		return false;
    }
    else {
        ssp.webdb.db.transaction(function (tx) {
            var currenttime = Math.round(new Date().getTime() / 1000);
            var mileagedate = formatEpoch($('#dtpMileageDate').val()) ;
            tx.executeSql('INSERT INTO tblMileage (PKIDDroid,TECH_NO,MILEAGEBEGIN,MILEAGEEND,MILEAGEDATE,PERSONAL,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?)', [(currenttime + '.' + window.localStorage.getItem("ssp_TechID")),window.localStorage.getItem("ssp_TechID"), $('#txtMileageBegin').val(), $('#txtMileageEnd').val(), mileagedate, (($('#chkMileagePersonal').is(':checked'))?1:0), 1, currenttime], ssp.webdb.getMileage(), ssp.webdb.onError); //$('#chkMileagePersonal').attr('checked')
        });
		return false;
    }
}

ssp.webdb.getMileage = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblMileage ORDER BY MILEAGEBEGIN', [], loadMileage, ssp.webdb.onError);
    });
}

ssp.webdb.deleteMileage = function (PKID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('DELETE FROM tblMileage WHERE PKIDDroid = ?', [PKID], ssp.webdb.getMileage(), ssp.webdb.onError);
    });
}

ssp.webdb.setMileageCount = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) AS cntMileage FROM tblMileage', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    $('#sideMileageCount').html(rs.rows.item(0).cntMileage);
                }
            }, ssp.webdb.onError);
        });
}

function loadMileage(tx, rs) {
    var totalmileage = 0;
    var rowOutput = '<article>';
	    rowOutput += '<section id="login-block"><div class="block-border"><div class="block-content">';
	    rowOutput += '<h1>Mileage List</h1>';
		
		rowOutput += '<form class="form" onsubmit="return ssp.webdb.MileageAdd();" >';
		rowOutput += '<fieldset class="grey-bg collapse" >';
		rowOutput += '<legend><a href="#" id="btnMileageDisplay">Add Mileage</a></legend>';
		rowOutput += '<p class="inline-mini-label">';
		rowOutput += '<label for="date">Date</label>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="date" id="dtpMileageDate" class="full-width" >';    /*JKS080818->4.03***Auto Fill Search switch*/
		rowOutput += '</p>';
		rowOutput += '<p class="inline-mini-label">';
		rowOutput += '<label for="startmiles">Start Mileage</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="startmiles" id="txtMileageBegin" class="full-width" >';    /*JKS080818->4.03***Auto Fill Search switch*/
		rowOutput += '</p>';
		rowOutput += '<p class="inline-mini-label">';
		rowOutput += '<label for="endmiles">End Mileage</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="endmiles" id="txtMileageEnd" class="full-width" >';    /*JKS080818->4.03***Auto Fill Search switch*/
		rowOutput += '</p>';
		rowOutput += '<p class="inline-mini-label">';
		rowOutput += '<label for="persmiles">Personal Miles</label>';
		rowOutput += '<input type="checkbox" name="persmiles" id="chkMileagePersonal" class="switch" >';
		rowOutput += '</p>';
		rowOutput += '<p><button id="btnMileageAdd" class="full-width">Add Mileage</button></p>';
		rowOutput += '</fieldset>';
		rowOutput += '</form>';
		
		rowOutput += '</br>';
        rowOutput += '<div class="no-margin"><table class="table" cellspacing="0" width="100%">';
        rowOutput += '<thead>';
        rowOutput += '<tr>';
        rowOutput += '<th scope="col">Date</th>';
        rowOutput += '<th scope="col">Begin</th>'; 
        rowOutput += '<th scope="col">End</th>';
        rowOutput += '<th scope="col">Use</th>';
        rowOutput += '<th scope="col" style="width:35px"></th>';
        rowOutput += '</tr></thead><tbody>';
		rowOutput += '<tfoot><tr>';
		rowOutput += '<td colspan="5"><img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto"> <b>Total:</b><div id="totalmileage"></div></td>';
		rowOutput += '</tr></tfoot><tbody>';

        for (var i = 0; i < rs.rows.length; i++) {
        //    if (i == 0) { beginmileage = rs.rows.item(i).MILEAGEBEGIN; }
        totalmileage = totalmileage + (rs.rows.item(i).MILEAGEEND - rs.rows.item(i).MILEAGEBEGIN);
        rowOutput += '<tr><td>' +  formatDate(rs.rows.item(i).MILEAGEDATE) + '</td>';
        rowOutput += '<td>' +  rs.rows.item(i).MILEAGEBEGIN + '</td>';
        rowOutput += '<td>' +  rs.rows.item(i).MILEAGEEND + '</td>';
        rowOutput += '<td>' + ((rs.rows.item(i).PERSONAL == 1) ? 'personal' : 'work')  + '</td>';
        rowOutput += '<td>';
        if (i == rs.rows.length-1){
            rowOutput += '<a href="#" class="button" title="delete" onclick="ssp.webdb.deleteMileage(' + "'" + rs.rows.item(i).PKIDDroid + "'" + ')"><img src="img/bin.png" width="16" height="16"></a>';		
            //endmileage = rs.rows.item(i).MILEAGEEND;
        }
        rowOutput += '</td></tr>';
    }
    rowOutput += '</tbody></table></div></div></div></section></article>';
    $('#maincontent').html(rowOutput);
    $('#totalmileage').html('Total: ' + totalmileage);

	$(document.body).applyTemplateSetup();

}


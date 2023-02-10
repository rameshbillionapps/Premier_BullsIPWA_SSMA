var curUrl_cs = "https://ssma.s-webapi.premierselect.com/sspweb";

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
        tx.exec('SELECT MILEAGEEND FROM tblMileage ORDER BY MILEAGEEND DESC', [],
            function (rs) {
                if (rs.length > 0) {
                    $('#txtMileageBegin').val(rs[0].MILEAGEEND);
                    //$('#txtMileageBegin').attr("disabled", true); 
                } else { $('#txtMileageBegin').val(window.localStorage.getItem('ssp_lastmileage')); }
            }, ssp.webdb.onError);
    });
}

ssp.webdb.MileageAdd = function () {
    var mileageStarting = $("#txtMileageBegin").val();
    var mileageEnding = $("#txtMileageEnd").val();
    if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
        var calMileage = mileageEnding - mileageStarting;
        var calRouteMiles = $("#txtRouteMiles").val();
    }
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
        if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
            if (calRouteMiles > calMileage || calRouteMiles < 0) {
                alert('You must enter valid Route-Miles');
                return false;
            }
            else {
                ssp.webdb.db.transaction(function (tx) {
                    var currenttime = Math.round(new Date().getTime() / 1000);
                    var mileagedate = formatEpoch($('#dtpMileageDate').val());
                    tx.exec('INSERT INTO tblMileage (PKIDDroid,TECH_NO,MILEAGEBEGIN,MILEAGEEND,MILEAGEDATE,PERSONAL,WORKEDFOR,MOD,MODSTAMP,ROUTEMILES) VALUES (?,?,?,?,?,?,?,?,?,?)', [(currenttime + '.' + window.localStorage.getItem("ssp_TechID")), window.localStorage.getItem("ssp_TechID"), +$('#txtMileageBegin').val(), $('#txtMileageEnd').val().trim() == '' ? '' : +$('#txtMileageEnd').val(), mileagedate, (($('#chkMileagePersonal').is(':checked')) ? 1 : 0), '', 1, currenttime, $('#txtRouteMiles').val().trim() == '' ? '' : +$('#txtRouteMiles').val()], ssp.webdb.getMileage, ssp.webdb.onError); //$('#chkMileagePersonal').attr('checked')
                });
            }
        }
        else {
            ssp.webdb.db.transaction(function (tx) {
                var currenttime = Math.round(new Date().getTime() / 1000);
                var mileagedate = formatEpoch($('#dtpMileageDate').val());
                tx.exec('INSERT INTO tblMileage (PKIDDroid,TECH_NO,MILEAGEBEGIN,MILEAGEEND,MILEAGEDATE,PERSONAL,WORKEDFOR,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?)', [(currenttime + '.' + window.localStorage.getItem("ssp_TechID")), window.localStorage.getItem("ssp_TechID"), +$('#txtMileageBegin').val(), $('#txtMileageEnd').val().trim() == '' ? '' : +$('#txtMileageEnd').val(), mileagedate, (($('#chkMileagePersonal').is(':checked')) ? 1 : 0), '', 1, currenttime], ssp.webdb.getMileage, ssp.webdb.onError); //$('#chkMileagePersonal').attr('checked')
            });
        }

        //  return false;
    }
}

ssp.webdb.getMileage = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblMileage ORDER BY MILEAGEBEGIN', [], loadMileage, ssp.webdb.onError);
    });
}

ssp.webdb.deleteMileage = function (PKID) {
    if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
        if ($("#del-last-mileage").attr("class") == "button red") {
            ssp.webdb.db.transaction(function (tx) {
                tx.exec('DELETE FROM tblMileage WHERE PKIDDroid = ?', [PKID], ssp.webdb.getMileage, ssp.webdb.onError);
            });
        } else {
            $("#del-last-mileage").removeClass("button").addClass("button red");
            $("#del-last-mileage").html($("#del-last-mileage").html() + 'sure?');
        }
    }
    else {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('DELETE FROM tblMileage WHERE PKIDDroid = ?', [PKID], ssp.webdb.getMileage, ssp.webdb.onError);
        });
    }
}

ssp.webdb.setMileageCount = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT COUNT(*) AS cntMileage FROM tblMileage', [],
            function (rs) {
                if (rs.length > 0) {
                    $('#sideMileageCount').html(rs[0].cntMileage);
                }
            }, ssp.webdb.onError);
    });
}

function loadMileage(rs) {
    var totalmileage = 0;
    var rowOutput = '<article id="mileage-block">';
    rowOutput += '<section id="login-block"><div class="block-border"><div class="block-content">';
    rowOutput += '<h1>Mileage List</h1>';

    rowOutput += '<form class="form" onsubmit="return ssp.webdb.MileageAdd();" >';
    rowOutput += '<fieldset class="grey-bg collapsed" >';
    rowOutput += '<legend><a href="#" id="btnMileageDisplay">Add Mileage</a></legend>';
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="date" style="width: 18em;">Date</label>';
    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="date" id="dtpMileageDate" class="full-width" style="width:85%;" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '</p>';
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="startmiles" style="width: 18em;">Start Mileage</label>';
    rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="startmiles" id="txtMileageBegin" class="full-width" style="width:85%;" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '</p>';
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="endmiles" style="width: 18em;">End Mileage</label>';
    rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="endmiles" id="txtMileageEnd" class="full-width" style="width:85%;" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '</p>';
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="persmiles" style="width: 18em;">Personal Miles</label>';
    rowOutput += '<input type="checkbox" name="persmiles" id="chkMileagePersonal" class="switch" >';
    if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="routemiles" style="width: 18em;">Route Miles(charge days only)</label>';
        rowOutput += '<input autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="routemiles" id="txtRouteMiles" class="full-width" style="width:85%;" type="number">';
        rowOutput += '</p>';
    }
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
    if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
        rowOutput += '<th scope="col">Route Miles</th>';

    }
    rowOutput += '<th scope="col" style="width:35px"></th>';
    rowOutput += '</tr></thead><tbody>';
    rowOutput += '<tfoot><tr>';
    rowOutput += '<td colspan="5"><img src="img/arrowCurveLeft.png" width="16" height="16" class="picto"> <b>Total:</b><div id="totalmileage"></div></td>';
    rowOutput += '</tr></tfoot><tbody>';

    for (var i = 0; i < rs.length; i++) {
        //    if (i == 0) { beginmileage = rs[i].MILEAGEBEGIN; }
        totalmileage = totalmileage + (rs[i].MILEAGEEND - rs[i].MILEAGEBEGIN);
        rowOutput += '<tr><td>' + formatDate(rs[i].MILEAGEDATE) + '</td>';
        rowOutput += '<td>' + rs[i].MILEAGEBEGIN + '</td>';
        rowOutput += '<td>' + rs[i].MILEAGEEND + '</td>';
        rowOutput += '<td>' + ((rs[i].PERSONAL == 1) ? 'personal' : 'work') + '</td>';
        if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
            rowOutput += '<td>' + rs[i].ROUTEMILES + '</td>';
        }
        rowOutput += '<td>';
        if (i == rs.length - 1) {
            rowOutput += '<a role="button" class="button" style="cursor:pointer;" title="delete" id="del-last-mileage"  onclick="ssp.webdb.deleteMileage(' + "'" + rs[i].PKIDDroid + "'" + ')"><img src="img/bin.png" width="16" height="16"></a>';
            //endmileage = rs[i].MILEAGEEND;
        }
        rowOutput += '</td></tr>';
    }
    rowOutput += '</tbody></table></div></div></div></section></article>';

    $('#mileage-block').remove();
    $('#maincontent').append(rowOutput);
    $('#mileage-block').applyTemplateSetup()

    $('#totalmileage').html('Total: ' + totalmileage);
}


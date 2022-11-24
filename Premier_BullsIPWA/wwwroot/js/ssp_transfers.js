ssp.webdb.getTechTransfer = function () {
    var divContent = '<section id="login-block">';
    divContent += '<div class="block-border"><form class="form block-content" name="login-form" id="login-form" onsubmit="return ssp.webdb.addTransfer()">';
    divContent += '<h1><div id="transfer">Transfer</div></h1>';

    divContent += '<div class="block-controls no-margin" id="tabgroup">';
    divContent += '<ul class="controls-tabs js-tabs" class="float-right">';
    divContent += '<li class="current"><a href="#tab-bulls" title="Bulls">Bulls</a></li>';
    divContent += '<li><a href="#tab-supplies" title="Supplies">Supplies</a></li>';
    divContent += '<li><a href="#tab-pending" title="List">List</a></li>';
    divContent += '</ul>';
    divContent += '</div>';
    divContent += '<p class="message error no-margin"></p>';

    divContent += '<div id="tab-bulls">';
    divContent += '<div class="block-border medium-margin"><h3><div id="BullCode">Select a Bull.</div></h3>';
    divContent += '<h4><div id="BullName"></h4>';
    divContent += '<h4><div id="BullFreeze"></h4></div>';
    divContent += '</div>';

    divContent += '<div id="tab-supplies">';
    divContent += '<div class="block-border medium-margin"><h3><div id="SupplyCode">Select a Supply.</div></h3>';
    divContent += '<h4><div id="SupplyName"></div></h4></div>';
    divContent += '</div>';

    divContent += '<div id="tab-pending">';
    divContent += '<div id="reportoutput"></div>';
    divContent += '</div>';

    divContent += '<div id="techsave">'
    divContent += '<div class="block-border medium-margin"><h3><div id="TechCode">Select a Tech.</div></h3>';
    divContent += '<h4><div id="TechName"></div></h4></div>';
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="amt">Quantity</label>';
    divContent += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="TransQty" id="TransQty" class="full-width">';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '<p><button class="full-width">Save</button></p>';


    divContent += '</div></div></form></div>';

    divContent += '<div id="lookuplist">';
    divContent += '</div>';
    divContent += '<div id="lookuplisttech">';
    divContent += '</div>';
    divContent += '</section>';

    $('#maincontent').html(divContent);

    $('#login-form').removeBlockMessages();

    //ssp.webdb.getTechTransferList('%');
    $('#lookuplisttech').hide();

    $('#tab-bulls').onTabShow(function () {
        $('#lookuplist').html('');
        ssp.webdb.getBulls('%');
        ssp.webdb.resetSalesItemBull();
        $('#techsave').show();
        $('#lookuplist').hide();
    });
    $('#tab-supplies').onTabShow(function () {
        $('#lookuplist').html('');
        ssp.webdb.getSupplies('%');
        ssp.webdb.resetSalesItemSupply();
        $('#techsave').show();
        $('#lookuplist').hide();
    });
    $('#tab-pending').onTabShow(function () {
        $('#techsave').hide();
        $('#lookuplist').hide();
        $('#lookuplisttech').hide();
        ssp.webdb.getTransferReport();
    });

    $('#BullCode').click(function () {
        $('#lookuplisttech').hide();
        $('#lookuplist').show();

        window.location.hash = ''; //Added to enable the jump to '#lookuplist' after every click.
        window.location.hash = '#lookuplist';
    });

    $('#TechCode').click(function () {
        $('#lookuplist').hide();
        $('#lookuplisttech').show();

        window.location.hash = ''; //Added to enable the jump to '#lookuplisttech' after every click.
        window.location.hash = '#lookuplisttech';
    });

    $('#SupplyCode').click(function () {
        $('#lookuplisttech').hide();
        $('#lookuplist').show();

        window.location.hash = ''; //Added to enable the jump to '#lookuplist' after every click.
        window.location.hash = '#lookuplist';
    });

    loadTransferTechListContentBlock(); //Added here to keep the same DOM when searching, so input doesn't get out of focus 
    ssp.webdb.getTechTransferList('%');
}

ssp.webdb.setTechItem = function (item, itemname) {
    $('#TechCode').html(item);
    $('#TechName').html(itemname);
    $('#lookuplisttech').hide();

}

ssp.webdb.resetTransfer = function () {
    $('#TransQty').val('');
    ssp.webdb.resetSalesItemBull();
    $('#login-form').removeBlockMessages();

    //Added this to get the updated bulls/sales data after successful transfer
    if ($('#tab-bulls').css('display') != 'none') { //=='block'
        var searchBulls = $("#searchbulls").val();
        searchBulls ? ssp.webdb.getBulls(searchBulls) : ssp.webdb.getBulls('%'); //Added this check to keep the initial search '%' consistent
    }
    else {
        var searchSupplies = $("#searchsupplies").val();
        searchSupplies ? ssp.webdb.getSupplies(searchSupplies) : ssp.webdb.getSupplies('%');
    }
}

ssp.webdb.deleteTransfer = function (SIORNM, MODSTAMP) {

    if ($("#del" + MODSTAMP).attr("class") == "button red") {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('DELETE FROM tblSales WHERE SIORNM = ? AND MODSTAMP = ?', [SIORNM, MODSTAMP], ssp.webdb.getTransferReport, ssp.webdb.onError);
        });
    } else {
        $("#del" + MODSTAMP).removeClass("button").addClass("button red");
        $("#del" + MODSTAMP).html($("#del" + MODSTAMP).html() + 'sure?');
    }

}

ssp.webdb.pdfTransfer = function (SIORNM, MODSTAMP, RECTECH) {

    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT    transfrom.TransferListName as FromName, tblTechTransfer.TransferListName, tblTechTransfer.TechID, tblSales.SIDATO, tblSales.SITYPS, \
        		tblSales.SIQTY, tblSales.SICOD, tblSales.SINAM, tblSales.SIORNM, tblSales.MODSTAMP, tblSales.SIREP, tblSales.FRZYYYYMMDD  \
                FROM tblSales \
                INNER JOIN  tblTechTransfer ON tblSales.SIANM = tblTechTransfer.TechID \
                INNER JOIN tblTechTransfer AS transfrom ON tblSales.SIREP = transfrom.TechID \
                WHERE tblTechTransfer.TechID = ?', [RECTECH], transferPDF, ssp.webdb.onError);
    });


}

ssp.webdb.addTransfer = function () {


    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);

        var techcode = $('#TechCode').html();
        var techname = $('#TechName').html();
        var techqty = $('#TransQty').val();
        var itemcode = $('#SupplyCode').html();
        var itemname = $('#SupplyName').html();
        var bullfreeze = 0;
        var bullfreezeYYYYMMDD = '';
        if ($("#BullCode").is(":visible")) {
            itemcode = $('#BullCode').html();
            itemname = $('#BullName').html();
            bullfreeze = ($('#BullFreezeCode').html()) ? formatEpochAdjust($('#BullFreezeCode').html()) + 3600 : 0;
            bullfreezeYYYYMMDD = ($('#BullFreezeCode').html()) ? $('#BullFreezeCode').html().split('/')[2] + $('#BullFreezeCode').html().split('/')[0] + $('#BullFreezeCode').html().split('/')[1] : '0';
        }


        if (!itemcode || itemcode.length == 0) {
            $('#login-form').removeBlockMessages().blockMessage('Please select an item code.', { type: 'error' });
        }
        else if (!itemname || itemname.length == 0) {
            $('#login-form').removeBlockMessages().blockMessage('Please select an item name.', { type: 'error' });
        }
        else if (!techcode || techcode.length == 0) {
            $('#login-form').removeBlockMessages().blockMessage('Please select a tech code.', { type: 'error' });
        }
        else if (!techname || techname.length == 0) {
            $('#login-form').removeBlockMessages().blockMessage('Please select a tech name.', { type: 'error' });
        }
        else if (!techqty || techqty.length == 0 || sspNaN(techqty)) {
            $('#login-form').removeBlockMessages().blockMessage('Please enter a quantity.', { type: 'error' });
        }
        else {
            techqty = +techqty; //[ala] converting string to number. Individual value insertion doesn't require this but it is needed when inserting a data object.

            var salesDataStructure = { SIACT: null, SIINVL: null, SIORNM: null, SIINVO: null, SIDATO: null, SITIMO: null, SITYPS: null, SICOD: null, SIQTY: null, SIMATH: null, SINAM: null, SIPRC: null, SITYPI: null, SICOW: null, SIARM: null, SISTP: null, SIOTH: null, SILIN: null, SISEM: null, SIPOA: null, SISUP: null, SICDI: null, SIPGA: null, SIDSC: null, SIREP: null, SIANM: null, SILVL1: null, SILVL2: null, SILVL3: null, SILVL4: null, SILVL5: null, SIRETL: null, FRZDAT: null, LOTNOT: null, SIDATOYYYYMMDD: null, BREEDTYPE: null, FRZYYYYMMDD: null, MOD: null, MODSTAMP: null };
            var currentData = { SIACT: 'Transfer', SIORNM: currenttime + '.' + window.localStorage.getItem("ssp_TechID"), SIDATO: currenttime, SITYPS: 'T', SICOD: itemcode, SIQTY: techqty, SINAM: itemname, SIREP: window.localStorage.getItem("ssp_TechID"), SIANM: $('#TechCode').html(), FRZDAT: bullfreeze, MOD: 1, MODSTAMP: currenttime, FRZYYYYMMDD: bullfreezeYYYYMMDD }

            tx.exec('INSERT INTO tblSales VALUES ?', [{ ...salesDataStructure, ...currentData }], ssp.webdb.resetTransfer, ssp.webdb.onError); //[ala] Using salesDataStructure to avoid the undefined values error when POSTing the data to backend. In WebSQL after inserting, rest object property remains null whereas in alasql it remains undefined.
            //tx.exec('INSERT INTO tblSales (SIACT,SIORNM,SIDATO,SITYPS,SICOD,SIQTY,SINAM,SIREP,SIANM,FRZDAT,MOD,MODSTAMP,FRZYYYYMMDD) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', ['Transfer', currenttime + '.' + window.localStorage.getItem("ssp_TechID"), currenttime, 'T', itemcode, $('#TransQty').val(), itemname, window.localStorage.getItem("ssp_TechID"), $('#TechCode').html(), bullfreeze, 1, currenttime,bullfreezeYYYYMMDD], ssp.webdb.resetTransfer(), ssp.webdb.onError);
        }
    });
    return false;
}

ssp.webdb.getTechTransferList = function (keywords, recbegin) {
    //loadTransferTechListContentBlock();
    ssp.webdb.db.transaction(function (tx) {
        if (typeof recbegin == 'undefined') {
            if (keywords != '%') $('#techkeyword').html(keywords);
            tx.exec('SELECT * FROM tblTechTransfer WHERE (TechID LIKE "%' + keywords + '%" OR TransferListName LIKE "%' + keywords + '%") ORDER BY TransferListName', [], loadTechTransferList, ssp.webdb.onError);
        } else {
            tx.exec('SELECT * FROM tblTechTransfer WHERE (TechID LIKE "%' + keywords + '%" OR TransferListName LIKE "%' + keywords + '%") ORDER BY TransferListName' + ' LIMIT 50 OFFSET ' + recbegin, [], loadTechTransferList, ssp.webdb.onError);
        }
    });
}

ssp.webdb.searchtechs = function () {
    $('#techlist0').html('<div id="techlist0"></div>');
    $('#techmore').html('<div id="techmore"></div>');
    ssp.webdb.getTechTransferList($("#searchtechs").val());
    return false;
}

function loadTransferTechListContentBlock() {
    var rowOutput = '<article>';
    rowOutput += '<section id="login-block">';
    rowOutput += '<div class="block-border">';
    rowOutput += '<div class="block-content"><h1>Techs<div id="techkeyword"></div></h1>';
    rowOutput += '<form class="form input-with-button full-width" onsubmit="return ssp.webdb.searchtechs()" >';
    rowOutput += '<p><span class="input-type-text">';
    rowOutput += '<a href="javascript:void(0)" class="button float-right" style="margin-left:10px" onclick="ssp.webdb.searchtechs()" title="messages"><img src="img/zoom.png" width="16" height="16"></a>';
    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="searchtechs" id="searchtechs" class="full-width" ';      /*JKS080818->4.03***Auto Fill Search switch*/
    if ($("#searchtechs").val() != undefined) rowOutput += 'value="' + $("#searchtechs").val() + '"';
    rowOutput += ' )>';
    rowOutput += '</p></span>';
    rowOutput += '</form>';
    rowOutput += '</br>';
    rowOutput += '<div id="techlist0"></div><div id="techmore"></div>';
    rowOutput += '</div>';
    rowOutput += '</div></section></article>';
    $('#lookuplisttech').html(rowOutput);
}

function loadTechTransferList(rs) {
    var reccount = 0;
    var currfilter = $('#techkeyword').html();
    var rowOutput = '';
    if (rs.length == 0) {
        rowOutput += '<p class="message warning">Sorry, no techs to list.</p>';
    }
    else {
        rowOutput += '<ul class="extended-list">';
        for (var i = 0; i < rs.length; i++) {
            rowOutput += '<li><a href="#" onclick="ssp.webdb.setTechItem(' + "'" + rs[i].TechID + '\',\'' + rs[i].TransferListName + "'" + ');">';
            rowOutput += '<span class="icon"></span>';
            rowOutput += rs[i].TransferListName + '<br>';
            rowOutput += '<small>' + rs[i].TechID + '</small>';
            rowOutput += '</a></li>';
        }
        reccount = Math.max(0, $('#techlistcount').html()) + i;
        //var listid = (Math.max(0,Math.ceil(reccount/50)));
        rowOutput += '<div id="techlist0"></div>';
        rowOutput += '</ul>';
        var rectotal = Math.max(rs.length, $('#techlisttotal').html());
        var moreOutput = '<div id=techmore"><img src="img/arrowCurveLeft.png" width="16" height="16" class="picto"> <div style="display:inline-block" id="techlistcount">' + reccount + '</div> of <div style="display:inline-block" id="techlisttotal">' + rectotal + '</div> items  ';
        //if (reccount != rectotal) moreOutput += '<button type="button" onClick="ssp.webdb.getTechList(\'' + currfilter + '\',' + Math.min((reccount),rectotal) + ');">Show More</button></div>';
    }
    $('#techlist0').html(rowOutput);
    $('#techmore').html(moreOutput);
    $(document.body).applyTemplateSetup();


    $('#searchtechs').keyup(function () {
        delay(function () {
            ssp.webdb.searchtechs();
        }, 0);
    });



}

function transferPDF(rs) {

    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    //function gotFS(fileSystem) {
    //    var path = window.localStorage.getItem('ssp_orderpdf') + "transfer_" + rs[0].SIORNM + ".pdf";
    //    fileSystem.root.getFile(path, { create: true, exclusive: false }, gotFileEntry, fail);

    //    function gotFileEntry(fileEntry) {

    //        fileEntry.createWriter(gotFileWriter, fail);
    //        function gotFileWriter(writer) {

    var homeHeader = 'Premier Select Sires, Inc.';
    var addr1Header = '1 Stony Mountain Road, Tunkhannock, PA 18657';
    var addr2Header = 'Phone: (570)836-3168   FAX: (570)836-1490  e-mail: office@premierselect.com';
    var reply1Header = 'Tunkhannock office: 1 Stony Mountain Road, Tunkhannock, PA 18657';
    var reply2Header = 'Phone: (570)836-3168   FAX: (570)836-1490';


    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
            homeHeader = 'Premier Select Sires, Inc.';
            addr1Header = '3789 Old Port Royal Road, Spring Hill, TN 37174';
            addr2Header = 'Phone: (931) 489-2020   FAX: (931) 489-2026  e-mail: sess.office@premierselect.com';
            break;
        case 'ssc':
            homeHeader = 'Select Sires Genervations, Inc.';
            addr1Header = 'RR 3 P.O. Box 489 / 2 Industrial Road, Kemptville, Ontario K0G 1J0';
            addr2Header = 'Phone: (613) 258-3800   FAX: (613) 258-7257  e-mail: ssgi@selectgen.com';
            break;
        case 'ps':
            homeHeader = 'Select Sires MidAmerica';
            addr4Header = '41W 394 U.S. Highway 20, Hampshire, IL 60140';
            addr5Header = 'Phone: (847) 464-5281';
            addr1Header = '833 West 400 North, Logan UT 84321';
            addr2Header = 'Phone (435) 752-2022';
            break;
        case 'ecss':
            homeHeader = 'CentralStar';
            addr1Header = 'P.O. Box 191, Waupun, WI 53963-0191';
            addr2Header = 'P.O. Box 23157, Lansing, MI 48909-3157';
            addr3Header = 'Phone: 800.631.3510  Website: www.mycentralstar.com';
            break;
    }

    var doc = new jsPDF();
    var top = 20;

    doc.setFontSize(16);
    doc.text(10, top, homeHeader);
    doc.text(10, (top + .75), "__________________");

    doc.setFontSize(8);
    doc.text(80, (top - 10), addr1Header);
    doc.text(80, (top - 6.25), addr2Header);
    if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
        doc.text(80, (top - 2.5), addr3Header);
    }
    if (window.localStorage.getItem("ssp_projectid") == 'ps') {
        doc.text(10, (top - 10), addr4Header);
        doc.text(10, (top - 6.25), addr5Header);
    }
    doc.setFontSize(10);
    if (window.localStorage.getItem("ssp_projectid") == 'ssp') {
        doc.text(80, (top - 3), "REPLY TO:");
        doc.setFontSize(8);
        doc.text(100, (top - 3), reply1Header);
        doc.text(80, (top + .75), reply2Header);
    }


    doc.setFontSize(12);
    doc.text(10, (top + 10), "Received By:");
    doc.text(10, (top + 10.5), "______________");
    doc.setFontSize(10);
    doc.text(10, (top + 15), 'ID: ' + rs[0].TechID);
    doc.text(10, (top + 20), 'Name: ' + rs[0].TransferListName);
    doc.setFontSize(12);
    doc.text(100, (top + 10), "Transfer");
    doc.text(100, (top + 10.5), "_________");
    doc.setFontSize(10);
    doc.text(100, (top + 15), 'Number: ' + rs[0].SIORNM);
    doc.text(100, (top + 20), 'Date: ' + formatDate(Date.now() / 1000));
    doc.text(100, (top + 25), 'From: ' + rs[0].SIREP);
    doc.text(100, (top + 30), 'Name: ' + rs[0].FromName);     //JKS121817***ADDED USERNAME to Transfer List for a From Name***

    doc.setFontSize(12);
    doc.text(10, (top + 35), "Items");
    doc.text(10, (top + 35.5), "_____");

    doc.text(10, (top + 40), 'Transfer Date - Code');
    doc.text(15, (top + 45), 'Name');
    doc.text(120, (top + 40), 'Quantity');
    doc.text(10, (top + 45.5), "_____________________________________________________________________");


    doc.setFontSize(10);
    var linepos = (top + 55);
    var bullname = "";
    for (var i = 0; i < rs.length; i++) {
        doc.text(10, linepos, formatDate(rs[0].SIDATO) + ' - ' + rs[i].SICOD);
        bullname = rs[i].SINAM + ((window.localStorage.getItem("ssp_freeze") == 1 && rs[i].FRZYYYYMMDD !== '0') ? ' - ' + formatYYYYMMDDtoMDY(rs[i].FRZYYYYMMDD) : '');
        doc.text(15, linepos + 5, '' + bullname);
        doc.text(120, linepos, '' + rs[i].SIQTY);
        linepos += 15;

        if ((linepos > 250) && (i < rs.length - 1)) {
            doc.text(10, linepos, "(cont.)");
            doc.addPage();
            doc.text(10, 10, "(cont.) " + homeHeader + " - To Tech: " + rs[i].TechID);
            linepos = 20;
        }

    }

    doc.save('Transfer_' + Math.round(new Date().getTime() / 1000) + '.pdf');

    //doc.output('datauri');    //JKS061316 PDFLocalTest
    //PDFLocalTest comment out from here... (uncomment the line above)
    //writer.write(doc.output());
    //    //JKS061316 ***BEGIN-Replaced FileOpener with FileOpener2***
    //cordova.plugins.fileOpener2.open(cordova.file.externalRootDirectory + path,     //JKS030716 ***New Path***
    //    'application/pdf',
    //    {
    //        error: function (e) {
    //            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
    //        },
    //        success: function () {
    //            console.log('file opened successfully');
    //        }
    //    }
    //);
    //JKS061316 ***END-Replaced FileOpener with FileOpener2***
    //JKS061316 ***Replaced FileOpener with FileOpener2***                window.plugins.fileOpener.open("file://" + path);
    // }

    //  }

    // }

}






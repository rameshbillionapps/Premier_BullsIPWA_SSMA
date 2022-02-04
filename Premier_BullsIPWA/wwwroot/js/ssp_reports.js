ssp.webdb.loadReports = function () {

    //var divContent = "<header id='mainheader'><h1>Premier Select Sires</h1></header>";
   	//divContent += "<a href='javascript:void(0);' onclick='location.reload();' id='home'>Home</a>";
	//$('#headercontent').html(divContent);
	
    
    var divContent = '<section id="login-block">';
    divContent += '<div class="block-border with-margin"><form class="form block-content" name="login-form" id="login-form" >';
    divContent += '<h1>Reports</h1>';
    divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.getNitroFillsOver();">Nitrogen Expired</button></p>';
    divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.get90DayReport();">' + ((window.localStorage.getItem("ssp_projectid") == 'mnss')?'60':'90') + '-Day List</button></p>';
    divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.getTransferReport();">Transfer List</button></p>';
    divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.getPendingItemsReport();">Pending Items</button></p>';
    if ((window.localStorage.getItem("ssp_projectid") == 'ssp') || (window.localStorage.getItem("ssp_projectid") == 'sess')) {      /*JKS103118 ->4.10 ***ADDED the following for SESS Semen Sorted Order List: || (window.localStorage.getItem("ssp_projectid") == 'sess')*/
        divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.getInventortyListingSortedReport();">Bull Inv Order Sorted (PDF)</button></p>';
    }
    divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.getInventortyListingReport();">Bull Inv Listing (PDF)</button></p>';
    divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.getSupplyInventortyListingReport();">Supply Inv Listing (PDF)</button></p>';
    divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.getSyncInCounts();">Sync History (online)</button></p>';
    divContent += '<p><button type="button" class="full-width" onclick="ssp.webdb.getNitroFills();">Nitrogen Fills</button></p>';
    divContent += '</form></div><div id="reportoutput"></div></section>';
		

	$('#maincontent').html(divContent);	
}

ssp.webdb.get90DayReport = function () {

	ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT tblCustomers.ACCT_NO, tblCustomers.NAME, tblCustomersAR.OVER_90 FROM \
        		tblCustomers INNER JOIN tblCustomersAR ON tblCustomers.ACCT_NO = tblCustomersAR.ACCT_NO \
                WHERE OVER_90 > 0 ORDER BY NAME', [], display90DayReport, ssp.webdb.onError);
    });	
}

ssp.webdb.getTransferReport = function () {

	ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT     tblTechTransfer.TransferListName, tblTechTransfer.TechID, tblSales.SIDATO, tblSales.SITYPS, \
        		tblSales.SIQTY, tblSales.SICOD, tblSales.SINAM, tblSales.SIORNM, tblSales.MODSTAMP \
        		FROM tblSales INNER JOIN  tblTechTransfer ON tblSales.SIANM = tblTechTransfer.TechID WHERE SITYPS = "T" ORDER BY SIDATO DESC', [], displayTransferReport, ssp.webdb.onError); 
    });	
}

ssp.webdb.getPendingItemsReport = function () {

	$('#reportoutput').html('<div id="orderitems"></div>');
	ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblSales WHERE MOD = 1 AND (SITYPS = "D" OR SITYPS = "N" OR SITYPS = "S" OR SITYPS = "B" OR SITYPS = "Z") ORDER BY SIORNM,SINAM ', [], loadOrderItems, ssp.webdb.onError); 
    });
	
}

ssp.webdb.getNitroFills = function () {

	$('#reportoutput').html('<div id="orderitems"></div>');
	ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblSales WHERE SITYPS = "N" ORDER BY SIDATO DESC ', [], loadOrderItems, ssp.webdb.onError); 
    });	
}

ssp.webdb.getNitroFillsOver = function () {

    //var daysAgo30 = Math.round(new Date().getTime() / 1000) - (60 * 60 * 24 * window.localStorage.getItem("ssp_nitrodays"));  //JKS102517***NitroDays Moved to Customer Info***
    ssp.webdb.db.transaction(function (tx) {
        //tx.executeSql('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,max(tblSales.SIDATO) AS NITROSALE FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE tblSales.SITYPS = "N" GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME HAVING NITROSALE < strftime("%s","now") - (60 * 60 * 24 * tblCustomers.SP7) ORDER BY tblSales.SIDATO', [], displayNitroOverReport, ssp.webdb.onError);    //JKS110817***NitroDays Moved to Customer Info...Replaced  ' + daysAgo30 + ' with  strftime("%s","now") - (60 * 60 * 24 * tblCustomers.SP7) ***
        //JKS021218***3.100.37->Removed all 020518 Default Nitro Value code, which was replaced by SQL statement CHANGES in Reports and Home to check for Customer Nitro or Default Nitro values*** 
        tx.executeSql('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,max(tblSales.SIDATO) AS NITROSALE, CASE WHEN tblCustomers.SP7 IS NULL OR tblCustomers.SP7 = "" OR tblCustomers.SP7 = " "  \
            THEN strftime("%s", "now") - (60 * 60 * 24 * ' + window.localStorage.getItem("ssp_nitrodays") + ') \
            ELSE strftime("%s","now") - (60 * 60 * 24 * tblCustomers.SP7) END AS tmpDays \
            FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT \
            WHERE tblSales.SITYPS = "N" \
            GROUP BY tblCustomers.ACCT_NO, tblCustomers.NAME \
            HAVING NITROSALE < tmpDays \
            ORDER BY tblSales.SIDATO', [], displayNitroOverReport, ssp.webdb.onError);    //JKS110817***NitroDays Moved to Customer Info...Replaced  ' + daysAgo30 + ' with  strftime("%s","now") - (60 * 60 * 24 * tblCustomers.SP7) ***
    });
}

ssp.webdb.getInventortyListingReport = function () {

	$('#reportoutput').html('<div id="orderitems"></div>');
	ssp.webdb.db.transaction(function (tx) {
		
        tx.executeSql('SELECT  SICOD, B_NAME, SUM(QOH) as QOH, AVG(PRICE1) as PRICE1, invsold FROM tblBulls LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" GROUP BY SICOD \
    			) inv ON tblBulls.SICOD = inv.salecode WHERE tblBulls.ACTIVE = "L" OR tblBulls.QOH - (CASE WHEN inv.invsold IS NULL THEN 0 ELSE inv.invsold END) <> 0 GROUP BY SICOD ORDER BY SICOD', [], loadInventoryListingPDF, ssp.webdb.onError);
	});	
}

ssp.webdb.getInventortyListingSortedReport = function () {

    $('#reportoutput').html('<div id="orderitems"></div>');
    ssp.webdb.db.transaction(function (tx) {

        tx.executeSql('SELECT  SICOD, B_NAME, SUM(QOH) as QOH, AVG(PRICE1) as PRICE1, invsold FROM tblBulls LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" GROUP BY SICOD \
    			) inv ON tblBulls.SICOD = inv.salecode WHERE tblBulls.ACTIVE = "L" OR tblBulls.QOH - (CASE WHEN inv.invsold IS NULL THEN 0 ELSE inv.invsold END) <> 0 GROUP BY SICOD ORDER BY SS_CON IS NULL, SS_CON ASC', [], loadInventoryListingPDF, ssp.webdb.onError);
    });
}

ssp.webdb.getSupplyInventortyListingReport = function () {

    $('#reportoutput').html('<div id="orderitems"></div>');
    ssp.webdb.db.transaction(function (tx) {

        tx.executeSql('SELECT * FROM tblSupplies LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" GROUP BY SICOD \
    			) inv ON tblSupplies.STOCK_NO = inv.salecode WHERE tblSupplies.QOH - (CASE WHEN inv.invsold IS NULL THEN 0 ELSE inv.invsold END) <> 0 ORDER BY STOCK_NO' , [], loadSupplyInventoryListingPDF, ssp.webdb.onError);
    });
}


function display90DayReport(tx, rs) {
	
	var totalOver90 = 0
    var rowOutput = '<div class="no-margin"><table class="table" cellspacing="0" width="100%">';
    rowOutput += '<thead>';
    rowOutput += '<tr>';
    rowOutput += '<th scope="col">Cust Num</th>';
    rowOutput += '<th scope="col">Cust Name</th>'; 
    rowOutput += '<th scope="col">Over ' + ((window.localStorage.getItem("ssp_projectid") == 'mnss') ? '60' : '90') + '</th>';
    rowOutput += '</tr></thead><tbody>';
	rowOutput += '<tfoot><tr>';
	rowOutput += '<td colspan="5"><img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto"> <b>Total:</b><div id="totalover90"></div></td>';
	rowOutput += '</tr></tfoot><tbody>';

    for (var i = 0; i < rs.rows.length; i++) {
        rowOutput += '<tr><td>' +  rs.rows.item(i).ACCT_NO + '</td>';
        rowOutput += '<td>' +  rs.rows.item(i).NAME + '</td>';
        rowOutput += '<td>' +  rs.rows.item(i).OVER_90.toFixed(2) + '</td>';
        rowOutput += '</tr>';
        totalOver90 += rs.rows.item(i).OVER_90
    }
    rowOutput += '</tbody></table></div>';
    
    $('#reportoutput').html(rowOutput);
    $('#totalover90').html(totalOver90.toFixed(2));
}

function displayTransferReport(tx, rs) {
	
	var totalOver90 = 0
    var rowOutput = '<div class="no-margin"><table class="table" cellspacing="0" width="100%">';
    rowOutput += '<thead>';
    rowOutput += '<tr>';
    rowOutput += '<th scope="col" style="width:35px"></th>';
    rowOutput += '<th scope="col">Date</th>';
    rowOutput += '<th scope="col">Tech</th>';
    rowOutput += '<th scope="col">Item</th>';
    rowOutput += '<th scope="col">Quantity</th>';
    rowOutput += '<th scope="col" style="width:35px"></th>';
    rowOutput += '</tr></thead><tbody>';
	rowOutput += '<tbody>';

    for (var i = 0; i < rs.rows.length; i++) {

        rowOutput += '<tr>';
        rowOutput += '<td><a href="#" class="button" title="transferpdf" id="pdf' + rs.rows.item(i).MODSTAMP + '" onclick="ssp.webdb.pdfTransfer(' + "'" + rs.rows.item(i).SIORNM + "'," + rs.rows.item(i).MODSTAMP + ",'" + rs.rows.item(i).TechID + "'" + ')"><img src="img/document-pdf.png" width="16" height="16"></a></td>';
        rowOutput += '<td>' +  formatDate(rs.rows.item(i).SIDATO) + '</td>';
        rowOutput += '<td>' +  rs.rows.item(i).TechID + ' - ' + rs.rows.item(i).TransferListName + '</td>';
        rowOutput += '<td>' +  rs.rows.item(i).SICOD + ' - ' + rs.rows.item(i).SINAM + '</td>';
        rowOutput += '<td>' + rs.rows.item(i).SIQTY + '</td>';
        rowOutput += '<td><a href="#" class="button" title="delete" id="del' + rs.rows.item(i).MODSTAMP + '" onclick="ssp.webdb.deleteTransfer(' + "'" + rs.rows.item(i).SIORNM + "'," + rs.rows.item(i).MODSTAMP + ')"><img src="img/bin.png" width="16" height="16"></a></td>';
        rowOutput += '</tr>';
    }
    rowOutput += '</tbody></table></div>';
    
    $('#reportoutput').html(rowOutput);
}

function displayNitroOverReport(tx, rs) {

    var rowOutput = '<div class="no-margin"><table class="table" cellspacing="0" width="100%">';
    rowOutput += '<thead>';
    rowOutput += '<tr>';
    rowOutput += '<th scope="col">Cust Num</th>';
    rowOutput += '<th scope="col">Cust Name</th>';
    rowOutput += '<th scope="col">Last Nitro Order Date</th>';
    rowOutput += '</tr></thead><tbody>';
    rowOutput += '<tfoot><tr>';
    rowOutput += '<td colspan="5"><img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto"> <b>Total:</b><div id="totalover"></div></td>';
    rowOutput += '</tr></tfoot><tbody>';

    for (var i = 0; i < rs.rows.length; i++) {
        rowOutput += '<tr><td>' + rs.rows.item(i).ACCT_NO + '</td>';
        rowOutput += '<td>' + rs.rows.item(i).NAME + '</td>';
        rowOutput += '<td>' + formatDate(rs.rows.item(i).NITROSALE) + '</td>';
        rowOutput += '</tr>';
    }
    rowOutput += '</tbody></table></div>';

    $('#reportoutput').html(rowOutput);
    $('#totalover').html(rs.rows.length);
}


ssp.webdb.getSyncInCounts = function () {

	$.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/syncInCounts/" + window.localStorage.getItem("ssp_TechGUID") + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        async: true,
        error: function (xhr, status, error) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            ssp.webdb.db.transaction(function (tx) {
                var rowOutput = '<div class="no-margin"><table class="table" cellspacing="0" width="100%">';
                rowOutput += '<thead>';
                rowOutput += '<tr>';
                //JKS081017***Begin IF ELSE for varied TIMESTAMP display between Co-ops***
                if (window.localStorage.getItem("ssp_projectid") == 'ssp') {
                    rowOutput += '<th scope="col">Date/Time</th>';
                } else {
                    rowOutput += '<th scope="col">Date</th>';
                }
                //JKS081017***End IF ELSE for varied TIMESTAMP display between Co-ops***
                rowOutput += '<th scope="col">Amount</th>';
                rowOutput += '<th scope="col">Sales</th>';
                rowOutput += '<th scope="col">Customers</th>';
                rowOutput += '<th scope="col">Mileage</th>';
                rowOutput += '<th scope="col">Timesheets</th>';
                rowOutput += '</tr></thead><tbody>';
            	rowOutput += '<tbody>';
            	
                $.each(JSON.parse(msg), function (i, item) {
                    //JKS030718***3.100.41->REMOVED SECTION for line of code below to RESOLVE NaN/NaN/NaN ERROR for TIMESTAMP data after WebAPI and Date function changes.***//JKS081017***Begin IF ELSE to RESOLVE NaN/NaN/NaN ERROR for varied TIMESTAMP data between Co-ops***
                    //if (window.localStorage.getItem("ssp_projectid") == 'ssp') {
                    //    rowOutput += '<tr><td>' + item.TIMESTAMPStartSales.substring(0, 19) + '</td>'; //Date((item.TIMESTAMPStartSales).substring(6,19))
                    //} else {
                    //    rowOutput += '<tr><td>' + formatDate((item.TIMESTAMPStartSales).substring(6, 19) / 1000) + '</td>'; 
                    //}
                    //JKS030718***3.100.41->REMOVED SECTION  for line of code below to RESOLVE NaN/NaN/NaN ERROR for TIMESTAMP data after WebAPI and Date function changes***//JKS081017***End IF ELSE to RESOLVE NaN/NaN/NaN ERROR for varied TIMESTAMP data between Co-ops***
                    rowOutput += '<tr><td>' + item.TIMESTAMPStartSales.substring(0, 19) + '</td>';      //JKS030718***3.100.41->ADDED LINE to RESOLVE NaN/NaN/NaN ERROR for TIMESTAMP data after WebAPI and Date function changes for co-ops now included with SSP.***
                    rowOutput += '<td>' + ((item.ItemTotal == null) ? '' : item.ItemTotal) + '</td>';
	                rowOutput += '<td>' +  ((item.CountSales==null)?'':item.CountSales) + '</td>';
	                rowOutput += '<td>' +  ((item.CountCustomers==null)?'':item.CountCustomers) + '</td>';
	                rowOutput += '<td>' +  ((item.CountMileage==null)?'':item.CountMileage) + '</td>';
	                rowOutput += '<td>' +  ((item.CountTimesheet==null)?'':item.CountTimesheet) + '</td>';
	                rowOutput += '</tr>';
                });
	            rowOutput += '</tbody></table></div>';
	            
	            $('#reportoutput').html(rowOutput);
            });
        }
    });
	
}

function loadInventoryListingPDF(tx, rs) {

    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    // function gotFS(fileSystem) {
        // var path = window.localStorage.getItem('ssp_orderpdf') + "inventory_" + formatDateYYYYMMDD(Math.round(new Date().getTime() / 1000)) + ".pdf";
        // fileSystem.root.getFile(path, {create: true, exclusive: false}, gotFileEntry, fail);
        
        // function gotFileEntry(fileEntry) {

           // fileEntry.createWriter(gotFileWriter, fail);
             // function gotFileWriter(writer) {
            	var doc = new jsPDF();
                var homeHeader = 'Premier Select Sires';
            	switch (window.localStorage.getItem("ssp_projectid")) {
            	    case 'sess':
                        homeHeader = 'Premier Select Sires';
            	        break;
            	    case 'ssc':
            	        homeHeader = 'Select Sires Genervations';
            	        break;
            	    case 'ps':
                        homeHeader = 'Select Sires MidAmerica';
            	        break;
            	    case 'ecss':
                        homeHeader = 'CentralStar';
            	        break;
            	    case 'mnss':
            	        homeHeader = 'Minnesota Select Sires';
            	        break;
            	}
            	doc.setFontSize(16);
            	doc.text(10,12, homeHeader + " - Inventory Listing");
            	doc.text(10,12.75,"__________________");

		    	doc.text(10, 19, 'Date Stamp: ' + formatDate(Math.round(new Date().getTime() / 1000)));
            	doc.setFontSize(12);
		
		    	doc.text(10, 25, 'Code - Name');
		    	doc.text(90, 25, 'Inventory Quantity');
		    	doc.text(140, 25, 'Price');
            	doc.text(10,25.5,"_____________________________________________________________________");

            	doc.setFontSize(10);
		    	var linepos = 30;
		    	var bullqty = 0;
		    	for (var i = 0; i < rs.rows.length; i++) {
			        doc.text(10, linepos, '' + rs.rows.item(i).SICOD + ' - ' + rs.rows.item(i).B_NAME);
			    	doc.text(120, linepos, '' + (rs.rows.item(i).QOH  -  rs.rows.item(i).invsold));
			    	doc.text(140, linepos, '' + rs.rows.item(i).PRICE1.toFixed(2));
	            	doc.text(10,linepos + .5,"________________________________________________________________________________");
			    	linepos += 5;
			    	bullqty += (rs.rows.item(i).QOH  -  rs.rows.item(i).invsold);
			    	if ((linepos > 270) && (i < rs.rows.length-1)){
			    		doc.text(10,linepos,"(cont.)");
			    		doc.addPage();
			    		doc.text(10,10,"(cont.) " + homeHeader + " - Inventory Listing - " + formatDate(Math.round(new Date().getTime() / 1000)) );
			    		linepos = 20;
			    	}
		        }
		    	
		    	linepos += 5;	
		    	doc.text(140, linepos, 'Total Units:  ' + bullqty);

				doc.output('save');
		    	// //doc.output('datauri');
		    	// writer.write(doc.output());
                 // //JKS062916 ***BEGIN-Replaced FileOpener with FileOpener2***
		    	// cordova.plugins.fileOpener2.open(cordova.file.externalRootDirectory + path,     //JKS062916 ***New Path***
                    // 'application/pdf',
                    // {
                        // error: function (e) {
                            // console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        // },
                        // success: function () {
                            // console.log('file opened successfully');
                        // }
                    // }
                // );
                 // //JKS062916 ***END-Replaced FileOpener with FileOpener2***
                 // //JKS022916 ***Replaced FileOpener with FileOpener2***         window.plugins.fileOpener.open("file://" + path);
       	// }
            
        // }
    // }
}

function loadSupplyInventoryListingPDF(tx, rs) {

    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    // function gotFS(fileSystem) {
        // var path = window.localStorage.getItem('ssp_orderpdf') + "inventory_" + formatDateYYYYMMDD(Math.round(new Date().getTime() / 1000)) + ".pdf";
        // fileSystem.root.getFile(path, { create: true, exclusive: false }, gotFileEntry, fail);

        // function gotFileEntry(fileEntry) {

            // fileEntry.createWriter(gotFileWriter, fail);
            // function gotFileWriter(writer) {
                var doc = new jsPDF();
                var homeHeader = 'Premier Select Sires';
                switch (window.localStorage.getItem("ssp_projectid")) {
                    case 'sess':
                        homeHeader = 'Premier Select Sires';
                        break;
                    case 'ssc':
                        homeHeader = 'Select Sires Genervations';
                        break;
                    case 'ps':
                        homeHeader = 'Select Sires MidAmerica';
                        break;
                    case 'ecss':
                        homeHeader = 'CentralStar';
                        break;
                    case 'mnss':
                        homeHeader = 'Minnesota Select Sires';
                        break;
                }
                doc.setFontSize(16);
                doc.text(10, 12, homeHeader + " - Supply Inventory Listing");
                doc.text(10, 12.75, "________________________________________________");

                doc.text(10, 19, 'Date Stamp: ' + formatDate(Math.round(new Date().getTime() / 1000)));
                doc.setFontSize(12);

                doc.text(10, 25, 'Code - Name');
                doc.text(90, 25, 'Inventory Quantity');
                doc.text(140, 25, 'Price');
                doc.text(10, 25.5, "_____________________________________________________________________");

                doc.setFontSize(10);
                var linepos = 30;
                var bullqty = 0;
                for (var i = 0; i < rs.rows.length; i++) {
                    doc.text(10, linepos, '' + rs.rows.item(i).STOCK_NO + ' - ' + rs.rows.item(i).DESC);
                    doc.text(120, linepos, '' + (rs.rows.item(i).QOH - rs.rows.item(i).invsold));
                    doc.text(140, linepos, '' + rs.rows.item(i).PRICE.toFixed(2));
                    doc.text(10, linepos + .5, "________________________________________________________________________________");
                    linepos += 5;
                    bullqty += (rs.rows.item(i).QOH - rs.rows.item(i).invsold);
                    if ((linepos > 270) && (i < rs.rows.length - 1)) {
                        doc.text(10, linepos, "(cont.)");
                        doc.addPage();
                        doc.text(10, 10, "(cont.) " + homeHeader + " - Inventory Listing - " + formatDate(Math.round(new Date().getTime() / 1000)));
                        linepos = 20;
                    }
                }

                linepos += 5;
                doc.text(140, linepos, 'Total Units:  ' + bullqty);

				doc.output('save');
                //doc.output('datauri');
                // writer.write(doc.output());
                // //JKS062916 ***BEGIN-Replaced FileOpener with FileOpener2***
                // cordova.plugins.fileOpener2.open(cordova.file.externalRootDirectory + path,     //JKS062916 ***New Path***
                    // 'application/pdf',
                    // {
                        // error: function (e) {
                            // console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        // },
                        // success: function () {
                            // console.log('file opened successfully');
                        // }
                    // }
                // );
                // //JKS062916 ***END-Replaced FileOpener with FileOpener2***
                // //JKS022916 ***Replaced FileOpener with FileOpener2***         window.plugins.fileOpener.open("file://" + path);
            // }

        // }
    // }
}




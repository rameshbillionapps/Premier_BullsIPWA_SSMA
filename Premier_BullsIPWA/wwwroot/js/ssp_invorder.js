ssp.webdb.getItemsInventory = function (itemid,itemtype,frzdat) {
   
    //JKS062716 ***Removed MOD and SIINVO and Added SIDATO DESC,***to have all bull sales in descending order***
    if (itemtype == 'b') {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM tblSales WHERE SICOD = "' + itemid + '" AND FRZYYYYMMDD = "' + frzdat + '" ORDER BY  SIDATO DESC,SIORNM,SINAM ', [], loadOrderItemsInventory, ssp.webdb.onError);
        });
    } else {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM tblSales WHERE SICOD = "' + itemid + '" ORDER BY  SIDATO DESC,SIORNM,SINAM ', [], loadOrderItemsInventory, ssp.webdb.onError);
        });
    }


	if (itemtype == 'b') {
		ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM tblBulls LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold, FRZYYYYMMDD AS freezedate FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" GROUP BY SICOD,FRZYYYYMMDD \
	    			) inv ON tblBulls.SICOD = inv.salecode AND tblBulls.FRZYYYYMMDD = inv.freezedate WHERE SICOD = "' + itemid + '" AND FRZYYYYMMDD = "' + frzdat + '"' , [], loadInventoryItemInfo, ssp.webdb.onError);
		});
   } else {
		ssp.webdb.db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM tblSupplies LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" GROUP BY SICOD \
	    			) inv ON tblSupplies.STOCK_NO = inv.salecode WHERE STOCK_NO = "' + itemid + '"' , [], loadInventoryItemInfo, ssp.webdb.onError);    	
		});
   }
	
}


ssp.webdb.getInvOrder = function (itemid,itemname,itemtype,frzdat) {
    var divContent = '<section id="login-block">';
    divContent += '<div class="block-border"><form class="form block-content" name="login-form" id="login-form" onsubmit="return ssp.webdb.addTransfer()">';
    divContent += '<h1><div id="transfer">Inventory Info</div></h1>';
     
    divContent += '<div class="block-controls no-margin" id="tabgroup">';
    divContent += '<ul class="controls-tabs js-tabs" class="float-right">';
    divContent += '<li ' + ((itemtype=='b') ? 'class="current"':'') + '><a href="#tab-bulls" title="Bulls">Bulls</a></li>';
    divContent += '<li ' + ((itemtype=='b') ? '':'class="current"') + '><a href="#tab-supplies" title="Supplies">Supply</a></li>';
    divContent += '</ul>';
  	divContent += '</div>';
    divContent += '<p class="message error no-margin"></p>';

    divContent += '<div id="tab-bulls">';
    divContent += '<div class="block-border medium-margin"><h3><div id="BullName"></div></h3>';
    divContent += '<h3><div id="BullFreeze"></div></h3>';
    divContent += '<h4><div id="BullCode"></div></h4></div>';
 	divContent += '</div>';
	
    divContent += '<div id="tab-supplies">';
    divContent += '<div class="block-border medium-margin"><h3><div id="SupplyName"></div></h3>';
    divContent += '<h4><div id="SupplyCode"></div></h4></div>';
    divContent += '</div>';

//    divContent += '<p class="inline-mini-label">';
//    divContent += '<label for="amt">Quantity</label>';
//    divContent += '<input type="number" name="TransQty" id="TransQty" class="full-width">';
//    divContent += '<p><button class="full-width">Place Order</button></p>';
	
    
	divContent += '<div id="currinvsumm">'
	divContent += '</div>';

    divContent += '<p><div id="orderitems"></div></p>';
	divContent += '</form></div>';

	divContent += '<div id="lookuplist">';
	divContent += '</div>';
	divContent += '<div id="lookuplisttech">';
	divContent += '</div>';
	divContent += '</section>';
	
	$('#maincontent').html(divContent);
	
	$('#login-form').removeBlockMessages();

	$('#tab-bulls').onTabShow(function() {
		$('#lookuplist').html('');
		$('#currinvsumm').html('');
		$('#orderitems').html('');
		ssp.webdb.getBulls('%');
		ssp.webdb.resetSalesItemBull();
		$('#lookuplist').hide();
	});

	$('#tab-supplies').onTabShow(function () {
		$('#lookuplist').html('');
		$('#currinvsumm').html('');
		$('#orderitems').html('');
		ssp.webdb.getSupplies('%');
		ssp.webdb.resetSalesItemSupply();
		$('#lookuplist').hide();
	});

	$('#BullCode').click(function() {
		$('#lookuplist').show();
		window.location.hash = '#lookuplist';
	});
	

	$('#SupplyCode').click(function() {
		$('#lookuplist').show();
		window.location.hash = '#lookuplist';
	});
	
	$(document.body).applyTemplateSetup();
	
    if (itemtype == 'b') {
    	$('#BullCode').html(itemid);
    	$('#BullName').html(itemname);
        if (frzdat !== '0') $('#BullFreeze').html(formatYYYYMMDDtoMDY(frzdat)); 
    }else{
    	$('#SupplyCode').html(itemid);
    	$('#SupplyName').html(itemname);
    }
    
    divContent = '<ul class="blocks-list with-padding">';
    divContent += '<li>';
    divContent += '<img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto"><span class="number float-right"><div style="display:inline-block" id="currinv"></div></span><strong>Current Inventory</strong>';
	divContent += '';
	divContent += '<ul class="with-padding">';
	divContent += '<li><strong>Last Office Inventory: </strong><div style="display:inline-block" id="offinv"></div></li>';
	divContent += '<li><strong>Total Pending: </strong><div style="display:inline-block" id="dbinv"></div></li>';
	divContent += '<li>To Be Invoiced: <div style="display:inline-block" id="pendinv"></div></li>';
	divContent += '<li>To Be Sync: <div style="display:inline-block" id="syncinv"></div></li>';
	divContent += '</ul>';
	divContent += '</li>';
	divContent += '</ul>';
	$('#currinvsumm').html(divContent);

    ssp.webdb.getItemsInventory(itemid,itemtype,frzdat);
    
}

ssp.webdb.resetInvOrder = function () {
	$('#TransQty').val('');
	ssp.webdb.resetSalesItemBull();
	$('#login-form').removeBlockMessages();
}

ssp.webdb.addInvOrder = function () {
	

    ssp.webdb.db.transaction(function (tx) {
    var currenttime = Math.round(new Date().getTime() / 1000);
    
    var techcode = $('#TechCode').html();
    var techname = $('#TechName').html();
    var techqty = $('#TransQty').val();
    var itemcode = $('#SupplyCode').html();
    var itemname = $('#SupplyName').html();
	if ($("#BullCode").is(":visible")) {
	   itemcode = $('#BullCode').html();
	   itemname = $('#BullName').html();
	}

 
	if (!itemcode || itemcode.length == 0) {
		$('#login-form').removeBlockMessages().blockMessage('Please select an item code.', {type: 'error'});
	} 
	else if (!itemname || itemname.length == 0) {
		$('#login-form').removeBlockMessages().blockMessage('Please select an item name.', {type: 'error'});
	}
	else if (!techcode || techcode.length == 0) {
		$('#login-form').removeBlockMessages().blockMessage('Please select a tech code.', {type: 'error'});
	} 
	else if (!techname || techname.length == 0) {
		$('#login-form').removeBlockMessages().blockMessage('Please select a tech name.', {type: 'error'});
	}
	else if (!techqty || techqty.length == 0 || sspNaN(techqty)) {
		$('#login-form').removeBlockMessages().blockMessage('Please enter a quantity.', {type: 'error'});
	}
	else {
        tx.executeSql('INSERT INTO tblSales (SIACT,SIORNM,SIDATO,SITYPS,SICOD,SIQTY,SINAM,SIREP,SIANM,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', ['Transfer', currenttime + '.' + window.localStorage.getItem("ssp_TechID") , currenttime,'T',itemcode,$('#TransQty').val(),itemname,window.localStorage.getItem("ssp_TechID"),$('#TechCode').html(),1,currenttime], ssp.webdb.resetTransfer() , ssp.webdb.onError);
	}
});
return false;
}


function loadOrderItemsInventory(tx, rs) {
	var	rowOutput = '';
	//var ordertotal = 0;
	var pendinv = 0;
	var unsyncinv = 0;
	if (rs.rows.length == 0) {
		rowOutput += '<div class="task with-legend with-padding" >';
        rowOutput += '<div class="legend"><img src="img/flag.png" width="16" height="16"> Pending Items</div>';
		rowOutput += '<div class="task-description"><h3>None.</h3></div>';
		rowOutput += '</div>';
    }
    else {
    	 for (var i = 0; i < rs.rows.length; i++) {
			rowOutput += '<div class="task with-legend">';
            rowOutput += '<div class="legend"><img src="img/tags-label.png" width="16" height="16"> ' + rs.rows.item(i).SITYPS ;
            rowOutput += " - " + rs.rows.item(i).SIORNM ; 
            rowOutput += '</div>';
			rowOutput += '<div class="task-description">';
			rowOutput += '<ul class="floating-tags">';
			rowOutput += '<li class="tag-date" id="itemdate"> ' + formatDate(rs.rows.item(i).SIDATO)  + '</li>';
			rowOutput += '<li class="tag-money"> ' + ((rs.rows.item(i).SITYPS=="Z") ? rs.rows.item(i).SIPRC : rs.rows.item(i).SIQTY + '@' + rs.rows.item(i).SIPRC.toFixed(2))  + '</li> ';
			rowOutput += '<li><img src="img/status' + ((rs.rows.item(i).MOD) ? '-away' : '')  + '.png" width="16" height="16">sync</li>';
			rowOutput += '</ul>';
			rowOutput += '<h3>' + rs.rows.item(i).SINAM ;
            if ((rs.rows.item(i).FRZYYYYMMDD) == "0" ? ' ' : rowOutput += '<br>' + formatYYYYMMDDtoMDY(rs.rows.item(i).FRZYYYYMMDD));    //JKS071017***ADDED ( !== "0" ? ' ' : ) to check for FRZDAT values to FIX incorrect FRZDAT***
			rowOutput += '</h3>'
			rowOutput += rs.rows.item(i).SICOD;
			if (rs.rows.item(i).SITYPS == "B") rowOutput += '</br>Bull: <strong>' + rs.rows.item(i).LOTNOT + '</strong>';   //JSK102716***Added Bull Note to Item display.***
			if (rs.rows.item(i).SITYPS=="B") rowOutput += '</br>Cow: <strong>' +  rs.rows.item(i).SICOW + '</strong>';
			rowOutput += '<h4>' + ((rs.rows.item(i).SITYPS=="Z") ? rs.rows.item(i).SIPOA.toFixed(2) : ((rs.rows.item(i).SIQTY*rs.rows.item(i).SIPRC)+rs.rows.item(i).SIARM).toFixed(2)) + '</h4>';
			if (typeof reportoutput != "undefined")  rowOutput += rs.rows.item(i).SIANM ;
    	     //ordertotal += (rs.rows.item(i).SIQTY*rs.rows.item(i).SIPRC)+rs.rows.item(i).SIARM
			rowOutput += rs.rows.item(i).SIANM;     //JKS062416 ***Customer Name***
			rowOutput += '</br>Rep: ' + rs.rows.item(i).SIREP;     //JKS062716 ***Sales Rep***
			rowOutput += '</div>';
			rowOutput += '</div>'; 
			if (rs.rows.item(i).MOD) {
				unsyncinv += rs.rows.item(i).SIQTY;
			} else {
			    if (rs.rows.item(i).SIINVO == null || rs.rows.item(i).SIINVO == "0") {
			        pendinv += rs.rows.item(i).SIQTY;
			    }
			}
				
			
			
        }
		rowOutput += '</div>';
    }
    $("#pendinv").html(pendinv);
    $("#syncinv").html(unsyncinv);
	$('#orderitems').html(rowOutput);

}

function loadInventoryItemInfo(tx, rs) {
    $("#currinv").html(rs.rows.item(0).QOH - rs.rows.item(0).invsold);
    $("#offinv").html(rs.rows.item(0).QOH);
    $("#dbinv").html(((!rs.rows.item(0).invsold)? 0 : rs.rows.item(0).invsold ));
}






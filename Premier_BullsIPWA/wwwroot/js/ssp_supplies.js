ssp.webdb.getSupplies = function (keywords, recbegin) {
	loadSuppliesContentBlock();
	ssp.webdb.getSuppliesList(keywords, recbegin);
}

ssp.webdb.getSuppliesList = function (keywords, recbegin) {
	if (keywords != '%') $('#supplykeyword').html(keywords);
	var repID = window.localStorage.getItem("ssp_TechID");
	ssp.webdb.db.transaction(function (tx) {
		if (typeof recbegin == 'undefined') {
			tx.exec('SELECT SICOD AS salecode,SUM(SIQTY) AS invsold FROM tblSales WHERE SIINVO is null OR SIINVO = "0" AND SIREP = "' + repID + '" GROUP BY SICOD ', [], (inv, err) => {
				tx.exec('SELECT * FROM tblSupplies LEFT OUTER JOIN ? inv ON tblSupplies.STOCK_NO = inv.salecode WHERE (STOCK_NO LIKE "%' + keywords + '%" OR [DESC] LIKE "%' + keywords + '%") ORDER BY ' + (isNaN(keywords.substr(0, 1)) ? '[DESC]' : 'STOCK_NO'), [inv],
					//Added this delay to avoid the infinite loop case as 'applyTemplateSetup'(this.find('.js-tabs').updateTabs();) gets stuck in loop due to instantaneous result from loadSupplies.
					//On click of info button at the end of each Supply rows, ssp.webdb.getInvOrder('%') gets called and flow goes through here.
					(res) => delay(function () {
						loadSupplies(res);
					}, 0)
				)
			}
			)
		} else {
			tx.exec('SELECT SICOD AS salecode,SUM(SIQTY) AS invsold FROM tblSales WHERE SIINVO is null OR SIINVO = "0" AND SIREP = "' + repID + '" GROUP BY SICOD ', [], (inv, err) => {
				tx.exec('SELECT * FROM tblSupplies LEFT OUTER JOIN ? inv ON tblSupplies.STOCK_NO = inv.salecode WHERE (STOCK_NO LIKE "%' + keywords + '%" OR [DESC] LIKE "%' + keywords + '%") ORDER BY ' + (isNaN(keywords.substr(0, 1)) ? '[DESC]' : 'STOCK_NO') + ' LIMIT 50 OFFSET ' + recbegin, [inv], loadSupplies, ssp.webdb.onError)
			}
			)
		}
	});

}

ssp.webdb.setSuppliesCount = function () {
	ssp.webdb.db.transaction(function (tx) {
		tx.exec('SELECT COUNT(*) AS cntSupplies FROM tblSupplies', [],
			function (rs) {
				if (rs.length > 0) {
					$('#sideSuppliesCount').html(rs[0].cntSupplies);
				}
			}, ssp.webdb.onError);
	});
}

ssp.webdb.searchsupplies = function () {
	$('#supplylist0').html('<div id="supplylist0"></div>');
	$('#supplymore').html('<div id="supplymore"></div>');
	ssp.webdb.getSuppliesList($("#searchsupplies").val());
	return false;
}

function loadSuppliesContentBlock() {
	var rowOutput = '<article>';
	rowOutput += '<section id="login-block">';
	if (typeof acctid == "undefined") rowOutput += '<div class="block-border">';
	rowOutput += '<div class="block-content"><h1>Supplies<div id="supplykeyword"></div></h1>';
	rowOutput += '<form class="form input-with-button full-width" onsubmit="return ssp.webdb.searchsupplies()" >';
	rowOutput += '<p><span class="input-type-text">';
	rowOutput += '<a href="javascript:void(0)" class="button float-right" onclick="ssp.webdb.searchsupplies()" title="messages"><img src="img/zoom.png" width="16" height="16"></a>';
	rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="searchsupplies" id="searchsupplies" class="full-width" ';       /*JKS080818->4.03***Auto Fill Search switch*/
	if ($("#searchsupplies").val() != undefined) rowOutput += 'value="' + $("#searchsupplies").val() + '"';
	rowOutput += '>';
	rowOutput += '</p></span>';
	rowOutput += '</form>';
	rowOutput += '</br>';
	rowOutput += '<div id="supplylist0"></div><div id="supplymore"></div>';
	if (typeof acctid == "undefined") rowOutput += '</div>';
	rowOutput += '</div></section></article>';
	if ((typeof acctid != "undefined") || (typeof transfer != "undefined"))
		$('#lookuplist').html(rowOutput);
	else
		$('#maincontent').html(rowOutput);
}

function loadSupplies(rs) {
	var rowOutput = '';
	var reccount = 0;
	var currfilter = $('#supplykeyword').html();
	var supplyclick = '';
	if (rs.length == 0) {
		rowOutput += '<p class="message warning">Sorry, no supplies to list.</p>';
	}
	else {
		rowOutput += '<div id="tab-users"><ul class="extended-list">';
		for (var i = 0; i < Math.min(50, rs.length); i++) {
			supplyclick = ((typeof acctid) != undefined) ? 'onclick="ssp.webdb.setSalesItemSupply(\'' + rs[i].STOCK_NO + '\',\'' + rs[i].DESC + '\',' + rs[i].PRICE + ',' + rs[i].MIN_HAND + ',\'' + rs[i].STATETAXABLE + '\')"' : '';
			rowOutput += '<li><a href="#" ' + supplyclick + '>';
			//rowOutput += '<li><a href="#" onclick="ssp.webdb.getCustomerByID(' + "'" + rs[i].STOCK_NO + "'" + ');>';
			rowOutput += '<span class="icon"></span>';
			rowOutput += rs[i].DESC + '<br>';
			rowOutput += '<small>' + rs[i].STOCK_NO + '</small>';
			rowOutput += '</a>';
			rowOutput += '<ul class="extended-options">';
			rowOutput += '<li><a href="#" class="button" onclick="ssp.webdb.getInvOrder(\'' + rs[i].STOCK_NO + '\',\'' + rs[i].DESC + '\',\'s\',0);"><img src="img/informationBlue.png" width="16" height="16">' + (rs[i].QOH || 0 - rs[i].invsold || 0) + '</a></li>';
			rowOutput += '</ul>';
			rowOutput += '<ul class="tags float-right">'; //floating-tags">';
			//rowOutput += '<li class="tag-info"> ' + (rs[i].QOH - rs[i].invsold) + '</li>';
			rowOutput += '<li class="tag-money"> ' + rs[i].PRICE.toFixed(2) + '</li> ';
			rowOutput += '</ul>';
			rowOutput += '</li>';
		}
		reccount = Math.max(0, $('#supplylistcount').html()) + i;
		var listid = (Math.max(0, Math.ceil(reccount / 50)));
		rowOutput += '<div id="supplylist' + listid + '"></div>';
		rowOutput += '</ul></div>';
		var rectotal = Math.max(rs.length, $('#supplylisttotal').html());
		var moreOutput = '<div id="supplymore"><img src="img/arrowCurveLeft.png" width="16" height="16" class="picto"> <div style="display:inline-block" id="supplylistcount">' + reccount + '</div> of <div style="display:inline-block" id="supplylisttotal">' + rectotal + '</div> items  ';
		if (reccount != rectotal) moreOutput += '<button type="button" onClick="ssp.webdb.getSuppliesList(\'' + currfilter + '\',' + Math.min((reccount), rectotal) + ');">Show More</button></div>';
	}
	$('#supplylist' + Math.max(0, (Math.ceil(reccount / 50) - 1))).html(rowOutput);
	$('#supplymore').html(moreOutput);
	$(".mini-switch-replace").remove();
	// rp-101315-remove any switches from order screen then reapply the event
	$(document.body).applyTemplateSetup();
	$('.mini-switch-replace').click(function () {
		var parent = $(this).parent().get(0);
		window.localStorage.setItem('ssp_techfunc', ($('#chkTechfunc').is(':checked')) ? 1 : 0);
		ssp.webdb.getOrder(-1, 1);
	});

	$('#searchsupplies').keyup(function () {
		delay(function () {
			ssp.webdb.searchsupplies();
		}, 0);
	});
}








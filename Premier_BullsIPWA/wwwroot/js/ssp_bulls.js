ssp.webdb.getBulls = function (keywords, recbegin) {
    		loadBullsContentBlock ();
    		ssp.webdb.getBullList(keywords, recbegin);
}

ssp.webdb.getBullList = function (keywords, recbegin) {
    ssp.webdb.db.transaction(function (tx) {
    	var repID = window.localStorage.getItem("ssp_TechID");
		if (typeof recbegin == 'undefined') {
			if (keywords != '%') $('#bullkeyword').html(keywords);
			if (keywords.substring(0, 2) == '7H') {     //JKS070816 ***7H search only in Bulls list***  ***Removed AND at end of line3 after tot.salecode***
                tx.executeSql('SELECT * FROM tblBulls LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold, FRZYYYYMMDD AS freezedate FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" AND SIREP = "' + repID + '" GROUP BY SICOD,FRZYYYYMMDD \
	        			) inv ON tblBulls.SICOD = inv.salecode AND tblBulls.FRZYYYYMMDD = inv.freezedate \
                        LEFT OUTER JOIN (	SELECT SICOD AS salecode,SUM(SIQTY) AS totsold, MAX(SIDATO) AS lastsaledate FROM tblSales WHERE SIREP = "' + repID + '" GROUP BY SICOD ) tot ON tblBulls.SICOD = tot.salecode  \
                        WHERE (SICOD LIKE "%' + keywords + '%" ) ORDER BY SICOD,FRZYYYYMMDD', [], loadBulls, ssp.webdb.onError);
	    	} else {    //JKS070816 ***all other searchs in Bulls list***
                tx.executeSql('SELECT * FROM tblBulls LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold, FRZYYYYMMDD AS freezedate FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" AND SIREP = "' + repID + '" GROUP BY SICOD,FRZYYYYMMDD \
    			) inv ON tblBulls.SICOD = inv.salecode AND tblBulls.FRZYYYYMMDD = inv.freezedate \
                LEFT OUTER JOIN (	SELECT SICOD AS salecode,SUM(SIQTY) AS totsold, MAX(SIDATO) AS lastsaledate FROM tblSales WHERE SIREP = "' + repID + '" GROUP BY SICOD ) tot ON tblBulls.SICOD = tot.salecode   \
                WHERE (SICOD LIKE "%' + keywords + '%" OR B_NAME LIKE "%' + keywords + '%") ORDER BY ' + (isNaN(keywords.substr(0, 1)) ? 'B_NAME,FRZYYYYMMDD' : 'SICOD,FRZYYYYMMDD'), [], loadBulls, ssp.webdb.onError);
			}
		} else {
			if (keywords.substring(0, 2) == '7H') {
                tx.executeSql('SELECT * FROM tblBulls LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold, FRZYYYYMMDD AS freezedate FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" AND SIREP = "' + repID + '" GROUP BY SICOD,FRZYYYYMMDD \
	        			) inv ON tblBulls.SICOD = inv.salecode AND tblBulls.FRZYYYYMMDD = inv.freezedate \
                        LEFT OUTER JOIN (	SELECT SICOD AS salecode,SUM(SIQTY) AS totsold, MAX(SIDATO) AS lastsaledate FROM tblSales WHERE SIREP = "' + repID + '" GROUP BY SICOD ) tot ON tblBulls.SICOD = tot.salecode   \
                        WHERE (SICOD LIKE "' + keywords + '%" ) ORDER BY SICOD,FRZYYYYMMDD LIMIT ' + recbegin + ',50', [], loadBulls, ssp.webdb.onError);
	    	} else {
                tx.executeSql('SELECT * FROM tblBulls LEFT OUTER JOIN (SELECT SICOD AS salecode,SUM(SIQTY) AS invsold, FRZYYYYMMDD AS freezedate FROM tblSales WHERE SIINVO isnull OR SIINVO = "0" AND SIREP = "' + repID + '" GROUP BY SICOD,FRZYYYYMMDD \
        			) inv ON tblBulls.SICOD = inv.salecode AND tblBulls.FRZYYYYMMDD = inv.freezedate \
                    LEFT OUTER JOIN (	SELECT SICOD AS salecode,SUM(SIQTY) AS totsold, MAX(SIDATO) AS lastsaledate FROM tblSales WHERE SIREP = "' + repID + '" GROUP BY SICOD ) tot ON tblBulls.SICOD = tot.salecode   \
                    WHERE (SICOD LIKE "%' + keywords + '%" OR B_NAME LIKE "%' + keywords + '%") ORDER BY ' + (isNaN(keywords.substr(0, 1)) ? 'B_NAME,FRZYYYYMMDD' : 'SICOD,FRZYYYYMMDD') + ' LIMIT ' + recbegin + ',50', [], loadBulls, ssp.webdb.onError);
	    	}	
		}    	
    });	
}

ssp.webdb.setBullsCount = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) AS cntBulls FROM tblBulls', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    $('#sideBullsCount').html(rs.rows.item(0).cntBulls);
                }
            }, ssp.webdb.onError);
        });
    }

ssp.webdb.setBullFilter = function (header) {
        switch (header)
        {
        case 'Beef':
            $('#bullfilter').html('Bull List - Beef <a href="#">&darr;</a>');
            ssp.webdb.getBulls("");
            break;
        case 'Dairy':
            $('#bullfilter').html('Bull List - Dairy <a href="#">&darr;</a>');
            ssp.webdb.getBulls("");
            break;
        case 'All':
            $('#bullfilter').html('Bull List - All <a href="#">&darr;</a>');
            ssp.webdb.getBulls("");
            break;
    }
    // setup the view switcher
    $('.main-content > header .view-switcher > h2 > a').click(function () {
        $(this).focus().parent().next().fadeIn();
        return false;
    }).blur(function () {
        $(this).parent().next().fadeOut();
        return false;
    });
}

ssp.webdb.searchbulls = function () {
	$('#bulllist0').html('<div id="bulllist0"></div>');
	$('#bullmore').html('<div id="bullmore"></div>');
	ssp.webdb.getBullList($("#searchbulls").val());
	return false;
}

ssp.webdb.search7Hbulls = function () {
    $("#searchbulls").val("7H");    //JKS070516 ***search would fail when value was set to "7H" in Win10...changed to "7h"***   JKS070816 ***changed back to "7H"***
    ssp.webdb.searchbulls();
    return false;
}



function loadBullsContentBlock () {
		var rowOutput = '<article>';
	    rowOutput += '<section id="login-block">';
		if (typeof acctid == "undefined") rowOutput += '<div class="block-border">';
		rowOutput += '<div class="block-content"><h1>Bulls<div id="bullkeyword"></div></h1>';
		rowOutput += '<form class="form input-with-button full-width" onsubmit="return ssp.webdb.searchbulls()" >';
        rowOutput += '<p><span class="input-type-text">';
		rowOutput += '<a href="javascript:void(0)" class="button float-right" style="margin-left:10px" onclick="ssp.webdb.searchbulls()" title="messages"><img src="img/zoom.png" width="16" height="16"></a>';
		rowOutput += '<a href="javascript:void(0)" class="button float-right" onclick="ssp.webdb.search7Hbulls()" >7H</a>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="searchbulls" id="searchbulls" class="full-width" ';     /*JKS080818->4.03***Auto Fill Search switch*/
		if ($("#searchbulls").val() != undefined) rowOutput += 'value="' + $("#searchbulls").val() + '"'; 
		rowOutput += ' )>';
		rowOutput += '</p></span>';
//		rowOutput += '<fieldset class="grey-bg collapse" >';
//		rowOutput += '<legend><a href="#" id="btnSearchOptions">Search Options</a></legend>';
//		rowOutput += '<p class="inline-mini-label">';
//		rowOutput += '<label for="searchbulls">Search</label>';
//		rowOutput += '<input type="text" name="searchbulls" id="searchbulls" class="full-width" >';
//		rowOutput += '</p>';
//		rowOutput += '<p><button class="full-width">Bull Search</button></p>';
//		rowOutput += '</fieldset>';
		rowOutput += '</form>';
		rowOutput += '</br>';
		rowOutput += '<div id="bulllist0"></div><div id="bullmore"></div>';
		if (typeof acctid == "undefined") rowOutput += '</div>';
		rowOutput += '</div></section></article>';
		if ((typeof acctid != "undefined")||(typeof transfer != "undefined")) { 
        	$('#lookuplist').html(rowOutput);
		}
		else
		    $('#maincontent').html(rowOutput);
}

function loadBulls(tx, rs) {
	    var reccount = 0;
	    var currfilter = $('#bullkeyword').html();
	    var roycostdisp = 0;
	    var bullclick = "";
	    var salesmonths = Math.max(1, (((new Date).getTime() - (window.localStorage.getItem('ssp_salemonths') * 1000)) / 2592000000).toFixed(2));  //JKS062716 ***Added Math.max()***
		var rowOutput='';
		if (rs.rows.length == 0) {
            rowOutput += '<p class="message warning">Sorry, no bulls to list.</p>';
        }
        else {
		    rowOutput += '<div id="tab-users"><ul class="extended-list">';
			for (var i = 0; i < Math.min(50,rs.rows.length) ; i++) { 
                bullclick = ((typeof acctid) != undefined) ? 'onclick="ssp.webdb.setSalesItemBull(\'' + rs.rows.item(i).SICOD + '\',\'' + rs.rows.item(i).B_NAME + '\',' + rs.rows.item(i).PRICE1 + "," + rs.rows.item(i).PRICE2 + "," + rs.rows.item(i).PRICE3 + "," + rs.rows.item(i).ROY_COST + ',\'' + rs.rows.item(i).FRZYYYYMMDD + '\',\'' + rs.rows.item(i).BLK1 + '\')"' : '';
						rowOutput += '<li><a href="#" ' + bullclick + ' >' ;    
						rowOutput += '<span class="icon"></span>';
                        rowOutput += rs.rows.item(i).B_NAME + '<br>';
                        if ((rs.rows.item(i).FRZYYYYMMDD) && (rs.rows.item(i).FRZYYYYMMDD) != "undefined" && (rs.rows.item(i).FRZYYYYMMDD) != "0") {  //JKS062717***ADDED (&& (rs.rows.item(i).FRZDAT) != "undefined") {} TO REMOVE NaN in Bull List and prevent default date***
                            rowOutput += formatYYYYMMDDtoMDY(rs.rows.item(i).FRZYYYYMMDD) + '<br>';
                        }
						rowOutput += '<small>' + rs.rows.item(i).SICOD + '</small>';
						rowOutput += (rs.rows.item(i).invsold > 0) ? '</br><small>pending: ' + rs.rows.item(i).invsold + '</small>' : '';
						rowOutput += '</a>';
						rowOutput += '<ul class="extended-options">';
                        rowOutput += '<li><a href="#" class="button" onclick="ssp.webdb.getInvOrder(\'' + rs.rows.item(i).SICOD + '\',\'' + rs.rows.item(i).B_NAME + '\',\'b\',\'' + rs.rows.item(i).FRZYYYYMMDD + '\');"><img src="img/information-blue.png" width="16" height="16">' + (rs.rows.item(i).QOH - rs.rows.item(i).invsold) + '</a></li>';
						rowOutput += '</ul>';
						rowOutput += '<ul class="tags float-right">'; //floating-tags">';
						//rowOutput += '<li class="tag-info" > ' + (rs.rows.item(i).QOH  -  rs.rows.item(i).invsold) + '</li>';
						rowOutput += '<li class="tag-money"> ' + rs.rows.item(i).PRICE1.toFixed(2) + '</li> ';
					    roycostdisp = (rs.rows.item(i).ROY_COST < 0) ? ((rs.rows.item(i).ROY_COST * -1) + "%") : "$" + rs.rows.item(i).ROY_COST;
					    rowOutput += '<li class="tag">roy ' + roycostdisp + '</li>';
					    rowOutput += '</ul>';
					    if ((rs.rows.item(i).totsold) != null) {
					        rowOutput += '<ul class="extended-options">';
                            rowOutput += '<div><a href="#" class="button float-right" onclick="ssp.webdb.getInvOrder(\'' + rs.rows.item(i).SICOD + '\',\'' + rs.rows.item(i).B_NAME + '\',\'b\',\'' + rs.rows.item(i).FRZYYYYMMDD + '\');"><img src="img/information-ocre.png" width="16" height="16"> Average (Last): ' + (rs.rows.item(i).totsold / salesmonths).toFixed(2) + ' (' + formatDate(rs.rows.item(i).lastsaledate) + ')</a></div>';    //JKS062216 ***Added OnClick***
					        rowOutput += '</ul>';
					    }

					    rowOutput += '</li>';
			}
    		reccount = Math.max(0,$('#bulllistcount').html()) + i;
			var listid = (Math.max(0,Math.ceil(reccount/50)));
			rowOutput += '<div id="bulllist' + listid + '"></div>';
			rowOutput += '</ul></div>';
			var rectotal = Math.max(rs.rows.length,$('#bulllisttotal').html());
			var moreOutput = '<div id="bullmore"><img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto"> <div style="display:inline-block" id="bulllistcount">' + reccount + '</div> of <div style="display:inline-block" id="bulllisttotal">' + rectotal + '</div> items  ';
			if (reccount != rectotal) moreOutput += '<button type="button" onClick="ssp.webdb.getBullList(\'' + currfilter + '\',' + Math.min((reccount),rectotal) + ');">Show More</button></div>';
			moreOutput += '<div>Sales Range: ' + salesmonths + ' months</div>';
		}
       	$('#bulllist'+ Math.max(0,(Math.ceil(reccount/50)-1)) ).html(rowOutput);
       	$('#bullmore').html(moreOutput);
        // rp-101315-remove any switches from order screen then reapply the event
       	$(".mini-switch-replace").remove();
		$(document.body).applyTemplateSetup();
		$('.mini-switch-replace').click(function () {
		    var parent = $(this).parent().get(0);
		    window.localStorage.setItem('ssp_techfunc', ($('#chkTechfunc').is(':checked')) ? 1 : 0);
		    ssp.webdb.getOrder(-1, 1);
		});

		$('#searchbulls').keyup(function() {
		    delay(function(){
		    	ssp.webdb.searchbulls();
		    }, 500 );
		});

}




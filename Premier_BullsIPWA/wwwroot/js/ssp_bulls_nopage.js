ssp.webdb.getBulls = function (keywords, recbegin) {
//    ssp.webdb.db.transaction(function (tx) {
        //if (typeof formname != "undefined") { loadBullsHeader(); }
//        var bulltypechar = ($("#bullfilter").length == 0) ? "A" : $("#bullfilter").html().charAt(12);
//        var type = (bulltypechar == 'A') ? "" : bulltypechar;
//		if (typeof recbegin == 'undefined') {
			loadBullsContentBlock ();
//			if (keywords != '%') $('#bullkeyword').html(keywords); 
//        	tx.executeSql('SELECT * FROM tblBulls WHERE TYPE LIKE "' + type + '%" AND (CODE LIKE "%' + keywords + '%" OR B_NAME LIKE "%' + keywords + '%") ORDER BY CODE ', [], loadBulls, ssp.webdb.onError);
//		} else {
//        	tx.executeSql('SELECT * FROM tblBulls WHERE TYPE LIKE "' + type + '%" AND (CODE LIKE "%' + keywords + '%" OR B_NAME LIKE "%' + keywords + '%") ORDER BY CODE LIMIT ' + recbegin + ',50' , [], loadBulls, ssp.webdb.onError);
//		}
 //   });
	
}

ssp.webdb.getBullList = function (keywords, recbegin) {
    ssp.webdb.db.transaction(function (tx) {
        //if (typeof formname != "undefined") { loadBullsHeader(); }
        var bulltypechar = ($("#bullfilter").length == 0) ? "A" : $("#bullfilter").html().charAt(12);
        var type = (bulltypechar == 'A') ? "" : bulltypechar;
		if (typeof recbegin == 'undefined') {
//			loadBullsContentBlock ();
			if (keywords != '%') $('#bullkeyword').html(keywords); 
        	tx.executeSql('SELECT * FROM tblBulls WHERE TYPE LIKE "' + type + '%" AND (CODE LIKE "%' + keywords + '%" OR B_NAME LIKE "%' + keywords + '%") ORDER BY CODE ', [], loadBulls, ssp.webdb.onError);
		} else {
        	tx.executeSql('SELECT * FROM tblBulls WHERE TYPE LIKE "' + type + '%" AND (CODE LIKE "%' + keywords + '%" OR B_NAME LIKE "%' + keywords + '%") ORDER BY CODE LIMIT ' + recbegin + ',50' , [], loadBulls, ssp.webdb.onError);
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
    ssp.webdb.getBullList($("#searchbulls").val());
	return false;
}


function loadBullsContentBlock () {

		var rowOutput = '<article>';
	    rowOutput += '<section id="login-block">';
		if (typeof acctid == "undefined") rowOutput += '<div class="block-border">';
	    rowOutput += '<div class="block-content"><h1>Bulls<div id="bullkeyword"></div></h1>';
		rowOutput += '<form class="form input-with-button full-width" onsubmit="return ssp.webdb.searchbulls()" >';
        rowOutput += '<p><span class="input-type-text">';
		rowOutput += '<a href="javascript:void(0)" class="button float-right" onclick="ssp.webdb.searchbulls()" title="messages"><img src="img/zoom.png" width="16" height="16"></a>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="searchbulls" id="searchbulls" class="full-width" >';    /*JKS080818->4.03***Auto Fill Search switch*/
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
		rowOutput += '<div id="bulllist"></div>';
		if (typeof acctid == "undefined") rowOutput += '</div>';
		rowOutput += '</div></section></article>';
		if (typeof acctid != "undefined") 
        	$('#lookuplist').html(rowOutput);
		else
        	$('#maincontent').html(rowOutput);
}

function loadBulls(tx, rs) {
	var reccount = 0;
	var currfilter = $('#bullkeyword').html();
	var bullclick = ""
		var rowOutput='';
		if (rs.rows.length == 0) {
            rowOutput += '<p class="message warning">Sorry, no bulls to list.</p>';
        }
        else {
            rowOutput += '<div id="tab-users"><ul class="extended-list">';
			for (var i = 0; i < rs.rows.length ; i++) { 
						bullclick = ((typeof acctid) != undefined) ? 'onclick="ssp.webdb.setSalesItemBull(\'' + rs.rows.item(i).CODE + '\',\'' + rs.rows.item(i).B_NAME + '\',' + rs.rows.item(i).PRICE_1 + ')"' : '';   
						rowOutput += '<li><a href="#" ' + bullclick + '>' ;    
						rowOutput += '<span class="icon"></span>';
						rowOutput += rs.rows.item(i).B_NAME + '<br>';
						rowOutput += '<small>' + rs.rows.item(i).CODE + '</small>';
						rowOutput += '</a>';
						rowOutput += '<ul class="floating-tags">';
						rowOutput += '<li class="tag-info"> ' + rs.rows.item(i).QUANTITY + '</li>';
						rowOutput += '<li class="tag-money"> ' + rs.rows.item(i).PRICE_1 + '</li> ';
						//rowOutput += '<li class="tag-type"> ' + rs.rows.item(i).TYPE + '</li>';
						rowOutput += '</ul>';
						rowOutput += '</li>';        
			}
//    		reccount = Math.max(0,$('#bulllistcount').html()) + i;
//			var listid = (Math.max(0,Math.ceil(reccount/50)));
//			rowOutput += '<div id="bulllist' + listid + '"></div>';
			rowOutput += '</ul>';
//			var rectotal = Math.max(rs.rows.length,$('#bulllisttotal').html());
			rowOutput += '<img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto"> ' + rs.rows.length + ' items  ';
			rowOutput += '</div>'
//			if (reccount != rectotal) moreOutput += '<button type="button" onClick="ssp.webdb.getBulls(\'' + currfilter + '\',' + Math.min((reccount),rectotal) + ');">Show More</button></div>';
        }
       	$('#bulllist').html(rowOutput);
//		$('#bullmore').html(moreOutput);
		$(document.body).applyTemplateSetup();
}




ssp.webdb.getTechRelief = function () {
	
    divContent = '<section id="login-block">';
  	divContent += '<div id="lookuplisttech">';
	divContent += '</div>';
	divContent += '</section>';
	
	$('#maincontent').html(divContent);
	
	ssp.webdb.getTechReliefList('%');
	
}

ssp.webdb.setTechRelief = function (RELIEF_NO) {
    var relief = $("#relief_" + RELIEF_NO).attr("src");
    var meTech = window.localStorage.getItem("ssp_TechID");
    var currenttime = Math.round(new Date().getTime() / 1000);
    if ( relief == "img/star.png") {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql("DELETE FROM tblTechRelief WHERE TechIDMaster ='" + meTech + "' AND TechIDRelief = '" + RELIEF_NO + "'" , [], ssp.webdb.onSucess, ssp.webdb.onError);
        });
        $("#relief_" + RELIEF_NO).attr("src", "img/star-empty.png");
    }
    else{
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('INSERT INTO tblTechRelief (TechIDMaster,TechIDRelief,MODSTAMP,MOD) values (?,?,?,?)', [meTech,RELIEF_NO,currenttime,1], ssp.webdb.onSucess, ssp.webdb.onError);
        });
        $("#relief_" + RELIEF_NO).attr("src", "img/star.png");
    }
}

ssp.webdb.getTechReliefList = function (keywords, recbegin) {
	loadTechReliefContentBlock();
    ssp.webdb.db.transaction(function (tx) {
    	var meTech = window.localStorage.getItem("ssp_TechID");
    	if (typeof recbegin == 'undefined') {
			  // if (keywords != '%') $('#techkeyword').html(keywords);
			   tx.executeSql('SELECT tblTechTransfer.*, tblTechRelief.TechIDMaster FROM tblTechTransfer LEFT JOIN tblTechRelief ON tblTechTransfer.TechID = tblTechRelief.TechIDRelief  WHERE ((TechID LIKE "%' + keywords + '%" OR TransferListName LIKE "%' + keywords + '%") AND TechID <> "' + meTech + '") ORDER BY TechIDMaster DESC,TransferListName', [], loadTechList, ssp.webdb.onError);
    	} else {
				tx.executeSql('SELECT tblTechTransfer.*, tblTechRelief.TechIDMaster FROM tblTechTransfer LEFT JOIN tblTechRelief ON tblTechTransfer.TechID = tblTechRelief.TechIDRelief WHERE ((TechID LIKE "%' + keywords + '%" OR TransferListName LIKE "%' + keywords + '%") AND TechID <> "' + meTech + '") ORDER BY TechIDMaster DESC,TransferListName' + ' LIMIT ' + recbegin + ',50', [], loadTechList, ssp.webdb.onError);
    	}				
		});
}

ssp.webdb.searchtechrelief = function () {
	$('#techlist0').html('<div id="techlist0"></div>');
	$('#techmore').html('<div id="techmore"></div>');
	ssp.webdb.getTechReliefList($("#searchtechs").val());
	return false;
}

function loadTechReliefContentBlock () {
	
//    var rowOutput = "<div id='status-bar'>";
//    rowOutput += "<ul id='status-infos'>";
//    rowOutput += "<li><a href='#' class='button' title='sync' onclick='ssp.webdb.loadTechReliefSync();'><img src='img/arrow-circle.png' width='16' height='16'></a></li>";
//    rowOutput += "</ul>";
//    rowOutput += "</div>";

	var rowOutput = '<article>';
    rowOutput += '<section id="login-block">';
	rowOutput += '<div class="block-border">';
    rowOutput += '<div class="block-content"><h1>Tech Relief List<div id="techkeyword"></div></h1>';
	rowOutput += '<form class="form input-with-button full-width" onsubmit="return ssp.webdb.searchtechs()" >';
    rowOutput += '<p><span class="input-type-text">';
	rowOutput += '<a href="javascript:void(0)" class="button float-right" style="margin-left:10px" onclick="ssp.webdb.searchtechrelief()" title="messages"><img src="img/zoom.png" width="16" height="16"></a>';
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

function loadTechList(tx, rs) {
var reccount = 0;
var meTech = window.localStorage.getItem("ssp_TechID");
var currfilter = $('#techkeyword').html();
	var rowOutput='';
	if (rs.rows.length == 0) {
        rowOutput += '<p class="message warning">Sorry, no techs to list.</p>';
    }
    else {
        rowOutput += '<ul class="extended-list">';
		for (var i = 0; i < rs.rows.length ; i++) { 
					rowOutput += '<li><a href="#" >';
					rowOutput += '<span class="icon"></span>';
					rowOutput += rs.rows.item(i).TransferListName + '<br>';
					rowOutput += '<small>' + rs.rows.item(i).TechID + '</small>';
					rowOutput += '</a>';
					
					if (rs.rows.item(i).TechIDMaster==meTech) { //on
						rowOutput += '<ul class="extended-options"><li>';
						rowOutput += '<img id="relief_' + rs.rows.item(i).TechID + '" width="16" height="16" alt="" src="img/star.png" onclick="ssp.webdb.setTechRelief(' + "'" + rs.rows.item(i).TechID + "'" + ')"/>' + '</span>';
						rowOutput += '</li></ul>';
					} else {  //off
						rowOutput += '<ul class="extended-options"><li>';
						rowOutput += '<img id="relief_' + rs.rows.item(i).TechID + '" width="16" height="16" alt="" src="img/star-empty.png" onclick="ssp.webdb.setTechRelief(' + "'" + rs.rows.item(i).TechID + "'" + ')"/>' + '</span>';
						rowOutput += '</li></ul>';
					}	
					
					rowOutput += '</li>';        
		}
		reccount = Math.max(0,$('#techlistcount').html()) + i;
		//var listid = (Math.max(0,Math.ceil(reccount/50)));
		rowOutput += '<div id="techlist0"></div>';
		rowOutput += '</ul>';
		var rectotal = Math.max(rs.rows.length,$('#techlisttotal').html());
		var moreOutput = '<div id=techmore"><img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto"> <div style="display:inline-block" id="techlistcount">' + reccount + '</div> of <div style="display:inline-block" id="techlisttotal">' + rectotal + '</div> items  ';
		//if (reccount != rectotal) moreOutput += '<button type="button" onClick="ssp.webdb.getTechList(\'' + currfilter + '\',' + Math.min((reccount),rectotal) + ');">Show More</button></div>';
    }
   	$('#techlist0').html(rowOutput);
	$('#techmore').html(moreOutput);
	$(document.body).applyTemplateSetup();
	
	
	$('#searchtechs').keyup(function() {
	    delay(function(){
	    	ssp.webdb.searchtechrelief();
	    }, 500 );
	});
	
	

}








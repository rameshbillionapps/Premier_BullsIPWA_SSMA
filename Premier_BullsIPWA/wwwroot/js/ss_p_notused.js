ssp.webdb.getCustomers = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM NETBOOK_CUSTOMERS ORDER BY ACCOUNT', [], loadCustomers, ssp.webdb.onError);
    });
}

ssp.webdb.getCustomersFav = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM NETBOOK_CUSTOMERS WHERE FAV = 1 ORDER BY ACCOUNT', [], loadCustomers, ssp.webdb.onError);
    });
}

ssp.webdb.getCustomersNotes = function (PKIDCUSTOMER) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblCustomerNotes WHERE PKIDCUSTOMER = "' + PKIDCUSTOMER  + '" ORDER BY TIMESTAMP DESC', [], loadCustomerNotes, ssp.webdb.onError);
    });
}

ssp.webdb.getCustomerByID = function (ACCOUNT) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM NETBOOK_CUSTOMERS WHERE ACCOUNT = "' + ACCOUNT + '"', [], loadCustomerDetail, ssp.webdb.onError);
    });
}

ssp.webdb.addCustomerNote = function (ACCOUNT) {
    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);
        tx.executeSql('INSERT INTO tblCustomerNotes (PKIDTECH, PKIDCUSTOMER,NOTE,TIMESTAMP) values (?,?,?,?)', ['Ron', ACCOUNT, $("#txtAddNote").val(), currenttime], ssp.webdb.getCustomersNotes(ACCOUNT), ssp.webdb.onError);
    });
}

ssp.webdb.editCustomerNote = function () {
    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);
        tx.executeSql('UPDATE tblCustomerNotes SET NOTE = ?, TIMESTAMP = ? WHERE PKID = ?', [$('#txtEditNote').val(), currenttime, $('#txtEditNotePKID').html()], ssp.webdb.getCustomersNotes($('#acctid').html()), ssp.webdb.onError);
    });
}

ssp.webdb.deleteCustomerNote = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('DELETE FROM tblCustomerNotes WHERE PKID = ?', [$('#txtEditNotePKID').html()], ssp.webdb.getCustomersNotes($('#acctid').html()), ssp.webdb.onError);
    });
}

ssp.webdb.getCustomerNoteByID = function (PKID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblCustomerNotes WHERE PKID = ' + PKID , [], loadEditNote, ssp.webdb.onError);
    });
}

ssp.webdb.setCustomerFav = function (ACCOUNT) {
    var fav = $("#fav_" + ACCOUNT).attr("src");
    if ( fav == "/img/valid.gif") {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('UPDATE NETBOOK_CUSTOMERS SET FAV = 0 WHERE ACCOUNT = "' + ACCOUNT + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
        });
        $("#fav_" + ACCOUNT).attr("src", "/img/add.png");
    }
    else{
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('UPDATE NETBOOK_CUSTOMERS SET FAV = 1 WHERE ACCOUNT = "' + ACCOUNT + '"', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        });
        $("#fav_" + ACCOUNT).attr("src", "/img/valid.gif");
    }
}


ssp.webdb.search = function(table, keywords) {
	ssp.webdb.db.transaction(function(tx) {
	       tx.executeSql('SELECT * FROM ' + table + ' WHERE ACCOUNT LIKE "%' + keywords + '%" OR NAME1 LIKE "%' + keywords + '%"', [], loadCustomers, ssp.webdb.onError);
	});
}

ssp.webdb.setCustomerCount = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) AS cntCustomer FROM NETBOOK_CUSTOMERS', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    $('#sideCustomerCount').html(rs.rows.item(0).cntCustomer);
                }
            }, ssp.webdb.onError);
    });
    }

$(document).ready(function () {


//    $("#btnSync").click(function () {
//        ssp.webdb.syncDB();
//    });

    if (window.localStorage.getItem('ssp_project_installed')) {
        ssp.webdb.open();
        ssp.webdb.createTables();
        ssp.webdb.getCustomersFav();
    } else {
        alert('Need to Install Database.');
        window.localStorage.setItem('ssp_project_dbsize', 5);
        window.localStorage.setItem('ssp_project_dbname', randomString());
        ssp.webdb.open();
        ssp.webdb.createTables();
        window.localStorage.setItem('ssp_project_installed', 1);
        window.localStorage.setItem('ssp_project_version', '1.1');
        location.reload(true);
        alert('database installed - need to sync');
    }

    ssp.webdb.setMileageCount()
    ssp.webdb.setCustomerCount()
    ssp.webdb.setTimesheetCount()
    ssp.webdb.setBullsCount()
    ssp.webdb.setSuppliesCount()

});

function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 16;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

function search() {
    //ssp.webdb.search(window.localStorage.getItem('ssp_project_currenttab'), $("#search").val());
    ssp.webdb.search('NETBOOK_CUSTOMERS', $("#search").val())
}

function loadCustomers(tx, rs) {
    
    
        var rowOutput = '<section class="main-section grid_7"><div class="main-content grid_7 alpha"><header><ul class="action-buttons clearfix fr">';
        rowOutput += '<li><a href="documentation/index.html" class="button button-gray no-text add" rel="#overlay"><span class="add"></span>Add Customer</a></li>';
        rowOutput += '</ul><h2>Customer List</h2></header>';
        rowOutput += '<section><ul id="contacts" class="listing list-view clearfix">';
        if (rs.rows.length == 0) {
            rowOutput += '<section class="container_6 clearfix"><div class="grid_6"><div class="message info"><h3>Information</h3><p>You haven\'t assigned any favorite customers. Please begin to search and add customers to your favorite list by clicking on the Plus Sign next to their name.</p></div></div></section>';
        }
        else {
            for (var i = 0; i < rs.rows.length; i++) { 

                rowOutput += '<li class="contact clearfix"><div class="avatar"><img src="img/user.png" /></div>';
                rowOutput += '<span class="timestamp">' + (rs.rows.item(i).FAV == 1 ? ('<img id="fav_' + rs.rows.item(i).ACCOUNT + '" width="16" height="16" alt="" src="/img/valid.gif" onclick="ssp.webdb.setCustomerFav(' + "'" + rs.rows.item(i).ACCOUNT + "'" + ')"/>') : ('<img id="fav_' + rs.rows.item(i).ACCOUNT + '" width="16" height="16" alt="" src="/img/add.png" onclick="ssp.webdb.setCustomerFav(' + "'" + rs.rows.item(i).ACCOUNT + "'" + ')"/>')) + '</span>';
                rowOutput += '<a href="#" class="name"><span onclick="ssp.webdb.getCustomerByID(' + "'" + rs.rows.item(i).ACCOUNT + "'" + ');">' + rs.rows.item(i).NAME1 + '</span></a>';
                rowOutput += '<div class="entry-meta">' + rs.rows.item(i).ACCOUNT + '</div></li>';
            }
            rowOutput += '</ul></section></div></section>';

        }
        $('#custlist').html(rowOutput);
}

function loadCustomerDetail(tx, rs) {
    var rowOutput = '<section class="main-section grid_7"><div class="main-content grid_4 alpha"><header><ul class="action-buttons clearfix fr">';
    rowOutput += '<button class="button button-gray" onclick="ssp.webdb.getSales(' + "'" + rs.rows.item(0).ACCOUNT + "'" + ');"><span class="add"></span>Add Order</button>';
    rowOutput += '</ul><h2>' + rs.rows.item(0).NAME1 + ' - <div id="acctid">' + rs.rows.item(0).ACCOUNT + '</div></header>';
    rowOutput += '<section>';
    rowOutput += '<h3>Add Note</h3>';
    //rowOutput += '<form method="post" style="width: 400px;">';
    rowOutput += '<textarea id="txtAddNote" class="markItUpTextarea" style="height: 80px; width: 100%;"></textarea>';
    rowOutput += '<button class="fr button button-gray" onclick="ssp.webdb.addCustomerNote(' + "'" +  rs.rows.item(0).ACCOUNT  + "'" + ');">Add Note</button>';
    //rowOutput += '</form>';
    rowOutput += '<div class="clear"></div>';
    rowOutput += '<div id="notelist"></div>';
    rowOutput += '</section></div>';
    rowOutput += '<div class="preview-pane grid_3 omega">';
    rowOutput += '<div class="content">';
    rowOutput += '<h3>Contact Information</h3>';
    rowOutput += '<ul class="profile-info">';
    rowOutput += '<li class="email">johndoe@somecompany.com<span>email</span></li>';
    rowOutput += '<li class="phone">(555) 555-HOME<span>home</span></li>';
    rowOutput += '<li class="mobile">(555) 555-MOBI<span>mobile</span></li>';
    rowOutput += '<li class="phone">(555) 555-WORK<span>work</span></li>';
    rowOutput += '</ul>';
    rowOutput += '<h3>Order History</h3>';
    rowOutput += 'None so far. <a href="#">Add an Order</a>';
    rowOutput += '<h3>Additional info</h3>';
    rowOutput += '<ul class="profile-info">';
    rowOutput += '<li class="calendar-day">January 1, 1991<span>birthday</span></li>';
    rowOutput += '<li class="calendar-day">December 21, 2010<span>hire date</span></li>';
    rowOutput += '<li class="house">123 Some Street, LA<span>home address</span></li>';
    rowOutput += '<li class="building">456 Some Street, LA<span>office address</span></li>';
    rowOutput += '</ul>';
    rowOutput += '</div>';
    rowOutput += '<div class="preview">';
    rowOutput += '</div>';
    rowOutput += '</div></section>';

    $('#custlist').html(rowOutput);
    $('.markItUpTextarea').markItUp(mySettings, { root: 'markitup/skins/simple/' });
    ssp.webdb.getCustomersNotes(rs.rows.item(0).ACCOUNT);

}

function loadCustomerNotes(tx, rs) {

    var rowOutput = '<h3>History</h3>';
    if (rs.rows.length == 0) {
        //rowOutput += '<li class="note">';
        //rowOutput += '<a href="" class="more">&raquo;</a>';
        rowOutput += '<p>None so far.</p>'; //</li>';
    }
    else {
        rowOutput += '<ul class="listing list-view">';
        for (var i = 0; i < rs.rows.length; i++) {
            var note_date = new Date(rs.rows.item(i).TIMESTAMP * 1000);
            var note_html = rs.rows.item(i).NOTE.replace(/\n\r?/g, '<br />'); 
            rowOutput += '<li class="note">';
            rowOutput += '<a href="editnote.html" class="more" id="' + rs.rows.item(i).PKID + '">&raquo;</a>';
            rowOutput += '<span class="timestamp">' + note_date.toDateString()  + '</span>';
            rowOutput += '<p>' + note_html + '</p>';
            rowOutput += '<div class="entry-meta">';
            rowOutput += 'Posted by ' + rs.rows.item(i).PKIDTECH;
            rowOutput += '</div>';
            rowOutput += '</li>';
        }
    }
    rowOutput += '</ul>';
    $('#notelist').html(rowOutput);
    $('#txtAddNote').val("");

    // preview pane setup
    $('.list-view > li').click(function () {
        var url = $(this).find('.more').attr('href');
        var currid = $(this).find('.more').attr('id')
        if (!$(this).hasClass('current')) {
            $('.preview-pane .preview').animate({ left: "-375px" }, 300, function () {
                $(this).animate({ left: "-22px" }, 500).html('<img src="img/ajax-loader.gif" />').load(url, function () { ssp.webdb.getCustomerNoteByID(currid); });
            });
        } else {
            $('.preview-pane .preview').animate({ left: "-375px" }, 300);
        }
        $(this).toggleClass('current').siblings().removeClass('current');
        return false;
    });

    $('.list-view > li a:not(.more)').click(function (e) { e.stopPropagation(); });

    $('.preview-pane .preview .close').live('click', function () {
        $('.preview-pane .preview').animate({ left: "-375px" }, 300);
        $('.list-view li').removeClass('current');
        return false;
    });
    // preview pane setup end


}

function loadEditNote(tx, rs) {
    $('#txtEditNote').val(rs.rows.item(0).NOTE);
    $('#txtEditNotePKID').html(rs.rows.item(0).PKID);
}

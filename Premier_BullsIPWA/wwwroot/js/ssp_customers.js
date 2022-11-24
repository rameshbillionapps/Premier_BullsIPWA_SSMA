ssp.webdb.getCustomers = function (keywords, recbegin) {
    loadCustomersContentBlock();
    ssp.webdb.getCustomersList(keywords, recbegin);
}

ssp.webdb.getCustomersList = function (keywords, recbegin) {
    if (keywords != '%') $('#customerkeyword').html(keywords);
    ssp.webdb.db.transaction(function (tx) {

        var addrwhere = (window.localStorage.getItem("ssp_addrsearch") == 1) ? ' OR tblCustomers.ADDR2 LIKE "%' + keywords + '%" OR tblCustomers.CITY LIKE "%' + keywords + '%"' : ' ';
        if (window.localStorage.getItem("ssp_custsalesbubble") == 1) {
            if (typeof recbegin == 'undefined') {
                //[alaSQL] Added tblCustomers.CITY,tblCustomers.STATE in GROUP BY Clause
                tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV, COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE tblCustomers.ACCT_NO LIKE "%' + keywords + '%" OR tblCustomers.NAME LIKE "%' + keywords + '%" ' + addrwhere + ' GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY ' + ((isNaN(keywords) || keywords.length == 0) ? 'tblCustomers.NAME' : 'tblCustomers.ACCT_NO'), [], loadCustomers, ssp.webdb.onError);
            } else {
                //[alaSQL] Added tblCustomers.CITY,tblCustomers.STATE in GROUP BY Clause
                tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV, COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE tblCustomers.ACCT_NO LIKE "%' + keywords + '%" OR tblCustomers.NAME LIKE "%' + keywords + '%" ' + addrwhere + ' GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY ' + ((isNaN(keywords) || keywords.length == 0) ? 'tblCustomers.NAME' : 'tblCustomers.ACCT_NO') + ' LIMIT ' + CUSTPAGING + ' OFFSET ' + recbegin, [], loadCustomers, ssp.webdb.onError);
            }
        } else {
            if (typeof recbegin == 'undefined') {
                tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE tblCustomers.ACCT_NO LIKE "%' + keywords + '%" OR tblCustomers.NAME LIKE "%' + keywords + '%" ' + addrwhere + '  ORDER BY ' + ((isNaN(keywords) || keywords.length == 0) ? 'tblCustomers.NAME' : 'tblCustomers.ACCT_NO'), [], loadCustomers, ssp.webdb.onError);
            } else {
                tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE tblCustomers.ACCT_NO LIKE "%' + keywords + '%" OR tblCustomers.NAME LIKE "%' + keywords + '%" ' + addrwhere + ' ORDER BY ' + ((isNaN(keywords) || keywords.length == 0) ? 'tblCustomers.NAME' : 'tblCustomers.ACCT_NO') + ' LIMIT ' + CUSTPAGING + ' OFFSET ' + recbegin, [], loadCustomers, ssp.webdb.onError);
            }
        }

    });
}

ssp.webdb.getCustomersFav = function () {
    ssp.webdb.db.transaction(function (tx) {
        loadCustomersContentBlock();
        if (window.localStorage.getItem("ssp_custsalesbubble") == 1) {
            //[alaSQL] Added tblCustomers.CITY,tblCustomers.STATE in GROUP BY Clause
            tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV,COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE FAV=1 GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY FAV DESC,NAME ', [], loadCustomers, ssp.webdb.onError);
        } else {
            tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE FAV=1 ORDER BY FAV DESC,NAME ', [], loadCustomers, ssp.webdb.onError);
        }
    });
}

ssp.webdb.getCustomersOrders = function (PKIDCUSTOMER) {
    /*alaSQL:
     *     1.Added min(a.SIDATO) in SELECT statement
     *     2.Added a.SIINVO in GROUP BY clause
     *          GROUP BY a.SIORNM, a.SIINVO 
     *     3. Added min(a.SIDATO) in ORDER BY clause
     *          ORDER BY min(a.SIDATO) DESC
     *     4. Using SUM(nitro.nitrosold) instead of SUM(NITROSOLD). It's case sensitive and needs table name also.
    */
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT SIORNM, SUM(SIQTY) AS nitrosold FROM tblSales WHERE SICOD = "N2Fill" GROUP BY SIORNM', [], nitro => {
            tx.exec('SELECT COUNT(*) AS ORDERCOUNTITEM, SUM(SIPRC*SIQTY) AS ORDERTOTAL, SUM(SIARM) AS ARMTOTAL, a.SIORNM,a.SIINVO,min(a.SIDATO) as SIDATO,SUM(MOD) AS MODIFIED,SUM(nitro.nitrosold) AS NITROCOUNT,SUM(SIPOA) AS POATOTAL  FROM tblSales a LEFT JOIN ? nitro ON a.SIORNM  = nitro.SIORNM WHERE SIACT = "' + PKIDCUSTOMER + '" GROUP BY a.SIORNM, a.SIINVO ORDER BY min(a.SIDATO) DESC, a.SIORNM DESC', [nitro], loadCustomerOrders)
        }, ssp.webdb.onError);
    });
}

ssp.webdb.getCustomersNotes = function (PKIDCUSTOMER) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblCustomerNotes WHERE ACCT_NO = "' + PKIDCUSTOMER + '" ORDER BY MODSTAMP DESC', [], loadCustomerNotes, ssp.webdb.onError);
    });
}

ssp.webdb.getCustomersAR = function (PKIDCUSTOMER) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblCustomersAR WHERE ACCT_NO = "' + PKIDCUSTOMER + '"', [], res => res.length && loadCustomerAR(res), ssp.webdb.onError);
    });
}

ssp.webdb.getCustomerByID = function (ACCOUNT) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT tblCustomers.*, COUNT(distinct tblCustomerNotes.PKIDDroid) AS NUMNOTES  FROM tblCustomers LEFT JOIN tblCustomerNotes ON tblCustomers.ACCT_NO = tblCustomerNotes.ACCT_NO WHERE tblCustomers.ACCT_NO = "' + ACCOUNT + '"', [], loadCustomerDetail, ssp.webdb.onError);
    });
}

//JKS101817***Added SP7=custnitrodays to table values.***
//JKS100416***Added SP6=custnote to table values.***
//JKS100316***Changed SP3=custbreed to BREED1=custbreed1...Added BREED2=custbreed2 and BREED3=custbreed3 to table values.***
//JKS091416***Added SP5...Swapped SP2 value with SP5...Now SP2=contname & SP5=custherd.***
//JKS090716***Added SP1=businame, SP2=custherd, SP3=custbreed, & SP4=custroute for New Customer Function.***
ssp.webdb.addCustomer = function () {
    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);

        var custacct = $('#custacct').html();
        var custname = $('#custname').val();


        if (!custacct || custacct.length == 0) {
            $('#login-block').removeBlockMessages().blockMessage('Error no account number assigned.', { type: 'error' });
        }
        else if (!custname || custname.length == 0) {
            $('#login-block').removeBlockMessages().blockMessage('Please enter a name.', { type: 'error' });
        }
        else {
            var customersDataStructure = { ACTIVE: null, TYPE_AREA: null, SP1: null, ACCT_NO: null, NAME: null, ADDR1: null, ADDR2: null, CITY: null, STATE: null, SP2: null, ZIP: null, BREED1: null, BREED2: null, BREED3: null, TYPE: null, SP3: null, TECH_NO: null, MEMBER: null, DISC1: null, DISC2: null, W_O: null, SP4: null, L_PMT_M: null, SP5: null, L_PMT_Y: null, SP6: null, L_PUR_M: null, SP7: null, L_PUR_Y: null, SP8: null, SP_ACCT: null, SP9: null, SP_RATE: null, SL_AREA: null, SP10: null, COUNTY: null, TAXABLE: null, MOD: null, MODSTAMP: null, FAV: null }

            var currentData = { ACCT_NO: $('#custacct').html(), NAME: $('#custname').val(), SP1: $('#businame').val(), SP2: $('#contname').val(), ADDR1: $('#custaddr').val(), ADDR2: $('#custaddr2').val(), CITY: $('#custcity').val(), STATE: $('#custstate').val(), ZIP: $('#custzip').val(), SP5: $('#custherd').val(), BREED1: $('#custbreed1').val(), BREED2: $('#custbreed2').val(), BREED3: $('#custbreed3').val(), SP4: $('#custroute').val(), SP6: $('#custnote').val(), SP7: $('#custnitrodays').val(), TECH_NO: window.localStorage.getItem("ssp_TechID"), MEMBER: $('#custemail').val(), TAXABLE: "00000:00000", MOD: 1, MODSTAMP: currenttime }

            tx.exec('INSERT INTO tblCustomers VALUES ?', [{ ...customersDataStructure, ...currentData }], ssp.webdb.getCustomersFav, ssp.webdb.onError); //[ala] Using customersDataStructure to avoid the undefined values error when POSTing the data to backend. Im WebSQL after inserting, rest object property remains null whereas in alasql it remains undefined.
            //tx.exec('INSERT INTO tblCustomers (ACCT_NO,NAME,SP1,SP2,ADDR1,ADDR2,CITY,STATE,ZIP,SP5,BREED1,BREED2,BREED3,SP4,SP6,SP7,TECH_NO,MEMBER,TAXABLE,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [$('#custacct').html(), $('#custname').val(), $('#businame').val(), $('#contname').val(), $('#custaddr').val(), $('#custaddr2').val(), $('#custcity').val(), $('#custstate').val(), $('#custzip').val(), $('#custherd').val(), $('#custbreed1').val(), $('#custbreed2').val(), $('#custbreed3').val(), $('#custroute').val(), $('#custnote').val(), $('#custnitrodays').val(), window.localStorage.getItem("ssp_TechID"), $('#custemail').val(), "00000:00000", 1, currenttime], ssp.webdb.getCustomersFav, ssp.webdb.onError);
        }
    });
    return false;
}

ssp.webdb.addCustomerNote = function (ACCOUNT) {
    var txtAddNote = $('#txtAddNote').val();
    if (txtAddNote.trim())
        ssp.webdb.db.transaction(function (tx) {
            var currenttime = Math.round(new Date().getTime() / 1000);
            tx.exec('INSERT INTO tblCustomerNotes (PKIDDroid, TECH_NO,ACCT_NO,NOTE,MODSTAMP,MOD) values (?,?,?,?,?,?)', [currenttime + "." + window.localStorage.getItem("ssp_TechID"), window.localStorage.getItem("ssp_TechID"), ACCOUNT, txtAddNote, currenttime, 1], () => ssp.webdb.getCustomersNotes(ACCOUNT));
        });
    return false;
}

ssp.webdb.deleteCustomerNote = function (PKID, DelID) {
    if ($("#delnote" + DelID).attr("class") == "button red") {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec("DELETE FROM tblCustomerNotes WHERE PKIDDroid = ?", [PKID], res => ssp.webdb.getCustomersNotes($('#acctid').html()), ssp.webdb.onError);
        });
    } else {
        $("#delnote" + DelID).removeClass("button").addClass("button red");
        $("#delnote" + DelID).html($("#delnote" + DelID).html() + 'sure?');
    }




}

ssp.webdb.deleteCustomer = function (PKID) {

    if ($("#del" + PKID).attr("class") == "button red") {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('DELETE FROM tblCustomers WHERE ACCT_NO = ? ', [PKID], () => ssp.webdb.getCustomers(), ssp.webdb.onError);
        });
    } else {
        $("#del" + PKID).removeClass("button").addClass("button red");
        $("#del" + PKID).html($("#del" + PKID).html() + 'sure?');
    }

}

ssp.webdb.setCustomerFav = function (ACCOUNT) {
    var fav = $("#fav_" + ACCOUNT).attr("src");
    var currenttime = Math.round(new Date().getTime() / 1000);
    if (fav == "img/star.png") {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('UPDATE tblCustomers SET FAV = 0,MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + ACCOUNT + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
        });
        $("#fav_" + ACCOUNT).attr("src", "img/starEmpty.png");
    }
    else {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('UPDATE tblCustomers SET FAV = 1,MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + ACCOUNT + '"', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        });
        $("#fav_" + ACCOUNT).attr("src", "img/star.png");
    }
}

ssp.webdb.searchCustomers = function (buttonpressed, searchstring) {
    if (typeof searchstring == 'undefined') {
        $('#customerlist0').html('<div id="customerlist0"></div>');
        $('#customermore').html('<div id="customermore"></div>');
        if (buttonpressed) {
            window.localStorage.setItem('ssp_custsearch_5', window.localStorage.getItem('ssp_custsearch_4'));
            window.localStorage.setItem('ssp_custsearch_4', window.localStorage.getItem('ssp_custsearch_3'));
            window.localStorage.setItem('ssp_custsearch_3', window.localStorage.getItem('ssp_custsearch_2'));
            window.localStorage.setItem('ssp_custsearch_2', window.localStorage.getItem('ssp_custsearch_1'));
            window.localStorage.setItem('ssp_custsearch_1', $("#searchcustomers").val());
            loadCustomerContentBlockHeader();
        }
        ssp.webdb.getCustomersList($("#searchcustomers").val());
    } else {
        $("#menu").toggleClass("active");
        loadCustomersContentBlock();
        ssp.webdb.getCustomersList(searchstring);
        $("#searchcustomers").val(searchstring);
    }
    return false;
}

ssp.webdb.setCustomerCount = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT COUNT(*) AS cntCustomer FROM tblCustomers', [],
            function (rs) {
                if (rs.length > 0) {
                    $('#sideCustomerCount').html(rs[0].cntCustomer);
                }
            }, ssp.webdb.onError);
    });
}

//JKS091516***Business Name Edit Function***	
ssp.webdb.modCustomerBusiness = function (business) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerBusiness" id="ModCustomerBusiness" value="' + business + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerBusiness();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerBusiness").html(rowOutput);
}

//JKS091516***Business Name Save Edit Function***
ssp.webdb.SaveCustomerBusiness = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var businessaddr = $('#ModCustomerBusiness').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP1 = "' + businessaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerBusiness').html(businessaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustbusiness" onclick="ssp.webdb.modCustomerBusiness(\'' + businessaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091516***Contact Name Edit Function***	
ssp.webdb.modCustomerContact = function (contact) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerContact" id="ModCustomerContact" value="' + contact + '" >';     /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerContact();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerContact").html(rowOutput);
}

//JKS091516***Contact Name Save Edit Function***
ssp.webdb.SaveCustomerContact = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var contactaddr = $('#ModCustomerContact').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP2 = "' + contactaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerContact').html(contactaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustcontact" onclick="ssp.webdb.modCustomerContact(\'' + contactaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091516***Phone Edit Function***	
ssp.webdb.modCustomerPhone = function (phone) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerPhone" id="ModCustomerPhone" value="' + phone + '" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerPhone();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerPhone").html(rowOutput);
}

//JKS091516***Phone Save Edit Function***
ssp.webdb.SaveCustomerPhone = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var phoneaddr = $('#ModCustomerPhone').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET ADDR1 = "' + phoneaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerPhone').html(phoneaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustphone" onclick="ssp.webdb.modCustomerPhone(\'' + phoneaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091316***Address Edit Function***	
ssp.webdb.modCustomerStreet = function (street) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerStreet" id="ModCustomerStreet" value="' + street + '" >';        /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerStreet();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerStreet").html(rowOutput);
}

//JKS091316***Address Save Edit Function***
ssp.webdb.SaveCustomerStreet = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var streetaddr = $('#ModCustomerStreet').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET ADDR2 = "' + streetaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerStreet').html(streetaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcuststreet" onclick="ssp.webdb.modCustomerStreet(\'' + streetaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091316***City Edit Function***	
ssp.webdb.modCustomerCity = function (city) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerCity" id="ModCustomerCity" value="' + city + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerCity();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerCity").html(rowOutput);
}

//JKS091316***City Save Edit Function***
ssp.webdb.SaveCustomerCity = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var cityaddr = $('#ModCustomerCity').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET CITY = "' + cityaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerCity').html(cityaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustcity" onclick="ssp.webdb.modCustomerCity(\'' + cityaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091316***State Edit Function***	
ssp.webdb.modCustomerState = function (state) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerState" id="ModCustomerState" value="' + state + '" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerState();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerState").html(rowOutput);
}

//JKS091316***State Save Edit Function***
ssp.webdb.SaveCustomerState = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var stateaddr = $('#ModCustomerState').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET STATE = "' + stateaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerState').html(stateaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcuststate" onclick="ssp.webdb.modCustomerState(\'' + stateaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091316***Zip Edit Function***	
ssp.webdb.modCustomerZip = function (zip) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerZip" id="ModCustomerZip" value="' + zip + '" >';     /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerZip();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerZip").html(rowOutput);
}

//JKS091316***Zip Save Edit Function***
ssp.webdb.SaveCustomerZip = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var zipaddr = $('#ModCustomerZip').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET ZIP = "' + zipaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerZip').html(zipaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustzip" onclick="ssp.webdb.modCustomerZip(\'' + zipaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

ssp.webdb.modCustomerEmail = function (email) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerEmail" id="ModCustomerEmail" value="' + email + '" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerEmail();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerEmail").html(rowOutput);
}

ssp.webdb.SaveCustomerEmail = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var emailaddr = $('#ModCustomerEmail').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET MEMBER = "' + emailaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerEmail').html(emailaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustemail" onclick="ssp.webdb.modCustomerEmail(\'' + emailaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS090816***Herd Edit Function***	
ssp.webdb.modCustomerHerd = function (herd) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerHerd" id="ModCustomerHerd" value="' + herd + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerHerd();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerHerd").html(rowOutput);
}

//JKS090816***Herd Save Edit Function***
ssp.webdb.SaveCustomerHerd = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var herdaddr = $('#ModCustomerHerd').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP5 = "' + herdaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerHerd').html(herdaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustherd" onclick="ssp.webdb.modCustomerHerd(\'' + herdaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS090816***Breed1 Edit Function***
ssp.webdb.modCustomerBreed1 = function (breed1) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerBreed1" id="ModCustomerBreed1" value="' + breed1 + '" >';        /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerBreed1();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerBreed1").html(rowOutput);
}

//JKS090816***Breed1 Save Edit Function***
ssp.webdb.SaveCustomerBreed1 = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var breed1addr = $('#ModCustomerBreed1').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET BREED1 = "' + breed1addr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerBreed1').html(breed1addr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustbreed1" onclick="ssp.webdb.modCustomerBreed1(\'' + breed1addr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS100316***Breed2 Edit Function***
ssp.webdb.modCustomerBreed2 = function (breed2) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerBreed2" id="ModCustomerBreed2" value="' + breed2 + '" >';        /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerBreed2();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerBreed2").html(rowOutput);
}

//JKS100316***Breed2 Save Edit Function***
ssp.webdb.SaveCustomerBreed2 = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var breed2addr = $('#ModCustomerBreed2').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET BREED2 = "' + breed2addr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerBreed2').html(breed2addr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustbreed2" onclick="ssp.webdb.modCustomerBreed2(\'' + breed2addr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS100316***Breed3 Edit Function***
ssp.webdb.modCustomerBreed3 = function (breed3) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerBreed3" id="ModCustomerBreed3" value="' + breed3 + '" >';        /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerBreed3();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerBreed3").html(rowOutput);
}

//JKS100316***Breed3 Save Edit Function***
ssp.webdb.SaveCustomerBreed3 = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var breed3addr = $('#ModCustomerBreed3').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET BREED3 = "' + breed3addr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerBreed3').html(breed3addr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustbreed3" onclick="ssp.webdb.modCustomerBreed3(\'' + breed3addr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS090816***Route Edit Function***	
ssp.webdb.modCustomerRoute = function (route) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerRoute" id="ModCustomerRoute" value="' + route + '" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerRoute();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerRoute").html(rowOutput);
}

//JKS090816***Route Save Edit Function***
ssp.webdb.SaveCustomerRoute = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var routeaddr = $('#ModCustomerRoute').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP4 = "' + routeaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerRoute').html(routeaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustroute" onclick="ssp.webdb.modCustomerRoute(\'' + routeaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS100416***Customer Note Edit Function***	
ssp.webdb.modCustomerNote = function (cnote) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerNote" id="ModCustomerNote" value="' + cnote + '" >';     /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerNote();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerNote").html(rowOutput);
}

//JKS100416***Customer Note Save Edit Function***
ssp.webdb.SaveCustomerNote = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var noteaddr = $('#ModCustomerNote').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP6 = "' + noteaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerNote').html(noteaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnote" onclick="ssp.webdb.modCustomerNote(\'' + noteaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS101817***Customer Nitrogen Days Edit Function***	
ssp.webdb.modCustomerNitroDays = function (cnitrodays) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerNitroDays" id="ModCustomerNitroDays" value="' + cnitrodays + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerNitroDays();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerNitroDays").html(rowOutput);
}

//JKS101817***Customer Nitrogen Days Save Edit Function***
ssp.webdb.SaveCustomerNitroDays = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var nitrodaysaddr = $('#ModCustomerNitroDays').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP7 = "' + nitrodaysaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerNitroDays').html(nitrodaysaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnitrodays" onclick="ssp.webdb.modCustomerNitroDays(\'' + nitrodaysaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

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

function loadCustomersContentBlock() {

    loadCustomerContentBlockHeader();

    var rowOutput = '<article>';
    rowOutput += '<div class="block-border"><div class="block-content">';
    rowOutput += '<h1><a href="javascript:void(0)" class="float-right" onclick="loadCustomerNew();"><img src="img/plusCircleBlue.png" width="16" height="16"></a>Customer List<div id="customerkeyword"></div></h1>';
    rowOutput += '<form class="form input-with-button full-width" onsubmit="return ssp.webdb.searchCustomers(true)" >';
    rowOutput += '<p><span class="input-type-text">';
    rowOutput += '<a href="javascript:void(0)" class="button float-right" onclick="ssp.webdb.searchCustomers(true)" title="messages"><img src="img/zoom.png" width="16" height="16"></a>';
    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="searchcustomers" id="searchcustomers" class="full-width" ';     /*JKS080818->4.03***Auto Fill Search switch*/
    if ($("#searchcustomers").val() != undefined) rowOutput += 'value="' + $("#searchcustomers").val() + '"';
    rowOutput += '>';
    rowOutput += '</p></span>';
    rowOutput += '</form>';
    rowOutput += '</br>';
    rowOutput += '<div id="customerlist0"></div><div id="customermore"></div>';
    if (typeof acctid == "undefined") rowOutput += '</div>';
    rowOutput += '</div></section></article>';
    $('#maincontent').html(rowOutput);

}

function loadCustomerContentBlockHeader() {

    var cs1 = window.localStorage.getItem('ssp_custsearch_1');
    var cs2 = window.localStorage.getItem('ssp_custsearch_2');
    var cs3 = window.localStorage.getItem('ssp_custsearch_3');
    var cs4 = window.localStorage.getItem('ssp_custsearch_4');
    var cs5 = window.localStorage.getItem('ssp_custsearch_5');
    var homeHeader = 'PSS';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
            homeHeader = 'PSS';
            break;
        case 'ssc':
            homeHeader = 'SSC';
            break;
        case 'ps':
            homeHeader = 'SSMA';
            break;
        case 'ecss':
            homeHeader = 'CS';
            break;
        //JKS112216***Added MNSS to header***
        case 'mnss':
            homeHeader = 'MNSS';
            break;
    }
    var header = "<header id='mainheader'><h1>" + homeHeader + " - " + ((window.localStorage.getItem("ssp_techfunc") == 1) ? "Tech" : "ASM") + "</h1></header>";
    header += "<a href='javascript:void(0);' onclick='location.reload();' id='home'>Home</a>";
    header += '<div id="menu">';
    header += '<a href="#">Searches</a>';
    header += '<ul>';
    if (cs1 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs1 + "'" + ');">' + cs1 + '</a></li>';
    if (cs2 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs2 + "'" + ');">' + cs2 + '</a></li>';
    if (cs3 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs3 + "'" + ');">' + cs3 + '</a></li>';
    if (cs4 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs4 + "'" + ');">' + cs4 + '</a></li>';
    if (cs5 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs5 + "'" + ');">' + cs5 + '</a></li>';
    header += '</ul>';
    header += '</div>';
    $('#headercontent').html(header);
    var menu = $('#menu > ul'),
        menuHeight = menu.height(),
        currentMenu = menu;

    // Open
    $('#menu > a').click(function (event) {
        event.preventDefault();

        var parent = $(this).parent();
        if (parent.hasClass('active')) {
            menu.css({
                display: '',
                height: menuHeight
            });
        }
        parent.toggleClass('active');
    });


}

function loadCustomers(rs) {

    var reccount = 0;
    var currtechid = window.localStorage.getItem("ssp_TechID");
    var currfilter = $('#customerkeyword').html();
    var rowOutput = '';
    if (rs.length == 0) {
        // rowOutput += '<p class="message warning">Sorry, no customers found.</p>';
    }
    else {
        rowOutput += '<div id="tab-users"><ul class="extended-list">';
        for (var i = 0; i < Math.min(CUSTPAGING, rs.length); i++) {
            rowOutput += '<li><a href="#" onclick="ssp.webdb.getCustomerByID(' + "'" + rs[i].ACCT_NO + "'" + ');">';
            rowOutput += '<span class="icon"></span>';
            rowOutput += rs[i].NAME + '<br>';
            rowOutput += '<small>' + rs[i].ADDR2 + '</small>';
            rowOutput += '<br><small>' + rs[i].CITY + ', ' + rs[i].STATE + '</small>';
            rowOutput += '<div><small><strong>' + rs[i].ACCT_NO + '</strong></small></div>';
            rowOutput += '</a>';
            if (rs[i].TECH_NO.toUpperCase() == currtechid.toUpperCase()) {
                rowOutput += '<ul class="extended-options"><li>';
                rowOutput += (rs[i].FAV == 1 ? ('<img id="fav_' + rs[i].ACCT_NO + '" width="16" height="16" alt="" src="img/star.png" onclick="ssp.webdb.setCustomerFav(' + "'" + rs[i].ACCT_NO + "'" + ')"/>') : ('<img id="fav_' + rs[i].ACCT_NO + '" width="16" height="16" alt="" src="img/starEmpty.png" onclick="ssp.webdb.setCustomerFav(' + "'" + rs[i].ACCT_NO + "'" + ')"/>')); // + '</span>';
                if (window.localStorage.getItem("ssp_custsalesbubble") == 1) rowOutput += '<span class="number">' + rs[i].NUMSALES + '</span>';
                rowOutput += '</li></ul>';
            } else {
                rowOutput += '<ul class="extended-options"><li><strong>' + rs[i].TECH_NO + '</strong></li></ul>';

            }

            rowOutput += '</li>';
        }
        //rowOutput += '</ul></div></div></div></section></article>';
        reccount = Math.max(0, $('#customerlistcount').html()) + i;
        var listid = (Math.max(0, Math.ceil(reccount / CUSTPAGING)));
        rowOutput += '<div id="customerlist' + listid + '"></div>';
        rowOutput += '</ul></div>';
        var rectotal = Math.max(rs.length, $('#customerlisttotal').html());
        var moreOutput = '<div id="customermore"><img src="img/arrowCurveLeft.png" width="16" height="16" class="picto"> <div style="display:inline-block" id="customerlistcount">' + reccount + '</div> of <div style="display:inline-block" id="customerlisttotal">' + rectotal + '</div> items  ';
        if (reccount != rectotal) moreOutput += '<button type="button" onClick="ssp.webdb.getCustomersList(\'' + currfilter + '\',' + Math.min((reccount), rectotal) + ');">Show More</button></div>';
    }
    $('#customerlist' + Math.max(0, (Math.ceil(reccount / CUSTPAGING) - 1))).html(rowOutput);
    $('#customermore').html(moreOutput);
    $(document.body).applyTemplateSetup();

    $('#searchcustomers').keyup(function () {
        delay(function () {
            ssp.webdb.searchCustomers();
        }, 0);
    });

}

//JKS101817***Added Nitrogen Days to Customer Accounts.***
//JKS102116***Removed Editing Abilities from Contact, Phone, Address, City, State, and Zip in the Customer Info list.***
//JKS102116***Removed Business Name, Herd, Breeds 1-3, and Routes from the Customer Info list.***
//JKS102116***Changed "Phone/Contact" to "Phone Number" int the Customer Info list.*** 
//JKS100416***Added a Customer Note field SP6 to Customer Info.***
//JKS100316***Added BREED2 and BREED3 fields to Customer Info and Changed SP3 to BREED1***
//JKS091416***Added CONTACT NAME field to Customer Info.***
//JKS090716***Added BUSINESS NAME, HERD SIZE, BREED, & ROUTE NUMBER fields to Customer Info.***
function loadCustomerDetail(rs) {

    var rowOutput = '<article>';
    rowOutput += '<div id="custmsg" class="block-border">';
    rowOutput += '<div id="fallcreditmsg" class="block-border">';
    rowOutput += '<div class="block-content no-padding">';
    rowOutput += '<h1>';
    rowOutput += '<div id="custname">' + rs[0].NAME + '</div><div id="acctid">' + rs[0].ACCT_NO + '</div>';
    rowOutput += '<div id="custdisc1" style="display:none">' + rs[0].DISC1 + '</div><div id="custdisc2" style="display:none">' + rs[0].DISC2 + '</div>';
    if ((window.localStorage.getItem("ssp_projectid") == 'ssc') || (window.localStorage.getItem("ssp_projectid") == 'sess') || (window.localStorage.getItem("ssp_projectid") == 'ecss')) {
        rowOutput += '<div id="custrate1" style="display:none">' + (rs[0].TAXABLE.split(':')[0] * .00001) + '</div><div id="custrate2" style="display:none">' + (rs[0].TAXABLE.split(':')[1] * .00001) + '</div><div id="taxstate" style="display:none">' + (rs[0].STATE) + '</div>';
    }
    if (window.localStorage.getItem("ssp_projectid") == 'mnss' && rs[0].STATE == 'ND' || window.localStorage.getItem("ssp_projectid") == 'mnss' && rs[0].STATE == 'MN') {
        rowOutput += '<div id="custrate1" style="display:none">' + (rs[0].TAXABLE.split(':')[0]) + '</div><div id="custrate2" style="display:none">' + (rs[0].TAXABLE.split(':')[1]) + '</div><div id="taxstate" style="display:none">' + (rs[0].STATE) + '</div>';
    }
    rowOutput += '</h1>';
    rowOutput += '<div class="block-controls">';
    rowOutput += '<ul class="controls-tabs js-tabs">';
    rowOutput += '<li class="current"><a href="#tab-orders" title="Orders">Orders</a></li>';
    rowOutput += '<li><a href="#tab-notes" title="Notes">Notes' + ((rs[0].NUMNOTES > 0) ? '<span class="nb-events"> ' + rs[0].NUMNOTES + '</span>' : '') + '</a></li>';
    rowOutput += '<li><a href="#tab-info" title="Info">Info</a></li>';
    rowOutput += '<li><a href="#tab-ar" title="A/R">Finance</a></li>';
    rowOutput += '<li><a href="#tab-docs" title="Docs">Docs</a></li>';
    rowOutput += '</ul>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-orders">';
    rowOutput += '<div id="orderlist"></div>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-notes">';
    rowOutput += '<div id="notelist">';
    rowOutput += '</div>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-info">';
    rowOutput += '<ul class="simple-list" >';
    rowOutput += '<li><strong>CONTACT NAME:</strong> ' + rs[0].SP2 + '</li>';
    if (window.localStorage.getItem("ssp_projectid") == 'ecss') {       /*JKS051718***v4.01->Added Phone Number edit for ECSS only*/
        rowOutput += '<li>';
        rowOutput += '<strong>PHONE NUMBER:</strong> <div id="CustomerPhone" style="display:inline-block"> ' + rs[0].ADDR1 + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustphone" onclick="ssp.webdb.modCustomerPhone(\'' + rs[0].ADDR1 + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
        rowOutput += '</li>';
    } else {
        rowOutput += '<li><strong>PHONE NUMBER:</strong> ' + rs[0].ADDR1 + '</li>';
    }
    rowOutput += '<li><strong>ADDRESS:</strong> ' + rs[0].ADDR2 + '</li>';
    rowOutput += '<li><strong>CITY:</strong> ' + rs[0].CITY + '</li>';
    rowOutput += '<li><strong>STATE:</strong> ' + rs[0].STATE + '</li>';
    rowOutput += '<li><strong>ZIP:</strong> ' + rs[0].ZIP + '</li>';
    rowOutput += '<li>';
    rowOutput += '<strong>EMAIL:</strong> <div id="CustomerEmail" style="display:inline-block"> ' + rs[0].MEMBER + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustemail" onclick="ssp.webdb.modCustomerEmail(\'' + rs[0].MEMBER + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
    rowOutput += '</li>';
    if (window.localStorage.getItem("ssp_techfunc") == 0) {   //JKS111517***Added IfElse statement to ONLY allow for TechIdMaster to Edit.***
        if (rs[0].SP6 == null) {      //JKS122117***3.100.36->Added a check for NULL CustomerNotes***
            rowOutput += '<li>';
            rowOutput += '<strong>CUSTOMER NOTE: </strong> <div id="CustomerNote" style="display:inline-block">' + " " + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnote" onclick="ssp.webdb.modCustomerNote(\'' + " " + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
            rowOutput += '</li>';
        } else {
            rowOutput += '<li>';
            rowOutput += '<strong>CUSTOMER NOTE: </strong> <div id="CustomerNote" style="display:inline-block">' + rs[0].SP6 + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnote" onclick="ssp.webdb.modCustomerNote(\'' + rs[0].SP6 + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
            rowOutput += '</li>';
        }
    } else {
        if (rs[0].SP6 == null) {      //JKS122117***3.100.36->Added a check for NULL CustomerNotes***
            rowOutput += '<li><strong>CUSTOMER NOTE: </strong>' + " " + '</li>';
        } else {
            rowOutput += '<li><strong>CUSTOMER NOTE: </strong>' + rs[0].SP6 + '</li>';
        }
    }
    if (window.localStorage.getItem("ssp_techfunc") == 0) {   //JKS111517***Added IfElse statement to ONLY allow for TechIdMaster to Edit.***
        if ((rs[0].SP7 == null) || (rs[0].SP7 == " ") || (rs[0].SP7 == "")) {      //JKS020718***3.100.37->ADDED both "" and " " to NitroDays check***//JKS013018***3.100.37->Changed or '' to or " " for NitroDays check***//JKS011818***3.100.37->Added or '' to NitroDays check***//JKS122117***3.100.36->Added a check for NULL NitroDays***
            rowOutput += '<li>';
            rowOutput += '<strong>NITROGEN DAYS: </strong> <div id="CustomerNitroDays" style="display:inline-block">' + "" + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnitrodays" onclick="ssp.webdb.modCustomerNitroDays(\'' + rs[0].SP7 + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';      //JKS021218***3.100.37->Changed Displayed value from window.localStorage.getItem("ssp_nitrodays") to ""***  //JKS020118***3.100.37->Changed " " to window.localStorage.getItem("ssp_nitrodays") for Display***
            rowOutput += '</li>';
        } else {
            rowOutput += '<li>';
            rowOutput += '<strong>NITROGEN DAYS: </strong> <div id="CustomerNitroDays" style="display:inline-block">' + rs[0].SP7 + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnitrodays" onclick="ssp.webdb.modCustomerNitroDays(\'' + rs[0].SP7 + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
            rowOutput += '</li>';
        }
    } else {
        if ((rs[0].SP7 == null) || (rs[0].SP7 == " ") || (rs[0].SP7 == "")) {      //JKS020718***3.100.37->ADDED both "" and " " to NitroDays check***//JKS013018***3.100.37->Changed or '' to or " " for NitroDays check***//JKS011818***3.100.37->Added or '' to NitroDays check***//JKS122117***3.100.36->Added a check for NULL NitroDays***
            rowOutput += '<li><strong>NITROGEN DAYS: </strong>' + "" + '</li>';      //JKS021218***3.100.37->Changed Displayed value from window.localStorage.getItem("ssp_nitrodays") to ""***//JKS020118***3.100.37->Changed " " to window.localStorage.getItem("ssp_nitrodays") for Display***
        } else {
            rowOutput += '<li><strong>NITROGEN DAYS: </strong>' + rs[0].SP7 + '</li>';
        }
    }
    if (rs[0].DISC1 == null) {
        rowOutput += '<li><strong>DISCOUNT %:</strong> 0 </li>';
    }
    else {
        rowOutput += '<li><strong>DISCOUNT %:</strong> ' + rs[0].DISC1 + '</li>';
    }
    rowOutput += '<li><strong>DISC MAX $: </strong> ' + (((!rs[0].DISC2)) ? 0 : rs[0].DISC2.toFixed(2)); + '</li>';
    if (window.localStorage.getItem("ssp_projectid") == 'ssc') {
        rowOutput += '<li><strong>G.S.T./H.S.T. (RT869132142):</strong> ' + (rs[0].TAXABLE.split(':')[0] * .00001) + '</li>';
        rowOutput += '<li><strong>T.V.Q. (1087751925):</strong> ' + (rs[0].TAXABLE.split(':')[1] * .00001) + '</li>';
    }
    if (window.localStorage.getItem("ssp_projectid") == 'sess') {
        rowOutput += '<li><strong>Tax Rate 1:</strong> ' + (rs[0].TAXABLE.split(':')[0] * .00001) + '</li>';
        rowOutput += '<li><strong>Tax Rate 2:</strong> ' + (rs[0].TAXABLE.split(':')[1] * .00001) + '</li>';
    }
    if (rs[0].MOD) {
        rowOutput += '<li><div class="align-right"><a href="javascript:void(0)" class="button" id="del' + rs[0].ACCT_NO + '" title="delete" onclick="ssp.webdb.deleteCustomer(' + "'" + rs[0].ACCT_NO + "'" + ')"><img src="img/bin.png" width="16" height="16"></a></div></li>';
    }
    rowOutput += '</ul>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-ar">';
    rowOutput += '<div id="custar">';
    rowOutput += '</div>';
    rowOutput += '</div>';

    rowOutput += '<div id="tab-docs">';
    rowOutput += '<div id="docs">';
    //rowOutput += '<body style="margin:0px;padding:0px;overflow:hidden">';
    var currUrl = window.localStorage.getItem('ssp_urldata');
    var docUrl = (currUrl.substr(currUrl.length - 7) == 'SSPweb/') ? currUrl.replace('SSPweb/', '') : currUrl.replace('SSPweb', '');
    rowOutput += '<iframe src="' + docUrl + '/Docs/Docs.aspx?type=customer&pkid=' + rs[0].ACCT_NO + '" onload="resize_iframe()" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>';
    //rowOutput += '</body>';
    rowOutput += '</div>';
    rowOutput += '</div>';

    rowOutput += '</div>';
    rowOutput += '</div>';
    rowOutput += '</article>';

    $('#maincontent').html(rowOutput);
    $('#tab-orders').onTabShow(function () {
        ssp.webdb.getCustomersOrders(rs[0].ACCT_NO);
    });
    $('#tab-notes').onTabShow(function () {
        ssp.webdb.getCustomersNotes(rs[0].ACCT_NO);
    });
    $('#tab-ar').onTabShow(function () {
        ssp.webdb.getCustomersAR(rs[0].ACCT_NO);
    });
    $(document.body).applyTemplateSetup();

    if (window.localStorage.getItem("ssp_projectid") == 'sess') {
        var fcAS400 = rs[0].SP_RATE;
        var fcPending = 0;
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('SELECT SUM(SIQTY*SIPRC) AS amtSales FROM tblSales WHERE (SIINVO = "0" OR SIINVO IS NULL) AND (SILVL4="1.0" OR SILVL4="1") AND SIACT = "' + rs[0].ACCT_NO + '"', [],
                function (rs) {
                    if (rs[0].amtSales) {
                        fcPending = rs[0].amtSales * .60;     /*JKS080818->4.03***SESS Fall Credit rate changed from .50 to .60*/
                    }
                    if ((fcAS400 + fcPending) > 0) {
                        var fcMsg = 'Fall Credit: $' + fcAS400.toFixed(2);
                        if (fcPending > 0) {
                            fcMsg += ' (pend:' + fcPending.toFixed(2) + ')';
                        }
                        $('#fallcreditmsg').removeBlockMessages().blockMessage(fcMsg, { type: 'success' });
                    }
                }, ssp.webdb.onError);
        });
    }


    //check 90 day balance
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblCustomersAR WHERE ACCT_NO = "' + rs[0].ACCT_NO + '"', [],
            function (rs) {
                if (rs.length > 0) {
                    if (rs[0].OVER_90 > 0) {
                        $('#custmsg').removeBlockMessages().blockMessage('Customer has balance over ' + ((window.localStorage.getItem("ssp_projectid") == 'mnss') ? '60' : '90') + ' days.', { type: 'error' });
                    }
                }
            }, ssp.webdb.onError);
    });

}

function loadCustomerAR(rs) {

    var rowOutput = '<ul class="simple-list with-icon icon-info with-padding">';
    if (window.localStorage.getItem("ssp_projectid") == 'mnss') {
        rowOutput += '<li><strong>BALANCE:</strong> ' + rs[0].BALANCE + '</li>';
        rowOutput += '<li><strong>0-30:</strong> ' + rs[0].CURRENT + '</li>';
        rowOutput += '<li><strong>31-60:</strong> ' + rs[0].OVER_DUE + '</li>';
        rowOutput += '<li><strong>OVER 60:</strong> ' + rs[0].OVER_90 + '</li>';
        rowOutput += '<li><strong>LAST PAY DATE:</strong> ' + format120Date(rs[0].OVER_120) + '</li>';
        rowOutput += '<li><strong>LAST PAYMENT ($):</strong> ' + rs[0].PAYMENTS.toFixed(2) + '</li>';
    } else if (window.localStorage.getItem("ssp_projectid") == 'ssp') {
        rowOutput += '<li><strong>BALANCE:</strong> ' + rs[0].BALANCE + '</li>';
        rowOutput += '<li><strong>CURRENT:</strong> ' + rs[0].CURRENT + '</li>';
        rowOutput += '<li><strong>OVER DUE:</strong> ' + rs[0].OVER_DUE + '</li>';
        rowOutput += '<li><strong>OVER 90:</strong> ' + rs[0].OVER_90 + '</li>';
        rowOutput += '<li><strong>LAST PAY DATE:</strong> ' + format120Date(rs[0].OVER_120) + '</li>';
        rowOutput += '<li><strong>CURRENT MONTH PAYMENT:</strong> ' + rs[0].PAYMENTS.toFixed(2) + '</li>';
    } else {
        rowOutput += '<li><strong>BALANCE:</strong> ' + rs[0].BALANCE + '</li>';
        rowOutput += '<li><strong>CURRENT:</strong> ' + rs[0].CURRENT + '</li>';
        rowOutput += '<li><strong>OVER DUE:</strong> ' + rs[0].OVER_DUE + '</li>';
        rowOutput += '<li><strong>OVER 90:</strong> ' + rs[0].OVER_90 + '</li>';
        rowOutput += '<li><strong>LAST PAY DATE:</strong> ' + format120Date(rs[0].OVER_120) + '</li>';
        rowOutput += '<li><strong>LAST PAYMENT:</strong> ' + rs[0].PAYMENTS.toFixed(2) + '</li>';
    }
    rowOutput += '</ul>';

    $('#custar').html(rowOutput);

}

function loadCustomerNotes(rs) {

    var rowOutput = '<div class="task">';
    rowOutput += '<ul class="task-dialog">';
    rowOutput += '<li>';
    rowOutput += '<form class="form input-with-button" onsubmit="return ssp.webdb.addCustomerNote(' + "'" + $('#acctid').html() + "'" + ');">';
    rowOutput += '<button class="float-right" type="submit">Add</button>';
    rowOutput += '<textarea id="txtAddNote" name="txtAddNote" value="" class="form input-with-button"></textarea>';
    rowOutput += '</form>';
    rowOutput += '</li>';


    if (rs.length == 0) {
        rowOutput += '<li>Sorry, no messages to list.</li>';
    }
    else {

        for (var i = 0; i < rs.length; i++) {
            var note_date = formatDate(rs[i].MODSTAMP);
            var note_html = rs[i].NOTE.replace(/\n\r?/g, '<br />');
            rowOutput += '<li>';
            rowOutput += note_html;
            rowOutput += '<br /><strong>' + rs[i].TECH_NO + '</strong><em>-' + note_date + '  </em>';
            if (rs[i].MOD) {
                rowOutput += '<a href="#" class="button" id="delnote' + i + '" title="delete" onclick="ssp.webdb.deleteCustomerNote(' + "'" + rs[i].PKIDDroid + "'," + i + ')"><img src="img/bin.png" width="16" height="16"></a>';
            }
            rowOutput += '</li>';
        }
    }
    rowOutput += '</ul></div>';
    $('#notelist').html(rowOutput);

}

function loadCustomerOrders(rs) {

    var rowOutput = '<p style="margin-top: 5px" ><button class="full-width" onclick="ssp.webdb.getOrder(-1,1);">Create Order</button></p>';
    rowOutput += '<ul class="blocks-list with-padding ">';

    if (rs.length == 0) {
        rowOutput += '<li>Sorry, no orders to list.</li>';
        rowOutput += '</ul>';
    }
    else {

        for (var i = 0; i < rs.length; i++) {
            //msg.substring(0, msg.indexOf("|"))
            var orderDate = rs[i].SIORNM
            rowOutput += '<li onclick="ssp.webdb.getOrder(' + "'" + rs[i].SIORNM + "'" + ',' + ((rs[i].MODIFIED > 0) ? 1 : 0) + ')">';
            rowOutput += '<a href="#" class="float-left"><img src="img/status' + ((rs[i].MODIFIED > 0) ? 'Away' : '') + '.png" width="16" height="16"> ' + rs[i].SIORNM + '<h4>' + ((rs[i].MODIFIED > 0) ? ('items to sync: ' + rs[i].MODIFIED) : rs[i].SIINVO) + '</h4></a>';
            rowOutput += '<ul class="floating-tags float-right">';
            rowOutput += '<li class="tag-date"> ' + formatDate(rs[i].SIDATO) + '</li>';
            rowOutput += '<li class="tag-money"> ' + rs[i].ORDERCOUNTITEM + ' - ' + (rs[i].ORDERTOTAL + rs[i].ARMTOTAL).toFixed(2) + '</li>';
            if (!!rs[i].NITROCOUNT) {
                rowOutput += '<span class="number"> ' + 'Nitrogen' + '</span>';
            }
            if (!!rs[i].POATOTAL) {
                rowOutput += '<span class="number"> ' + 'POA' + '</span>';
            }
            rowOutput += '</ul>';
            rowOutput += '</li>';
        }
        rowOutput += '</ul>';
    }
    $('#orderlist').html(rowOutput);

}

function getNewCustomerID() {

    $('#custacct').html("N" + window.localStorage.getItem("ssp_TechID") + randomString().substr(0, (3 + (4 - window.localStorage.getItem("ssp_TechID").length))));

}

//JKS101817***Added custnitrodays text field to New Customers.***
//JKS100416***Added custnote text field to New Customers.***
//JKS100316***Added custbreed2 and custbreed3 text fields to New Customers.***
//JKS091416***Added contname text fields to New Customer...Changed order Name fields.***
//JKS090716***Added businame, custherd, custbreed, & custroute text fields to New Customer.***

function loadCustomerNew() {
    var divContent = '<section id="login-block">';
    var req = "";

    divContent += '<div class="block-border"><form class="form block-content" name="login-form" id="login-form" onsubmit="return ssp.webdb.addCustomer()" action="">';
    divContent += '<h1>New Customer</h1>';

    divContent += '<div class="block-border with-margin"><h3>Temporary Customer ID</h3>';
    divContent += '<h4><div id="custacct"></div></h4></div>';

    if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
        req = "required";
    }

    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Customer Name</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custname" id="custname" class="full-width" value="" ' + req + '>';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Business Name</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="businame" id="businame" class="full-width" value="">';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Contact Name</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="contname" id="contname" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">Address</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custaddr2" id="custaddr2" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">City</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custcity" id="custcity" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">State</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custstate" id="custstate" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">Zip</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custzip" id="custzip" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">Phone</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custaddr" id="custaddr" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">Email</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custemail" id="custemail" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Herd Size</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custherd" id="custherd" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Breed 1</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custbreed1" id="custbreed1" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Breed 2</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custbreed2" id="custbreed2" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Breed 3</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custbreed3" id="custbreed3" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Sales Route #</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custroute" id="custroute" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Customer Note</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custnote" id="custnote" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Customer Nitrogen Days</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custnitrodays" id="custnitrodays" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';


    divContent += '<p><button type="submit" class="full-width">Save</button></p>';
    divContent += '</form></div></section>'

    $('#maincontent').html(divContent);
    getNewCustomerID();
}


ssp.webdb.getCustomers = function (keywords, recbegin) {
    loadCustomersContentBlock();
    ssp.webdb.getCustomersList(keywords, recbegin);
}

ssp.webdb.getCustomersList = function (keywords, recbegin) {
    if (keywords != '%') $('#customerkeyword').html(keywords);
    ssp.webdb.db.transaction(function (tx) {

        var addrwhere = (window.localStorage.getItem("ssp_addrsearch") == 1) ? ' OR tblCustomers.ADDR2 LIKE "%' + keywords + '%" OR tblCustomers.CITY LIKE "%' + keywords + '%"' : ' ';
        if (window.localStorage.getItem("ssp_custsalesbubble") == 1) {
            if (typeof recbegin == 'undefined') {
                //[alaSQL] Added tblCustomers.CITY,tblCustomers.STATE in GROUP BY Clause
                tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV, COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE tblCustomers.ACCT_NO LIKE "%' + keywords + '%" OR tblCustomers.NAME LIKE "%' + keywords + '%" ' + addrwhere + ' GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY ' + ((isNaN(keywords) || keywords.length == 0) ? 'tblCustomers.NAME' : 'tblCustomers.ACCT_NO'), [], loadCustomers, ssp.webdb.onError);
            } else {
                //[alaSQL] Added tblCustomers.CITY,tblCustomers.STATE in GROUP BY Clause
                tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV, COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE tblCustomers.ACCT_NO LIKE "%' + keywords + '%" OR tblCustomers.NAME LIKE "%' + keywords + '%" ' + addrwhere + ' GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY ' + ((isNaN(keywords) || keywords.length == 0) ? 'tblCustomers.NAME' : 'tblCustomers.ACCT_NO') + ' LIMIT ' + CUSTPAGING + ' OFFSET ' + recbegin, [], loadCustomers, ssp.webdb.onError);
            }
        } else {
            if (typeof recbegin == 'undefined') {
                tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE tblCustomers.ACCT_NO LIKE "%' + keywords + '%" OR tblCustomers.NAME LIKE "%' + keywords + '%" ' + addrwhere + '  ORDER BY ' + ((isNaN(keywords) || keywords.length == 0) ? 'tblCustomers.NAME' : 'tblCustomers.ACCT_NO'), [], loadCustomers, ssp.webdb.onError);
            } else {
                tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE tblCustomers.ACCT_NO LIKE "%' + keywords + '%" OR tblCustomers.NAME LIKE "%' + keywords + '%" ' + addrwhere + ' ORDER BY ' + ((isNaN(keywords) || keywords.length == 0) ? 'tblCustomers.NAME' : 'tblCustomers.ACCT_NO') + ' LIMIT ' + CUSTPAGING + ' OFFSET ' + recbegin, [], loadCustomers, ssp.webdb.onError);
            }
        }

    });
}

ssp.webdb.getCustomersFav = function () {
    ssp.webdb.db.transaction(function (tx) {
        loadCustomersContentBlock();
        if (window.localStorage.getItem("ssp_custsalesbubble") == 1) {
            //[alaSQL] Added tblCustomers.CITY,tblCustomers.STATE in GROUP BY Clause
            tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV,COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE FAV=1 GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY FAV DESC,NAME ', [], loadCustomers, ssp.webdb.onError);
        } else {
            tx.exec('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE FAV=1 ORDER BY FAV DESC,NAME ', [], loadCustomers, ssp.webdb.onError);
        }
    });
}

ssp.webdb.getCustomersOrders = function (PKIDCUSTOMER) {
    /*alaSQL:
     *     1.Added min(a.SIDATO) in SELECT statement
     *     2.Added a.SIINVO in GROUP BY clause
     *          GROUP BY a.SIORNM, a.SIINVO 
     *     3. Added min(a.SIDATO) in ORDER BY clause
     *          ORDER BY min(a.SIDATO) DESC
     *     4. Using SUM(nitro.nitrosold) instead of SUM(NITROSOLD). It's case sensitive and needs table name also.
    */
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT SIORNM, SUM(SIQTY) AS nitrosold FROM tblSales WHERE SICOD = "N2Fill" GROUP BY SIORNM', [], nitro => {
            tx.exec('SELECT COUNT(*) AS ORDERCOUNTITEM, SUM(SIPRC*SIQTY) AS ORDERTOTAL, SUM(SIARM) AS ARMTOTAL, a.SIORNM,a.SIINVO,min(a.SIDATO) as SIDATO,SUM(MOD) AS MODIFIED,SUM(nitro.nitrosold) AS NITROCOUNT,SUM(SIPOA) AS POATOTAL  FROM tblSales a LEFT JOIN ? nitro ON a.SIORNM  = nitro.SIORNM WHERE SIACT = "' + PKIDCUSTOMER + '" GROUP BY a.SIORNM, a.SIINVO ORDER BY min(a.SIDATO) DESC, a.SIORNM DESC', [nitro], loadCustomerOrders)
        }, ssp.webdb.onError);
    });
}

ssp.webdb.getCustomersNotes = function (PKIDCUSTOMER) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblCustomerNotes WHERE ACCT_NO = "' + PKIDCUSTOMER + '" ORDER BY MODSTAMP DESC', [], loadCustomerNotes, ssp.webdb.onError);
    });
}

ssp.webdb.getCustomersAR = function (PKIDCUSTOMER) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblCustomersAR WHERE ACCT_NO = "' + PKIDCUSTOMER + '"', [], res => res.length && loadCustomerAR(res), ssp.webdb.onError);
    });
}

ssp.webdb.getCustomerByID = function (ACCOUNT) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT tblCustomers.*, COUNT(distinct tblCustomerNotes.PKIDDroid) AS NUMNOTES  FROM tblCustomers LEFT JOIN tblCustomerNotes ON tblCustomers.ACCT_NO = tblCustomerNotes.ACCT_NO WHERE tblCustomers.ACCT_NO = "' + ACCOUNT + '"', [], loadCustomerDetail, ssp.webdb.onError);
    });
}

//JKS101817***Added SP7=custnitrodays to table values.***
//JKS100416***Added SP6=custnote to table values.***
//JKS100316***Changed SP3=custbreed to BREED1=custbreed1...Added BREED2=custbreed2 and BREED3=custbreed3 to table values.***
//JKS091416***Added SP5...Swapped SP2 value with SP5...Now SP2=contname & SP5=custherd.***
//JKS090716***Added SP1=businame, SP2=custherd, SP3=custbreed, & SP4=custroute for New Customer Function.***
ssp.webdb.addCustomer = function () {
    ssp.webdb.db.transaction(function (tx) {       
        var currenttime = Math.round(new Date().getTime() / 1000);

        var custacct = $('#custacct').html();
        var custname = $('#custname').val();


        if (!custacct || custacct.length == 0) {
            $('#login-block').removeBlockMessages().blockMessage('Error no account number assigned.', { type: 'error' });
        }
        else if (!custname || custname.length == 0) {
            $('#login-block').removeBlockMessages().blockMessage('Please enter a name.', { type: 'error' });
        }
        else {
            var customersDataStructure = { ACTIVE: null, TYPE_AREA: null, SP1: null, ACCT_NO: null, NAME: null, ADDR1: null, ADDR2: null, CITY: null, STATE: null, SP2: null, ZIP: null, BREED1: null, BREED2: null, BREED3: null, TYPE: null, SP3: null, TECH_NO: null, MEMBER: null, DISC1: null, DISC2: null, W_O: null, SP4: null, L_PMT_M: null, SP5: null, L_PMT_Y: null, SP6: null, L_PUR_M: null, SP7: null, L_PUR_Y: null, SP8: null, SP_ACCT: null, SP9: null, SP_RATE: null, SL_AREA: null, SP10: null, COUNTY: null, TAXABLE: null, MOD: null, MODSTAMP: null, FAV: null }

            var currentData = { ACCT_NO: $('#custacct').html(), NAME: $('#custname').val(), SP1: $('#businame').val(), SP2: $('#contname').val(), ADDR1: $('#custaddr').val(), ADDR2: $('#custaddr2').val(), CITY: $('#custcity').val(), STATE: $('#custstate').val(), ZIP: $('#custzip').val(), SP5: $('#custherd').val(), BREED1: $('#custbreed1').val(), BREED2: $('#custbreed2').val(), BREED3: $('#custbreed3').val(), SP4: $('#custroute').val(), SP6: $('#custnote').val(), SP7: $('#custnitrodays').val(), TECH_NO: window.localStorage.getItem("ssp_TechID"), MEMBER: $('#custemail').val(), TAXABLE: "00000:00000", MOD: 1, MODSTAMP: currenttime }

            tx.exec('INSERT INTO tblCustomers VALUES ?', [{ ...customersDataStructure, ...currentData }], ssp.webdb.getCustomersFav, ssp.webdb.onError); //[ala] Using customersDataStructure to avoid the undefined values error when POSTing the data to backend. Im WebSQL after inserting, rest object property remains null whereas in alasql it remains undefined.
            //tx.exec('INSERT INTO tblCustomers (ACCT_NO,NAME,SP1,SP2,ADDR1,ADDR2,CITY,STATE,ZIP,SP5,BREED1,BREED2,BREED3,SP4,SP6,SP7,TECH_NO,MEMBER,TAXABLE,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [$('#custacct').html(), $('#custname').val(), $('#businame').val(), $('#contname').val(), $('#custaddr').val(), $('#custaddr2').val(), $('#custcity').val(), $('#custstate').val(), $('#custzip').val(), $('#custherd').val(), $('#custbreed1').val(), $('#custbreed2').val(), $('#custbreed3').val(), $('#custroute').val(), $('#custnote').val(), $('#custnitrodays').val(), window.localStorage.getItem("ssp_TechID"), $('#custemail').val(), "00000:00000", 1, currenttime], ssp.webdb.getCustomersFav, ssp.webdb.onError);
        }
    });
    return false;
}

ssp.webdb.addCustomerNote = function (ACCOUNT) {
    var txtAddNote = $('#txtAddNote').val();
    if (txtAddNote.trim())
        ssp.webdb.db.transaction(function (tx) {
            var currenttime = Math.round(new Date().getTime() / 1000);
            tx.exec('INSERT INTO tblCustomerNotes (PKIDDroid, TECH_NO,ACCT_NO,NOTE,MODSTAMP,MOD) values (?,?,?,?,?,?)', [currenttime + "." + window.localStorage.getItem("ssp_TechID"), window.localStorage.getItem("ssp_TechID"), ACCOUNT, txtAddNote, currenttime, 1], () => ssp.webdb.getCustomersNotes(ACCOUNT));
        });
    return false;
}

ssp.webdb.deleteCustomerNote = function (PKID, DelID) {
    if ($("#delnote" + DelID).attr("class") == "button red") {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec("DELETE FROM tblCustomerNotes WHERE PKIDDroid = ?", [PKID], res => ssp.webdb.getCustomersNotes($('#acctid').html()), ssp.webdb.onError);
        });
    } else {
        $("#delnote" + DelID).removeClass("button").addClass("button red");
        $("#delnote" + DelID).html($("#delnote" + DelID).html() + 'sure?');
    }




}

ssp.webdb.deleteCustomer = function (PKID) {

    if ($("#del" + PKID).attr("class") == "button red") {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('DELETE FROM tblCustomers WHERE ACCT_NO = ? ', [PKID], () => ssp.webdb.getCustomers(), ssp.webdb.onError);
        });
    } else {
        $("#del" + PKID).removeClass("button").addClass("button red");
        $("#del" + PKID).html($("#del" + PKID).html() + 'sure?');
    }

}

ssp.webdb.setCustomerFav = function (ACCOUNT) {
    var fav = $("#fav_" + ACCOUNT).attr("src");
    var currenttime = Math.round(new Date().getTime() / 1000);
    if (fav == "img/star.png") {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('UPDATE tblCustomers SET FAV = 0,MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + ACCOUNT + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
        });
        $("#fav_" + ACCOUNT).attr("src", "img/starEmpty.png");
    }
    else {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('UPDATE tblCustomers SET FAV = 1,MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + ACCOUNT + '"', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        });
        $("#fav_" + ACCOUNT).attr("src", "img/star.png");
    }
}

ssp.webdb.searchCustomers = function (buttonpressed, searchstring) {
    if (typeof searchstring == 'undefined') {
        $('#customerlist0').html('<div id="customerlist0"></div>');
        $('#customermore').html('<div id="customermore"></div>');
        if (buttonpressed) {
            window.localStorage.setItem('ssp_custsearch_5', window.localStorage.getItem('ssp_custsearch_4'));
            window.localStorage.setItem('ssp_custsearch_4', window.localStorage.getItem('ssp_custsearch_3'));
            window.localStorage.setItem('ssp_custsearch_3', window.localStorage.getItem('ssp_custsearch_2'));
            window.localStorage.setItem('ssp_custsearch_2', window.localStorage.getItem('ssp_custsearch_1'));
            window.localStorage.setItem('ssp_custsearch_1', $("#searchcustomers").val());
            loadCustomerContentBlockHeader();
        }
        ssp.webdb.getCustomersList($("#searchcustomers").val());
    } else {
        $("#menu").toggleClass("active");
        loadCustomersContentBlock();
        ssp.webdb.getCustomersList(searchstring);
        $("#searchcustomers").val(searchstring);
    }
    return false;
}

ssp.webdb.setCustomerCount = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT COUNT(*) AS cntCustomer FROM tblCustomers', [],
            function (rs) {
                if (rs.length > 0) {
                    $('#sideCustomerCount').html(rs[0].cntCustomer);
                }
            }, ssp.webdb.onError);
    });
}

//JKS091516***Business Name Edit Function***	
ssp.webdb.modCustomerBusiness = function (business) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerBusiness" id="ModCustomerBusiness" value="' + business + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerBusiness();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerBusiness").html(rowOutput);
}

//JKS091516***Business Name Save Edit Function***
ssp.webdb.SaveCustomerBusiness = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var businessaddr = $('#ModCustomerBusiness').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP1 = "' + businessaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerBusiness').html(businessaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustbusiness" onclick="ssp.webdb.modCustomerBusiness(\'' + businessaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091516***Contact Name Edit Function***	
ssp.webdb.modCustomerContact = function (contact) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerContact" id="ModCustomerContact" value="' + contact + '" >';     /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerContact();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerContact").html(rowOutput);
}

//JKS091516***Contact Name Save Edit Function***
ssp.webdb.SaveCustomerContact = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var contactaddr = $('#ModCustomerContact').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP2 = "' + contactaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerContact').html(contactaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustcontact" onclick="ssp.webdb.modCustomerContact(\'' + contactaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091516***Phone Edit Function***	
ssp.webdb.modCustomerPhone = function (phone) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerPhone" id="ModCustomerPhone" value="' + phone + '" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerPhone();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerPhone").html(rowOutput);
}

//JKS091516***Phone Save Edit Function***
ssp.webdb.SaveCustomerPhone = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var phoneaddr = $('#ModCustomerPhone').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET ADDR1 = "' + phoneaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerPhone').html(phoneaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustphone" onclick="ssp.webdb.modCustomerPhone(\'' + phoneaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091316***Address Edit Function***	
ssp.webdb.modCustomerStreet = function (street) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerStreet" id="ModCustomerStreet" value="' + street + '" >';        /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerStreet();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerStreet").html(rowOutput);
}

//JKS091316***Address Save Edit Function***
ssp.webdb.SaveCustomerStreet = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var streetaddr = $('#ModCustomerStreet').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET ADDR2 = "' + streetaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerStreet').html(streetaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcuststreet" onclick="ssp.webdb.modCustomerStreet(\'' + streetaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091316***City Edit Function***	
ssp.webdb.modCustomerCity = function (city) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerCity" id="ModCustomerCity" value="' + city + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerCity();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerCity").html(rowOutput);
}

//JKS091316***City Save Edit Function***
ssp.webdb.SaveCustomerCity = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var cityaddr = $('#ModCustomerCity').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET CITY = "' + cityaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerCity').html(cityaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustcity" onclick="ssp.webdb.modCustomerCity(\'' + cityaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091316***State Edit Function***	
ssp.webdb.modCustomerState = function (state) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerState" id="ModCustomerState" value="' + state + '" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerState();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerState").html(rowOutput);
}

//JKS091316***State Save Edit Function***
ssp.webdb.SaveCustomerState = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var stateaddr = $('#ModCustomerState').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET STATE = "' + stateaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerState').html(stateaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcuststate" onclick="ssp.webdb.modCustomerState(\'' + stateaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS091316***Zip Edit Function***	
ssp.webdb.modCustomerZip = function (zip) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerZip" id="ModCustomerZip" value="' + zip + '" >';     /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerZip();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerZip").html(rowOutput);
}

//JKS091316***Zip Save Edit Function***
ssp.webdb.SaveCustomerZip = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var zipaddr = $('#ModCustomerZip').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET ZIP = "' + zipaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerZip').html(zipaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustzip" onclick="ssp.webdb.modCustomerZip(\'' + zipaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

ssp.webdb.modCustomerEmail = function (email) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerEmail" id="ModCustomerEmail" value="' + email + '" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerEmail();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerEmail").html(rowOutput);
}

ssp.webdb.SaveCustomerEmail = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var emailaddr = $('#ModCustomerEmail').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET MEMBER = "' + emailaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerEmail').html(emailaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustemail" onclick="ssp.webdb.modCustomerEmail(\'' + emailaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS090816***Herd Edit Function***	
ssp.webdb.modCustomerHerd = function (herd) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerHerd" id="ModCustomerHerd" value="' + herd + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerHerd();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerHerd").html(rowOutput);
}

//JKS090816***Herd Save Edit Function***
ssp.webdb.SaveCustomerHerd = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var herdaddr = $('#ModCustomerHerd').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP5 = "' + herdaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerHerd').html(herdaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustherd" onclick="ssp.webdb.modCustomerHerd(\'' + herdaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS090816***Breed1 Edit Function***
ssp.webdb.modCustomerBreed1 = function (breed1) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerBreed1" id="ModCustomerBreed1" value="' + breed1 + '" >';        /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerBreed1();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerBreed1").html(rowOutput);
}

//JKS090816***Breed1 Save Edit Function***
ssp.webdb.SaveCustomerBreed1 = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var breed1addr = $('#ModCustomerBreed1').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET BREED1 = "' + breed1addr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerBreed1').html(breed1addr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustbreed1" onclick="ssp.webdb.modCustomerBreed1(\'' + breed1addr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS100316***Breed2 Edit Function***
ssp.webdb.modCustomerBreed2 = function (breed2) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerBreed2" id="ModCustomerBreed2" value="' + breed2 + '" >';        /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerBreed2();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerBreed2").html(rowOutput);
}

//JKS100316***Breed2 Save Edit Function***
ssp.webdb.SaveCustomerBreed2 = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var breed2addr = $('#ModCustomerBreed2').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET BREED2 = "' + breed2addr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerBreed2').html(breed2addr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustbreed2" onclick="ssp.webdb.modCustomerBreed2(\'' + breed2addr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS100316***Breed3 Edit Function***
ssp.webdb.modCustomerBreed3 = function (breed3) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerBreed3" id="ModCustomerBreed3" value="' + breed3 + '" >';        /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerBreed3();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerBreed3").html(rowOutput);
}

//JKS100316***Breed3 Save Edit Function***
ssp.webdb.SaveCustomerBreed3 = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var breed3addr = $('#ModCustomerBreed3').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET BREED3 = "' + breed3addr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerBreed3').html(breed3addr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustbreed3" onclick="ssp.webdb.modCustomerBreed3(\'' + breed3addr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS090816***Route Edit Function***	
ssp.webdb.modCustomerRoute = function (route) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerRoute" id="ModCustomerRoute" value="' + route + '" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerRoute();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerRoute").html(rowOutput);
}

//JKS090816***Route Save Edit Function***
ssp.webdb.SaveCustomerRoute = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var routeaddr = $('#ModCustomerRoute').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP4 = "' + routeaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerRoute').html(routeaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustroute" onclick="ssp.webdb.modCustomerRoute(\'' + routeaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS100416***Customer Note Edit Function***	
ssp.webdb.modCustomerNote = function (cnote) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerNote" id="ModCustomerNote" value="' + cnote + '" >';     /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerNote();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerNote").html(rowOutput);
}

//JKS100416***Customer Note Save Edit Function***
ssp.webdb.SaveCustomerNote = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var noteaddr = $('#ModCustomerNote').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP6 = "' + noteaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerNote').html(noteaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnote" onclick="ssp.webdb.modCustomerNote(\'' + noteaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

//JKS101817***Customer Nitrogen Days Edit Function***	
ssp.webdb.modCustomerNitroDays = function (cnitrodays) {
    //var rowOutput = '<p style="display:inline-block">';
    rowOutput = '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CustomerNitroDays" id="ModCustomerNitroDays" value="' + cnitrodays + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerNitroDays();"><img src="img/computer.png" width="16" height="16"/>save</a>';
    //rowOutput += '</p>';
    $("#CustomerNitroDays").html(rowOutput);
}

//JKS101817***Customer Nitrogen Days Save Edit Function***
ssp.webdb.SaveCustomerNitroDays = function () {
    var currenttime = Math.round(new Date().getTime() / 1000);
    var nitrodaysaddr = $('#ModCustomerNitroDays').val();
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('UPDATE tblCustomers SET SP7 = "' + nitrodaysaddr + '",MOD=1,MODSTAMP=' + currenttime + ' WHERE ACCT_NO = "' + $('#acctid').html() + '"', [], ssp.webdb.onSucess, ssp.webdb.onError);
    });
    $('#CustomerNitroDays').html(nitrodaysaddr + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnitrodays" onclick="ssp.webdb.modCustomerNitroDays(\'' + nitrodaysaddr + '\')"><img src="img/pencil.png" width="12" height="12"/></a>');
}

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

function loadCustomersContentBlock() {

    loadCustomerContentBlockHeader();

    var rowOutput = '<article>';
    rowOutput += '<div class="block-border"><div class="block-content">';
    rowOutput += '<h1><a href="javascript:void(0)" class="float-right" onclick="loadCustomerNew();"><img src="img/plusCircleBlue.png" width="16" height="16"></a>Customer List<div id="customerkeyword"></div></h1>';
    rowOutput += '<form class="form input-with-button full-width" onsubmit="return ssp.webdb.searchCustomers(true)" >';
    rowOutput += '<p><span class="input-type-text">';
    rowOutput += '<a href="javascript:void(0)" class="button float-right" onclick="ssp.webdb.searchCustomers(true)" title="messages"><img src="img/zoom.png" width="16" height="16"></a>';
    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="searchcustomers" id="searchcustomers" class="full-width" ';     /*JKS080818->4.03***Auto Fill Search switch*/
    if ($("#searchcustomers").val() != undefined) rowOutput += 'value="' + $("#searchcustomers").val() + '"';
    rowOutput += '>';
    rowOutput += '</p></span>';
    rowOutput += '</form>';
    rowOutput += '</br>';
    rowOutput += '<div id="customerlist0"></div><div id="customermore"></div>';
    if (typeof acctid == "undefined") rowOutput += '</div>';
    rowOutput += '</div></section></article>';
    $('#maincontent').html(rowOutput);

}

function loadCustomerContentBlockHeader() {

    var cs1 = window.localStorage.getItem('ssp_custsearch_1');
    var cs2 = window.localStorage.getItem('ssp_custsearch_2');
    var cs3 = window.localStorage.getItem('ssp_custsearch_3');
    var cs4 = window.localStorage.getItem('ssp_custsearch_4');
    var cs5 = window.localStorage.getItem('ssp_custsearch_5');
    var homeHeader = 'PSS';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
            homeHeader = 'PSS';
            break;
        case 'ssc':
            homeHeader = 'SSC';
            break;
        case 'ps':
            homeHeader = 'SSMA';
            break;
        case 'ecss':
            homeHeader = 'CS';
            break;
        //JKS112216***Added MNSS to header***
        case 'mnss':
            homeHeader = 'MNSS';
            break;
    }
    var header = "<header id='mainheader'><h1>" + homeHeader + " - " + ((window.localStorage.getItem("ssp_techfunc") == 1) ? "Tech" : "ASM") + "</h1></header>";
    header += "<a href='javascript:void(0);' onclick='location.reload();' id='home'>Home</a>";
    header += '<div id="menu">';
    header += '<a href="#">Searches</a>';
    header += '<ul>';
    if (cs1 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs1 + "'" + ');">' + cs1 + '</a></li>';
    if (cs2 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs2 + "'" + ');">' + cs2 + '</a></li>';
    if (cs3 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs3 + "'" + ');">' + cs3 + '</a></li>';
    if (cs4 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs4 + "'" + ');">' + cs4 + '</a></li>';
    if (cs5 != 'null') header += '<li><a href="javascript:void(0);" onclick="ssp.webdb.searchCustomers(false,' + "'" + cs5 + "'" + ');">' + cs5 + '</a></li>';
    header += '</ul>';
    header += '</div>';
    $('#headercontent').html(header);
    var menu = $('#menu > ul'),
        menuHeight = menu.height(),
        currentMenu = menu;

    // Open
    $('#menu > a').click(function (event) {
        event.preventDefault();

        var parent = $(this).parent();
        if (parent.hasClass('active')) {
            menu.css({
                display: '',
                height: menuHeight
            });
        }
        parent.toggleClass('active');
    });


}

function loadCustomers(rs) {

    var reccount = 0;
    var currtechid = window.localStorage.getItem("ssp_TechID");
    var currfilter = $('#customerkeyword').html();
    var rowOutput = '';
    if (rs.length == 0) {
        // rowOutput += '<p class="message warning">Sorry, no customers found.</p>';
    }
    else {
        rowOutput += '<div id="tab-users"><ul class="extended-list">';
        for (var i = 0; i < Math.min(CUSTPAGING, rs.length); i++) {
            rowOutput += '<li><a href="#" onclick="ssp.webdb.getCustomerByID(' + "'" + rs[i].ACCT_NO + "'" + ');">';
            rowOutput += '<span class="icon"></span>';
            rowOutput += rs[i].NAME + '<br>';
            rowOutput += '<small>' + rs[i].ADDR2 + '</small>';
            rowOutput += '<br><small>' + rs[i].CITY + ', ' + rs[i].STATE + '</small>';
            rowOutput += '<div><small><strong>' + rs[i].ACCT_NO + '</strong></small></div>';
            rowOutput += '</a>';
            if (rs[i].TECH_NO.toUpperCase() == currtechid.toUpperCase()) {
                rowOutput += '<ul class="extended-options"><li>';
                rowOutput += (rs[i].FAV == 1 ? ('<img id="fav_' + rs[i].ACCT_NO + '" width="16" height="16" alt="" src="img/star.png" onclick="ssp.webdb.setCustomerFav(' + "'" + rs[i].ACCT_NO + "'" + ')"/>') : ('<img id="fav_' + rs[i].ACCT_NO + '" width="16" height="16" alt="" src="img/starEmpty.png" onclick="ssp.webdb.setCustomerFav(' + "'" + rs[i].ACCT_NO + "'" + ')"/>')); // + '</span>';
                if (window.localStorage.getItem("ssp_custsalesbubble") == 1) rowOutput += '<span class="number">' + rs[i].NUMSALES + '</span>';
                rowOutput += '</li></ul>';
            } else {
                rowOutput += '<ul class="extended-options"><li><strong>' + rs[i].TECH_NO + '</strong></li></ul>';

            }

            rowOutput += '</li>';
        }
        //rowOutput += '</ul></div></div></div></section></article>';
        reccount = Math.max(0, $('#customerlistcount').html()) + i;
        var listid = (Math.max(0, Math.ceil(reccount / CUSTPAGING)));
        rowOutput += '<div id="customerlist' + listid + '"></div>';
        rowOutput += '</ul></div>';
        var rectotal = Math.max(rs.length, $('#customerlisttotal').html());
        var moreOutput = '<div id="customermore"><img src="img/arrowCurveLeft.png" width="16" height="16" class="picto"> <div style="display:inline-block" id="customerlistcount">' + reccount + '</div> of <div style="display:inline-block" id="customerlisttotal">' + rectotal + '</div> items  ';
        if (reccount != rectotal) moreOutput += '<button type="button" onClick="ssp.webdb.getCustomersList(\'' + currfilter + '\',' + Math.min((reccount), rectotal) + ');">Show More</button></div>';
    }
    $('#customerlist' + Math.max(0, (Math.ceil(reccount / CUSTPAGING) - 1))).html(rowOutput);
    $('#customermore').html(moreOutput);
    $(document.body).applyTemplateSetup();

    $('#searchcustomers').keyup(function () {
        delay(function () {
            ssp.webdb.searchCustomers();
        }, 0);
    });

}

//JKS101817***Added Nitrogen Days to Customer Accounts.***
//JKS102116***Removed Editing Abilities from Contact, Phone, Address, City, State, and Zip in the Customer Info list.***
//JKS102116***Removed Business Name, Herd, Breeds 1-3, and Routes from the Customer Info list.***
//JKS102116***Changed "Phone/Contact" to "Phone Number" int the Customer Info list.*** 
//JKS100416***Added a Customer Note field SP6 to Customer Info.***
//JKS100316***Added BREED2 and BREED3 fields to Customer Info and Changed SP3 to BREED1***
//JKS091416***Added CONTACT NAME field to Customer Info.***
//JKS090716***Added BUSINESS NAME, HERD SIZE, BREED, & ROUTE NUMBER fields to Customer Info.***
function loadCustomerDetail(rs) {

    var rowOutput = '<article>';
    rowOutput += '<div id="custmsg" class="block-border">';
    rowOutput += '<div id="fallcreditmsg" class="block-border">';
    rowOutput += '<div class="block-content no-padding">';
    rowOutput += '<h1>';
    rowOutput += '<div id="custname">' + rs[0].NAME + '</div><div id="acctid">' + rs[0].ACCT_NO + '</div>';
    rowOutput += '<div id="custdisc1" style="display:none">' + rs[0].DISC1 + '</div><div id="custdisc2" style="display:none">' + rs[0].DISC2 + '</div>';
    if ((window.localStorage.getItem("ssp_projectid") == 'ssc') || (window.localStorage.getItem("ssp_projectid") == 'sess') || (window.localStorage.getItem("ssp_projectid") == 'ecss')) {
        rowOutput += '<div id="custrate1" style="display:none">' + (rs[0].TAXABLE.split(':')[0] * .00001) + '</div><div id="custrate2" style="display:none">' + (rs[0].TAXABLE.split(':')[1] * .00001) + '</div><div id="taxstate" style="display:none">' + (rs[0].STATE) + '</div>';
    }
    if (window.localStorage.getItem("ssp_projectid") == 'mnss' && rs[0].STATE == 'ND' || window.localStorage.getItem("ssp_projectid") == 'mnss' && rs[0].STATE == 'MN') {
        rowOutput += '<div id="custrate1" style="display:none">' + (rs[0].TAXABLE.split(':')[0]) + '</div><div id="custrate2" style="display:none">' + (rs[0].TAXABLE.split(':')[1]) + '</div><div id="taxstate" style="display:none">' + (rs[0].STATE) + '</div>';
    }
    rowOutput += '</h1>';
    rowOutput += '<div class="block-controls">';
    rowOutput += '<ul class="controls-tabs js-tabs">';
    rowOutput += '<li class="current"><a href="#tab-orders" title="Orders">Orders</a></li>';
    rowOutput += '<li><a href="#tab-notes" title="Notes">Notes' + ((rs[0].NUMNOTES > 0) ? '<span class="nb-events"> ' + rs[0].NUMNOTES + '</span>' : '') + '</a></li>';
    rowOutput += '<li><a href="#tab-info" title="Info">Info</a></li>';
    rowOutput += '<li><a href="#tab-ar" title="A/R">Finance</a></li>';
    rowOutput += '<li><a href="#tab-docs" title="Docs">Docs</a></li>';
    rowOutput += '</ul>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-orders">';
    rowOutput += '<div id="orderlist"></div>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-notes">';
    rowOutput += '<div id="notelist">';
    rowOutput += '</div>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-info">';
    rowOutput += '<ul class="simple-list" >';
    rowOutput += '<li><strong>CONTACT NAME:</strong> ' + rs[0].SP2 + '</li>';
    if (window.localStorage.getItem("ssp_projectid") == 'ecss') {       /*JKS051718***v4.01->Added Phone Number edit for ECSS only*/
        rowOutput += '<li>';
        rowOutput += '<strong>PHONE NUMBER:</strong> <div id="CustomerPhone" style="display:inline-block"> ' + rs[0].ADDR1 + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustphone" onclick="ssp.webdb.modCustomerPhone(\'' + rs[0].ADDR1 + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
        rowOutput += '</li>';
    } else {
        rowOutput += '<li><strong>PHONE NUMBER:</strong> ' + rs[0].ADDR1 + '</li>';
    }
    rowOutput += '<li><strong>ADDRESS:</strong> ' + rs[0].ADDR2 + '</li>';
    rowOutput += '<li><strong>CITY:</strong> ' + rs[0].CITY + '</li>';
    rowOutput += '<li><strong>STATE:</strong> ' + rs[0].STATE + '</li>';
    rowOutput += '<li><strong>ZIP:</strong> ' + rs[0].ZIP + '</li>';
    rowOutput += '<li>';
    rowOutput += '<strong>EMAIL:</strong> <div id="CustomerEmail" style="display:inline-block"> ' + rs[0].MEMBER + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustemail" onclick="ssp.webdb.modCustomerEmail(\'' + rs[0].MEMBER + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
    rowOutput += '</li>';
    if (window.localStorage.getItem("ssp_techfunc") == 0) {   //JKS111517***Added IfElse statement to ONLY allow for TechIdMaster to Edit.***
        if (rs[0].SP6 == null) {      //JKS122117***3.100.36->Added a check for NULL CustomerNotes***
            rowOutput += '<li>';
            rowOutput += '<strong>CUSTOMER NOTE: </strong> <div id="CustomerNote" style="display:inline-block">' + " " + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnote" onclick="ssp.webdb.modCustomerNote(\'' + " " + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
            rowOutput += '</li>';
        } else {
            rowOutput += '<li>';
            rowOutput += '<strong>CUSTOMER NOTE: </strong> <div id="CustomerNote" style="display:inline-block">' + rs[0].SP6 + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnote" onclick="ssp.webdb.modCustomerNote(\'' + rs[0].SP6 + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
            rowOutput += '</li>';
        }
    } else {
        if (rs[0].SP6 == null) {      //JKS122117***3.100.36->Added a check for NULL CustomerNotes***
            rowOutput += '<li><strong>CUSTOMER NOTE: </strong>' + " " + '</li>';
        } else {
            rowOutput += '<li><strong>CUSTOMER NOTE: </strong>' + rs[0].SP6 + '</li>';
        }
    }
    if (window.localStorage.getItem("ssp_techfunc") == 0) {   //JKS111517***Added IfElse statement to ONLY allow for TechIdMaster to Edit.***
        if ((rs[0].SP7 == null) || (rs[0].SP7 == " ") || (rs[0].SP7 == "")) {      //JKS020718***3.100.37->ADDED both "" and " " to NitroDays check***//JKS013018***3.100.37->Changed or '' to or " " for NitroDays check***//JKS011818***3.100.37->Added or '' to NitroDays check***//JKS122117***3.100.36->Added a check for NULL NitroDays***
            rowOutput += '<li>';
            rowOutput += '<strong>NITROGEN DAYS: </strong> <div id="CustomerNitroDays" style="display:inline-block">' + "" + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnitrodays" onclick="ssp.webdb.modCustomerNitroDays(\'' + rs[0].SP7 + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';      //JKS021218***3.100.37->Changed Displayed value from window.localStorage.getItem("ssp_nitrodays") to ""***  //JKS020118***3.100.37->Changed " " to window.localStorage.getItem("ssp_nitrodays") for Display***
            rowOutput += '</li>';
        } else {
            rowOutput += '<li>';
            rowOutput += '<strong>NITROGEN DAYS: </strong> <div id="CustomerNitroDays" style="display:inline-block">' + rs[0].SP7 + '&nbsp;&nbsp;<a href="javascript:void(0)" class="float-right" title="modcustnitrodays" onclick="ssp.webdb.modCustomerNitroDays(\'' + rs[0].SP7 + '\')"><img src="img/pencil.png" width="16" height="16"/></a></div>';
            rowOutput += '</li>';
        }
    } else {
        if ((rs[0].SP7 == null) || (rs[0].SP7 == " ") || (rs[0].SP7 == "")) {      //JKS020718***3.100.37->ADDED both "" and " " to NitroDays check***//JKS013018***3.100.37->Changed or '' to or " " for NitroDays check***//JKS011818***3.100.37->Added or '' to NitroDays check***//JKS122117***3.100.36->Added a check for NULL NitroDays***
            rowOutput += '<li><strong>NITROGEN DAYS: </strong>' + "" + '</li>';      //JKS021218***3.100.37->Changed Displayed value from window.localStorage.getItem("ssp_nitrodays") to ""***//JKS020118***3.100.37->Changed " " to window.localStorage.getItem("ssp_nitrodays") for Display***
        } else {
            rowOutput += '<li><strong>NITROGEN DAYS: </strong>' + rs[0].SP7 + '</li>';
        }
    }
    if (rs[0].DISC1 == null) {
        rowOutput += '<li><strong>DISCOUNT %:</strong> 0 </li>';
    }
    else {
        rowOutput += '<li><strong>DISCOUNT %:</strong> ' + rs[0].DISC1 + '</li>';
    }
    rowOutput += '<li><strong>DISC MAX $: </strong> ' + (((!rs[0].DISC2)) ? 0 : rs[0].DISC2.toFixed(2)); + '</li>';
    if (window.localStorage.getItem("ssp_projectid") == 'ssc') {
        rowOutput += '<li><strong>G.S.T./H.S.T. (RT869132142):</strong> ' + (rs[0].TAXABLE.split(':')[0] * .00001) + '</li>';
        rowOutput += '<li><strong>T.V.Q. (1087751925):</strong> ' + (rs[0].TAXABLE.split(':')[1] * .00001) + '</li>';
    }
    if (window.localStorage.getItem("ssp_projectid") == 'sess') {
        rowOutput += '<li><strong>Tax Rate 1:</strong> ' + (rs[0].TAXABLE.split(':')[0] * .00001) + '</li>';
        rowOutput += '<li><strong>Tax Rate 2:</strong> ' + (rs[0].TAXABLE.split(':')[1] * .00001) + '</li>';
    }
    if (rs[0].MOD) {
        rowOutput += '<li><div class="align-right"><a href="javascript:void(0)" class="button" id="del' + rs[0].ACCT_NO + '" title="delete" onclick="ssp.webdb.deleteCustomer(' + "'" + rs[0].ACCT_NO + "'" + ')"><img src="img/bin.png" width="16" height="16"></a></div></li>';
    }
    rowOutput += '</ul>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-ar">';
    rowOutput += '<div id="custar">';
    rowOutput += '</div>';
    rowOutput += '</div>';

    rowOutput += '<div id="tab-docs">';
    rowOutput += '<div id="docs">';
    //rowOutput += '<body style="margin:0px;padding:0px;overflow:hidden">';
    var currUrl = window.localStorage.getItem('ssp_urldata');
    var docUrl = (currUrl.substr(currUrl.length - 7) == 'SSPweb/') ? currUrl.replace('SSPweb/', '') : currUrl.replace('SSPweb', '');
    rowOutput += '<iframe src="' + docUrl + '/Docs/Docs.aspx?type=customer&pkid=' + rs[0].ACCT_NO + '" onload="resize_iframe()" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>';
    //rowOutput += '</body>';
    rowOutput += '</div>';
    rowOutput += '</div>';

    rowOutput += '</div>';
    rowOutput += '</div>';
    rowOutput += '</article>';

    $('#maincontent').html(rowOutput);
    $('#tab-orders').onTabShow(function () {
        ssp.webdb.getCustomersOrders(rs[0].ACCT_NO);
    });
    $('#tab-notes').onTabShow(function () {
        ssp.webdb.getCustomersNotes(rs[0].ACCT_NO);
    });
    $('#tab-ar').onTabShow(function () {
        ssp.webdb.getCustomersAR(rs[0].ACCT_NO);
    });
    $(document.body).applyTemplateSetup();

    if (window.localStorage.getItem("ssp_projectid") == 'sess') {
        var fcAS400 = rs[0].SP_RATE;
        var fcPending = 0;
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('SELECT SUM(SIQTY*SIPRC) AS amtSales FROM tblSales WHERE (SIINVO = "0" OR SIINVO IS NULL) AND (SILVL4="1.0" OR SILVL4="1") AND SIACT = "' + rs[0].ACCT_NO + '"', [],
                function (rs) {
                    if (rs[0].amtSales) {
                        fcPending = rs[0].amtSales * .60;     /*JKS080818->4.03***SESS Fall Credit rate changed from .50 to .60*/
                    }
                    if ((fcAS400 + fcPending) > 0) {
                        var fcMsg = 'Fall Credit: $' + fcAS400.toFixed(2);
                        if (fcPending > 0) {
                            fcMsg += ' (pend:' + fcPending.toFixed(2) + ')';
                        }
                        $('#fallcreditmsg').removeBlockMessages().blockMessage(fcMsg, { type: 'success' });
                    }
                }, ssp.webdb.onError);
        });
    }


    //check 90 day balance
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblCustomersAR WHERE ACCT_NO = "' + rs[0].ACCT_NO + '"', [],
            function (rs) {
                if (rs.length > 0) {
                    if (rs[0].OVER_90 > 0) {
                        $('#custmsg').removeBlockMessages().blockMessage('Customer has balance over ' + ((window.localStorage.getItem("ssp_projectid") == 'mnss') ? '60' : '90') + ' days.', { type: 'error' });
                    }
                }
            }, ssp.webdb.onError);
    });

}

function loadCustomerAR(rs) {

    var rowOutput = '<ul class="simple-list with-icon icon-info with-padding">';
    if (window.localStorage.getItem("ssp_projectid") == 'mnss') {
        rowOutput += '<li><strong>BALANCE:</strong> ' + rs[0].BALANCE + '</li>';
        rowOutput += '<li><strong>0-30:</strong> ' + rs[0].CURRENT + '</li>';
        rowOutput += '<li><strong>31-60:</strong> ' + rs[0].OVER_DUE + '</li>';
        rowOutput += '<li><strong>OVER 60:</strong> ' + rs[0].OVER_90 + '</li>';
        rowOutput += '<li><strong>LAST PAY DATE:</strong> ' + format120Date(rs[0].OVER_120) + '</li>';
        rowOutput += '<li><strong>LAST PAYMENT ($):</strong> ' + rs[0].PAYMENTS.toFixed(2) + '</li>';
    } else if (window.localStorage.getItem("ssp_projectid") == 'ssp') {
        rowOutput += '<li><strong>BALANCE:</strong> ' + rs[0].BALANCE + '</li>';
        rowOutput += '<li><strong>CURRENT:</strong> ' + rs[0].CURRENT + '</li>';
        rowOutput += '<li><strong>OVER DUE:</strong> ' + rs[0].OVER_DUE + '</li>';
        rowOutput += '<li><strong>OVER 90:</strong> ' + rs[0].OVER_90 + '</li>';
        rowOutput += '<li><strong>LAST PAY DATE:</strong> ' + format120Date(rs[0].OVER_120) + '</li>';
        rowOutput += '<li><strong>CURRENT MONTH PAYMENT:</strong> ' + rs[0].PAYMENTS.toFixed(2) + '</li>';
    } else {
        rowOutput += '<li><strong>BALANCE:</strong> ' + rs[0].BALANCE + '</li>';
        rowOutput += '<li><strong>CURRENT:</strong> ' + rs[0].CURRENT + '</li>';
        rowOutput += '<li><strong>OVER DUE:</strong> ' + rs[0].OVER_DUE + '</li>';
        rowOutput += '<li><strong>OVER 90:</strong> ' + rs[0].OVER_90 + '</li>';
        rowOutput += '<li><strong>LAST PAY DATE:</strong> ' + format120Date(rs[0].OVER_120) + '</li>';
        rowOutput += '<li><strong>LAST PAYMENT:</strong> ' + rs[0].PAYMENTS.toFixed(2) + '</li>';
    }
    rowOutput += '</ul>';

    $('#custar').html(rowOutput);

}

function loadCustomerNotes(rs) {

    var rowOutput = '<div class="task">';
    rowOutput += '<ul class="task-dialog">';
    rowOutput += '<li>';
    rowOutput += '<form class="form input-with-button" onsubmit="return ssp.webdb.addCustomerNote(' + "'" + $('#acctid').html() + "'" + ');">';
    rowOutput += '<button class="float-right" type="submit">Add</button>';
    rowOutput += '<textarea id="txtAddNote" name="txtAddNote" value="" class="form input-with-button"></textarea>';
    rowOutput += '</form>';
    rowOutput += '</li>';


    if (rs.length == 0) {
        rowOutput += '<li>Sorry, no messages to list.</li>';
    }
    else {

        for (var i = 0; i < rs.length; i++) {
            var note_date = formatDate(rs[i].MODSTAMP);
            var note_html = rs[i].NOTE.replace(/\n\r?/g, '<br />');
            rowOutput += '<li>';
            rowOutput += note_html;
            rowOutput += '<br /><strong>' + rs[i].TECH_NO + '</strong><em>-' + note_date + '  </em>';
            if (rs[i].MOD) {
                rowOutput += '<a href="#" class="button" id="delnote' + i + '" title="delete" onclick="ssp.webdb.deleteCustomerNote(' + "'" + rs[i].PKIDDroid + "'," + i + ')"><img src="img/bin.png" width="16" height="16"></a>';
            }
            rowOutput += '</li>';
        }
    }
    rowOutput += '</ul></div>';
    $('#notelist').html(rowOutput);

}

function loadCustomerOrders(rs) {

    var rowOutput = '<p style="margin-top: 5px" ><button class="full-width" onclick="ssp.webdb.getOrder(-1,1);">Create Order</button></p>';
    rowOutput += '<ul class="blocks-list with-padding ">';

    if (rs.length == 0) {
        rowOutput += '<li>Sorry, no orders to list.</li>';
        rowOutput += '</ul>';
    }
    else {

        for (var i = 0; i < rs.length; i++) {
            //msg.substring(0, msg.indexOf("|"))
            var orderDate = rs[i].SIORNM
            rowOutput += '<li onclick="ssp.webdb.getOrder(' + "'" + rs[i].SIORNM + "'" + ',' + ((rs[i].MODIFIED > 0) ? 1 : 0) + ')">';
            rowOutput += '<a href="#" class="float-left"><img src="img/status' + ((rs[i].MODIFIED > 0) ? 'Away' : '') + '.png" width="16" height="16"> ' + rs[i].SIORNM + '<h4>' + ((rs[i].MODIFIED > 0) ? ('items to sync: ' + rs[i].MODIFIED) : rs[i].SIINVO) + '</h4></a>';
            rowOutput += '<ul class="floating-tags float-right">';
            rowOutput += '<li class="tag-date"> ' + formatDate(rs[i].SIDATO) + '</li>';
            rowOutput += '<li class="tag-money"> ' + rs[i].ORDERCOUNTITEM + ' - ' + (rs[i].ORDERTOTAL + rs[i].ARMTOTAL).toFixed(2) + '</li>';
            if (!!rs[i].NITROCOUNT) {
                rowOutput += '<span class="number"> ' + 'Nitrogen' + '</span>';
            }
            if (!!rs[i].POATOTAL) {
                rowOutput += '<span class="number"> ' + 'POA' + '</span>';
            }
            rowOutput += '</ul>';
            rowOutput += '</li>';
        }
        rowOutput += '</ul>';
    }
    $('#orderlist').html(rowOutput);

}

function getNewCustomerID() {

    $('#custacct').html("N" + window.localStorage.getItem("ssp_TechID") + randomString().substr(0, (3 + (4 - window.localStorage.getItem("ssp_TechID").length))));

}

//JKS101817***Added custnitrodays text field to New Customers.***
//JKS100416***Added custnote text field to New Customers.***
//JKS100316***Added custbreed2 and custbreed3 text fields to New Customers.***
//JKS091416***Added contname text fields to New Customer...Changed order Name fields.***
//JKS090716***Added businame, custherd, custbreed, & custroute text fields to New Customer.***

function loadCustomerNew() {
    var divContent = '<section id="login-block">';
    var req = "";

    divContent += '<div class="block-border"><form class="form block-content" name="login-form" id="login-form" onsubmit="return ssp.webdb.addCustomer()" action="">';
    divContent += '<h1>New Customer</h1>';

    divContent += '<div class="block-border with-margin"><h3>Temporary Customer ID</h3>';
    divContent += '<h4><div id="custacct"></div></h4></div>';

    if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
        req = "required";
    }

    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Customer Name</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custname" id="custname" class="full-width" value="" ' + req + '>';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Business Name</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="businame" id="businame" class="full-width" value="">';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Contact Name</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="contname" id="contname" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">Address</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custaddr2" id="custaddr2" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">City</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custcity" id="custcity" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">State</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custstate" id="custstate" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">Zip</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custzip" id="custzip" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">Phone</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custaddr" id="custaddr" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="mail">Email</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custemail" id="custemail" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Herd Size</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custherd" id="custherd" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Breed 1</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custbreed1" id="custbreed1" class="full-width" value="" ' + req + '>';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Breed 2</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custbreed2" id="custbreed2" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Breed 3</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custbreed3" id="custbreed3" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Sales Route #</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custroute" id="custroute" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Customer Note</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custnote" id="custnote" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-small-label">';
    divContent += '<label for="name">Customer Nitrogen Days</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="custnitrodays" id="custnitrodays" class="full-width" value="" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';


    divContent += '<p><button type="submit" class="full-width">Save</button></p>';
    divContent += '</form></div></section>'

    $('#maincontent').html(divContent);
    getNewCustomerID();
}



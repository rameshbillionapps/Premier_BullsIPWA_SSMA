//jQuery.timeago.settings.allowFuture = true;
var ssp = {};
// STAGE var urldata = "http://sspweb.yitsdev.com/SSPweb";
// DEV var urldata = "http://10.1.7.29/SSPweb/SSPweb"

//ssp.syntax = SyntaxHighlighter;
ssp.webdb = {};
ssp.webdb.db = null;

$(document).ready(function () {
    window.isphone = false;
    if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 && document.URL.indexOf('MyGit') === -1 && document.URL.indexOf('SSP_BullsI') === -1) {       //JKS042817***Replaced myYITS with SSP_BullsI to debug on PC*** //RP102616***Added myYITS to check if not on a Device.***
        window.isphone = true;
    }
    if (window.isphone) {
        document.addEventListener('deviceready', onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});

ssp.webdb.onError = function (tx, e) { alert('Database Error: ' + e.message); }
ssp.webdb.onSuccess = function (tx, r) { }
ssp.webdb.createTables = function () {
        
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS tblCustomers( \
			ACTIVE TEXT, \
			TYPE_AREA TEXT, \
			SP1 TEXT, \
			ACCT_NO TEXT, \
			NAME TEXT, \
			ADDR1 TEXT, \
			ADDR2 TEXT, \
			CITY TEXT, \
			STATE TEXT, \
			SP2 TEXT, \
			ZIP TEXT, \
			BREED1 TEXT, \
			BREED2 TEXT, \
			BREED3 TEXT, \
			TYPE TEXT, \
			SP3 TEXT, \
			TECH_NO TEXT, \
			MEMBER TEXT, \
			DISC1 FLOAT, \
			DISC2 FLOAT, \
			W_O TEXT, \
			SP4 TEXT, \
			L_PMT_M FLOAT, \
			SP5 TEXT, \
			L_PMT_Y FLOAT, \
			SP6 TEXT, \
			L_PUR_M FLOAT, \
			SP7 TEXT, \
			L_PUR_Y FLOAT, \
			SP8 TEXT, \
			SP_ACCT TEXT, \
			SP9 TEXT, \
			SP_RATE FLOAT, \
			SL_AREA TEXT, \
			SP10 TEXT, \
			COUNTY TEXT, \
			TAXABLE TEXT, \
			MOD INTEGER, \
			MODSTAMP INTEGER, \
			FAV INTEGER)', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE INDEX IF NOT EXISTS cust_index ON tblCustomers( ACCT_NO, NAME, ADDR1)', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblCustomersAR( \
			ACTIVE TEXT, \
			ACCT_NO TEXT, \
			BALANCE FLOAT, \
			CURRENT FLOAT, \
			OVER_DUE FLOAT, \
			OVER_90 FLOAT, \
			OVER_120 FLOAT, \
			PAYMENTS FLOAT)' , [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE INDEX IF NOT EXISTS custar_index ON tblCustomersAR( ACCT_NO )', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblCustomerNotes( \
			PKIDDroid TEXT, \
			TECH_NO TEXT, \
			ACCT_NO TEXT, \
			NOTE TEXT, \
			MOD INTEGER, \
			MODSTAMP INTEGER)' , [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE INDEX IF NOT EXISTS custnotes_index ON tblCustomerNotes( ACCT_NO )', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblMileage( \
			PKIDDroid TEXT, \
			TECH_NO TEXT, \
			MILEAGEBEGIN INTEGER, \
			MILEAGEEND INTEGER, \
			MILEAGEDATE INTEGER, \
			PERSONAL INTEGER, \
			WORKEDFOR  TEXT, \
			MOD INTEGER, \
			MODSTAMP INTEGER)' , [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE INDEX IF NOT EXISTS mile_index ON tblMileage( PKIDDroid, MILEAGEDATE )', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblTimesheet( \
			PKIDDroid TEXT, \
			TECH_NO TEXT, \
			TIMESHEETDATE INTEGER, \
			TIMESHEETHALF INTEGER, \
			TIMESHEETCODE TEXT, \
            WORKEDFOR  TEXT, \
			MOD INTEGER, \
			MODSTAMP INTEGER)' , [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE INDEX IF NOT EXISTS time_index ON tblTimesheet( PKIDDroid, TIMESHEETDATE )', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblSales( \
			SIACT TEXT, \
			SIINVL TEXT, \
			SIORNM TEXT, \
			SIINVO TEXT, \
			SIDATO FLOAT, \
			SITIMO FLOAT, \
			SITYPS TEXT, \
			SICOD TEXT, \
			SIQTY FLOAT, \
			SIMATH TEXT, \
			SINAM TEXT, \
			SIPRC FLOAT, \
			SITYPI TEXT, \
			SICOW TEXT, \
			SIARM FLOAT, \
			SISTP FLOAT, \
			SIOTH FLOAT, \
			SILIN FLOAT, \
			SISEM FLOAT, \
			SIPOA FLOAT, \
			SISUP FLOAT, \
			SICDI FLOAT, \
			SIPGA FLOAT, \
			SIDSC FLOAT, \
			SIREP TEXT, \
			SIANM TEXT, \
			SILVL1 TEXT, \
			SILVL2 TEXT, \
			SILVL3 TEXT, \
			SILVL4 TEXT, \
			SILVL5 TEXT, \
			SIRETL FLOAT, \
            FRZDAT FLOAT, \
            LOTNOT TEXT, \
            SIDATOYYYYMMDD TEXT, \
            BREEDTYPE TEXT, \
            FRZYYYYMMDD TEXT, \
			MOD INTEGER, \
			MODSTAMP INTEGER)', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE INDEX IF NOT EXISTS sales_index ON tblSales( SIACT,SIINVL )', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblBulls( \
			SICOD TEXT, \
			ACTIVE TEXT, \
			S_SUPPLY TEXT, \
			BREED TEXT, \
			BLK1 TEXT, \
			BULLNO FLOAT, \
			BLK2 TEXT, \
			STUD FLOAT, \
			B_NAME TEXT, \
			PRICE1 FLOAT, \
			PUR_COST FLOAT, \
			PRICE2 FLOAT, \
			PRICE3 FLOAT, \
			ROY_COST FLOAT, \
			SS_CON TEXT, \
			MAX_DISC TEXT, \
			SS TEXT, \
			GS TEXT, \
			QOH FLOAT, \
            FRZDAT FLOAT, \
            FRZYYYYMMDD TEXT)' , [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE INDEX IF NOT EXISTS bull_index ON tblBulls( SICOD, B_NAME )', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblSupplies( \
			SICOD TEXT, \
			ACTIVE TEXT, \
            STOCK_NO TEXT, \
			DESC TEXT, \
			PRICE FLOAT, \
			COST FLOAT, \
			MIN_HAND FLOAT, \
            STATETAXABLE TEXT, \
            STTAXLIST TEXT, \
			QOH FLOAT)' , [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE INDEX IF NOT EXISTS supp_index ON tblSupplies( STOCK_NO, DESC )', [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblTechTransfer( \
			TechID TEXT, \
			TransferList INTEGER, \
			TransferListName TEXT)' , [], ssp.webdb.onSuccess, ssp.webdb.onError);

        tx.executeSql('CREATE TABLE IF NOT EXISTS tblTechRelief( \
			TechIDMaster TEXT, \
			TechIDRelief Text, \
			MOD INTEGER,\
			MODSTAMP INTEGER)' , [], ssp.webdb.onSuccess, ssp.webdb.onError);
    
    });

}

ssp.webdb.getSync = function () {
    $('#custlist').load('sync.html.');
}

ssp.webdb.syncDB = function () {

    $('#loader').ajaxStart(function () {
        $(this).show();
        $('#syncbutton').hide();
    });

    $('#loader').ajaxStop(function () {
        $('#loader').hide();
        window.localStorage.setItem('ssp_initial_sync', 1);
        window.localStorage.setItem('ssp_last_sync', $('#salesynccnt').html() + '@' + $('#salesyncamt').html() + ' - ' + formatDate(Math.round(new Date().getTime() / 1000)));
        $('#syncbutton').show();
    });

    //ssp.webdb.createTables();   //RP111016 ***OnlyCreateInBeginning***
    ssp.webdb.prepSync();

}

ssp.webdb.prepSync = function () {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/prepSyncV3/" + window.localStorage.getItem("ssp_TechID") + "/" + window.localStorage.getItem("ssp_TechGUID") + "/" + sspversion + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, err) {
            alert(xhr.statusText);
        },
        success: function (msg) {

            ssp.webdb.sendCustomers(msg);
            ssp.webdb.sendCustomerNotes(msg);
            ssp.webdb.sendSales(msg);
            ssp.webdb.sendMileage(msg);
            ssp.webdb.sendTimesheet(msg);
            ssp.webdb.sendTechRelief(msg);

            ssp.webdb.clearLocalData();

            //	    	ssp.webdb.getServerDataCustomers();
            //ssp.webdb.getServerDataBulls();
            //ssp.webdb.getServerDataSupplies();
            //ssp.webdb.getServerDataCustomersAR();
            //ssp.webdb.getServerDataTechTransfer();
            //	    	ssp.webdb.getServerDataSales();

        }
    });
}

ssp.webdb.clearLocalData = function () {
    ssp.webdb.db.transaction(function (tx) {
        //        tx.executeSql('DELETE FROM tblCustomers', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        tx.executeSql('DELETE FROM tblBulls', [], ssp.webdb.getServerDataBulls(), ssp.webdb.onError);
        tx.executeSql('DELETE FROM tblSupplies', [], ssp.webdb.getServerDataSupplies(), ssp.webdb.onError);
        tx.executeSql('DELETE FROM tblCustomersAR', [], ssp.webdb.getServerDataCustomersAR(), ssp.webdb.onError);
        tx.executeSql('DELETE FROM tblTechTransfer', [], ssp.webdb.getServerDataTechTransfer(), ssp.webdb.onError);
        tx.executeSql('DELETE FROM tblMileage', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        //        tx.executeSql('DELETE FROM tblTimesheet', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        //        tx.executeSql('DELETE FROM tblSales', [], ssp.webdb.onSuccess, ssp.webdb.onError);
    });
}

ssp.webdb.getServerDataCustomers = function () {

    // sync customers
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/tblAS400Customers/" + window.localStorage.getItem("ssp_TechID") + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, error) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            var sspBarCnt = JSON.parse(msg).length;
            $('#custtot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                $.each(JSON.parse(msg), function (i, item) {
                    tx.executeSql('INSERT INTO tblCustomers(ACTIVE, \
                			TYPE_AREA, \
                			SP1, \
                			ACCT_NO, \
                			NAME, \
                			ADDR1, \
                			ADDR2, \
                			CITY, \
                			STATE, \
                			SP2, \
                			ZIP, \
                			BREED1, \
                			BREED2, \
                			BREED3, \
                			TYPE, \
                			SP3, \
                			TECH_NO, \
                			MEMBER, \
                			DISC1, \
                			DISC2, \
                			W_O, \
                			SP4, \
                			L_PMT_M, \
                			SP5, \
                			L_PMT_Y, \
                			SP6, \
                			L_PUR_M, \
                			SP7, \
                			L_PUR_Y, \
                			SP8, \
                			SP_ACCT, \
                			SP9, \
                			SP_RATE, \
                			SL_AREA, \
                			SP10, \
                			COUNTY, \
                			TAXABLE, \
                			MOD, \
                			MODSTAMP, \
                    		FAV) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [item.ACTIVE, item.TYPE_AREA, item.SP1, item.ACCT_NO, item.NAME, item.ADDR1, item.ADDR2, item.CITY, item.STATE, item.SP2, item.ZIP, item.BREED1, item.BREED2, item.BREED3, item.TYPE, item.SP3, item.TECH_NO, item.MEMBER, item.DISC1, item.DISC2, item.W_O, item.SP4, item.L_PMT_M, item.SP5, item.L_PMT_Y, item.SP6, item.L_PUR_M, item.SP7, item.L_PUR_Y, item.SP8, item.SP_ACCT, item.SP9, item.SP_RATE, item.SL_AREA, item.SP10, item.COUNTY, item.TAXABLE, 0, 0, item.FAV], ssp.webdb.onSuccess, ssp.webdb.onError);
                    $('#custcurr').html(i + 1);
                    $('#custbar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
            });
        }
    });
}

ssp.webdb.getServerDataCustomersAR = function () {

    // sync customers
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/tblAS400CustomersAR/" + window.localStorage.getItem("ssp_TechID") + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, error) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            var sspBarCnt = JSON.parse(msg).length;
            $('#cuartot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                $.each(JSON.parse(msg), function (i, item) {
                    tx.executeSql('INSERT INTO tblCustomersAR( \
                 			ACTIVE, \
                			ACCT_NO, \
                			BALANCE, \
                			CURRENT, \
                			OVER_DUE, \
                			OVER_90, \
                			OVER_120, \
                    		PAYMENTS) VALUES (?,?,?,?,?,?,?,?)', [item.ACTIVE, item.ACCT_NO, item.BALANCE, item.CURRENT, item.OVER_DUE, item.OVER_90, item.OVER_120, item.PAYMENTS], ssp.webdb.onSuccess, ssp.webdb.onError);
                    $('#cuarcurr').html(i + 1);
                    $('#cuarbar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
            });
        }
    });
}

ssp.webdb.getServerDataTechTransfer = function () {

    // sync tech transfer list
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/tblTechTransfers/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, error) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            var sspBarCnt = JSON.parse(msg).length;
            $('#techtot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                $.each(JSON.parse(msg), function (i, item) {
                    tx.executeSql('INSERT INTO tblTechTransfer( \
                 			TechID, \
                			TransferList, \
                    		TransferListName) VALUES (?,?,?)', [item.TechID, item.TransferList, item.TransferListName], ssp.webdb.onSuccess, ssp.webdb.onError);
                    $('#techcurr').html(i + 1);
                    $('#techbar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
            });
        }
    });
}

ssp.webdb.getServerDataTechRelief = function () {

    // sync tech transfer list
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/tblTechRelief/" + window.localStorage.getItem("ssp_TechID") + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, error) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            //var sspBarCnt = JSON.parse(msg).length;
            //$('#techtot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                $.each(JSON.parse(msg), function (i, item) {
                    tx.executeSql('INSERT INTO tblTechRelief( \
                 			TechIDMaster, \
                 			TechIDRelief, \
                    		MOD) VALUES (?,?,?)', [item.TechIDMaster, item.TechIDRelief, 0], ssp.webdb.onSuccess, ssp.webdb.onError);
                    //$('#techcurr').html(i+1);
                    //$('#techbar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
            });
        }
    });
}

    ssp.webdb.getServerDataBulls = function () {
        // sync bulls
        var urlBulls = '/tblAS400Bulls/';
        //JKS051117***var urlBulls = '/tblAS400BullsNoFrz/';
        switch (window.localStorage.getItem("ssp_projectid")) {
            case 'sess':
            case 'ssc':
            case 'ps':
            case 'ecss':
            case 'mnss':
                //JKS051117***urlBulls = '/tblAS400Bulls/';
                break;
        }

    //JKS051117***((window.localStorage.getItem("ssp_projectid") == 1) ? '/tblAS400Bulls/' : '/tblAS400BullsNoFrz/');
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/tblAS400Bulls/" + window.localStorage.getItem("ssp_TechID") + "/" + Math.round(new Date().getTime() / 1000),    //JKS051117***Changed '/tblAS400BullsNoFrz/' to "/tblAS400Bulls/"
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, error) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            var sspBarCnt = JSON.parse(msg).length;
            $('#bulltot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                var bullcode = '';
                var coopid = window.localStorage.getItem("ssp_projectid");
                $.each(JSON.parse(msg), function (i, item) {
                    if (coopid == 'mnss') {
                        bullcode = ('000' + $.trim(item.STUD)).slice(-3) + $.trim(item.BREED) + ('00000' + $.trim(item.BULLNO)).slice(-5);
                    } else {
                        bullcode = ($.trim(item.STUD) + $.trim(item.BREED) + $.trim(item.BULLNO));
                    }
                    tx.executeSql('INSERT INTO tblBulls(SICOD, \
                    		ACTIVE, \
                			S_SUPPLY, \
                			BREED, \
                			BLK1, \
                			BULLNO, \
                			BLK2, \
                			STUD, \
                			B_NAME, \
                			PRICE1, \
                			PUR_COST, \
                			PRICE2, \
                			PRICE3, \
                			ROY_COST, \
                			SS_CON, \
                			MAX_DISC, \
                			SS, \
                			GS, \
                			QOH, \
                            FRZDAT, \
                            FRZYYYYMMDD) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [bullcode, item.ACTIVE, item.S_SUPPLY, item.BREED, item.BLK1, item.BULLNO, item.BLK2, item.STUD, item.B_NAME, item.PRICE1, item.PUR_COST, item.PRICE2, item.PRICE3, item.ROY_COST, item.SS_CON, item.MAX_DISC, item.SS, item.GS, item.QOH, ((!item.FRZDAT) ? 0 : item.FRZDAT), ((!item.FRZYYYYMMDD) ? '0' : item.FRZYYYYMMDD)], ssp.webdb.onSuccess, ssp.webdb.onError);     //JKS070617***FIXED Bull Inventory Info by changing item.FRZDAT to ((!item.FRZDAT) ? 0 : item.FRZDAT)***
                    $('#bullcurr').html(i + 1);
                    $('#bullbar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
            });
        }
    });
}

ssp.webdb.getServerDataSupplies = function () {

    // sync supplies
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/tblAS400Supplies/" + window.localStorage.getItem("ssp_TechID") + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, err) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            var sspBarCnt = JSON.parse(msg).length;
            $('#supptot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                $.each(JSON.parse(msg), function (i, item) {
                    tx.executeSql('INSERT INTO tblSupplies(ACTIVE, \
                			STOCK_NO, \
                			DESC, \
                			PRICE, \
                			COST, \
                			MIN_HAND, \
                            STATETAXABLE, \
                			QOH) VALUES (?,?,?,?,?,?,?,?)', [item.ACTIVE, item.STOCK_NO, item.DESC, item.PRICE, item.COST, item.MIN_HAND, item.STATETAXABLE, item.QOH], ssp.webdb.onSuccess, ssp.webdb.onError);

//                            STTAXLIST, \
//                			QOH) VALUES (?,?,?,?,?,?,?,?,?)', [item.ACTIVE, item.STOCK_NO, item.DESC, item.PRICE, item.COST, item.MIN_HAND, item.STATETAXABLE, item.STTAXLIST, item.QOH], ssp.webdb.onSuccess, ssp.webdb.onError);

                            $('#suppcurr').html(i + 1);
                    $('#suppbar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
            });
        }
    });
}

//JKS033117***Begin...Removed tblAS400SalesNoFrz***//JKS033017***Begin...ADDED tblAS400SalesNoFrz to function like v3.100.20 for SSP***//JKS111716***Begin...Removed tblAS400SalesNoFrz***
ssp.webdb.getServerDataSales = function () {
    // sync sales
    var urlSales = '/tblAS400Sales/';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
        case 'ssc':
        case 'ps':
        case 'ecss':
        case 'mnss':            
            break;
    }

    //ssp.webdb.getServerDataSales = function () {
    //    // sync sales
    //    var urlSales = '/tblAS400SalesNoFrz/';
    //    switch (window.localStorage.getItem("ssp_projectid")) {
    //        case 'sess':
    //        case 'ssc':
    //        case 'ps':
    //        case 'ecss':
    //        case 'mnss':
    //            urlSales = '/tblAS400Sales/';
    //            break;
    //    }
//JKS033117***End...Removed tblAS400SalesNoFrz***//JKS033017***END...ADDED tblAS400SalesNoFrz to function like v3.100.20 for SSP***//JKS111716***End...Removed tblAS400SalesNoFrz***

    var oldestsale = 0;
    var rep = window.localStorage.getItem("ssp_TechID");
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + urlSales + window.localStorage.getItem("ssp_TechID") + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, err) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            var sspBarCnt = JSON.parse(msg).length;
            $('#saletot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                $.each(JSON.parse(msg), function (i, item) {
                    tx.executeSql('INSERT INTO tblSales(SIACT, \
                			SIINVL, \
                			SIORNM, \
                			SIINVO, \
                			SIDATO, \
                			SITIMO, \
                			SITYPS, \
                			SICOD, \
                			SIQTY, \
                			SIMATH, \
                			SINAM, \
                			SIPRC, \
                			SITYPI, \
                			SICOW, \
                			SIARM, \
                			SISTP, \
                			SIOTH, \
                			SILIN, \
                			SISEM, \
                			SIPOA, \
                			SISUP, \
                			SICDI, \
                			SIPGA, \
                			SIDSC, \
                			SIREP, \
                			SIANM, \
                			SILVL1, \
                			SILVL2, \
                			SILVL3, \
                			SILVL4, \
                			SILVL5, \
                			SIRETL, \
                            FRZDAT, \
                            LOTNOT, \
                            SIDATOYYYYMMDD, \
                            FRZYYYYMMDD, \
                            MOD) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [item.SIACT, item.SIINVL, item.SIORNM, item.SIINVO, item.SIDATO, item.SITIMO, item.SITYPS, item.SICOD, item.SIQTY, item.SIMATH, item.SINAM, item.SIPRC, item.SITYPI, item.SICOW, item.SIARM, item.SISTP, item.SIOTH, item.SILIN, item.SISEM, item.SIPOA, item.SISUP, item.SICDI, item.SIPGA, item.SIDSC, item.SIREP, item.SIANM, item.SILVL1, item.SILVL2, item.SILVL3, item.SILVL4, item.SILVL5, item.SIRETL, (item.FRZDAT == null ? '' : item.FRZDAT), (item.LOTNOT == null ? '' : item.LOTNOT), item.SIDATOYYYYMMDD, item.FRZYYYYMMDD, 0], ssp.webdb.onSuccess, ssp.webdb.onError);   //JKS062717***Changed LOTNOT to (item.LOTNOT == null ? '' : item.LOTNOT) and FRZDAT to (item.FRZDAT == null ? '' : item.FRZDAT)*** //JKS111716***Changed FRZDAT value...Removed ((!item.FRZDAT) ? '0' : item.FRZDAT)***//JKS111416***Changed LOTNOT value...Removed ((!item.LOTNOT) ? '' : item.LOTNOT)*** 
                    if ((item.SITYPS == 'B' || item.SITYPS == 'D') && item.SIREP == rep && item.SIORNM != '0123004') {
                        if (((item.SIDATO * 1) < oldestsale) || oldestsale == 0) {
                            oldestsale = item.SIDATO;
                        }
                    }
                    $('#salecurr').html(i + 1);
                    $('#salesbar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
                window.localStorage.setItem('ssp_salemonths', oldestsale);
            });
        }
    });
}

ssp.webdb.getServerDataTimesheet = function () {
    // sync sales
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/tblAS400Timesheet/" + window.localStorage.getItem("ssp_TechID") + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, err) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            var sspBarCnt = JSON.parse(msg).length;
            $('#timetot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                $.each(JSON.parse(msg), function (i, item) {
                    if ("WORKEDFOR" in item) {
                        tx.executeSql('INSERT INTO tblTimesheet(PKIDDroid, \
			                        TECH_NO, \
			                        TIMESHEETDATE, \
			                        TIMESHEETHALF, \
			                        TIMESHEETCODE, \
                                    WORKEDFOR, \
			                        MOD) VALUES (?,?,?,?,?,?,?)' , [item.PKIDDroid, item.TECH_NO, item.TIMESHEETDATE, item.TIMESHEETHALF, item.TIMESHEETCODE, item.WORKEDFOR, 0], ssp.webdb.onSuccess, ssp.webdb.onError);

                    } else {
                        tx.executeSql('INSERT INTO tblTimesheet(PKIDDroid, \
			                        TECH_NO, \
			                        TIMESHEETDATE, \
			                        TIMESHEETHALF, \
			                        TIMESHEETCODE, \
			                        MOD) VALUES (?,?,?,?,?,?)' , [item.PKIDDroid, item.TECH_NO, item.TIMESHEETDATE, item.TIMESHEETHALF, item.TIMESHEETCODE, 0], ssp.webdb.onSuccess, ssp.webdb.onError);
                    }
                    $('#timecurr').html(i + 1);
                    $('#timebar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
            });
        }
    });
}

ssp.webdb.getServerDataCustomerNotes = function () {
    // sync sales
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: window.localStorage.getItem('ssp_urldata') + "/tblAS400CustomerNotes/" + window.localStorage.getItem("ssp_TechID") + "/" + Math.round(new Date().getTime() / 1000),
        dataType: "json",
        // data: { },
        async: true,
        error: function (xhr, status, err) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            var sspBarCnt = JSON.parse(msg).length;
            $('#cnotetot').html(sspBarCnt);
            ssp.webdb.db.transaction(function (tx) {
                $.each(JSON.parse(msg), function (i, item) {
                    tx.executeSql('INSERT INTO tblCustomerNotes(PKIDDroid, \
			            TECH_NO, \
			            ACCT_NO, \
			            NOTE, \
			            MOD, \
			            MODSTAMP) VALUES (?,?,?,?,?,?)' , [item.PKIDDroid, item.TECH_NO, item.ACCT_NO, item.NOTE, item.MOD, item.MODSTAMP], ssp.webdb.onSuccess, ssp.webdb.onError);
                    $('#cnotecurr').html(i + 1);
                    $('#cnotebar span').css("width", ((i / sspBarCnt) * 100) + "%");
                });
            });
        }
    });
}

ssp.webdb.setTech = function () {

    var strUrl = window.localStorage.getItem('ssp_urldata') + "/setTech/" + $('#login').val() + "/" + $('#pass').val() + "/" + Math.round(new Date().getTime() / 1000);
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: strUrl,
        dataType: "json",
        // data: { },
        async: false,
        error: function (xhr, status, err) {
            alert(xhr.statusText);
        },
        success: function (msg) {
            if (msg == "Failed") {
                window.localStorage.removeItem('ssp_TechID')
                alert("Login Failed!");
                // location.reload(true);
            }
            else {
                window.localStorage.setItem('ssp_TechGUID', msg.substring(0, msg.indexOf("|")));
                window.localStorage.setItem('ssp_TechPKID', msg.substring(msg.indexOf("|") + 1, msg.lastIndexOf("|")));
                window.localStorage.setItem('ssp_TechID', msg.substring(msg.lastIndexOf("|") + 1, msg.length));
                //JKS041819***4.17->IF ELSE to set CS ssp_projectid to ECSS for case values
                var projurl = window.localStorage.getItem('ssp_urldata');
                window.localStorage.setItem('ssp_projectid', projurl.substring(projurl.lastIndexOf("//") + 2, projurl.indexOf(".")));
                if (window.localStorage.getItem('ssp_projectid') == "cs") {
                    window.localStorage.setItem('ssp_projectid', "ecss");
                }
				if (window.localStorage.getItem('ssp_projectid') == "ssma") {
                    window.localStorage.setItem('ssp_projectid', "ps");
                }
                ssp.webdb.createTables(); //RP111016 ***Create Tables and load login on complete***
                //ssp.webdb.loadSync();
            }
        }
    });
}

ssp.webdb.sendCustomers = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblCustomers WHERE MOD = 1', [], function (tx, rs) { ssp.webdb.sendtblSyncInCustomers(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendCustomerNotes = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblCustomerNotes WHERE MOD = 1', [], function (tx, rs) { ssp.webdb.sendtblSyncInCustomerNotes(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendSales = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblSales WHERE MOD = 1', [], function (tx, rs) { ssp.webdb.sendtblSyncInSales(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendTechRelief = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblTechRelief WHERE MOD = 1', [], function (tx, rs) { ssp.webdb.sendtblSyncInTechRelief(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendMileage = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblMileage WHERE MOD = 1 ORDER BY MILEAGEEND', [], function (tx, rs) { ssp.webdb.sendtblSyncInMileage(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendTimesheet = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblTimesheet WHERE MOD = 1', [], function (tx, rs) { ssp.webdb.sendtblSyncInTimesheet(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendtblSyncInCustomers = function (rs, syncID) {

    if (rs.rows.length > 0) {
        var custData = "[" // + JSON.stringify(rs.rows.item(0));
        for (var i = 0; i < rs.rows.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs.rows.item(i));
        }
        custData += "]"
        //alert(custData.length + '-' + rs.rows.length);



        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: window.localStorage.getItem('ssp_urldata') + "/tblSyncInCustomers/" + syncID + "/" + Math.round(new Date().getTime() / 1000),  // gSyncID
            dataType: "json",
            data: custData,
            async: true,
            error: function (xhr, status, err) {
                //alert(custData);
                alert(xhr.responseText);
            },
            success: function (msg) {
                ssp.webdb.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM tblCustomers', [], ssp.webdb.getServerDataCustomers(), ssp.webdb.onError);
                });
            }
        });
    } else {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM tblCustomers', [], ssp.webdb.getServerDataCustomers(), ssp.webdb.onError);
        });
    }

}

ssp.webdb.sendtblSyncInCustomerNotes = function (rs, syncID) {

    if (rs.rows.length > 0) {
        var custData = "[" // + JSON.stringify(rs.rows.item(0));
        for (var i = 0; i < rs.rows.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs.rows.item(i));
        }
        custData += "]"
        //alert(custData.length + '-' + rs.rows.length);



        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: window.localStorage.getItem('ssp_urldata') + "/tblSyncInCustomerNotes/" + syncID + "/" + Math.round(new Date().getTime() / 1000),  // gSyncID
            dataType: "json",
            data: custData,
            async: true,
            error: function (xhr, status, err) {
                //alert(custData);
                alert(xhr.responseText);
            },
            success: function (msg) {
                ssp.webdb.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM tblCustomerNotes', [], ssp.webdb.getServerDataCustomerNotes(), ssp.webdb.onError);
                });
            }
        });
    } else {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM tblCustomerNotes', [], ssp.webdb.getServerDataCustomerNotes(), ssp.webdb.onError);
        });
    }
}

//JKS033117***Begin...Removed tblSyncInSalesNoFrz***//JKS033017***Begin...ADDED tblSyncInSalesNoFrz to function like v3.100.20 for SSP***//JKS111716***Begin...Removed tblSyncInSalesNoFrz***
ssp.webdb.sendtblSyncInSales = function (rs, syncID) {
    var urlSales = '/tblSyncInSales/';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
        case 'ssc':
        case 'ps':
        case 'ecss':
        case 'mnss':            
            break;
    }
       
    //ssp.webdb.sendtblSyncInSales = function (rs, syncID) {
    //    var urlSales = '/tblSyncInSalesNoFrz/';
    //    switch (window.localStorage.getItem("ssp_projectid")) {
    //        case 'sess':
    //        case 'ssc':
    //        case 'ps':
    //        case 'ecss':
    //        case 'mnss':
    //            urlSales = '/tblSyncInSales/';
    //            break;
    //    }
//JKS033117***End...Removed tblSyncInSalesNoFrz***//JKS033017***END...ADDED tblSyncInSalesNoFrz to function like v3.100.20 for SSP***//JKS111716***End...Removed tblSyncInSalesNoFrz***

    if (rs.rows.length > 0) {
        var custData = "[" // + JSON.stringify(rs.rows.item(0));
        for (var i = 0; i < rs.rows.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs.rows.item(i));
        }
        custData += "]"
        //alert(custData.length + '-' + rs.rows.length);



        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: window.localStorage.getItem('ssp_urldata') + urlSales + syncID + "/" + Math.round(new Date().getTime() / 1000),  // gSyncID
            dataType: "json",
            data: custData,
            async: true,
            error: function (xhr, status, err) {
                //alert(custData);
                alert(xhr.responseText);
            },
            success: function (msg) {
                ssp.webdb.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM tblSales', [], ssp.webdb.getServerDataSales(), ssp.webdb.onError);
                });
            }
        });
    } else {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM tblSales', [], ssp.webdb.getServerDataSales(), ssp.webdb.onError);
        });

    }
}

ssp.webdb.sendtblSyncInTechRelief = function (rs, syncID) {

    if (rs.rows.length > 0) {
        var techData = "[" // + JSON.stringify(rs.rows.item(0));
        for (var i = 0; i < rs.rows.length; i++) {
            if (i > 0) techData += ",";
            techData += JSON.stringify(rs.rows.item(i));
        }
        techData += "]"
        //alert(custData.length + '-' + rs.rows.length);



        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: window.localStorage.getItem('ssp_urldata') + "/tblSyncInTechRelief/" + syncID + "/" + Math.round(new Date().getTime() / 1000),  // gSyncID
            dataType: "json",
            data: techData,
            async: true,
            error: function (xhr, status, err) {
                //alert(custData);
                alert(xhr.responseText);
            },
            success: function (msg) {
                ssp.webdb.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM tblTechRelief', [], ssp.webdb.getServerDataRelief(), ssp.webdb.onError);
                });
            }
        });
    } else {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM tblTechRelief', [], ssp.webdb.getServerDataTechRelief(), ssp.webdb.onError);
        });

    }
}

ssp.webdb.sendtblSyncInMileage = function (rs, syncID) {

    if (rs.rows.length > 0) {
        var custData = "[" // + JSON.stringify(rs.rows.item(0));
        for (var i = 0; i < rs.rows.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs.rows.item(i));
        }
        custData += "]"
        window.localStorage.setItem('ssp_lastmileage', rs.rows.item(i - 1).MILEAGEEND);
        //alert(custData.length + '-' + rs.rows.length);



        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: window.localStorage.getItem('ssp_urldata') + "/tblSyncInMileage/" + syncID + "/" + Math.round(new Date().getTime() / 1000),  // gSyncID
            dataType: "json",
            data: custData,
            async: true,
            error: function (xhr, status, err) {
                //alert(custData);
                alert(xhr.responseText);
            },
            success: function (msg) {
                //alert(msg);
            }
        });
    }
}

ssp.webdb.sendtblSyncInTimesheet = function (rs, syncID) {

    if (rs.rows.length > 0) {
        var custData = "[" // + JSON.stringify(rs.rows.item(0));
        for (var i = 0; i < rs.rows.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs.rows.item(i));
        }
        custData += "]"
        //alert(custData.length + '-' + rs.rows.length);



        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: window.localStorage.getItem('ssp_urldata') + "/tblSyncInTimesheet/" + syncID + "/" + Math.round(new Date().getTime() / 1000),  // gSyncID
            dataType: "json",
            data: custData,
            async: true,
            error: function (xhr, status, err) {
                //alert(custData);
                alert(xhr.responseText);
            },
            success: function (msg) {
                ssp.webdb.db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM tblTimesheet', [], ssp.webdb.getServerDataTimesheet(), ssp.webdb.onError);
                });
            }
        });
    } else {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM tblTimesheet', [], ssp.webdb.getServerDataTimesheet(), ssp.webdb.onError);
        });

    }
}

ssp.webdb.setSyncCounts = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) AS cntCustomer FROM tblCustomers WHERE MOD=1', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    $('#custsynccnt').html(rs.rows.item(0).cntCustomer);
                }
            }, ssp.webdb.onError);
    });
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) AS cntSales,SUM(SIQTY*SIPRC) AS amtSales, SUM(SIARM) AS amtArmCharge FROM tblSales WHERE MOD=1', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    $('#salesynccnt').html(rs.rows.item(0).cntSales);
                    $('#salesyncamt').html((rs.rows.item(0).amtSales + rs.rows.item(0).amtArmCharge).toFixed(2));
                }
            }, ssp.webdb.onError);
    });
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) AS cntTimesheet FROM tblTimesheet WHERE MOD=1', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    $('#timesynccnt').html(rs.rows.item(0).cntTimesheet);
                }
            }, ssp.webdb.onError);
    });
}

ssp.webdb.saveSettings = function (rs) {

    window.localStorage.setItem("ssp_urldata", $("#urldata").val());
    window.localStorage.setItem("ssp_orderpdf", $("#orderpdf").val());
    window.localStorage.setItem('ssp_nitroprice', $("#nitroprice").val());
    window.localStorage.setItem('ssp_nitrodays', $("#nitrodays").val());  //JKS011818***Restored NitroDays in Settings***//JKS102517***Moved NitroDays to Customer Info***
    window.localStorage.setItem('ssp_armprice', $("#armprice").val());
    window.localStorage.setItem('ssp_thankyou', $("#thankyou").val());
    window.localStorage.setItem('ssp_yousaved', ($('#chkYouSaved').is(':checked')) ? 1 : 0); //JKS021716 ***YouSavedSwitch***
    window.localStorage.setItem('ssp_techfunc', ($('#chkTechfunc').is(':checked')) ? 1 : 0);
    window.localStorage.setItem('ssp_addrsearch', ($('#chkAddrSearch').is(':checked')) ? 1 : 0);
    window.localStorage.setItem('ssp_autofillsearch', ($('#chkAutoFillSearch').is(':checked')) ? 'on' : 'off');    /*JKS080818->4.03***Auto Fill Search switch*/
    window.localStorage.setItem('ssp_custsalesbubble', ($('#chkCustSalesBubble').is(':checked')) ? 1 : 0);
    window.localStorage.setItem('ssp_autobackup', ($('#chkAutoBackup').is(':checked')) ? 1 : 0);
    window.localStorage.setItem('ssp_freeze', ($('#chkFreezeCode').is(':checked')) ? 1 : 0);
    window.localStorage.setItem('ssp_numberpad', ($('#chkNumberPad').is(':checked')) ? 1 : 0);
    //if ((rs.rows.item(0).SP7 == null) || (rs.rows.item(0).SP7 == " ")) {
    //    window.localStorage.setItem('CustomerNitroDays', $("#nitrodays").val());    //JKS012218***3.100.37->Set CustomerNitroDays to Default value from ssp_nitrodays IF NULL or BLANK***
    //}
}

//JS100815 ***ECSS Only Save TechMode on Orders Function***Begin
//ssp.webdb.saveSettings1 = function () {
//    window.localStorage.setItem('ssp_techfunc',($('#chkTechfunc').is(':checked'))?1:0);
//}
//JS100815 ***ECSS Only Save TechMode on Orders Function***End    

ssp.webdb.saveInitSettings = function () {
    window.localStorage.setItem("ssp_urldata", $("#urldata").val());
    window.localStorage.setItem('ssp_freeze', ($('#chkFreezeCode').is(':checked')) ? 1 : 0);
    ssp.webdb.loadLogin();
}

function onDeviceReady() {

    if (window.isPhone) {
        ssp.webdb.db = window.sqlitePlugin.openDatabase({ name: 'bullsi.db', location: 'default' }, ssp.webdb.onTestSuccess, ssp.webdb.onTestError);
    } else {
        if (!window.localStorage.getItem('ssp_project_dbname')) {                   //RP102616***Added check if not on a Device for db storage.***
            window.localStorage.setItem('ssp_project_dbname', randomString());
        }
        ssp.webdb.db = openDatabase(window.localStorage.getItem('ssp_project_dbname'), '1.1', 'ssp WebSQLdb', 1024 * 1024 * 40); // browser
    }

    if (window.localStorage.getItem('ssp_project_installed')) {
        if (window.localStorage.getItem("ssp_TechID")) {
            //ssp.webdb.open();
            if (window.localStorage.getItem('ssp_initial_sync')) {
                ssp.webdb.loadHome();
            } else {
                ssp.webdb.loadHome();
                ssp.webdb.loadSync();
            }
        } else {
            ssp.webdb.loadLogin();
        }
    } else {
        window.localStorage.setItem('ssp_project_installed', 1);
        //window.localStorage.setItem('ssp_urldata', 'https://ssp.selectsirepower.com/SSPwebPWA/SSPweb');
		window.localStorage.setItem('ssp_urldata', 'https://ssp.selectsirepower.com/SSPweb');
        window.localStorage.setItem('ssp_orderpdf', '');    //JKS030716  ***Set to blank per Ron***
        window.localStorage.setItem('ssp_nitroprice', '25');
        window.localStorage.setItem('ssp_armprice', '10');
        window.localStorage.setItem('ssp_thankyou', 'Thank you for your order.');
        window.localStorage.setItem('ssp_yousaved', 1);  //JKS021716 ***YouSavedSwitch***
        window.localStorage.setItem('ssp_techfunc', 0);
        window.localStorage.setItem('ssp_addrsearch', 1);
        window.localStorage.setItem('ssp_autofillsearch', 'on');    /*JKS080818->4.03***Auto Fill Search switch*/
        window.localStorage.setItem('ssp_custsalesbubble', 1);
        window.localStorage.setItem('ssp_lastmileage', 0);
        window.localStorage.setItem('ssp_autobackup', 1);
        window.localStorage.setItem('ssp_lastbackup', 0);
        window.localStorage.setItem('ssp_nitrodays', 30);     //JKS011818***Restored NitroDays in Settings***//JKS102517***Moved NitroDays to Customer Info***
        window.localStorage.setItem('ssp_freeze', 0);
        window.localStorage.setItem('ssp_salemonths', 1);
        //ssp.webdb.createTables(); //RP111016 ***Create Tables on Login***
        ssp.webdb.loadInitSettings();
    }

}

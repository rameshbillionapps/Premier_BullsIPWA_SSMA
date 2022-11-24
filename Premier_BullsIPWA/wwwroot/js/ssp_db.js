//jQuery.timeago.settings.allowFuture = true;
var ssp = {};
// STAGE var urldata = "http://sspweb.yitsdev.com/SSPweb";
// DEV var urldata = "http://10.1.7.29/SSPweb/SSPweb"

//ssp.syntax = SyntaxHighlighter;
ssp.webdb = {};
ssp.webdb.indb = null; //alaSQL IndexedDB
ssp.webdb.db = alasql.databases['alasql']; //In-Memory Database

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

/*
 * [July 2022]
 * There's an open issue with error logging in alaSQL. GitHub issue link: https://github.com/AlaSQL/alasql/issues/845.
 * As it is still open, error handling would be cumbersome if done for each query. So, leaving it as it is as it was in WebSQL. 
 * Later error handling can be implemented.
*/
ssp.webdb.onError = function (e) { alert('Database Error: ' + e.message); }
ssp.webdb.onSuccess = function (tx, r) { }

ssp.webdb.createInMemoryTables = function (resolve, query) {

    ssp.webdb.db.transaction(function (tx) {
        ssp.webdb.inMemoryTriggers();
        tx.exec(`CREATE TABLE IF NOT EXISTS tblCustomers (ACTIVE TEXT, TYPE_AREA TEXT, SP1 TEXT, ACCT_NO TEXT, NAME TEXT, ADDR1 TEXT, ADDR2 TEXT, CITY TEXT, STATE TEXT, SP2 TEXT, ZIP TEXT, BREED1 TEXT, BREED2 TEXT, BREED3 TEXT, TYPE TEXT, SP3 TEXT, TECH_NO TEXT, MEMBER TEXT, DISC1 FLOAT, DISC2 FLOAT, W_O TEXT, SP4 TEXT, L_PMT_M FLOAT, SP5 TEXT, L_PMT_Y FLOAT, SP6 TEXT, L_PUR_M FLOAT, SP7 TEXT, L_PUR_Y FLOAT, SP8 TEXT, SP_ACCT TEXT, SP9 TEXT, SP_RATE FLOAT, SL_AREA TEXT, SP10 TEXT, COUNTY TEXT, TAXABLE TEXT, MOD INTEGER, MODSTAMP INTEGER, FAV INTEGER);
                 CREATE TABLE IF NOT EXISTS tblCustomersAR (ACTIVE TEXT, ACCT_NO TEXT, BALANCE FLOAT, CURRENT FLOAT, OVER_DUE FLOAT, OVER_90 FLOAT, OVER_120 FLOAT, PAYMENTS FLOAT);
                 CREATE TABLE IF NOT EXISTS tblCustomerNotes (PKIDDroid TEXT, TECH_NO TEXT, ACCT_NO TEXT, NOTE TEXT, MOD INTEGER, MODSTAMP INTEGER);
                 CREATE TABLE IF NOT EXISTS tblMileage (PKIDDroid TEXT, TECH_NO TEXT, MILEAGEBEGIN INTEGER, MILEAGEEND INTEGER, MILEAGEDATE INTEGER, PERSONAL INTEGER, WORKEDFOR  TEXT, MOD INTEGER, MODSTAMP INTEGER, ROUTEMILES INTEGER);
                 CREATE TABLE IF NOT EXISTS tblTimesheet (PKIDDroid TEXT, TECH_NO TEXT, TIMESHEETDATE INTEGER, TIMESHEETHALF INTEGER, TIMESHEETCODE TEXT, WORKEDFOR  TEXT, SPLIT  TEXT, MOD INTEGER, MODSTAMP INTEGER);
                 CREATE TABLE IF NOT EXISTS tblSales (SIACT TEXT, SIINVL TEXT, SIORNM TEXT, SIINVO TEXT, SIDATO FLOAT, SITIMO FLOAT, SITYPS TEXT, SICOD TEXT, SIQTY FLOAT, SIMATH TEXT, SINAM TEXT, SIPRC FLOAT, SITYPI TEXT, SICOW TEXT, SIARM FLOAT, SISTP FLOAT, SIOTH FLOAT, SILIN FLOAT, SISEM FLOAT, SIPOA FLOAT, SISUP FLOAT, SICDI FLOAT, SIPGA FLOAT, SIDSC FLOAT, SIREP TEXT, SIANM TEXT, SILVL1 TEXT, SILVL2 TEXT, SILVL3 TEXT, SILVL4 TEXT, SILVL5 TEXT, SIRETL FLOAT, FRZDAT FLOAT, LOTNOT TEXT, SIDATOYYYYMMDD TEXT, BREEDTYPE TEXT, FRZYYYYMMDD TEXT, MOD INTEGER, MODSTAMP INTEGER);
                 CREATE TABLE IF NOT EXISTS tblBulls (SICOD TEXT, ACTIVE TEXT, S_SUPPLY TEXT, BREED TEXT, BLK1 TEXT, BULLNO FLOAT, BLK2 TEXT, STUD FLOAT, B_NAME TEXT, PRICE1 FLOAT, PUR_COST FLOAT, PRICE2 FLOAT, PRICE3 FLOAT, ROY_COST FLOAT, SS_CON TEXT, MAX_DISC TEXT, SS TEXT, GS TEXT, QOH FLOAT, FRZDAT FLOAT, FRZYYYYMMDD TEXT);
                 CREATE TABLE IF NOT EXISTS tblSupplies (SICOD TEXT, ACTIVE TEXT, STOCK_NO TEXT, [DESC] TEXT, PRICE FLOAT, COST FLOAT, MIN_HAND FLOAT, STATETAXABLE TEXT, STTAXLIST TEXT, QOH FLOAT);
                 CREATE TABLE IF NOT EXISTS tblTechTransfer (TechID TEXT, TransferList INTEGER, TransferListName TEXT);
                 CREATE TABLE IF NOT EXISTS tblTechRelief (TechIDMaster TEXT, TechIDRelief Text, MOD INTEGER, MODSTAMP INTEGER);

                 CREATE INDEX cust_index ON tblCustomers( ACCT_NO, NAME, ADDR1);
                 CREATE INDEX custar_index ON tblCustomersAR( ACCT_NO );
                 CREATE INDEX custnotes_index ON tblCustomerNotes( ACCT_NO );
                 CREATE INDEX mile_index ON tblMileage( PKIDDroid, MILEAGEDATE );
                 CREATE INDEX time_index ON tblTimesheet( PKIDDroid, TIMESHEETDATE );
                 CREATE INDEX sales_index ON tblSales( SIACT,SIINVL );
                 CREATE INDEX bull_index ON tblBulls( SICOD, B_NAME );
                 CREATE INDEX supp_index ON tblSupplies( STOCK_NO, [DESC] );
               
                 CREATE TRIGGER Cust_Ins AFTER INSERT ON tblCustomers indbCust_Ins;
                 CREATE TRIGGER Cust_Upd AFTER UPDATE ON tblCustomers indbCust_Upd;
                 CREATE TRIGGER Cust_Del BEFORE DELETE ON tblCustomers indbCust_Del;
                 CREATE TRIGGER CustNotes_Ins AFTER INSERT ON tblCustomerNotes indbCustNotes_Ins;
                 CREATE TRIGGER CustNotes_Del BEFORE DELETE ON tblCustomerNotes indbCustNotes_Del;
                 CREATE TRIGGER Mileage_Ins AFTER INSERT ON tblMileage indbMileage_Ins;
                 CREATE TRIGGER Mileage_Del BEFORE DELETE ON tblMileage indbMileage_Del;
                 CREATE TRIGGER Timesheet_Ins AFTER INSERT ON tblTimesheet indbTimesheet_Ins;
                 CREATE TRIGGER Timesheet_Del BEFORE DELETE ON tblTimesheet indbTimesheet_Del;
                 CREATE TRIGGER Sales_Ins AFTER INSERT ON tblSales indbSales_Ins;
                 CREATE TRIGGER Sales_Upd AFTER UPDATE ON tblSales indbSales_Upd;
                 CREATE TRIGGER Sales_Del BEFORE DELETE ON tblSales indbSales_Del;
                 CREATE TRIGGER TechRelief_Ins AFTER INSERT ON tblTechRelief indbTechRelief_Ins;
                 CREATE TRIGGER TechRelief_Del BEFORE DELETE ON tblTechRelief indbTechRelief_Del;`
            , [], (res) => {
                console.log('In-Memory Table creation results: ', res);
                ssp.webdb.populateInMemoryTables(resolve, query)
        }, ssp.webdb.onError);
    });
}

ssp.webdb.inMemoryTriggers = () => {
    //tblCustomers TRIGGERS
    alasql.fn.indbCust_Ins = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('INSERT INTO tblCustomers VALUES ?', [data], res => console.log("INserted in INDB tblCustomers Successfully"))
        })
    }

    alasql.fn.indbCust_Upd = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec(`UPDATE tblCustomers SET 
                SP1=?,SP2=?,ADDR1=?,ADDR2=?,CITY=?,STATE=?,ZIP=?,MEMBER=?,SP5=?,BREED1=?,BREED2=?,BREED3=?,SP4=?,SP6=?,SP7=?,FAV=?,MOD=?,MODSTAMP=?
                WHERE ACCT_NO=?`,
                [data.SP1, data.SP2, data.ADDR1, data.ADDR2, data.CITY, data.STATE, data.ZIP, data.MEMBER, data.SP5, data.BREED1, data.BREED2, data.BREED3, data.SP4, data.SP6, data.SP7, data.FAV, data.MOD, data.MODSTAMP, data.ACCT_NO], res => console.log("Updated in INDB tblCustomers Successfully"))
        })
    }

    alasql.fn.indbCust_Del = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('DELETE FROM tblCustomers WHERE ACCT_NO = ? ', [data.ACCT_NO], res => console.log("Deleted from INDB tblCustomers Successfully"))
        })
    }

    //tblCustomerNotes TRIGGERS
    alasql.fn.indbCustNotes_Ins = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('INSERT INTO tblCustomerNotes VALUES ?', [data], res => console.log("INserted in INDB tblCustomerNotes Successfully"))
        })
    }

    alasql.fn.indbCustNotes_Del = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('DELETE FROM tblCustomerNotes WHERE PKIDDroid = ?', [data.PKIDDroid], res => console.log("Deleted from INDB tblCustomerNotes Successfully"))
        })
    }

    //tblMileage TRIGGERS
    alasql.fn.indbMileage_Ins = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('INSERT INTO tblMileage VALUES ?', [data], res => console.log("INserted in INDB tblMileage Successfully"))
        })
    }

    alasql.fn.indbMileage_Del = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('DELETE FROM tblMileage WHERE PKIDDroid = ?', [data.PKIDDroid], res => console.log("Deleted from INDB tblMileage Successfully"))
        })
    }

    //tblTimesheet TRIGGERS
    alasql.fn.indbTimesheet_Ins = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('INSERT INTO tblTimesheet VALUES ?', [data], res => console.log("INserted in INDB tblTimesheet Successfully"))
        })
    }

    alasql.fn.indbTimesheet_Del = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('DELETE FROM tblTimesheet WHERE PKIDDroid = ?', [data.PKIDDroid], res => console.log("Deleted from INDB tblTimesheet Successfully"))
        })
    }

    //tblSales TRIGGERS
    alasql.fn.indbSales_Ins = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('INSERT INTO tblSales VALUES ?', [data], res => console.log("INserted in INDB tblSales Successfully"))
        })
    }

    alasql.fn.indbSales_Upd = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec(`UPDATE tblSales SET SIDATO = ? WHERE SIORNM = ? AND MODSTAMP = ?`,
                [data.SIDATO, data.SIORNM, data.MODSTAMP], res => console.log("Updated in INDB tblSales Successfully"))
        })
    }

    alasql.fn.indbSales_Del = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('DELETE FROM tblSales WHERE SIORNM = ? AND MODSTAMP = ?', [data.SIORNM, data.MODSTAMP], res => console.log("Deleted from INDB tblSales Successfully"))
        })
    }

    //tblTechRelief TRIGGERS
    alasql.fn.indbTechRelief_Ins = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('INSERT INTO tblTechRelief VALUES ?', [data], res => console.log("INserted in INDB tblTechRelief Successfully"))
        })
    }

    alasql.fn.indbTechRelief_Del = function (data) {
        console.log(data);
        ssp.webdb.indb.transaction(function (tx) {
            tx.exec('DELETE FROM tblTechRelief WHERE TechIDMaster = ? AND TechIDRelief = ?', [data.TechIDMaster, data.TechIDRelief], res => console.log("Deleted from INDB tblTechRelief Successfully"))
        })
    }
}

ssp.webdb.populateInMemoryTables = function (resolve, query) {
    //almost 700-800ms faster than SELECT * FROM INDB + SELECT * INTO In-Memory Tables.
    var StartTime = new Date();

    const dbBullsOpenRequest = indexedDB.open('BullsINTD')
    dbBullsOpenRequest.onsuccess = event => {
        console.log("Database successfully opened for population!")

        const db = event.target.result;

        const transaction = db.transaction(["tblCustomers", "tblCustomersAR", "tblCustomerNotes", "tblMileage", "tblTimesheet", "tblSales", "tblBulls", "tblSupplies", "tblTechTransfer", "tblTechRelief"]);
        transaction.oncomplete = event => {
            var EndTime = new Date()
            console.log('Total time Select + Assign : ', EndTime.getTime() - StartTime.getTime())
            console.log("All done!");

            resolve(alasql.promise(query));
        };

        transaction.onerror = event => {
            console.log('Error in opening database for population', event.target.result)
        };
       
        const OStblCustomers = transaction.objectStore("tblCustomers");
        const OStblCustomersAR = transaction.objectStore("tblCustomersAR");
        const OStblCustomerNotes = transaction.objectStore("tblCustomerNotes");
        const OStblMileage = transaction.objectStore("tblMileage");
        const OStblTimesheet = transaction.objectStore("tblTimesheet");
        const OStblSales = transaction.objectStore("tblSales");
        const OStblBulls = transaction.objectStore("tblBulls");
        const OStblSupplies = transaction.objectStore("tblSupplies");
        const OStblTechTransfer = transaction.objectStore("tblTechTransfer");
        const OStblTechRelief = transaction.objectStore("tblTechRelief");

        OStblCustomers.getAll().onsuccess = etblCustomers => {
            alasql.databases['alasql'].tables['tblCustomers'].data = etblCustomers.target.result
        }
        OStblCustomersAR.getAll().onsuccess = etblCustomersAR => {
            alasql.databases['alasql'].tables['tblCustomersAR'].data = etblCustomersAR.target.result
        }
        OStblCustomerNotes.getAll().onsuccess = etblCustomerNotes => {
            alasql.databases['alasql'].tables['tblCustomerNotes'].data = etblCustomerNotes.target.result
        }
        OStblMileage.getAll().onsuccess = etblMileage => {
            alasql.databases['alasql'].tables['tblMileage'].data = etblMileage.target.result
        }
        OStblTimesheet.getAll().onsuccess = etblTimesheet => {
            alasql.databases['alasql'].tables['tblTimesheet'].data = etblTimesheet.target.result
        }
        OStblSales.getAll().onsuccess = etblSales => {
            alasql.databases['alasql'].tables['tblSales'].data = etblSales.target.result
        }
        OStblBulls.getAll().onsuccess = etblBulls => {
            alasql.databases['alasql'].tables['tblBulls'].data = etblBulls.target.result
        }
        OStblSupplies.getAll().onsuccess = etblSupplies => {
            alasql.databases['alasql'].tables['tblSupplies'].data = etblSupplies.target.result
        }
        OStblTechTransfer.getAll().onsuccess = etblTechTransfer => {
            alasql.databases['alasql'].tables['tblTechTransfer'].data = etblTechTransfer.target.result
        }
        OStblTechRelief.getAll().onsuccess = etblTechRelief => {
            alasql.databases['alasql'].tables['tblTechRelief'].data = etblTechRelief.target.result
        }
    }
}

ssp.webdb.getSync = function () {
    $('#custlist').load('sync.html.');
}

ssp.webdb.syncDB = function () {
   
    var StartTime, EndTime;
    $('#loader').ajaxStart(function () {
        StartTime = new Date();
        console.log('Sync Now, Start Time: ', StartTime.getTime())
        $(this).show();
        $('#syncbutton').hide();
    });

    $('#loader').ajaxStop(function () {
        $('#loader').hide();
        window.localStorage.setItem('ssp_initial_sync', 1);
        window.localStorage.setItem('ssp_last_sync', $('#salesynccnt').html() + '@' + $('#salesyncamt').html() + ' - ' + formatDate(Math.round(new Date().getTime() / 1000)));
        $('#syncbutton').show();

        EndTime = new Date();
        console.log('Sync Now, End Time: ', EndTime.getTime())
        console.log(`Sync Now took :  ${EndTime - StartTime} ms`)
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

            //ssp.webdb.getServerDataCustomers();
            //ssp.webdb.getServerDataBulls();
            //ssp.webdb.getServerDataSupplies();
            //ssp.webdb.getServerDataCustomersAR();
            //ssp.webdb.getServerDataTechTransfer();
            //ssp.webdb.getServerDataSales();

        }
    });
}

ssp.webdb.clearLocalData = function () {
/*    ssp.webdb.db.transaction(function (tx) {
        //        tx.exec('DELETE FROM tblCustomers', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        tx.exec('DELETE FROM tblBulls WHERE 1', [], ssp.webdb.getServerDataBulls(), ssp.webdb.onError);
        tx.exec('DELETE FROM tblSupplies WHERE 1', [], ssp.webdb.getServerDataSupplies(), ssp.webdb.onError);
        tx.exec('DELETE FROM tblCustomersAR WHERE 1', [], ssp.webdb.getServerDataCustomersAR(), ssp.webdb.onError);
        tx.exec('DELETE FROM tblTechTransfer WHERE 1', [], ssp.webdb.getServerDataTechTransfer(), ssp.webdb.onError);
        tx.exec('DELETE FROM tblMileage WHERE 1', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        //        tx.exec('DELETE FROM tblTimesheet', [], ssp.webdb.onSuccess, ssp.webdb.onError);
        //        tx.exec('DELETE FROM tblSales', [], ssp.webdb.onSuccess, ssp.webdb.onError);
    });*/

    ssp.webdb.truncateTable('tblBulls', ssp.webdb.getServerDataBulls)
    ssp.webdb.truncateTable('tblSupplies', ssp.webdb.getServerDataSupplies)
    ssp.webdb.truncateTable('tblCustomersAR', ssp.webdb.getServerDataCustomersAR)
    ssp.webdb.truncateTable('tblTechTransfer', ssp.webdb.getServerDataTechTransfer)
    ssp.webdb.truncateTable('tblMileage')

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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            $('#custtot').html(sspBarCnt);

            for (var i = 0; i < sspBarCnt; i++) {
                data[i].MOD = 0;
                data[i].MODSTAMP = 0;
            }

            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('Select * into tblCustomers from ?', [data], (res) => {
                    $('#custcurr').html(sspBarCnt);
                    if (sspBarCnt != 0) {
                        $('#custbar span').css("width", "100%");
                    }
                  
                }, ssp.webdb.onError);
            });
            alasql.databases['alasql'].tables['tblCustomers'].data = data; //In-Memory Table Insertion
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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            $('#cuartot').html(sspBarCnt);

            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('Select * into tblCustomersAR from ?', [data], (res) => {
                    $('#cuarcurr').html(sspBarCnt);
                    if (sspBarCnt != 0) {
                        $('#cuarbar span').css("width", "100%");
                    }
                }, ssp.webdb.onError);
            });
            alasql.databases['alasql'].tables['tblCustomersAR'].data = data; //In-Memory Table Insertion
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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            $('#techtot').html(sspBarCnt);

            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('Select * into tblTechTransfer from ?', [data], (res) => {
                    $('#techcurr').html(sspBarCnt);
                    if (sspBarCnt != 0) {
                        $('#techbar span').css("width", "100%");
                    }
                }, ssp.webdb.onError);
            });
            alasql.databases['alasql'].tables['tblTechTransfer'].data = data; //In-Memory Table Insertion
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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            //$('#techtot').html(sspBarCnt);

            for (var i = 0; i < sspBarCnt; i++) {
                data[i].MOD = 0;
            }

            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('SELECT * INTO tblTechRelief FROM ?', [data], () => {}, ssp.webdb.onError);
                //$('#techcurr').html(i+1);
                //$('#techbar span').css("width", ((i / sspBarCnt) * 100) + "%");
            });
            alasql.databases['alasql'].tables['tblTechRelief'].data = data; //In-Memory Table Insertion
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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            $('#bulltot').html(sspBarCnt);

            var bullcode = '';
            var coopid = window.localStorage.getItem("ssp_projectid");

            for (var i = 0; i < sspBarCnt; i++) {
                if (coopid == 'mnss') {
                    bullcode = ('000' + $.trim(data[i].STUD)).slice(-3) + $.trim(data[i].BREED) + ('00000' + $.trim(data[i].BULLNO)).slice(-5);
                } else {
                    bullcode = ($.trim(data[i].STUD) + $.trim(data[i].BREED) + $.trim(data[i].BULLNO));
                }

                data[i].SICOD = bullcode
                data[i].FRZDAT = !data[i].FRZDAT ? 0 : data[i].FRZDAT;
                data[i].FRZYYYYMMDD = !data[i].FRZYYYYMMDD ? '0' : data[i].FRZYYYYMMDD;
            }

            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('SELECT * INTO tblBulls FROM ?', [data], function (res) {
                    $('#bullcurr').html(sspBarCnt);
                    if (sspBarCnt != 0) {
                        $('#bullbar span').css("width", "100%");
                    }
                }, ssp.webdb.onError)
            })
            alasql.databases['alasql'].tables['tblBulls'].data = data; //In-Memory Table Insertion
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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            $('#supptot').html(sspBarCnt);
            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('Select * into tblSupplies from ?', [data], (res) => {
                    $('#suppcurr').html(sspBarCnt);
                    if (sspBarCnt != 0) {
                        $('#suppbar span').css("width", "100%");
                    }
                }, ssp.webdb.onError);
            });
            alasql.databases['alasql'].tables['tblSupplies'].data = data; //In-Memory Table Insertion
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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            $('#saletot').html(sspBarCnt);

            for (var i = 0; i < sspBarCnt; i++) {
                data[i].FRZDAT = data[i].FRZDAT == null ? '' : data[i].FRZDAT
                data[i].LOTNOT = data[i].LOTNOT == null ? '' : data[i].LOTNOT
                data[i].MOD = 0;

                if ((data[i].SITYPS == 'B' || data[i].SITYPS == 'D') && data[i].SIREP == rep && data[i].SIORNM != '0123004') {
                    if (((data[i].SIDATO * 1) < oldestsale) || oldestsale == 0) {
                        oldestsale = data[i].SIDATO;
                    }
                }
            }

            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('Select * into tblSales from ?', [data], function (res) {
                    $('#salecurr').html(sspBarCnt);
                    if (sspBarCnt != 0) {
                        $('#salesbar span').css("width", "100%");
                    }
                    window.localStorage.setItem('ssp_salemonths', oldestsale);
                }, ssp.webdb.onError);
            });
            alasql.databases['alasql'].tables['tblSales'].data = data; //In-Memory Table Insertion
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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            $('#timetot').html(sspBarCnt);

            for (var i = 0; i < sspBarCnt; i++) {
                data[i].MOD = 0;
            }

            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('SELECT * INTO tblTimesheet FROM ?', [data], function (res) {
                    $('#timecurr').html(sspBarCnt);
                    if (sspBarCnt != 0)
                        $('#timebar span').css("width", ("100%"));
                }, ssp.webdb.onError)
            });
            alasql.databases['alasql'].tables['tblTimesheet'].data = data; //In-Memory Table Insertion
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
            var data = JSON.parse(msg);
            var sspBarCnt = data.length;
            $('#cnotetot').html(sspBarCnt);
            ssp.webdb.indb.transaction(function (tx) {
                tx.exec('Select * into tblCustomerNotes from ?', [data], (res) => {
                    $('#cnotecurr').html(sspBarCnt);
                   // $('#cnotebar span').css("width", ((i / sspBarCnt) * 100) + "%");
                    if (sspBarCnt != 0) {
                        $('#cnotebar span').css("width", "100%");
                    }
                }, ssp.webdb.onError);
            });
            alasql.databases['alasql'].tables['tblCustomerNotes'].data = data; //In-Memory Table Insertion
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
                //[ala]//ssp.webdb.createTables(); //RP111016 ***Create Tables and load login on complete***
                //ssp.webdb.loadSync();
                return true; //Added this to submit the login form successfully if AJAX call is a success. Earlier, post login, sometimes the Home page was not getting reloaded.
            }
        }
    });
}

ssp.webdb.sendCustomers = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblCustomers WHERE MOD = 1', [], function (rs, err) { ssp.webdb.sendtblSyncInCustomers(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendCustomerNotes = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblCustomerNotes WHERE MOD = 1', [], function (rs, err) { ssp.webdb.sendtblSyncInCustomerNotes(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendSales = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblSales WHERE MOD = 1', [], function (rs, err) { ssp.webdb.sendtblSyncInSales(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendTechRelief = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblTechRelief WHERE MOD = 1', [], function (rs, err) { ssp.webdb.sendtblSyncInTechRelief(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendMileage = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblMileage WHERE MOD = 1 ORDER BY MILEAGEEND', [], function (rs, err) { ssp.webdb.sendtblSyncInMileage(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendTimesheet = function (syncID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblTimesheet WHERE MOD = 1', [], function (rs, err) { ssp.webdb.sendtblSyncInTimesheet(rs, syncID); }, ssp.webdb.onError);
    });
}

ssp.webdb.sendtblSyncInCustomers = function (rs, syncID) {

    if (rs.length > 0) {
        var custData = "[" // + JSON.stringify(rs[0]);
        for (var i = 0; i < rs.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs[i]);
        }
        custData += "]"
        //alert(custData.length + '-' + rs.length);


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
                ssp.webdb.truncateTable('tblCustomers', ssp.webdb.getServerDataCustomers)
            }
        });
    } else {
        ssp.webdb.truncateTable('tblCustomers', ssp.webdb.getServerDataCustomers)
    }

}

ssp.webdb.sendtblSyncInCustomerNotes = function (rs, syncID) {

    if (rs.length > 0) {
        var custData = "[" // + JSON.stringify(rs[0]);
        for (var i = 0; i < rs.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs[i]);
        }
        custData += "]"
        //alert(custData.length + '-' + rs.length);



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
                ssp.webdb.truncateTable('tblCustomerNotes', ssp.webdb.getServerDataCustomerNotes)
            }
        });
    } else {
        ssp.webdb.truncateTable('tblCustomerNotes', ssp.webdb.getServerDataCustomerNotes)
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

    if (rs.length > 0) {
        var custData = "[" // + JSON.stringify(rs[0]);
        for (var i = 0; i < rs.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs[i]);
        }
        custData += "]"
        //alert(custData.length + '-' + rs.length);



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
                ssp.webdb.truncateTable('tblSales', ssp.webdb.getServerDataSales)
            }
        });
    } else {
        ssp.webdb.truncateTable('tblSales', ssp.webdb.getServerDataSales)
    }
}

ssp.webdb.sendtblSyncInTechRelief = function (rs, syncID) {

    if (rs.length > 0) {
        var techData = "[" // + JSON.stringify(rs[0]);
        for (var i = 0; i < rslength; i++) {
            if (i > 0) techData += ",";
            techData += JSON.stringify(rs[i]);
        }
        techData += "]"
        //alert(custData.length + '-' + rs.length);



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
                ssp.webdb.truncateTable('tblTechRelief', ssp.webdb.getServerDataRelief)
            }
        });
    } else {
        ssp.webdb.truncateTable('tblTechRelief', ssp.webdb.getServerDataRelief)
    }
}

ssp.webdb.sendtblSyncInMileage = function (rs, syncID) {
    if (rs.length > 0) {
        var custData = "[" // + JSON.stringify(rs[0]);
        for (var i = 0; i < rs.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs[i]);
        }
        custData += "]"
        window.localStorage.setItem('ssp_lastmileage', rs[i - 1].MILEAGEEND);
        //alert(custData.length + '-' + rs.length);

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
                console.log(msg);
            }
        });
    }
}

ssp.webdb.sendtblSyncInTimesheet = function (rs, syncID) {

    if (rs.length > 0) {
        var custData = "[" // + JSON.stringify(rs[0]);
        for (var i = 0; i < rs.length; i++) {
            if (i > 0) custData += ",";
            custData += JSON.stringify(rs[i]);
        }
        custData += "]"
        //alert(custData.length + '-' + rs.length);



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
                ssp.webdb.truncateTable('tblTimesheet', ssp.webdb.getServerDataTimesheet)
            }
        });
    } else {
        ssp.webdb.truncateTable('tblTimesheet', ssp.webdb.getServerDataTimesheet)
    }
}

ssp.webdb.setSyncCounts = function () {
   
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT COUNT(*) AS cntCustomer FROM tblCustomers WHERE MOD=1', [],
            function (rs, err) {
                if (rs[0]) {
                    $('#custsynccnt').html(rs[0].cntCustomer);
                }
            }, ssp.webdb.onError);
    });
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT COUNT(*) AS cntSales,SUM(SIQTY*SIPRC) AS amtSales, SUM(SIARM) AS amtArmCharge FROM tblSales WHERE MOD=1', [],
            function (rs, err) {
                if (rs[0]) {
                    $('#salesynccnt').html(rs[0].cntSales);
                    $('#salesyncamt').html((rs[0].amtSales + rs[0].amtArmCharge).toFixed(2));
                }
            }, ssp.webdb.onError);
    });
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT COUNT(*) AS cntTimesheet FROM tblTimesheet WHERE MOD=1', [],
            function (rs, err) {
                if (rs[0]) {
                    $('#timesynccnt').html(rs[0].cntTimesheet);
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
    //if ((rs[0].SP7 == null) || (rs[0].SP7 == " ")) {
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

async function onDeviceReady() {

    if (window.isPhone) {
        ssp.webdb.db = window.sqlitePlugin.openDatabase({ name: 'bullsi.db', location: 'default' }, ssp.webdb.onTestSuccess, ssp.webdb.onTestError);
    } else {
        if (!window.localStorage.getItem('ssp_project_dbname')) {                   //RP102616***Added check if not on a Device for db storage.***
            window.localStorage.setItem('ssp_project_dbname', randomString());
        }
        //ssp.webdb.db = alasql.databases['alasql']; //In-Memory Database

        ssp.webdb.createAndAttachINDB()
            .then(res => {
                console.log("Database attached onDeviceReady: ", res)

                ssp.webdb.indb = alasql.databases['BullsINTD']; //IndexedDB Database
                //alasql.DEFAULTDATABASEID = 'BullsINTD';

                if (window.localStorage.getItem('ssp_project_installed')) {
                    if (window.localStorage.getItem("ssp_TechID")) {
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
                    /*window.localStorage.setItem('ssp_urldata', 'https://ssp.selectsirepower.com/SSPweb');*/
                    window.localStorage.setItem('ssp_urldata', '#urldata');
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
            })
    }
}
ssp.webdb.createAndAttachINDB = () => {
    return new Promise(function (resolve, reject) {
        const dbBullsOpenRequest = indexedDB.open('BullsINTD')

        dbBullsOpenRequest.onupgradeneeded = event => {
            const db = event.target.result;

            const OStblBulls = db.createObjectStore("tblBulls", { autoIncrement: true });
            OStblBulls.createIndex('SICOD', 'SICOD', { unique: false });
            OStblBulls.createIndex('B_NAME', 'B_NAME', { unique: false });

            const OStblSales = db.createObjectStore("tblSales", { autoIncrement: true });
            OStblSales.createIndex('SIACT', 'SIACT', { unique: false })
            OStblSales.createIndex('SIINVL', 'SIINVL', { unique: false })

            const OStblSupplies = db.createObjectStore("tblSupplies", { autoIncrement: true });
            OStblSupplies.createIndex('STOCK_NO', 'STOCK_NO', { unique: false });
            OStblSupplies.createIndex('DESC', 'DESC', { unique: false });

            const OStblCustomers = db.createObjectStore("tblCustomers", { autoIncrement: true });
            OStblCustomers.createIndex('ACCT_NO', 'ACCT_NO', { unique: false });
            OStblCustomers.createIndex('NAME', 'NAME', { unique: false });
            OStblCustomers.createIndex('ADDR1', 'ADDR1', { unique: false });

            const OStblCustomersAR = db.createObjectStore("tblCustomersAR", { autoIncrement: true });
            OStblCustomersAR.createIndex('ACCT_NO', 'ACCT_NO', { unique: false });

            const OStblCustomerNotes = db.createObjectStore("tblCustomerNotes", { autoIncrement: true });
            OStblCustomerNotes.createIndex('ACCT_NO', 'ACCT_NO', { unique: false });

            const OStblMileage = db.createObjectStore("tblMileage", { autoIncrement: true });
            OStblMileage.createIndex('PKIDDroid', 'PKIDDroid', { unique: false });
            OStblMileage.createIndex('MILEAGEDATE', 'MILEAGEDATE', { unique: false });

            const OStblTimesheet = db.createObjectStore("tblTimesheet", { autoIncrement: true });
            OStblTimesheet.createIndex('PKIDDroid', 'PKIDDroid', { unique: false });
            OStblTimesheet.createIndex('TIMESHEETDATE', 'TIMESHEETDATE', { unique: false });

            db.createObjectStore("tblTechTransfer", { autoIncrement: true });
            db.createObjectStore("tblTechRelief", { autoIncrement: true });
        };

        dbBullsOpenRequest.onsuccess = event => {
            console.log("Database successfully opened!")
            //const db = event.target.result; //OR const dbBulls = dbBullsOpenRequest.result;

            //Populate In-Memory Tables whenever window reloads! (onDeviceReady() gets called on every Reload)
            //Once In-Memory Tables are created, populate them. And then resolve the promise.
            ssp.webdb.createInMemoryTables(resolve, `ATTACH INDEXEDDB DATABASE BullsINTD;USE BullsINTD;`)
        }

        dbBullsOpenRequest.onerror = event => {
            console.log("Error occurred while opening the database. ", event.target.result)
        }
    });
}

ssp.webdb.deleteINDBAndClearInMemoryTables = () => {
    return new Promise(function (resolve, reject) {
        var deleteINDBRequest = indexedDB.deleteDatabase('BullsINTD');
        deleteINDBRequest.onsuccess = function () {
            console.log("Deleted database successfully!");

            //Dropping all data of In-Memory Tables.
            //Equivalent to DROP TABLE statements for all table.
            ['tblCustomers', 'tblCustomersAR', 'tblCustomerNotes', 'tblMileage', 'tblTimesheet', 'tblSales', 'tblBulls', 'tblSupplies', 'tblTechTransfer', 'tblTechRelief'].forEach((table) => delete alasql.databases['alasql'].tables[table])
            resolve(true);
        };
        deleteINDBRequest.onerror = function () {
            console.log("Couldn't delete database!");
        };
        deleteINDBRequest.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked!");
        };
    })
}

ssp.webdb.truncateTable = (tableName, getServerDataFunction) => {
    // tableName = 'tblCustomers', 'tblBulls', etc

    //Truncate In-Memory (alasql) Database table
    alasql.databases['alasql'].tables[tableName].data = [];

    //clear Object Store
    const openRequest = indexedDB.open('BullsINTD')
    openRequest.onsuccess = () => {
        const db = openRequest.result;

        const transRequest = db.transaction([tableName], "readwrite").objectStore(tableName).clear();
        transRequest.onsuccess = () => {
            getServerDataFunction?.();
        }
    }
}
ssp.webdb.getOrder = function (INVNUM, CANEDIT) {
    var currenttimeINV = (INVNUM == -1) ? (Math.round(new Date().getTime() / 1000)) + '.' + window.localStorage.getItem("ssp_TechID") : INVNUM;
    loadOrderContentBlock(currenttimeINV, CANEDIT);
}

ssp.webdb.getOrderItems = function (INVNUM) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblSales WHERE SIORNM = "' + INVNUM + '" AND SIACT ="' + $('#acctid').html() + '" ORDER BY MODSTAMP', [], loadOrderItems, ssp.webdb.onError);
    });
}

ssp.webdb.printOrder = function (INVNUM) {
    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);
        loadOrderContentBlock(INVNUM);         // (INVNUM==0)?currenttime:INVNUM);
        //tx.executeSql('SELECT tblSales.*,tblCustomers.* FROM tblSales INNER JOIN tblCustomers ON tblSales.SIACT = tblCustomers.ACCT_NO AND tblSales.SIREP = tblCustomers.TECH_NO WHERE SIORNM = "' + INVNUM + '" ORDER BY tblSales.MODSTAMP', [], orderPDF, ssp.webdb.onError);
        tx.executeSql('SELECT * FROM tblSales WHERE SIORNM = ? ORDER BY MODSTAMP', [INVNUM],
            function(tx,rs) {
                tx.executeSql('SELECT * FROM tblCustomers WHERE ACCT_NO = ?', [rs.rows.item(0).SIACT],
                    function (tx, custrs) {
                        orderPDF(tx, rs, custrs);
                    }, ssp.webdb.onError);
            }
        , ssp.webdb.onError);
    });
}

//JS121815 ***PrintLabel SSC Begin***  
ssp.webdb.printLabel = function (ordernum) {
    ssp.webdb.db.transaction(function (tx) {
        //var currenttime = Math.round(new Date().getTime() / 1000);
        //loadOrderContentBlock(INVNUM);
        tx.executeSql('SELECT * FROM tblSales WHERE SIORNM = ? ORDER BY MODSTAMP', [ordernum],
            function(tx,rs) {
                tx.executeSql('SELECT * FROM tblCustomers WHERE ACCT_NO = ?', [rs.rows.item(0).SIACT],
                    function (tx, custrs) {
                        labelPDF(tx, rs, custrs);
                    }, ssp.webdb.onError);
            }
        , ssp.webdb.onError);
    });
}
//JS121815 ***PrintLabel SSC End***


ssp.webdb.printSyncItems = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblSales WHERE MOD = 1 AND (SITYPS = "D" OR SITYPS = "N" OR SITYPS = "S" OR SITYPS = "B" OR SITYPS = "Z" OR SITYPS = "T") ORDER BY SIORNM,SINAM', [], syncPDF, ssp.webdb.onError);     /*JKS091018***4.06->Added the following to include pending transfers to the "save sync items to file" Button on the SYNC Page*** OR SITYPS = "T"*/
    });
}

ssp.webdb.backupItems = function () {
    var formattedDay = new Date().getDay();
    if ((window.localStorage.getItem("ssp_autobackup") == 1) && (window.localStorage.getItem("ssp_lastbackup") != formattedDay)) {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM tblSales WHERE MOD = 1 AND (SITYPS = "D" OR SITYPS = "N" OR SITYPS = "S" OR SITYPS = "B" OR SITYPS = "Z" OR SITYPS = "T") ORDER BY SIORNM,SINAM', [], backupPDF, ssp.webdb.onError);       /*JKS100418***4.07->Added the following to include pending transfers to the BackUp Items function.*** OR SITYPS = "T"*/
        });
        window.localStorage.setItem('ssp_lastbackup', formattedDay);
    }
}

ssp.webdb.getBullMiscCodes = function () {

    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT STOCK_NO,DESC FROM tblSupplies WHERE STOCK_NO Like "M2%" ORDER BY STOCK_NO', [],
            	function (tx, rs) {
        		    var rowOutput = '<label for="code" class="inline">Misc Code</label>';
        		    rowOutput += '<select name="misccode" id="misccode" >';
        		    rowOutput += '<option value=""></option>';
        		    for (var i = 0; i < rs.rows.length; i++) {
        		        rowOutput += '<option value="' + rs.rows.item(i).STOCK_NO + '">' + rs.rows.item(i).STOCK_NO + '-' + rs.rows.item(i).DESC + '</option>';
        		    }
        		    rowOutput += '</select>';
        		    $('#bullmisc').html(rowOutput);
        		}
        		, ssp.webdb.onError);
    });

}

ssp.webdb.deleteOrderItem = function (SIORNM, MODSTAMP) {

    if ($("#" + MODSTAMP).attr("class") == "button red") {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM tblSales WHERE SIORNM = ? AND MODSTAMP = ?', [SIORNM, MODSTAMP], ssp.webdb.getOrderItems($('#ordernum').html()), ssp.webdb.onError);
        });
    } else {
        $("#" + MODSTAMP).removeClass("button").addClass("button red");
        $("#" + MODSTAMP).html($("#" + MODSTAMP).html() + 'sure?');
    }

}

ssp.webdb.modfrzdateOrderItem = function (ITEMDATE) {
    var rowOutput = '<p>';
    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="ModItemFrzDate" id="ModItemFrzDate" value="' + ((ITEMDATE == "null") ? '' : ITEMDATE) + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="button small" title="save" onclick="ssp.webdb.SaveOrderItemFrzDate()"><img src="img/computer.png" width="16" height="16">Save</a>';
    rowOutput += '</p>';
    $("#BullFreeze").html(rowOutput);
}

ssp.webdb.SaveOrderItemFrzDate = function () {
    if (isValidDateMDY($('#ModItemFrzDate').val())) {
        $('#BullFreeze').html('<h3><div id="BullFreezeCode" style="display:inline-block">' + formatMDYPad($('#ModItemFrzDate').val()) + '</div>&nbsp;&nbsp;<div id="modfrzdate" style="display:inline-block"><a href="javascript:void(0)" class="button" title="moddate" onclick="ssp.webdb.modfrzdateOrderItem(\'' + $('#ModItemFrzDate').val() + '\')"><img src="img/calendar-day.png" width="16" height="16">Frz</a></div></h3>');
    } else {
        $('#tab-bulls').removeBlockMessages().blockMessage('Invalid Date.', { type: 'error' });
    }
}

ssp.webdb.moddateOrderItem = function (SIORNM, MODSTAMP, ITEMDATE) {
    var rowOutput = '<p>';
    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="ModItemDate" id="ModItemDate" value="' + ITEMDATE + '" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '<a href="javascript:void(0)" class="button small" title="save" onclick="ssp.webdb.SaveOrderItemDate(\'' + SIORNM + '\',' + MODSTAMP + ')"><img src="img/computer.png" width="16" height="16">Save</a>';
    rowOutput += '</p>';
    $("#moddate" + MODSTAMP).html(rowOutput);
}

ssp.webdb.SaveOrderItemDate = function (SIORNM, MODSTAMP) {

    if (sspValidateDate(formatEpoch($("#ModItemDate").val()))) {
        ssp.webdb.db.transaction(function (tx) {
            tx.executeSql('UPDATE tblSales SET SIDATO = ? WHERE SIORNM = ? AND MODSTAMP = ?', [formatEpoch($('#ModItemDate').val()), SIORNM, MODSTAMP], ssp.webdb.getOrderItems($('#ordernum').html()), ssp.webdb.onError);
        });
        ssp.webdb.getOrderItems(SIORNM);
    } else {
        $('#tab-bulls').removeBlockMessages().blockMessage('Invalid Date.', { type: 'error' });
    }
}

ssp.webdb.setSalesItemBull = function (item, itemname, price1, price2, price3, roycost, frzdat, type) {
    $('#BullCode').html(item);
    $('#BullName').html(itemname);
    if (frzdat !== '0' && frzdat !== 'null') {
        $('#BullFreeze').html('<h3><div id="BullFreezeCode" style="display:inline-block">' + formatYYYYMMDDtoMDY(frzdat) + '</div>&nbsp;&nbsp;<div id="modfrzdate" style="display:inline-block"><a href="javascript:void(0)" class="button" title="moddate" onclick="ssp.webdb.modfrzdateOrderItem(\'' + formatYYYYMMDDtoMDY(frzdat) + '\')"><img src="img/calendar-day.png" width="16" height="16">Frz</a></div></h3>');
    } else {
        if (window.localStorage.getItem("ssp_freeze") == 1) {
            $('#BullFreeze').html('</br><div id="modfrzdate" style="display:inline-block"><a href="javascript:void(0)" class="button" title="moddate" onclick="ssp.webdb.modfrzdateOrderItem(\'' + formatDate(Math.round(new Date().getTime() / 1000)) + '\')"><img src="img/calendar-day.png" width="16" height="16">freeze</a></div>');
        }
    }
    if (typeof transfer == "undefined") {
        var roycostdisp = (roycost < 0) ? ((roycost * -1) + "%") : "$" + roycost;
        $('#RoyCost').html('royalty ' + roycostdisp);
        $('#RetailDisp').html('Retail $' + price1);
        $('#retailtag').show();
        if (window.localStorage.getItem("ssp_techfunc") != 1) {
            $('#bullprice1').html('Retail: ' + price1);
            if (window.localStorage.getItem("ssp_projectid") == 'sess') {
                if (type == 'B') {
                    $('#bullprice2').html('Disc10: ' + price2);
                    $('#bullprice3').html('Disc15: ' + price3);
                } else {
                    $('#bullprice2').html('Disc20: ' + price2);
                    $('#bullprice3').html('Disc40: ' + price3);
                }
            //JKS072617***ADDED else if for SSP Beef breakdown pricing to be Retail/50 QTY/200 QTY***
            } else if (window.localStorage.getItem("ssp_projectid") == 'ssp') {
                //JKS121817***ADDED if (type == 'B') else for Beef***
                if (type == 'B') {
                    $('#bullprice2').html('Qty50: ' + price2);
                    $('#bullprice3').html('Qty200: ' + price3);
                } else {
                    $('#bullprice2').html('Qty20: ' + price2);
                    $('#bullprice3').html('Qty50: ' + price3);
                }
            } else {
                $('#bullprice2').html('Qty20: ' + price2);
                $('#bullprice3').html('Qty50: ' + price3);
            }
            $('#BullPrice').val($('.bullprice.green-keyword').html().split(':')[1].trim());
            $('#bullperc').val($('#custdisc1').html());
        } else {
            $('#bullperc').val($('#custdisc1').html());
            var bullprice = price1 * 1.00;
            if (($('.breeddisc.green-keyword').html() == "Cust %") && bullprice > 9.99) {
                var percoff = $('#bullperc').val() * 0.01;
                var discount = Math.min((bullprice * percoff), $('#custdisc2').html());
                $('#BullPrice').val((bullprice - discount).toFixed(2));
            } else if ($('.breeddisc.green-keyword').html() == "&nbsp;&nbsp;&nbsp;PCP&nbsp;&nbsp;&nbsp;") {
                $('#BullPrice').val(Math.max(0, (bullprice - 5)).toFixed(2));
            } else {
                $('#BullPrice').val(bullprice.toFixed(2));
            }
        }
    }

    if (type == 'B') {
        $('.breeding').attr('class', 'breeding');
        $('#beefon').show();
    } else {
        $('.breeding').attr('class', 'breeding');
        $('#beefon').hide();
    }

    if (window.localStorage.getItem("ssp_techfunc") == 1) {
        $("#searchbulls").val("");
    }
    $('#lookuplist').hide();
}

ssp.webdb.resetSalesItemBull = function () {

    if (!($('#chkTechBreed').is(':checked'))) {
        $('#BullCode').html('Select a Bull.');
        $('#BullName').html('');
        $('#BullNote').val('');        //JKS092116***Added BullNote***
        if (window.localStorage.getItem("ssp_projectid") == "ssc") {
            $('#BullFreeze').html('');
            $('#CowReg').val('');   //JS092415
            $('#BullReg').val('');  //JS092415
        }
        $('#BullPrice').val('');
        $('#retailtag').hide();
        $('#BullQty').val('');
        $('#bullprice1').html('Retail: 0');
        if (window.localStorage.getItem("ssp_projectid") == 'sess') {
            $('#bullprice2').html('Price2: 0');
            $('#bullprice3').html('Price3: 0');
        //JKS072617***ADDED else if for SSP Beef breakdown pricing to be Retail/50 QTY/200 QTY***
        } else {
            $('#bullprice2').html('Qty20: 0');
            $('#bullprice3').html('Qty50: 0');
        }
        $('#chkPGA').prop('checked', false);
        $('#bullperc').val('');
    }
    //$('#LaborPrice').val('');
    $('#CowNote').val('');
    if (window.localStorage.getItem("ssp_projectid") == "ecss") {
        $('#PrevDate').val('');
        $('#PrevBullCode').val('');
        $('#PrevTechID').val('');
    }
    //JS092415***SSC Label Tag ONLY for Breeding and Tech Mode***
    if (window.localStorage.getItem("ssp_projectid") == "ssc") {
        $('#CowReg').val('');   //JS092415
        $('#BullReg').val('');  //JS092415
    }
    //$('#chkCustSupp').prop('checked',false);
    $('.breeddisc').attr('class', 'breeddisc');
    $('#breeddisc1').attr('class', 'breeddisc green-keyword');
    $("#misccode").val('');
    $('.breeding').attr('class', 'breeding');
    $('#beefon').hide();
    $('#tab-bulls').removeBlockMessages();
}

ssp.webdb.applyBullPercent = function () {
    var bullprice = 0;
    if (window.localStorage.getItem("ssp_techfunc") == 1) {
        bullprice = (document.getElementById("retailtag").style.display == 'none') ? 0 : $('#RetailDisp').html().split('$')[1].trim(); // $('#BullPrice').val();
    } else {
        bullprice = $('#BullPrice').val(); //$('.bullprice.green-keyword').html().split(':')[1].trim()
    }


    var percoff = $('#bullperc').val() * .01;
    var discount = Math.min((bullprice * percoff), $('#custdisc2').html());
    $('#BullPrice').val((bullprice - discount).toFixed(2));
    //$('#BullPrice').val( (((100 - $('#bullperc').val())*.01)*$('#BullPrice').val()).toFixed(2) );
}

ssp.webdb.orderAddBull = function () {
    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);

        var bullcode = $('#BullCode').html();
        var bullname = $('#BullName').html();
        var bullfreeze = ($('#BullFreezeCode').html()) ? formatEpochAdjust($('#BullFreezeCode').html()) + 3600 : 0;
        var bullfreezeYYYYMMDD = ($('#BullFreezeCode').html()) ? $('#BullFreezeCode').html().split('/')[2] + $('#BullFreezeCode').html().split('/')[0] + $('#BullFreezeCode').html().split('/')[1] : '0';
        var bullqty = $('#BullQty').val();
        var bullprice = $('#BullPrice').val();
        var bullnote = $('#BullNote').val();        //JKS092116***Added BullNote***
        var bullretail = 0;
        if (window.localStorage.getItem("ssp_techfunc") == 1) {
            bullretail = (document.getElementById("retailtag").style.display == 'none') ? 0 : $('#RetailDisp').html().split('$')[1].trim();
        } else {
            bullretail = $('#bullprice1').html().split(':')[1].trim();
        }
        var bullmisc = $("#misccode option:selected").text().split('-')[0].trim();
        var bulltype = 'D'
        var bulllabor = 0;
        var cownote = null;
        var salescode = null;
        var prevdate = null;
        var psprevbullsessfallcredit = null;
        var prevtechid = 0;
        var bullcustsupp = 0;
        var CowReg = null;      //JS091515
        var BullReg = null;     //JS091515
        var beefon = $('#beefon li.green-keyword').html();
        beefon = (beefon) ? beefon.substring(0, 1) : '';

        //***JS 111615 Make SalesCode available for both Tech and Non-tech Modes***Begin
        // if (window.localStorage.getItem("ssp_projectid") == "ecss") {
            // salescode = $('#SalesCode').val();
        // }
        //***JS 111615 Make SalesCode available for both Tech and Non-tech Modes***End        
        if ($('#chkTechBreed').is(':checked')) {
            bulltype = 'B';
            bullqty = ($('.breeddisc.green-keyword').html() == "CUST SUPP") ? 0 : 1;
            bullprice = ($('.breeddisc.green-keyword').html() == "CUST SUPP" && bullprice.length == 0) ? "0" : $('#BullPrice').val();
            bulllabor = $('#LaborPrice').val();
            cownote = $('#CowNote').val();
            // if (window.localStorage.getItem("ssp_projectid") == "ecss") {
                // if (($('#SalesCode').val() > 1 && $('#SalesCode').val() < 10)) {
                    // prevdate = $('#PrevDate').val();
                    // psprevbullsessfallcredit = $('#PrevBullCode').val();
                    // prevtechid = $('#PrevTechID').val();
                // }
            // }
            if ((!bullname || bullname.length == 0) && $('.breeddisc.green-keyword').html() == "CUST SUPP") {
                bullname = 'Customer Supplied';
                bullcode = '0H0';
            }
            if ($('.breeddisc.green-keyword').html() == "CUST SUPP") {
                bullcustsupp = 1;
            }
            //JS092415***SSC Label Tag for Breeding in Tech Mode ONLY*** 
            if(window.localStorage.getItem("ssp_projectid") == "ssc") {
                CowReg = $('#CowReg').val();
                BullReg = $('#BullReg').val();
            }
        }

        var taxrate1 = .00;
        var taxrate2 = .00;
        var custrate1 = .00;
        var custrate2 = .00;
        if (window.localStorage.getItem("ssp_projectid") == 'ssc') {
            custrate1 = $('#custrate1').html() * 1;
            custrate2 = $('#custrate2').html() * 1;
            taxrate1 = custrate1 * ((bullqty * bullprice) + +bulllabor);     //JKS022616 ***Added bulllabor to the equation***
            taxrate1 = Math.round(taxrate1 * 100) / 100;
            taxrate2 = custrate2 * ((bullqty * bullprice) + +bulllabor);     //JKS022616 ***Added bulllabor to the equation***
            taxrate2 = Math.round(taxrate2 * 100) / 100;
        }

        //if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
        //    semencode = $('#SemenCode').val();  //JS091015
        //    if ($('#chkTechBreed').is(':checked')) {
        //        salescode = $('#SalesCode').val();  //JS100515
        //    } else {
        //        salescode = 0;
        //    }
        //}
        
        
        //var sessfallcredit = 0;
        if (window.localStorage.getItem("ssp_projectid") == 'sess') {
            psprevbullsessfallcredit = (($('#chkFallCredit').is(':checked')) ? '1' : '0');
        }
        var psservicecall = '';
        if (window.localStorage.getItem("ssp_projectid") == 'ps') {
            psservicecall = $('#ServiceCall').val();
        }   
        if ((!bullcode || bullcode.length == 0) && $('.breeddisc.green-keyword').html() != "CUST SUPP") {
            $('#tab-bulls').removeBlockMessages().blockMessage('Please select a bull code.', { type: 'error' });
        }
        else if ((!bullname || bullname.length == 0) && $('.breeddisc.green-keyword').html() != "CUST SUPP") {
            $('#tab-bulls').removeBlockMessages().blockMessage('Please select a bull name.', { type: 'error' });
        }
        else if ((!bullqty && $('.breeddisc.green-keyword').html() != "CUST SUPP") || bullqty.length == 0 || sspNaN(bullqty)) {
            $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a correct bull quantity.', { type: 'error' });
        }
        else if (!bullprice || bullprice.length == 0 || sspNaN(bullprice) || bullprice.substr(bullprice.length - 1, bullprice.length) == ".") {
            $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a correct bull price.', { type: 'error' });
        }
            //		else if ((bullretail-bullprice) > 15) {
            //			$('#tab-bulls').removeBlockMessages().blockMessage('Cannot exceed $15 discount.', {type: 'error'});
            //		} 
        //else if ((!semencode || semencode.length == 0 || sspNaN(semencode)) && (window.localStorage.getItem("ssp_projectid") == "ecss")) {
        //    $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a semen code.', { type: 'error' });
        //}  
        else if ((!cownote || cownote.length == 0) && ($('#chkTechBreed').is(':checked'))) {
            $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a cow id.', { type: 'error' });
        }
        else if ((!bulllabor || bulllabor.length == 0 || sspNaN(bulllabor) || bulllabor.substr(bulllabor.length - 1, bulllabor.length) == ".") && ($('#chkTechBreed').is(':checked'))) {
            $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a correct labor price.', { type: 'error' });
        }
        //else if ((!salescode || salescode.length == 0 || sspNaN(salescode)) && (window.localStorage.getItem("ssp_projectid") == "ecss")) {
        //    $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a sales code.', { type: 'error' });
        //}    
        //else if ((!prevdate || prevdate.length == 0 || !(sspValidateDate(formatEpoch($("#PrevDate").val())))) && ($('#chkTechBreed').is(':checked')) && (window.localStorage.getItem("ssp_projectid") == "ecss") && ($('#SalesCode').val() > 1 && $('#SalesCode').val() < 10)) { // ($('#SalesCode').val() != 1) && ($('#SalesCode').val() != 71) && ($('#SalesCode').val() != 91)) {            
        //    $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a previous date, using mm/dd/yyyy format. ', { type: 'error' });
        //}
        //else if ((!psprevbullsessfallcredit || psprevbullsessfallcredit.length == 0) && ($('#chkTechBreed').is(':checked')) && (window.localStorage.getItem("ssp_projectid") == "ecss") && ($('#SalesCode').val() > 1 && $('#SalesCode').val() < 10)) { // && ($('#SalesCode').val() != 1) && ($('#SalesCode').val() != 71) && ($('#SalesCode').val() != 91)) {
        //    $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a previous bull number.', { type: 'error' });
        //}
        //else if ((!prevtechid || prevtechid.length == 0) && ($('#chkTechBreed').is(':checked')) && (window.localStorage.getItem("ssp_projectid") == "ecss") && ($('#SalesCode').val() > 1 && $('#SalesCode').val() < 10)) { // && ($('#SalesCode').val() != 1) && ($('#SalesCode').val() != 71) && ($('#SalesCode').val() != 91)) {
        //    $('#tab-bulls').removeBlockMessages().blockMessage('Please enter a previous tech ID.', { type: 'error' });
        //}        
        else {
            tx.executeSql('INSERT INTO tblSales (SIACT,SIORNM,SIDATO,SITYPS,SICOD,SIQTY,SINAM,SIPRC,SIREP,SIANM,SIRETL,SIPGA,SITYPI,SIOTH,SILVL4,SILIN,SILVL1,SILVL2,SILVL3,SILVL5,SICOW,SIARM,SISUP,FRZDAT,LOTNOT,MOD,MODSTAMP,BREEDTYPE,FRZYYYYMMDD) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [$('#acctid').html(), $('#ordernum').html(), currenttime, bulltype, bullcode, bullqty, bullname, bullprice, window.localStorage.getItem("ssp_TechID"), $('#custname').html(), bullretail, (($('#chkPGA').is(':checked')) ? 1 : 0), prevdate, salescode, psprevbullsessfallcredit, prevtechid, bullmisc, taxrate1, taxrate2, psservicecall, cownote, bulllabor, bullcustsupp, bullfreeze, bullnote, 1, currenttime, beefon, bullfreezeYYYYMMDD], ssp.webdb.resetSalesItemBull(), ssp.webdb.onError);        //JKS040218***ADDED BREEDTYPE ? breeding***
        }       //JKS092116***Added LOTNOT and bullnote for BullNote***
    });
    return false;
}

ssp.webdb.setSalesItemSupply = function (item, itemname, price, notax, statetaxable) {
    $('#SupplyCode').html(item);
    $('#SupplyName').html(itemname);
    $('#SupplyPrice').val(price);
    $('#SupplyNoTax').val(notax);
    $('#SupplyStateTaxable').val(statetaxable);
    $('#lookuplist').hide();
}

ssp.webdb.resetSalesItemSupply = function () {
    $('#SupplyCode').html('Select a Supply.');
    $('#SupplyName').html('');
    $('#SupplyQty').val('');
    $('#SupplyPrice').val('');
    $('#SupplyLot').val('');
    $('#SupplyNoTax').val('');
    $('#SupplyStateTaxable').val('');
    $('#tab-supplies').removeBlockMessages();
}

ssp.webdb.orderAddSupply = function () {
    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);

        var suppcode = $('#SupplyCode').html();
        var suppname = $('#SupplyName').html();
        var suppqty = $('#SupplyQty').val();
        var suppprice = $('#SupplyPrice').val();
        var supplot = $('#SupplyLot').val();    //JKS092616***Added for Supply Note for All***
        //JKS092616***Changed Supply Lot for SESS & SSC to Supply Note for All***      var supplot = ($('#SupplyLot').length == 0) ? '' : $('#SupplyLot').val();

        var taxrate1 = .00;
        var taxrate2 = .00;
        var custrate1 = .00;
        var custrate2 = .00;
        //Check if Canada or SESS or ECSS or MNSS and Taxable
        if (window.localStorage.getItem("ssp_projectid") == 'mnss') {
            custstate = $('#taxstate').html();
            ndtaxable = $('#SupplyStateTaxable').val().split(':')[1];
            mntaxable = $('#SupplyStateTaxable').val().split(':')[0];
            if ((custstate == 'MN' && mntaxable == 'Y') || (custstate == 'ND' && ndtaxable =='Y')) {
                custrate1 = $('#custrate1').html() * 1;
                custrate2 = $('#custrate2').html() * 1;
                taxrate1 = custrate1 * (suppqty * suppprice);
                taxrate2 = custrate2 * (suppqty * suppprice);
            }
        } else if ((window.localStorage.getItem("ssp_projectid") == 'ssc' || window.localStorage.getItem("ssp_projectid") == 'sess' || window.localStorage.getItem("ssp_projectid") == 'ecss') && $('#SupplyNoTax').val() == 0) {
            custrate1 = $('#custrate1').html() * 1;
            custrate2 = $('#custrate2').html() * 1;
            taxrate1 = custrate1 * (suppqty * suppprice);
            taxrate2 = custrate2 * (suppqty * suppprice);
        }

        if (!suppcode || suppcode.length == 0) {
            $('#tab-supplies').removeBlockMessages().blockMessage('Please select a supply code.', { type: 'error' });
        }
        else if (!suppname || suppname.length == 0) {
            $('#tab-supplies').removeBlockMessages().blockMessage('Please select a supply name.', { type: 'error' });
        }
        else if (!suppqty || suppqty.length == 0 || sspNaN(suppqty) || suppqty.substr(suppqty.length - 1, suppqty.length) == ".") {
            $('#tab-supplies').removeBlockMessages().blockMessage('Please enter a correct supply quantity.', { type: 'error' });
        }
        else if (!suppprice || suppprice.length == 0 || sspNaN(suppprice) || suppprice.substr(suppprice.length - 1, suppprice.length) == ".") {
            $('#tab-supplies').removeBlockMessages().blockMessage('Please enter a correct supply price.', { type: 'error' });
        }
        else {
            tx.executeSql('INSERT INTO tblSales (SIACT,SIORNM,SIDATO,SITYPS,SICOD,SIQTY,SINAM,SIPRC,SIREP,SIANM,SILVL2,SILVL3,LOTNOT,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [$('#acctid').html(), $('#ordernum').html(), currenttime, 'S', suppcode, suppqty, suppname, suppprice, window.localStorage.getItem("ssp_TechID"), $('#custname').html(), taxrate1, taxrate2, supplot, 1, currenttime], ssp.webdb.resetSalesItemSupply(), ssp.webdb.onError);
        }
    });
    return false;
}

ssp.webdb.resetSalesItemNitro = function () {
    $('#NitroQty').val('');
    $('#NitroAmt').val('');
    $('#NitroNote').val('');
    $('#tab-nitro').removeBlockMessages();
}

ssp.webdb.orderAddNitro = function () {
    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);

        // Check fields
        var nitroqty = $('#NitroQty').val();
        var nitroamt = $('#NitroAmt').val();
        var nitronote = $('#NitroNote').val();

        var taxrate1 = .00;
        var taxrate2 = .00;
        var custrate1 = .00;
        var custrate2 = .00;
        if ((window.localStorage.getItem("ssp_projectid") == 'ssc') || (window.localStorage.getItem("ssp_projectid") == 'sess') || (window.localStorage.getItem("ssp_projectid") == 'ecss') || (window.localStorage.getItem("ssp_projectid") == 'mnss' && $('#taxstate').html() == 'ND')) {
            custrate1 = $('#custrate1').html() * 1;
            custrate2 = $('#custrate2').html() * 1;
            taxrate1 = custrate1 * (nitroqty * nitroamt);
            taxrate2 = custrate2 * (nitroqty * nitroamt);
        }

        if (!nitroqty || nitroqty.length == 0 || sspNaN(nitroqty) || nitroqty.substr(nitroqty.length - 1, nitroqty.length) == "." || nitroqty <= 0 || nitroqty % 1 != 0) {
            $('#tab-nitro').removeBlockMessages().blockMessage('Please enter a correct quantity...no negatives or decimals...only positive integers.', { type: 'error' });
        }
        else if (!nitroamt || nitroamt.length == 0 || sspNaN(nitroamt) || nitroamt.substr(nitroamt.length - 1, nitroamt.length) == ".") {
            $('#tab-nitro').removeBlockMessages().blockMessage('Please enter a correct amount.', { type: 'error' });
        }
        else {
            tx.executeSql('INSERT INTO tblSales (SIACT,SIORNM,SIDATO,SITYPS,SICOD,SIQTY,SINAM,SIPRC,SIREP,SIANM,SILVL2,SILVL3,LOTNOT,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [$('#acctid').html(), $('#ordernum').html(), currenttime, 'N', 'N2Fill', nitroqty, 'Nitrogen Fill', nitroamt, window.localStorage.getItem("ssp_TechID"), $('#custname').html(), taxrate1, taxrate2, nitronote, 1, currenttime], ssp.webdb.resetSalesItemNitro(), ssp.webdb.onError);
        }
    });
    return false;
}

ssp.webdb.resetSalesItemPOA = function () {
    $('#POACashCheck').val('');
    $('#POAAmt').val('');
    $('#tab-poa').removeBlockMessages();
}

ssp.webdb.orderAddPOA = function () {
    ssp.webdb.db.transaction(function (tx) {
        var currenttime = Math.round(new Date().getTime() / 1000);

        // Check fields
        var poadate = $('#POACashCheck').val();
        var poaamt = $('#POAAmt').val();

        if (!poadate || poadate.length == 0) {
            $('#tab-poa').removeBlockMessages().blockMessage('Please enter cash or check number.', { type: 'error' });
        }
        else if (!poaamt || poaamt.length == 0 || sspNaN(poaamt) || poaamt.substr(poaamt.length - 1, poaamt.length) == ".") {
            $('#tab-poa').removeBlockMessages().blockMessage('Please enter a correct amount.', { type: 'error' });
        }
        else {
            tx.executeSql('INSERT INTO tblSales (SIACT,SIORNM,SIDATO,SITYPS,SICOD,SIQTY,SIMATH,SINAM,SIPRC,SIPOA,SIREP,SIANM,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [$('#acctid').html(), $('#ordernum').html(), currenttime, 'Z', 'POA', 1, $('#POACashCheck').val(), 'Paid on Account', 0, poaamt, window.localStorage.getItem("ssp_TechID"), $('#custname').html(), 1, currenttime], ssp.webdb.resetSalesItemPOA(), ssp.webdb.onError);
        }
    });
    return false;
}

ssp.webdb.setPOACashCheck = function (strVal) {
    $('#POACashCheck').val(strVal);
    return false;
}

function loadOrderContentBlock(INVNUM, CANEDIT) {
    var rowOutput = '<article>';
    rowOutput += '<div class="block-border">';
    rowOutput += '<article class="white-bg"><ul class="favorites">';
    rowOutput += '<li>';
    rowOutput += '<ul class="floating-tags">';
    rowOutput += '<li class="tag">Disc <div id="custdisc1" style="display:inline-block">' + $('#custdisc1').html() + '</div>%-$<div id="custdisc2" style="display:inline-block">' + $('#custdisc2').html() + '</div></li>';
    rowOutput += '<li class="tag-trans"><button class="medium" onclick="ssp.webdb.printOrder(' + "'" + INVNUM + "'" + ');"> order pdf </button></li>';
    
    //JS100615 ***ECSS Switch for TechMode on Order Screen***Begin
    //JKS041819***Removed Switch for ECSS/CS on Customer Orders*** if (window.localStorage.getItem("ssp_projectid") == "ecss" || window.localStorage.getItem("ssp_projectid") == "mnss") {
    if (window.localStorage.getItem("ssp_projectid") == "mnss") {
        rowOutput += '<li class="tag tag-trans">';
        rowOutput += '<h3 style="display:inline">Tech </h3>';
        rowOutput += '<input type="checkbox" name="techfunc" id="chkTechfunc" class="mini-switch float-left" title="Tech" ' + ((window.localStorage.getItem("ssp_techfunc") == 1) ? 'checked="checked"' : '') + '>';
        rowOutput += '</li>';
    }    
    //JS100615 ***ECSS Switch for TechMode on Order Screen***End

    rowOutput += '</ul>';
    rowOutput += '<h2><a href="#" class="no-margin" onclick="ssp.webdb.getCustomerByID(' + "'" + $('#acctid').html() + "'" + ');"><div id="custname">' + $('#custname').html() + '</div><div id="acctid">' + $('#acctid').html() + '</div>';
    rowOutput += '<strong></strong></a><small>Order Number: <div id="ordernum">' + INVNUM + '</div></small>';
    rowOutput += '</li>';
    if ((window.localStorage.getItem("ssp_projectid") == 'ssc') || (window.localStorage.getItem("ssp_projectid") == 'sess') || (window.localStorage.getItem("ssp_projectid") == 'ecss') || (window.localStorage.getItem("ssp_projectid") == 'mnss')) {
        rowOutput += '<li><div id="custrate1" style="display:none">' + $('#custrate1').html() + '</div><div id="custrate2" style="display:none">' + $('#custrate2').html() + '</div><div id="taxstate" style="display:none">' + $('#taxstate').html() + '</div></li>';
    }
    rowOutput += '</ul>';
    rowOutput += '</article>';
    rowOutput += '<div class="block-content no-padding">';
    rowOutput += '<div class="block-controls no-margin">';
    rowOutput += '<ul class="controls-tabs js-tabs" class="float-right">';
    rowOutput += '<li' + ((window.localStorage.getItem("ssp_techfunc") != 1 || !CANEDIT) ? ' class="current">' : '>') + '<a href="#tab-items" title="Item List">Items</a></li>';
    if (CANEDIT) {
        rowOutput += '<li><a href="#tab-nitro" title="Nitrogen">Nitrogren</a></li>';
        rowOutput += '<li' + ((window.localStorage.getItem("ssp_techfunc") == 1) ? ' class="current">' : '>') + '<a href="#tab-bulls" title="Bulls">Bulls</a></li>';
        rowOutput += '<li><a href="#tab-supplies" title="Supplies">Supplies</a></li>';
        rowOutput += '<li><a href="#tab-poa" title="POA">POA</a></li>';
    }
    rowOutput += '</ul>';
    rowOutput += '</div>';
    rowOutput += '<div id="tab-items">';
    rowOutput += '<div id="orderitems"></div>';
    rowOutput += '</div>';
    if (CANEDIT) {
        rowOutput += '<div id="tab-nitro">';
        rowOutput += '<p class="message error no-margin">Error Message</p>';
        rowOutput += '<form class="form" onsubmit="return ssp.webdb.orderAddNitro()" >';
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="qty">Quantity</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="NitroQty" id="NitroQty" class="full-width" value="1" >';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="amt">Amount</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="NitroAmt" id="NitroAmt" class="full-width" >';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="NitroNote">Note</label>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="NitroNote" id="NitroNote" class="full-width">';     /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        rowOutput += '<p><button class="full-width">Save</button></p>';
        rowOutput += '</form>';
        rowOutput += '</div>';
        rowOutput += '<div id="tab-bulls">';
        rowOutput += '<p class="message error no-margin">Error Message</p>';
        rowOutput += '<form class="form" onsubmit="return ssp.webdb.orderAddBull()" >';
        rowOutput += '<div class="block-border clearfix">';
        rowOutput += '<ul id="retailtag" class="floating-tags" style="display:none">';
        if (window.localStorage.getItem("ssp_techfunc") == 1) {
            rowOutput += '<li class="tag"><div id="RetailDisp" style="display:inline-block"></div></li>';
        }
        rowOutput += '<li class="tag"><div id="RoyCost" style="display:inline-block"></div></li>';
        rowOutput += '</ul>';
        rowOutput += '<h3><div id="BullCode">Select a Bull.</div></h3>';
        rowOutput += '<h4><div id="BullName"></div></h4>';
        if (window.localStorage.getItem("ssp_freeze") == 1) {
            rowOutput += '<h4><div id="BullFreeze"></div></h4>';
        }
        rowOutput += '</div>';
        rowOutput += '<p></p>';  //JS01015
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="amt">Price</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' step=".01" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="BullPrice" id="BullPrice" class="full-width">';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        rowOutput += '<p class="inline-mini-label" id="bullqtyvis">';
        rowOutput += '<label for="amt">Quantity</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="BullQty" id="BullQty" class="full-width">';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        //JKS092116***Begin BullNote***
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="BullNote">Note</label>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="BullNote" id="BullNote" class="full-width">';       /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        //JKS092116***End BullNote***
        if (window.localStorage.getItem("ssp_techfunc") == 1) {
            rowOutput += '<div class="lite-grey-gradient with-padding">';
            //if (window.localStorage.getItem("ssp_projectid") == "ecss") {
            //    rowOutput += '<p>';
            //    rowOutput += '<label for="SalesCode" class="inline">Sales Code </label>';
            //    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SalesCode" id="SalesCode">';        /*JKS080818->4.03***Auto Fill Search switch*/
            //    rowOutput += '</p>';
            //}
            rowOutput += '<p>';
            rowOutput += '<ul class="keywords"><li id="breeddisc1" class="breeddisc">Cust %</li>';
            if(window.localStorage.getItem("ssp_projectid") != 'mnss') {
                rowOutput += '<li id="breeddisc2" class="breeddisc">&nbsp;&nbsp;&nbsp; PCP &nbsp;&nbsp;&nbsp;</li>';
            }
            rowOutput += '<li id="breeddisc3" class="breeddisc">Special %</li><li id="breedcustsupp" class="breeddisc">CUST SUPP</li></ul > ';
            rowOutput += '</p>';
            rowOutput += '<p id="specperc">';
            rowOutput += '<label for="bullperc" class="inline">Discount % </label>';
            rowOutput += '<span class="input-type-text">';
            rowOutput += '<a href="javascript:void(0)" class="button float-right"  onclick="ssp.webdb.applyBullPercent()" >%</a>';
            rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="bullperc" id="bullperc" step=".01" style="width:40px" >';    /*JKS080818->4.03***Auto Fill Search switch*/
            rowOutput += '</span>';
            rowOutput += '</p>';
            rowOutput += '<p>';
            rowOutput += '<label for="LaborPrice" class="inline" >Labor Price </label>';
            rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' step=".01" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="LaborPrice" id="LaborPrice" >';    /*JKS080818->4.03***Auto Fill Search switch*/
            rowOutput += '</p>';
            rowOutput += '<p>';
            rowOutput += '<label for="CowNote" class="inline">Cow ID </label>';
            rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="CowNote" id="CowNote" >';       /*JKS080818->4.03***Auto Fill Search switch*/
            rowOutput += '</p>';
            
            //if (window.localStorage.getItem("ssp_projectid") == "ecss") {
            //    //rowOutput += '<p>';
            //    //rowOutput += '<label for="SalesCode" class="inline">Labor Code </label>';
            //    //rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SalesCode" id="SalesCode">';      /*JKS080818->4.03***Auto Fill Search switch*/
            //    //rowOutput += '</p>';
            //    //if ((window.localStorage.getItem("SalesCode") != 1) && (window.localStorage.getItem("SalesCode") != 2) && (window.localStorage.getItem("SalesCode") != 71) && (window.localStorage.getItem("SalesCode") != 91)) {
            //        rowOutput += '<p>';
            //        rowOutput += '<label for="PrevDate" class="inline">Previous Date </label>';
            //        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="PrevDate" id="PrevDate">';      /*JKS080818->4.03***Auto Fill Search switch*/
            //        rowOutput += '</p>';
            //        rowOutput += '<p>';
            //        rowOutput += '<label for="PrevBullCode" class="inline">Previous Bull Code </label>';
            //        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="PrevBullCode" id="PrevBullCode">';      /*JKS080818->4.03***Auto Fill Search switch*/
            //        rowOutput += '</p>';
            //        rowOutput += '<p>';
            //        rowOutput += '<label for="PrevTechID" class="inline">Previous Tech ID </label>';
            //        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="PrevTechID" id="PrevTechID">';      /*JKS080818->4.03***Auto Fill Search switch*/
            //        rowOutput += '</p>';
            //    //}
            //}
            
            if (window.localStorage.getItem("ssp_projectid") == 'ps') {
                rowOutput += '<p>';
                rowOutput += '<label for="ServiceCall" class="inline">Service Call </label>';
                rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="ServiceCall" id="ServiceCall" >';       /*JKS080818->4.03***Auto Fill Search switch*/
                rowOutput += '</p>';
            }
            rowOutput += '<p>';
            rowOutput += '<input type="checkbox" style="display:none;" name="techbreed" id="chkTechBreed" title="Breed" >';
            rowOutput += '</div>';
        }
        else {
            rowOutput += '<div class="lite-grey-gradient with-padding">';
            //JKS110916***Begin IF Removed PGA check box for MNSS.***
            if (window.localStorage.getItem("ssp_projectid") != 'mnss') {
                rowOutput += '<div class="float-right"><input type="checkbox" name="pgadisc" id="chkPGA" ><label for="pgadisc" class="inline"><b>&nbsp;PGA</b></label></div>';
            }
            //JKS110916***End IF Removed PGA check box for MNSS.***
            //if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
            //    rowOutput += '<p>';
            //    rowOutput += '<label for="SalesCode" class="inline">Sales Code </label>';
            //    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SalesCode" id="SalesCode">';        /*JKS080818->4.03***Auto Fill Search switch*/
            //    rowOutput += '</p>';
            //}
            if (window.localStorage.getItem("ssp_projectid") == 'sess') {
                rowOutput += '<ul class="keywords"><li id="bullprice1" class="bullprice">Retail: 0.00</li><li id="bullprice2" class="bullprice">Price2: 0.00</li><li id="bullprice3" class="bullprice">Price3: 0.00</li></ul>'
                rowOutput += '<div class="float-right"><input type="checkbox" name="fallcred" id="chkFallCredit" ><label for="fallcred"><b>&nbsp;Fall Cred&nbsp;</b></label></div>';
            //JKS072617***ADDED else if for SSP Beef breakdown pricing to be Retail/50 QTY/200 QTY***
            } else if (window.localStorage.getItem("ssp_projectid") == 'ssp') {
                //JKS121817***ADDED if (window.localStorage.getItem("type") == 'B') else for Beef***
                if (window.localStorage.getItem("type") == 'B') {
                    rowOutput += '<ul class="keywords"><li id="bullprice1" class="bullprice">Retail: 0.00</li><li id="bullprice2" class="bullprice">Qty50: 0.00</li><li id="bullprice3" class="bullprice">Qty200: 0.00</li></ul>'
                } else {
                    rowOutput += '<ul class="keywords"><li id="bullprice1" class="bullprice">Retail: 0.00</li><li id="bullprice2" class="bullprice">Qty20: 0.00</li><li id="bullprice3" class="bullprice">Qty50: 0.00</li></ul>'
                }
            } else {
                rowOutput += '<ul class="keywords"><li id="bullprice1" class="bullprice">Retail: 0.00</li><li id="bullprice2" class="bullprice">Qty20: 0.00</li><li id="bullprice3" class="bullprice">Qty50: 0.00</li></ul>'
            }
            rowOutput += '<p>';
            rowOutput += '<label for="bullperc" class="inline">Discount %</label>';
            rowOutput += '<span class="input-type-text">';
            rowOutput += '<a href="javascript:void(0)" class="button float-right"  onclick="ssp.webdb.applyBullPercent()" >%</a>';
            rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="bullperc" id="bullperc" step=".01" style="width:40px" >';    /*JKS080818->4.03***Auto Fill Search switch*/
            rowOutput += '</span>';
            rowOutput += '</p>';
            rowOutput += '<p class="inline-mini-label">';
            rowOutput += '<div id="bullmisc"></div>';
            rowOutput += '</p>';
            ////JKS032818***v4.00->Check boxes for Bull on Bull or Bull on Dairy breedings.***
            //if (window.localStorage.getItem("type") == 'B') {
            //    rowOutput += '<p>';
            //    rowOutput += '<div class="float-left"> &emsp;<input type="checkbox" name="bullonbull" id="chkBoB" ><label for="bullonbull" class="inline"><b>&nbsp;BoB </b></label></div>';
            //    rowOutput += '<div class="float-left"> &emsp; &emsp;<input type="checkbox" name="bullondairy" id="chkBoD" ><label for="bullondairy" class="inline"><b>&nbsp;BoD</b></label></div>';
            //    rowOutput += '</p>';
            //    rowOutput += '<p></p>';
            //    rowOutput += '<br />';
            //}
            rowOutput += '</div>';
        }
        //JKS040218***v4.00->BEGIN BeefOnBeef or BeefOnDairy or Unknown breedings.***
        rowOutput += '<ul class="keywords" id="beefon">&emsp;&nbsp;<label for="beefon" class="inline" style="font-size:12px">Beef On </label><li class="breeding">BEEF</li><li class="breeding">DAIRY</li><li class="breeding">UNKNOWN</li></ul>';
        //JKS040218***v4.00->END BeefOnBeef or BeefOnDairy or Unknown breedings.***

        rowOutput += '<p><button class="full-width">Save</button></p>';
        rowOutput += '</form>';
        rowOutput += '</div>';

        rowOutput += '<div id="tab-supplies">';
        rowOutput += '<p class="message error no-margin">Error Message</p>';
        rowOutput += '<form class="form" onsubmit="return ssp.webdb.orderAddSupply()" >';
        rowOutput += '<div class="block-border"><h3><div id="SupplyCode">Select a Supply.</div></h3>';
        rowOutput += '<h4><div id="SupplyName"></div></h4></div>'
        rowOutput += '<p></p>';  //JS100915
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="amt">Price</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SupplyPrice" id="SupplyPrice" class="full-width">';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="amt">Quantity</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SupplyQty" id="SupplyQty" class="full-width" value="1">';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        //JKS092616***Begin SupplyNote***
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="SupplyNote">Note</label>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SupplyLot" id="SupplyLot" class="full-width">';     /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        //JKS092616***End SupplyNote***
        //JKS092616***Begin Changed label Lot for SESS & SSC to Supply Note for All***
        //if (window.localStorage.getItem("ssp_projectid") == 'sess' || window.localStorage.getItem("ssp_projectid") == 'ssc') {
            //rowOutput += '<p class="inline-mini-label">';
            //rowOutput += '<label for="amt">Lot</label>';
            //rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SupplyLot" id="SupplyLot" class="full-width">';       /*JKS080818->4.03***Auto Fill Search switch*/
            //rowOutput += '</p>';
        //}
        //JKS092616***End Changed label Lot for SESS & SSC to Supply Note for All***
        rowOutput += '<p class="inline-mini-label" style="display:none">';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SupplyNoTax" id="SupplyNoTax" class="full-width">';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="SupplyStateTaxable" id="SupplyStateTaxable" class="full-width">';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        rowOutput += '<p><button class="full-width">Save</button></p>';
        rowOutput += '</form>';
        rowOutput += '</div>';
        rowOutput += '<div id="tab-poa">';
        rowOutput += '<p class="message error no-margin">Error Message</p>';
        rowOutput += '<form class="form" onsubmit="return ssp.webdb.orderAddPOA()" >';


        rowOutput += '<p class="with-padding">';
        rowOutput += '<button type="button" onclick="ssp.webdb.setPOACashCheck(\'CASH\');">cash</button>  or  <button type="button" onclick="ssp.webdb.setPOACashCheck();">check</button>';
        if (window.localStorage.getItem("ssp_projectid") == 'sess') {
            rowOutput += ' or <button type="button" onclick="ssp.webdb.setPOACashCheck(\'FALL CREDIT\');">fall credit</button>';
        }
        rowOutput += '</p>';
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="POACashCheck">Number</label>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="POACashCheck" id="POACashCheck" class="full-width" >';      /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="amt">Amount</label>';
        rowOutput += '<input ' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'type="number"' : '') + ' autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="POAAmt" id="POAAmt" class="full-width" >';    /*JKS080818->4.03***Auto Fill Search switch*/
        rowOutput += '</p>';
        rowOutput += '<p><button class="full-width">Save</button></p>';
        rowOutput += '</form>';
        rowOutput += '</div>';
    }
    rowOutput += '</div>';
    rowOutput += '<div id="lookuplist">';
    rowOutput += '</div>';
    rowOutput += '</div>';
    rowOutput += '</article>';

    $('#maincontent').html(rowOutput);

    if (window.localStorage.getItem("ssp_techfunc") == 1) {
        $('#chkTechBreed').prop('checked', true);
        $('#bullqtyvis').hide();
        $('#breedoptions').show();
        $('#LaborPrice').val(window.localStorage.getItem('ssp_armprice'));
    }

    $('#tab-items').onTabShow(function () {
        $('#tab-items').removeBlockMessages();
        $('#lookuplist').html('');
        ssp.webdb.getOrderItems($('#ordernum').html()); 
    });
    $('#tab-nitro').onTabShow(function () {
        $('#tab-items').removeBlockMessages();
        $('#lookuplist').html('');
        $('#NitroAmt').val(window.localStorage.getItem('ssp_nitroprice'));
        $('#NitroQty').val(1);
    });
    $('#tab-bulls').onTabShow(function () {
        $('#tab-items').removeBlockMessages();
        $('#lookuplist').html('');
        ssp.webdb.getBulls('%');
        ssp.webdb.resetSalesItemBull();
        ssp.webdb.getBullMiscCodes();
        $('.bullprice').attr('class', 'bullprice');
        $('#bullprice1').attr('class', 'bullprice green-keyword');
        $('.breeddisc').attr('class', 'breeddisc');
        $('#breeddisc1').attr('class', 'breeddisc green-keyword');
        $('.breeding').attr('class', 'breeding');                     //JKS040218***BreedType***
        //$('#beefonbeef').attr('class', 'breeding green-keyword');      //JKS040218***BreedType***
        $('#lookuplist').hide();
        $('#specperc').hide();
        $('#beefon').hide();
    });
    $('#tab-supplies').onTabShow(function () {
        $('#tab-items').removeBlockMessages();
        $('#lookuplist').html('');
        ssp.webdb.getSupplies('%');
        ssp.webdb.resetSalesItemSupply();
        $('#lookuplist').hide();

    });

    $('.bullprice').click(function () {
        $('#BullPrice').val($(this).html().split(':')[1].trim());
        $('.bullprice').attr('class', 'bullprice');
        $(this).attr('class', 'bullprice green-keyword');
        //$(document.body).applyTemplateSetup();
    });
    $('.breeddisc').click(function () {
        (this.id == "breeddisc3") ? $('#specperc').show() : $('#specperc').hide();
        $('.breeddisc').attr('class', 'breeddisc');
        $(this).attr('class', 'breeddisc green-keyword');
        //$(document.body).applyTemplateSetup();
        $('#bullperc').val($('#custdisc1').html());
        var bullprice = (document.getElementById("retailtag").style.display == 'none') ? 0 : $('#RetailDisp').html().split('$')[1].trim();
        if ((($('.breeddisc.green-keyword').html() == "Cust %") || ($('.breeddisc.green-keyword').html() == "Special %")) && bullprice > 0.01) {       /*JKS092419***4.23->CHANGED 9.99 to 0.01 and ADDED +|| ($('.breeddisc.green-keyword').html() == "Special %")+ to allow Cust % and Special % to reset to the original bullprice when selected.*/
            var percoff = $('#bullperc').val() * .01;
            var discount = Math.min((bullprice * percoff), $('#custdisc2').html());
            $('#BullPrice').val((bullprice - discount).toFixed(2));
        } else if ($('.breeddisc.green-keyword').html() == "&nbsp;&nbsp;&nbsp; PCP &nbsp;&nbsp;&nbsp;") {       /*JKS092419***4.23->ADDED a space before and after PCP to fix the discount button.*/
            $('#BullPrice').val(Math.max((bullprice - 5), 0).toFixed(2));
        } else if ($('.breeddisc.green-keyword').html() == "CUST SUPP") {
            $('#BullPrice').val(0);
        } else {
            $('#BullPrice').val(bullprice.toFixed(2));
        }

    });

    $('.breeding').click(function () {
        $('.breeding').attr('class', 'breeding');
        $(this).attr('class', 'breeding green-keyword');
    });

    $('#chkPGA').click(function () {
        $('#bullperc').val(10);
    });
    
    $('#BullCode').click(function () {
        $('#lookuplist').show();
        window.location.hash = '#lookuplist';
    });

    $('#SupplyCode').click(function () {
        $('#lookuplist').show();
        window.location.hash = '#lookuplist';
    });

    $('#tab-nitro').removeBlockMessages();
    // rp-101315-remove any switches from order screen then reapply the event
    $(".mini-switch-replace").remove();
    $(document.body).applyTemplateSetup();
    $('.mini-switch-replace').click(function () {
        var parent = $(this).parent().get(0);
        window.localStorage.setItem('ssp_techfunc', ($('#chkTechfunc').is(':checked')) ? 1 : 0);
        ssp.webdb.getOrder(-1, 1);
    });

}

function loadOrderItems(tx, rs) {
    //try {
    var rowOutput = '';
    var ordertotal = 0;
    var tax1total = 0;
    var tax2total = 0;
    if (rs.rows.length == 0) {
        rowOutput += '<div class="task with-legend with-padding" >';
        rowOutput += '<div class="legend"><img src="img/flag.png" width="16" height="16"> Order Item Listing</div>';
        rowOutput += '<div class="task-description"><h3>No Items.</h3>Please add an item for this order.</div>';
        rowOutput += '</div>';
    }
    else {
        rowOutput += '<ul class="message" id="ordersummary">';
        rowOutput += '</ul>';
        for (var i = 0; i < rs.rows.length; i++) {
            rowOutput += '<div class="task with-legend">';
            rowOutput += '<div class="legend"><img src="img/tags-label.png" width="16" height="16"> ' + rs.rows.item(i).SITYPS;
            if (typeof reportoutput != "undefined") rowOutput += " - " + rs.rows.item(i).SIORNM;
            rowOutput += '</div>';
            rowOutput += '<div class="task-description">';
            rowOutput += '<ul class="floating-tags">';
            rowOutput += '<li class="tag-date" id="itemdate"> ' + formatDate(rs.rows.item(i).SIDATO) + '</li>';
            rowOutput += '<li class="tag-money"> ' + ((rs.rows.item(i).SITYPS == "Z") ? rs.rows.item(i).SIPRC : rs.rows.item(i).SIQTY + '@' + rs.rows.item(i).SIPRC.toFixed(2)) + '</li> ';
            rowOutput += '</ul>';
            rowOutput += '<h3>' + rs.rows.item(i).SINAM + '</h3>';
            if (rs.rows.item(i).FRZYYYYMMDD && rs.rows.item(i).FRZYYYYMMDD != "0" && rs.rows.item(i).FRZYYYYMMDD != "null" && window.localStorage.getItem("ssp_freeze") == 1) {           /*JKS101518***4.08->Added the following to not display FRZ with 0 and NULL values in pending orders: && rs.rows.item(i).FRZYYYYMMDD != "0" && rs.rows.item(i).FRZYYYYMMDD != "null"*/
                rowOutput += '<h3>' + formatYYYYMMDDtoMDY(rs.rows.item(i).FRZYYYYMMDD) + '</h3>';
            }
            rowOutput += '<h4>' + rs.rows.item(i).SICOD + '</h4>';
            if (rs.rows.item(i).LOTNOT) {
                rowOutput += '<h4>' + rs.rows.item(i).LOTNOT + '</h4>';
            }
            //if  (window.localStorage.getItem("ssp_projectid") == "ecss" && rs.rows.item(i).SIOTH != null) {
            //    rowOutput += '</br>Sales Code: <strong>' + rs.rows.item(i).SIOTH + '</strong>';
            //}
            if (rs.rows.item(i).SITYPS == "B") {
                rowOutput += '</br>Cow ID: <strong>' + rs.rows.item(i).SICOW + '</strong>';
                //if (window.localStorage.getItem("ssp_projectid") == "ecss") {
                //    //rowOutput += '</br>Labor Code: <strong>' + rs.rows.item(i).SISTP + '</strong>';
                //    if ((rs.rows.item(i).SIOTH > 1 && rs.rows.item(i).SIOTH < 10)) {
                //        rowOutput += '</br>Previous Date: <strong>' + rs.rows.item(i).SITYPI + '</strong>';
                //        rowOutput += '</br>Previous Bull: <strong>' + rs.rows.item(i).SILVL4 + '</strong>';
                //        rowOutput += '</br>Previous Tech ID: <strong>' + rs.rows.item(i).SILIN + '</strong>';
                //    }
                //}
            }
            if (window.localStorage.getItem("ssp_projectid") == 'ps') {
                if (rs.rows.item(i).SILVL5 != "undefined" && rs.rows.item(i).SILVL5 != null) {    //JKS071417***ADDED if statement to remove "undefined" and NULL "call:" results***
                    rowOutput += '</br>call: ' + rs.rows.item(i).SILVL5;
                } else {
                    rowOutput += '</br>call: ';
                }
            }
            rowOutput += '<p><h3> $' + ((rs.rows.item(i).SITYPS == "Z") ? rs.rows.item(i).SIPOA.toFixed(2) : ((rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM).toFixed(2)) + '</h3></p>';
            if (typeof reportoutput != "undefined") rowOutput += rs.rows.item(i).SIANM;
            ordertotal += (rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM
            
            if (rs.rows.item(i).MOD) {
                rowOutput += '<div class="align-right"><a href="javascript:void(0)" class="button" id="' + rs.rows.item(i).MODSTAMP + '" title="delete" onclick="ssp.webdb.deleteOrderItem(' + "'" + rs.rows.item(i).SIORNM + "'," + rs.rows.item(i).MODSTAMP + ')"><img src="img/bin.png" width="16" height="16"></a>';
                if ((window.localStorage.getItem("ssp_projectid") == "ssc") && (window.localStorage.getItem("ssp_techfunc") == 1) && (rs.rows.item(i).SITYPS == "B")) {
                   rowOutput += '&nbsp;&nbsp;<a href="javascript:void(0)" class="button" id="' + rs.rows.item(i).MODSTAMP + '" title="label" onclick="labelForm(' + "'" + formatDate(rs.rows.item(i).SIDATO) + "','" + rs.rows.item(i).SIORNM + "','" + rs.rows.item(i).SICOW + "','" + rs.rows.item(i).SICOD + "-" + rs.rows.item(i).SINAM + "','" + rs.rows.item(i).LOTNOT + "'" + ')"><img src="img/tags-label.png" width="16" height="16"></a>';
                }
                
            
                rowOutput += '&nbsp;&nbsp;<div id="moddate' + rs.rows.item(i).MODSTAMP + '" style="display:inline-block"><a href="javascript:void(0)" class="button" title="moddate" onclick="ssp.webdb.moddateOrderItem(' + "'" + rs.rows.item(i).SIORNM + "'," + rs.rows.item(i).MODSTAMP + ",'" + formatDate(rs.rows.item(i).SIDATO) + "'" + ')"><img src="img/calendar-day.png" width="16" height="16"></a></div></div>';
            }

            rowOutput += '</div>';
            rowOutput += '</div>';
            tax1total += rs.rows.item(i).SILVL2 * 1;
            tax2total += rs.rows.item(i).SILVL3 * 1;
        }
        rowOutput += '</div>';
        if ((window.localStorage.getItem("ssp_projectid") == "ssc") && (window.localStorage.getItem("ssp_techfunc") == 1)) {
            rowOutput += '<div id="labelform"></div>'
        }
        //rowOutput += '<ul class="message" id="ordersummary">';
        //rowOutput += '<li><img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto">' + i + ' Items on ' + formatDate(rs.rows.item(i-1).SIDATO) + ' for ' + ordertotal.toFixed(2) + '</li>';
        //if (window.localStorage.getItem("ssp_projectid") == "ssc") {
        //    rowOutput += '<li>Total Taxes: ' + (tax1total + tax2total).toFixed(2) + '</li>';
        //}
        //rowOutput += '</ul>';

    }
    $('#orderitems').html(rowOutput);
    var summaryOutput = '';
    if (i > 0) {
        summaryOutput += '<li><img src="img/arrow-curve-000-left.png" width="16" height="16" class="picto">' + i + ' Items on ' + formatDate(rs.rows.item(i - 1).SIDATO) + ' for ' + ordertotal.toFixed(2) + '</li>';
    }
    if ((tax1total + tax2total) > 0) {
        summaryOutput += '<li>Plus Taxes: ' + (tax1total + tax2total).toFixed(2) + '</li>';
    }
    $('#ordersummary').html(summaryOutput);
    //}
    //catch(err){
    //	alert('ssperror:' + err.message);
    //}
}

function labelForm(orderdate,ordernum,cowname,bullname,ordernote) {
    
    var divContent = '<section id="login-block">';
    divContent += '<div class="block-border form block-content">'; //<form class="form block-content" >';

    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="labeldate">Date</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="labeldate" id="labeldate" class="full-width" value="' + orderdate + '">';      /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="labelnum">Invoice #</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="labelnum" id="labelnum" class="full-width" value="' + ordernum + '">';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="labelcow">Cow Name</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="labelcow" id="labelcow" class="full-width" value="' + cowname + '">';      /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="labelcowreg">Cow Reg #</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="labelcowreg" id="labelcowreg" class="full-width" >';       /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="labelbull">Bull Name</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="labelbull" id="labelbull" class="full-width" value="' + bullname + '">';       /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="ordernote">Note </label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="ordernote" id="ordernote" class="full-width" value="' + ordernote + '">';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="labelbullreg">Bull Reg #</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="labelbullreg" id="labelbullreg" class="full-width" >';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="labeltech">Tech</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="labeltech" id="labeltech" class="full-width" value="' + window.localStorage.getItem("ssp_TechID") + '">';      /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    //JKS030716 ***Begin Breed Count per Norm***
    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="labelbreed">Breeding #</label>';
    divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="labelbreed" id="labelbreed" class="full-width" >';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';
    //JKS030716 ***End Breed Count per Norm***
    divContent += '<p><button class="full-width" onclick="ssp.webdb.printLabel(' + "'" + ordernum + "'" + ');">Print Label</button></p>';
    $('#labelform').html(divContent);
    window.location.hash = '#labelform';
}
//JKS120315 ***SSC Label PDF Begin***
function labelPDF(tx, rs, custrs) {
    //PDFLocalTest comment out here to... for local test
// document.addEventListener("deviceready", onDeviceReady, false);

// function onDeviceReady() {
//     //request the persistent file system
//     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
// }

// function gotFS(fileSystem) {
//     var path = window.localStorage.getItem('ssp_orderpdf') + rs.rows.item(0).SIORNM + ".pdf";
//     fileSystem.root.getFile(path, { create: true, exclusive: false }, gotFileEntry, fail);

//     function gotFileEntry(fileEntry) {
//         fileEntry.createWriter(gotFileWriter, fail);
//         function gotFileWriter(writer) {
    //PDFLocalTest ...here for local pdf test - see below
                var homeHeader = 'Select Sires Genervations, Inc.';
                var addr1Header = 'RR 3 P.O. Box 489 / 2 Industrial Road, Kemptville, Ontario K0G 1J0';
                var addr2Header = 'Phone: (613) 258-3800  FAX: (613) 258-7257  e-mail: ssgi@selectgen.com';

                var doc = new jsPDF();
                var top = 20;   //JKS021516  ***20->18*** //JKS021816 ***18->20***
                
                //JKS122215 ***Top Leftside Begin***
                doc.setFontSize(16);
                doc.text(18, top, homeHeader);  //JS021516  ***10->18***
                doc.text(18, (top), "_________________________");

                doc.setFontSize(8);
                doc.text(18, (top + 5), addr1Header);   //JS021516  ***10->18***
                doc.text(18, (top + 8), addr2Header);   //JS021516  ***10->18***

                doc.setFontSize(12);
                doc.text(18, (top + 18), "Customer");   //JS021516  ***10->18***
                doc.text(18, (top + 18), "________");   //JS021516  ***10->18***
                doc.setFontSize(10);
                doc.text(18, (top + 23), 'ID:');    //JS021516  ***10->18***
                doc.text(34, (top + 23), custrs.rows.item(0).ACCT_NO);  //JS021516  ***26->34***
                doc.text(18, (top + 28), 'Name:');  //JS021516  ***10->18***
                doc.text(34, (top + 28), custrs.rows.item(0).NAME);     //JS021516  ***26->34***
                doc.text(34, (top + 33), custrs.rows.item(0).ADDR2);    //JS021516  ***26->34***
                doc.text(34, (top + 38), custrs.rows.item(0).CITY + ', ' + custrs.rows.item(0).STATE + ' ' + custrs.rows.item(0).ZIP);  //JS021516  ***26->34***
                doc.setFontSize(12);
                doc.text(18, (top + 45), "Order");  //JS021516  ***10->18***
                doc.text(18, (top + 45), "_____");  //JS021516  ***10->18***
                doc.setFontSize(10);
                doc.text(18, (top + 50), 'Number:');    //JS021516  ***10->18***
                doc.text(39, (top + 50), rs.rows.item(0).SIORNM);   //JS021516  ***31->39***
                doc.text(18, (top + 55), 'Date:');   //JS021516  ***10->18***
                doc.text(39, (top + 55), formatDate(rs.rows.item(0).SIDATO));   //JS021516  ***31->39***
                doc.text(18, (top + 65), 'Cow Name:');       //JS021516  ***10->18***
                doc.text(39, (top + 65), $('#labelcow').val());       //JS021516  ***10->18***
                doc.text(18, (top + 70), 'Cow Reg #');    //JS021516  ***10->18***
                doc.text(39, (top + 70), $('#labelcowreg').val());    //JS021516  ***10->18***
                doc.text(18, (top + 75), 'Bull Name:');     //JS021516  ***10->18***
                doc.text(39, (top + 75), $('#labelbull').val());     //JS021516  ***10->18***
                doc.text(18, (top + 80), 'Note:');    //JS021516  ***10->18***
                doc.text(39, (top + 80), $('#ordernote').val());    //JS021516  ***10->18***
                doc.text(18, (top + 85), 'Bull Reg #');     //JS021516  ***10->18***
                doc.text(39, (top + 85), $('#labelbullreg').val());     //JS021516  ***10->18***
                doc.text(18, (top + 90), 'Tech:');     //JS021516  ***10->18***
                doc.text(39, (top + 90), rs.rows.item(0).SIREP);     //JS021516  ***10->18***
                doc.text(18, (top + 95), 'Breeding #');     //JKS030816 ***Breed Count per Norm***
                doc.text(39, (top + 95), $('#labelbreed').val());     //JKS030816 ***Breed Count per Norm***
                //JKS122215 ***Top Leftside End***

                //JKS021816 ***Bottom Leftside Begin***
                doc.setFontSize(10);
                doc.text(25, (235.25), 'Order #         ' + $('#labelnum').val());           //JS021516  ***15->23   232.5->219
                doc.text(77, (235.25), 'Date: ' + $('#labeldate').val());                   //JS021516  ***70->78   232.5->219
                doc.text(25, (239.75), 'Cow Name:   ' + $('#labelcow').val());                //JS021516  ***15->23   237.5->224
                doc.text(25, (244.25), 'Cow Reg #    ' + $('#labelcowreg').val());             //JS021516  ***15->23   242.5->229
                doc.text(25, (248.75), 'Bull Name:    ' + $('#labelbull').val());              //JS021516  ***15->23   247.5->234
                doc.text(25, (253.25), 'Note: ' + $('#ordernote').val());              //JS021516  ***15->23   252.5->239
                doc.text(25, (257.75), 'Bull Reg #     ' + $('#labelbullreg').val());          //JS021516  ***15->23   257.5->244
                doc.text(25, (262.25), 'Tech:             ' + $('#labeltech').val());          //JS021516  ***15->23   262.5->249
                doc.text(60, (262.25), 'Breeding # ' + $('#labelbreed').val());     //JKS030716 ***Breed Count per Norm***
                //JKS021816 ***Bottom Leftside End***

                //JKS021816 ***Bottom Rightside Begin***
                doc.setFontSize(10);
                doc.text(114, (235.25), 'Order #         ' + $('#labelnum').val());          //JS021516  ***113->115   232.5->219
                doc.text(166, (235.25), 'Date: ' + $('#labeldate').val());        //JS021516  ***168->170   232.5->219
                doc.text(114, (239.75), 'Cow Name:   ' + $('#labelcow').val());
                doc.text(114, (244.25), 'Cow Reg #    ' + $('#labelcowreg').val());
                doc.text(114, (248.75), 'Bull Name:    ' + $('#labelbull').val());
                doc.text(114, (253.25), 'Note: ' + $('#ordernote').val());
                doc.text(114, (257.75), 'Bull Reg #     ' + $('#labelbullreg').val());   
                doc.text(114, (262.25), 'Tech:             ' + $('#labeltech').val());
                doc.text(149, (262.25), 'Breeding # ' + $('#labelbreed').val());     //JKS030716 ***Breed Count per Norm***      
                //JKS021816 ***Bottom Rightside End***

    //doc.output('datauri');    //JS021716PDFLocalTest
    //PDFLocalTest comment out from here... (uncomment the line above)
    doc.save($("#labelnum").val().replace('.','_') + '_' + Math.round(new Date().getTime() / 1000) + '_lab.pdf');
//                 writer.write(doc.output());
//                 //JKS030216 ***BEGIN-Replaced FileOpener with FileOpener2***
//                 cordova.plugins.fileOpener2.open(cordova.file.externalRootDirectory + path,     //JKS030716 ***New Path***
//                     'application/pdf',
//                     {
//                         error: function (e) {
//                             console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
//                         },
//                         success: function () {
//                             console.log('file opened successfully');
//                         }
//                     }
//                 );
//                 //JKS030216 ***END-Replaced FileOpener with FileOpener2***
// //JKS022916 ***Replaced FileOpener with FileOpener2***                window.plugins.fileOpener.open("file://" + path);
//             }
//         }
//    } 
    //PDFLocalTest ...to here
}                                       
//JKS120315 ***SSC Label PDF End***

function orderPDF(tx, rs, custrs) {
    //PDFLocalTest comment out here to... for local test
//   document.addEventListener("deviceready", onDeviceReady, false);
//
//    function onDeviceReady() {
//        //request the persistent file system
//        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
//    }
//
//    function gotFS(fileSystem) {
//        var path = window.localStorage.getItem('ssp_orderpdf') + rs.rows.item(0).SIORNM + ".pdf";
//        fileSystem.root.getFile(path, { create: true, exclusive: false }, gotFileEntry, fail);
//
//        function gotFileEntry(fileEntry) {
//            fileEntry.createWriter(gotFileWriter, fail);
//            function gotFileWriter(writer) {
    //PDFLocalTest ...here for local pdf test - see below
				var homeHeader = 'Premier Select Sires, Inc.';
                var addr1Header = '1 Stony Mountain Road, Tunkhannock, PA 18657';
                var addr2Header = 'Phone: (570)836-3168   FAX: (570)836-1490  e-mail: office@premierselect.com';
                var reply1Header = 'Tunkhannock office: 1 Stony Mountain Road, Tunkhannock, PA 18657';
                var reply2Header = 'Phone: (570)836-3168   FAX: (570)836-1490';

                switch (window.localStorage.getItem("ssp_projectid")) {
                    case 'sess':
                        homeHeader = 'Premier Select Sires, Inc.';
                        addr1Header = '3789 Old Port Royal Road, Spring Hill, TN 37174';
                        addr2Header = 'Phone: (931) 489-2020   FAX: (931) 489-2026  e-mail: sess.office@premierselect.com';
                        break;
                    case 'ssc':
                        homeHeader = 'Select Sires Genervations, Inc.';
                        addr1Header = 'RR 3 P.O. Box 489 / 2 Industrial Road, Kemptville, Ontario K0G 1J0';
                        addr2Header = 'Phone: (613) 258-3800   FAX: (613) 258-7257  e-mail: ssgi@selectgen.com';
                        break;
                    case 'ps':
                        homeHeader = 'Select Sires MidAmerica';
                        addr4Header = '41W 394 U.S. Highway 20, Hampshire, IL 60140';
                        addr5Header = 'Phone: (847) 464-5281';
                        addr1Header = '833 West 400 North, Logan UT 84321';
                        addr2Header = 'Phone (435) 752-2022';
                        break;
                    case 'ecss':
                        homeHeader = 'CentralStar';
                        addr1Header = 'P.O. Box 191, Waupun, WI 53963-0191';
                        addr2Header = 'P.O. Box 23157, Lansing, MI 48909-3157';
                        addr3Header = 'Phone: 800.631.3510  Website: www.mycentralstar.com';
                        //addr3Header = 'Phone: (920) 324-3505 Fax: (920) 324-5580  e-mail: info@ecselectsires.com';
                        break;
                    //JKS110916***Changed MNSS Order PDF Phone# to 320-259-6680 & Email to mnselect@mnss.coop.***
                    //JKS092016***Added MNSS address to Orders PDF.***
                    case 'mnss':
                        homeHeader = 'Minnesota Select Sires';
                        addr1Header = '6601 Gregory Park Road S, Saint Cloud, MN 56301';
                        addr2Header = '(800) 795-1233 | (320) 259-6680       mnselect@mnss.coop | www.selectsires.com';
                        break;
                }
                var doc = new jsPDF();
                var top = 20;

                doc.setFontSize(16);
                doc.text(10, top, homeHeader);
                doc.text(10, (top + .75), "___________________________");

                doc.setFontSize(8);
                doc.text(80, (top - 10), addr1Header);
                doc.text(80, (top - 6.25), addr2Header);
                if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
                    doc.text(80, (top - 2.5), addr3Header);
                }
                if (window.localStorage.getItem("ssp_projectid") == 'ps') {
                    doc.text(10, (top - 10), addr4Header);
                    doc.text(10, (top - 6.25), addr5Header);
                }
                doc.setFontSize(10);
                if (window.localStorage.getItem("ssp_projectid") == 'ssp') {
                    doc.text(80, (top - 3), "REPLY TO:");
                    doc.setFontSize(8);
                    doc.text(100, (top - 3), reply1Header);
                    doc.text(80, (top + .75), reply2Header);
                }

                doc.setFontSize(12);
                doc.text(10, (top + 10), "Customer");
                doc.text(10, (top + 10.5), "________");
                doc.setFontSize(10);
                doc.text(10, (top + 15), 'ID:');
                doc.text(25, (top + 15), custrs.rows.item(0).ACCT_NO);
                doc.text(10, (top + 20), 'Name:');
                doc.text(25, (top + 20), custrs.rows.item(0).NAME);
                doc.text(25, (top + 25), custrs.rows.item(0).ADDR2);
                doc.text(25, (top + 30), custrs.rows.item(0).CITY + ', ' + custrs.rows.item(0).STATE + ' ' + custrs.rows.item(0).ZIP);
                doc.setFontSize(12);
                if (window.localStorage.getItem("ssp_projectid") == 'sess') {
                    doc.text(100, (top + 10), "Order/Invoice");
                } else {
                    doc.text(100, (top + 10), "Order");
                }
                doc.text(100, (top + 10.5), "____________");
                doc.setFontSize(10);
                doc.text(100, (top + 15), 'Number: ' + rs.rows.item(0).SIORNM);
                doc.text(100, (top + 20), 'Date: ' + formatDate(rs.rows.item(0).SIDATO));
                //JKS110916***Begin Added IfElse to MNSS Order PDF for Invoice# to display Order# as Invoice#.***
                if (window.localStorage.getItem("ssp_projectid") == 'mnss') {
                    doc.text(100, (top + 25), 'Invoice #: ' + rs.rows.item(0).SIORNM);
                } else {
                    doc.text(100, (top + 25), 'Invoice #: ' + ((rs.rows.item(0).SIINVO == null) ? '(use order #)' : rs.rows.item(0).SIINVO));
                }
                //JKS110916***End Added IfElse to MNSS Order PDF for Invoice# to display Order# as Invoice#.***
                doc.setFontSize(12);
                doc.text(10, (top + 35), "Items");
                doc.text(10, (top + 35.5), "_____");
                //JKS110916***Begin Added IfElse to MNSS Order PDF for Bull Code to be Item#.***
                if (window.localStorage.getItem("ssp_projectid") == 'mnss') {
                    doc.text(10, (top + 40), 'Item #');
                } else {
                    doc.text(10, (top + 40), 'Bull Code');
                }
                //JKS110916***End Added IfElse to MNSS Order PDF for Bull Code to be Item#.***
                doc.text(15, (top + 45), 'Name');
                if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
                    //doc.text(90, (top + 45), 'Sales Code');
                    //doc.text(90, (top + 45), 'Labor Code');
                    doc.text(10, (top + 50), 'Previous: Date');
                    doc.text(45, (top + 50), 'Bull Code');
                    doc.text(70, (top + 50), 'Tech ID');
                }
                doc.text(120, (top + 40), 'Quantity');
                doc.text(140, (top + 40), 'Amount');
                doc.text(160, (top + 40), 'Total');
                doc.text(10, (top + 50.5), "_____________________________________________________________________");

                doc.setFontSize(10);
                var linepos = (top + 55);
                var grandtotal = 0;
                var bulltotal = 0;
                var bullqty = 0;
                var nitrototal = 0;
                var supptotal = 0;
                var bullname = "";
                var tax1total = 0;
                var tax2total = 0;
                var yousaved = 0;   //JKS012716 ***For YouSaved on PDF***
                var saved = 0;  //JKS021816 ***For YouSaved on PDF Moved To***
                var stotal = 0; //JKS021816 ***For YouSaved on PDF Moved To***
                //var poatotal = 0;
                for (var i = 0; i < rs.rows.length; i++) {
                    doc.text(10, linepos, '' + rs.rows.item(i).SICOD + ((rs.rows.item(i).FRZYYYYMMDD && rs.rows.item(i).FRZYYYYMMDD != "0" && rs.rows.item(i).FRZYYYYMMDD != "null" && (window.localStorage.getItem("ssp_freeze") == 1)) ? ' - ' + formatYYYYMMDDtoMDY(rs.rows.item(i).FRZYYYYMMDD) : ''));       /*JKS101518***4.08->CHANGED THIS formatDate(rs.rows.item(i).FRZYYYYMMDD) TO formatYYYYMMDDtoMDY(rs.rows.item(i).FRZYYYYMMDD)*/
                    bullname = ((rs.rows.item(i).SITYPS) == 'B') ? rs.rows.item(i).SINAM + " (COW: " + rs.rows.item(i).SICOW + ")" + " - Labor: " + rs.rows.item(i).SIARM.toFixed(2) : rs.rows.item(i).SINAM;
                    if (rs.rows.item(i).SITYPS == "B" && window.localStorage.getItem("ssp_projectid") == 'ecss'){
                        //doc.text(90, linepos + 5, '' + rs.rows.item(i).SIOTH);
                        if ((rs.rows.item(i).SIOTH > 1 && rs.rows.item(i).SIOTH < 10)) {
                            doc.text(20, linepos + 10, '' + rs.rows.item(i).SITYPI);
                            doc.text(45, linepos + 10, '' + rs.rows.item(i).SILVL4);
                            doc.text(70, linepos + 10, '' + rs.rows.item(i).SILIN);
                        }
                    }
                    bullname += ((rs.rows.item(i).SITYPS) == 'Z') ? ' - ' + rs.rows.item(i).SIMATH : '';                    
                    if (rs.rows.item(i).SILVL1 == 'M202') {
                        bullname = bullname + ' (Blown Straw)'
                    }
                    if (rs.rows.item(i).SILVL1 == 'M203') {
                        bullname = bullname + ' (Returned Semen)'
                    }
                    doc.text(15, linepos + 5, '' + bullname);
                    if (window.localStorage.getItem("ssp_projectid") == 'ecss' && rs.rows.item(i).SIOTH != null){
                        doc.text(90, linepos + 5, '' + rs.rows.item(i).SIOTH);
                    }
                    if (rs.rows.item(i).LOTNOT) {
                        doc.text(15, linepos + 10, '' + rs.rows.item(i).LOTNOT);
                    }
                    if (rs.rows.item(i).SITYPS != "Z") doc.text(120, linepos, '' + rs.rows.item(i).SIQTY);
                    doc.text(140, linepos, '' + ((rs.rows.item(i).SITYPS == "Z") ? rs.rows.item(i).SIPOA.toFixed(2) : rs.rows.item(i).SIPRC.toFixed(2)));
                    if (rs.rows.item(i).SITYPS != "Z") doc.text(160, linepos, '' + ((rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM).toFixed(2));
                    linepos += 15;
                    grandtotal += (rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM;
                    tax1total += rs.rows.item(i).SILVL2 * 1;
                    tax2total += rs.rows.item(i).SILVL3 * 1;
                    //JKS012716 ***Begin YouSaved calculations***
                    if (rs.rows.item(i).SIRETL > 0) {
//JKS021816 ***For YouSaved on PDF Moved From***                        var saved = 0;
//JKS021816 ***For YouSaved on PDF Moved From***                        var stotal = 0;
                        stotal = ((rs.rows.item(i).SIRETL - rs.rows.item(i).SIPRC) * rs.rows.item(i).SIQTY);
                        saved = stotal;
                        yousaved = saved + yousaved;
                    }
                    //JKS012716 ***End YouSaved calculations***
                    switch (rs.rows.item(i).SITYPS) {
                        case 'D':
                            bulltotal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            bullqty += rs.rows.item(i).SIQTY;
                            break;
                        case 'B':
                            bulltotal += (rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM;
                            bullqty += rs.rows.item(i).SIQTY;
                            break;
                        case 'S':
                            supptotal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            break;
                        case 'N':
                            nitrototal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            break;
                            //case 'Z':
                            //	  poatotal += rs.rows.item(i).SIPOA;
                    }
                    if ((linepos > 250) && (i < rs.rows.length - 1)) {
                        doc.text(10, linepos, "(cont.)");
                        doc.addPage();
                        doc.text(10, 10, "(cont.) " + homeHeader + " - Order Number: " + rs.rows.item(0).SIORNM);
                        linepos = 20;
                    }
                }

                linepos += 5;
                if (window.localStorage.getItem("ssp_projectid") == 'ssc') {
                    doc.text(140, linepos, 'Item Total:  $' + grandtotal.toFixed(2));
                    linepos += 5;
                    doc.text(140, linepos, 'G.S.T./H.S.T.(RT869132142):  $' + tax1total.toFixed(2));
                    linepos += 5;
                    if (tax2total > 0) {
                        doc.text(140, linepos, 'T.V.Q.(1087751925):  $' + tax2total.toFixed(2));
                        linepos += 5;
                    }
                    doc.text(140, linepos - 4.5, "_______________________________");
                    doc.text(140, linepos, 'Grand Total:  $' + (grandtotal + tax1total + tax2total).toFixed(2));
                } else if (window.localStorage.getItem("ssp_projectid") == 'sess' || window.localStorage.getItem("ssp_projectid") == 'ecss' || window.localStorage.getItem("ssp_projectid") == 'mnss') {
                    doc.text(140, linepos, 'Item Total:  $' + grandtotal.toFixed(2));
                    linepos += 5;
                    doc.text(140, linepos, 'Tax:  $' + tax1total.toFixed(2));
                    linepos += 5;
                    if (tax2total > 0) {
                        doc.text(140, linepos, 'Additional Tax:  $' + tax2total.toFixed(2));
                        linepos += 5;
                    }
                    doc.text(140, linepos - 4.5, "_____________________________");
                    doc.text(140, linepos, 'Grand Total:  $' + (grandtotal + tax1total + tax2total).toFixed(2));
                } else {
                    doc.text(140, linepos, 'Grand Total:  $' + grandtotal.toFixed(2));
                }

                //JKS012516 ***Begin YouSaved Output***
                if (window.localStorage.getItem("ssp_yousaved") == 1 && yousaved > 0) {
                    linepos += 10;
                    doc.setFontSize(13)
                    doc.text(140, linepos, 'YOU SAVED!!!' );
                    linepos += 5;
                    doc.setFontSize(13)
                    doc.text(140, linepos, '$ ' + yousaved.toFixed(2));
                }
                //JKS012516 ***End YouSaved Output***

                linepos += 10;
                doc.setFontSize(12);
                doc.text(10, linepos, "Order Summary");
                doc.text(10, linepos + .5, "_____________");

                doc.setFontSize(10);
                if (bulltotal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Bull Total: $" + bulltotal.toFixed(2));
                    linepos += 5;
                    doc.text(10, linepos, "Bull Quantity: " + bullqty.toFixed(2));
                }
                if (supptotal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Supply Total: $" + supptotal.toFixed(2));
                }
                if (nitrototal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Nitrogen Total: $" + nitrototal.toFixed(2));
                }
                if (window.localStorage.getItem("ssp_thankyou") != null) {
                    linepos += 5;
                    doc.text(10, linepos, "__________________");
                    linepos += 5.5;
                    doc.text(10, linepos, window.localStorage.getItem("ssp_thankyou"));
                }

    //doc.output('datauri');  //JS021716PDFLocalTest
	//doc.output('save');
	//doc.output('dataurlnewwindow');
	doc.save(rs.rows.item(0).SIORNM.replace('.','_') + '_' + Math.round(new Date().getTime() / 1000) + '.pdf');
	
	//doc.output('dataurlnewwindow');
	//window.open(window.URL.createObjectURL(new Blob(doc.output('dataurlnewwindow'), {type: "application/pdf"})));
    //PDFLocalTest comment out from here... (uncomment the line above)
 //               writer.write(doc.output());
 //               //JKS030216 ***BEGIN-Replaced FileOpener with FileOpener2***
 //               cordova.plugins.fileOpener2.open(cordova.file.externalRootDirectory + path,     //JKS030716 ***New Path***
 //                   'application/pdf',
 //                   {
 //                       error: function (e) {
 //                           console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
 //                       },
 //                       success: function () {
 //                           console.log('file opened successfully');
 //                       }
 //                   }
 //               );
 //               //JKS030216 ***END-Replaced FileOpener with FileOpener2***
//JKS022916 ***Replaced FileOpener with FileOpener2***                window.plugins.fileOpener.open("file://" + path);
//            }
//        }
//    }
    //PDFLocalTest ...to here for local pdf test
}

function syncPDF(tx, rs) {
//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

//    function gotFS(fileSystem) {
//        var path = window.localStorage.getItem('ssp_orderpdf') + "sync_" + Math.round(new Date().getTime() / 1000) + ".pdf";
//        fileSystem.root.getFile(path, { create: true, exclusive: false }, gotFileEntry, fail);

//        function gotFileEntry(fileEntry) {
//            fileEntry.createWriter(gotFileWriter, fail);
//            function gotFileWriter(writer) {
                var doc = new jsPDF();
                var homeHeader = 'Premier Select Sires';
                switch (window.localStorage.getItem("ssp_projectid")) {
                    case 'sess':
                        homeHeader = 'Premier Select Sires';
                        break;
                    case 'ssc':
                        homeHeader = 'Select Sires Genervations, Inc.';
                        break;
                    case 'ps':
                        homeHeader = 'Select Sires MidAmerica';
                        break;
                    case 'ecss':
                        homeHeader = 'CentralStar';
                        break;
                    //JKS092716***Added MNSS Header to SyncPDF.***
                    case 'mnss':
                        homeHeader = 'Minnesota Select Sires';
                        break;
                }
                
                doc.setFontSize(16);
                doc.text(10, 12, homeHeader + " - SYNC ITEM LOG");
                doc.text(10, 12.75, "__________________");

                doc.text(10, 19, 'Date Stamp: ' + formatDate(Math.round(new Date().getTime() / 1000)));
                doc.setFontSize(12);
                doc.text(10, 55, "Items");
                doc.text(10, 55.5, "_____");

                doc.text(10, 60, 'Code');
                doc.text(15, 65, 'Name');
                doc.text(80, 60, 'Customer');
                doc.text(85, 65, 'Order');
                doc.text(120, 60, 'Quantity');
                doc.text(140, 60, 'Amount');
                doc.text(160, 60, 'Total');
                doc.text(10, 65.5, "_____________________________________________________________________");

                doc.setFontSize(10);
                var linepos = 75;
                var grandtotal = 0;
                var bulltotal = 0;
                var bullqty = 0;
                var nitrototal = 0;
                var supptotal = 0;
                var transqty = 0;       /*JKS100318***4.06->Added Transfer Quantity Total to snycPDF.*/
                var bullname = "";
                for (var i = 0; i < rs.rows.length; i++) {
                    doc.text(10, linepos, '' + rs.rows.item(i).SICOD);
                    doc.text(10, linepos - 5, 'Date: ' + formatDate(rs.rows.item(i).SIDATO));
                    bullname = ((rs.rows.item(i).SITYPS) == 'B') ? rs.rows.item(i).SINAM + " (COW: " + rs.rows.item(i).SICOW + ")" : rs.rows.item(i).SINAM;
                    doc.text(15, linepos + 5, '' + bullname);
                    doc.text(80, linepos, '' + rs.rows.item(i).SIANM);
                    doc.text(85, linepos + 5, '' + rs.rows.item(i).SIORNM);
                    if (rs.rows.item(i).SITYPS != "Z") doc.text(120, linepos, '' + rs.rows.item(i).SIQTY);
                    if (rs.rows.item(i).SITYPS != "T") doc.text(140, linepos, '' + ((rs.rows.item(i).SITYPS == "Z") ? rs.rows.item(i).SIPOA.toFixed(2) : rs.rows.item(i).SIPRC.toFixed(2)));        /*JKS092618***4.06->Added if (rs.rows.item(i).SITYPS != "T")*/ 
                    if ((rs.rows.item(i).SITYPS != "Z") || (rs.rows.item(i).SITYPS != "T")) doc.text(160, linepos, '' + ((rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM).toFixed(2)); /*JKS091918***4.06->Added || rs.rows.item(i).SITYPS != "T"*/
                    linepos += 15;
                    if (rs.rows.item(i).SITYPS != "T") grandtotal += (rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM;      /*JKS092018***4.06->Added if (rs.rows.item(i).SITYPS != "T") {} to include pending transfers to the "save sync items to file" Button on the SYNC Page for Grand Total*/ 
                    switch (rs.rows.item(i).SITYPS) {
                        case 'D':
                            bulltotal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            bullqty += rs.rows.item(i).SIQTY;
                            break;
                        case 'B':
                            bulltotal += (rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM;
                            bullqty += rs.rows.item(i).SIQTY;
                            break;
                        case 'S':
                            supptotal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            break;
                        case 'N':
                            nitrototal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            break;
                        case 'T':           /*JKS100318***4.06->Added Transfer Quantity Total to snycPDF.*/
                            transqty += rs.rows.item(i).SIQTY;
                            break;
                    }
                    if ((linepos > 230) && (i < rs.rows.length - 1)) {
                        doc.text(10, linepos, "(cont.)");
                        doc.addPage();
                        doc.text(10, 10, "(cont.) Premier Select Sires, Inc. - Sync Log - " + formatDate(Math.round(new Date().getTime() / 1000)));
                        linepos = 20;
                    }
                }

                linepos += 5;
                doc.text(140, linepos, 'Grand Total:  $' + grandtotal.toFixed(2));

                linepos += 10;
                doc.setFontSize(12);
                doc.text(10, linepos, "Order Summary");
                doc.text(10, linepos + .5, "_____________");

                doc.setFontSize(10);
                if (bulltotal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Bull Total: $" + bulltotal.toFixed(2));
                    linepos += 5;
                    doc.text(10, linepos, "Bull Quantity: " + bullqty.toFixed(2));
                }
                if (supptotal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Supply Total: $" + supptotal.toFixed(2));
                }
                if (nitrototal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Nitrogen Total: $" + nitrototal.toFixed(2));
                }
                if (transqty > 0) {         /*JKS100318***4.06->Added Transfer Quantity Total to snycPDF.*/
                    linepos += 5;
                    doc.text(10, linepos, "Transfer Quantity: " + transqty.toFixed(2));
                }
                if (window.localStorage.getItem("ssp_thankyou") != null) {
                    linepos += 5;
                    doc.text(10, linepos, "_____________");
                }

		doc.save('Sync_' + Math.round(new Date().getTime() / 1000) + '.pdf');
                //doc.output('datauri');
//                writer.write(doc.output());
                //JKS030216 ***BEGIN-Replaced FileOpener with FileOpener2***
//                cordova.plugins.fileOpener2.open(cordova.file.externalRootDirectory + path,     //JKS030716 ***New Path***
//                    'application/pdf',
//                    {
//                        error: function (e) {
//                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
//                        },
//                        success: function () {
//                            console.log('file opened successfully');
//                        }
//                    }
//                );
                //JKS030216 ***END-Replaced FileOpener with FileOpener2***
//JKS022916 ***Replaced FileOpener with FileOpener2***                window.plugins.fileOpener.open("file://" + path);
//            }
//        }
//    }
}

function backupPDF(tx, rs) {
    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    // function gotFS(fileSystem) {
        // var path = window.localStorage.getItem('ssp_orderpdf') + "ssp_backup_" + new Date().getDay() + ".pdf";
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
                        homeHeader = 'Select Sires Genvervations';
                        break;
                    case 'ps':
                        homeHeader = 'Select Sires MidAmerica';
                        break;
                    case 'ecss':
                        homeHeader = 'CentralStar';
                        break;
                        //JKS092716***Added MNSS Header to BackupPDF.***
                    case 'mnss':
                        homeHeader = 'Minnesota Select Sires';
                        break;
                }
                doc.setFontSize(16);
                doc.text(10, 12, homeHeader + " - BACKUP MODIFIED ITEMS");
                doc.text(10, 12.75, "__________________");

                doc.text(10, 19, 'Date Stamp: ' + formatDate(Math.round(new Date().getTime() / 1000)));
                doc.setFontSize(12);
                doc.text(10, 55, "Items");
                doc.text(10, 55.5, "_____");

                doc.text(10, 60, 'Code');
                doc.text(15, 65, 'Name');
                doc.text(80, 60, 'Customer');
                doc.text(85, 65, 'Account#')
                doc.text(90, 70, 'Order');
                doc.text(120, 60, 'Quantity');
                doc.text(140, 60, 'Amount');
                doc.text(160, 60, 'Total');
                doc.text(10, 70.5, "_____________________________________________________________________");

                doc.setFontSize(10);
                var linepos = 75;
                var grandtotal = 0;
                var bulltotal = 0;
                var bullqty = 0;
                var nitrototal = 0;
                var supptotal = 0;
                var transqty = 0;       /*JKS100418***4.07->Added Transfer Quantity Total to backupPDF.*/
                var bullname = "";
//JKS021816 ***Not Needed***                var yousaved = 0;   //JKS012916 ***For YouSaved on PDF***
                for (var i = 0; i < rs.rows.length; i++) {
                    doc.text(10, linepos, 'Date: ' + formatDate(rs.rows.item(0).SIDATO));
                    doc.text(10, linepos + 5, '' + rs.rows.item(i).SICOD);
                    bullname = ((rs.rows.item(i).SITYPS) == 'B') ? rs.rows.item(i).SINAM + " (COW: " + rs.rows.item(i).SICOW + ")" : rs.rows.item(i).SINAM;
                    doc.text(15, linepos + 10, '' + bullname);
                    doc.text(80, linepos, '' + rs.rows.item(i).SIANM);
                    doc.text(85, linepos + 5, '' + rs.rows.item(i).SIACT);
                    doc.text(90, linepos + 10, '' + rs.rows.item(i).SIORNM);
                    if (rs.rows.item(i).SITYPS != "Z") doc.text(120, linepos, '' + rs.rows.item(i).SIQTY);
                    if (rs.rows.item(i).SITYPS != "T") doc.text(140, linepos, '' + ((rs.rows.item(i).SITYPS == "Z") ? rs.rows.item(i).SIPOA.toFixed(2) : rs.rows.item(i).SIPRC.toFixed(2)));        /*JKS100418***4.07->Added if (rs.rows.item(i).SITYPS != "T") for pending transfers in the backupPDF*/
                    if ((rs.rows.item(i).SITYPS != "Z") || (rs.rows.item(i).SITYPS != "T")) doc.text(160, linepos, '' + ((rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM).toFixed(2));      /*JKS100418***4.07->Added || rs.rows.item(i).SITYPS != "T" for pending transfers in the backupPDF*/
                    linepos += 15;
                    if (rs.rows.item(i).SITYPS != "T") grandtotal += (rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM;      /*JKS100418***4.07->Added if (rs.rows.item(i).SITYPS != "T") {} to include pending transfers to the Backup Items for Grand Total*/
                    switch (rs.rows.item(i).SITYPS) {
                        case 'D':
                            bulltotal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            bullqty += rs.rows.item(i).SIQTY;
                            break;
                        case 'B':
                            bulltotal += (rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC) + rs.rows.item(i).SIARM;
                            bullqty += rs.rows.item(i).SIQTY;
                            break;
                        case 'S':
                            supptotal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            break;
                        case 'N':
                            nitrototal += rs.rows.item(i).SIQTY * rs.rows.item(i).SIPRC;
                            break;
                        case 'T':           /*JKS100418***4.07->Added Transfer Quantity Total to backupPDF.*/
                            transqty += rs.rows.item(i).SIQTY;
                            break;
                    }
                    if ((linepos > 230) && (i < rs.rows.length - 1)) {
                        doc.text(10, linepos, "(cont.)");
                        doc.addPage();
                        doc.text(10, 10, "(cont.) Premier Select Sires, Inc. - Sync Log - " + formatDate(Math.round(new Date().getTime() / 1000)));
                        linepos = 20;
                    }
                    //JKS012916 ***Begin YouSaved calculations***
//JKS021816 ***Not Needed***                    if (rs.rows.item(i).SIRETL > 0) {
//JKS021816 ***Not Needed***                        var saved = 0;
//JKS021816 ***Not Needed***                        var stotal = 0;
//JKS021816 ***Not Needed***                        stotal = ((rs.rows.item(i).SIRETL - rs.rows.item(i).SIPRC) * rs.rows.item(i).SIQTY);
//JKS021816 ***Not Needed***                        saved = stotal;
//JKS021816 ***Not Needed***                        yousaved = saved + yousaved;
//JKS021816 ***Not Needed***                    }
                    //JKS012916 ***End YouSaved calculations***                    
                }

                linepos += 5;
                doc.text(140, linepos, 'Grand Total:  $' + grandtotal.toFixed(2));
                
                //JKS012916 ***Begin YouSaved Output***
//JKS021816 ***Not Needed***                if (yousaved > 0){
//JKS021816 ***Not Needed***                    linepos += 10;
//JKS021816 ***Not Needed***                    doc.setFontSize(13)
//JKS021816 ***Not Needed***                    doc.text(140, linepos, 'YOU SAVED!!!' );
//JKS021816 ***Not Needed***                    linepos += 5;
//JKS021816 ***Not Needed***                    doc.setFontSize(13)
//JKS021816 ***Not Needed***                    doc.text(140, linepos, '$ ' + yousaved.toFixed(2));
//JKS021816 ***Not Needed***                }
                //JKS012916 ***End YouSaved Output***

                linepos += 10;
                doc.setFontSize(12);
                doc.text(10, linepos, "Order Summary");
                doc.text(10, linepos + .5, "_____________");

                doc.setFontSize(10);
                if (bulltotal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Bull Total: $" + bulltotal.toFixed(2));
                    linepos += 5;
                    doc.text(10, linepos, "Bull Quantity: " + bullqty.toFixed(2));
                }
                if (supptotal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Supply Total: $" + supptotal.toFixed(2));
                }
                if (nitrototal > 0) {
                    linepos += 5;
                    doc.text(10, linepos, "Nitrogen Total: $" + nitrototal.toFixed(2));
                }
                if (transqty > 0) {         /*JKS100418***4.07->Added Transfer Quantity Total to backupPDF.*/
                    linepos += 5;
                    doc.text(10, linepos, "Transfer Quantity: " + transqty.toFixed(2));
                }
                if (window.localStorage.getItem("ssp_thankyou") != null) {
                    linepos += 5;
                    doc.text(10, linepos, "_____________");
                }
				doc.save('Bulls-I_Backup_' + new Date().getDay() + '_' + Math.round(new Date().getTime() / 1000) + '.pdf');
                // //doc.output('datauri');
                // writer.write(doc.output());
            // }
        // }
    // }
}

function fail() {
    //unable to write local file through phonegap output to uri
    doc.output('datauri');
}




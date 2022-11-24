ssp.webdb.getCustomers = function(keywords, recbegin) {
  loadCustomersContentBlock();
  ssp.webdb.getCustomersList(keywords, recbegin);
};

ssp.webdb.getCustomersList = function(keywords, recbegin) {
  if (keywords != '%') $('#customerkeyword').html(keywords);
  ssp.webdb.db.transaction(function(tx) {
    var addrwhere =
      window.localStorage.getItem('ssp_addrsearch') == 1
        ? ' OR tblCustomers.ADDR2 LIKE "%' +
          keywords +
          '%" OR tblCustomers.CITY LIKE "%' +
          keywords +
          '%"'
        : ' ';
    if (window.localStorage.getItem('ssp_custsalesbubble') == 1) {
      if (typeof recbegin == 'undefined') {
        tx.executeSql(
          'SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV,COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE tblCustomers.ACCT_NO LIKE "%' +
            keywords +
            '%" OR tblCustomers.NAME LIKE "%' +
            keywords +
            '%" ' +
            addrwhere +
            ' GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY ' +
            (isNaN(keywords) || keywords.length == 0
              ? 'tblCustomers.NAME'
              : 'tblCustomers.ACCT_NO'),
          [],
          loadCustomers,
          ssp.webdb.onError
        );
      } else {
        tx.executeSql(
          'SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV,COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE tblCustomers.ACCT_NO LIKE "%' +
            keywords +
            '%" OR tblCustomers.NAME LIKE "%' +
            keywords +
            '%" ' +
            addrwhere +
            ' GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY ' +
            (isNaN(keywords) || keywords.length == 0
              ? 'tblCustomers.NAME'
              : 'tblCustomers.ACCT_NO') +
            ' LIMIT ' +
            recbegin +
            ',' +
            CUSTPAGING,
          [],
          loadCustomers,
          ssp.webdb.onError
        );
      }
    } else {
      if (typeof recbegin == 'undefined') {
        tx.executeSql(
          'SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE tblCustomers.ACCT_NO LIKE "%' +
            keywords +
            '%" OR tblCustomers.NAME LIKE "%' +
            keywords +
            '%" ' +
            addrwhere +
            '  ORDER BY ' +
            (isNaN(keywords) || keywords.length == 0
              ? 'tblCustomers.NAME'
              : 'tblCustomers.ACCT_NO'),
          [],
          loadCustomers,
          ssp.webdb.onError
        );
      } else {
        tx.executeSql(
          'SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE tblCustomers.ACCT_NO LIKE "%' +
            keywords +
            '%" OR tblCustomers.NAME LIKE "%' +
            keywords +
            '%" ' +
            addrwhere +
            ' ORDER BY ' +
            (isNaN(keywords) || keywords.length == 0
              ? 'tblCustomers.NAME'
              : 'tblCustomers.ACCT_NO') +
            ' LIMIT ' +
            recbegin +
            ',' +
            CUSTPAGING,
          [],
          loadCustomers,
          ssp.webdb.onError
        );
      }
    }
  });
};

ssp.webdb.getCustomersFav = function() {
  ssp.webdb.db.transaction(function(tx) {
    loadCustomersContentBlock();
    if (window.localStorage.getItem('ssp_custsalesbubble') == 1) {
      tx.executeSql(
        'SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV,COUNT(distinct tblSales.SIORNM) AS NUMSALES FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE FAV=1 GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.TECH_NO,tblCustomers.FAV ORDER BY FAV DESC,NAME ',
        [],
        loadCustomers,
        ssp.webdb.onError
      );
    } else {
      tx.executeSql(
        'SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblCustomers.ADDR2,tblCustomers.CITY,tblCustomers.STATE,tblCustomers.TECH_NO,tblCustomers.FAV FROM tblCustomers WHERE FAV=1 ORDER BY FAV DESC,NAME ',
        [],
        loadCustomers,
        ssp.webdb.onError
      );
    }
  });
};

ssp.webdb.getCustomersOrders = function(PKIDCUSTOMER) {
  ssp.webdb.db.transaction(function(tx) {
    tx.executeSql(
      'SELECT COUNT(*) AS ORDERCOUNTITEM, SUM(SIPRC*SIQTY) AS ORDERTOTAL, SUM(SIARM) AS ARMTOTAL, a.SIORNM,a.SIINVO,a.SIDATO,SUM(MOD) AS MODIFIED,SUM(NITROSOLD) AS NITROCOUNT,SUM(SIPOA) AS POATOTAL  FROM tblSales a LEFT OUTER JOIN (SELECT SIORNM, SUM(SIQTY) AS nitrosold FROM tblSales WHERE SICOD = "N2Fill" GROUP BY SIORNM ) nitro ON a.SIORNM  = nitro.SIORNM WHERE SIACT = "' +
        PKIDCUSTOMER +
        '" GROUP BY a.SIORNM ORDER BY a.SIDATO DESC, a.SIORNM DESC ',
      [],
      loadCustomerOrders,
      ssp.webdb.onError
    );
  });
};

ssp.webdb.getCustomersNotes = function(PKIDCUSTOMER) {
  ssp.webdb.db.transaction(function(tx) {
    tx.executeSql(
      'SELECT * FROM tblCustomerNotes WHERE ACCT_NO = "' +
        PKIDCUSTOMER +
        '" ORDER BY MODSTAMP DESC',
      [],
      loadCustomerNotes,
      ssp.webdb.onError
    );
  });
};

ssp.webdb.getCustomersAR = function(PKIDCUSTOMER) {
  ssp.webdb.db.transaction(function(tx) {
    tx.executeSql(
      'SELECT * FROM tblCustomersAR WHERE ACCT_NO = "' + PKIDCUSTOMER + '"',
      [],
      loadCustomerAR,
      ssp.webdb.onError
    );
  });
};

ssp.webdb.getCustomerByID = function(ACCOUNT) {
  ssp.webdb.db.transaction(function(tx) {
    tx.executeSql(
      'SELECT tblCustomers.*, COUNT(distinct tblCustomerNotes.PKIDDroid) AS NUMNOTES  FROM tblCustomers LEFT JOIN tblCustomerNotes ON tblCustomers.ACCT_NO = tblCustomerNotes.ACCT_NO WHERE tblCustomers.ACCT_NO = "' +
        ACCOUNT +
        '"',
      [],
      loadCustomerDetail,
      ssp.webdb.onError
    );
  });
};

ssp.webdb.addCustomer = function() {
  ssp.webdb.db.transaction(function(tx) {
    var currenttime = Math.round(new Date().getTime() / 1000);

    var custacct = $('#custacct').html();
    var custname = $('#custname').val();

    if (!custacct || custacct.length == 0) {
      $('#login-block')
        .removeBlockMessages()
        .blockMessage('Error no account number assigned.', { type: 'error' });
    } else if (!custname || custname.length == 0) {
      $('#login-block')
        .removeBlockMessages()
        .blockMessage('Please enter a name.', { type: 'error' });
    } else {
      tx.executeSql(
        'INSERT INTO tblCustomers (ACCT_NO,NAME,ADDR1,ADDR2,CITY,STATE,ZIP,TECH_NO,MEMBER,TAXABLE,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          $('#custacct').html(),
          $('#custname').val(),
          $('#custaddr').val(),
          $('#custaddr2').val(),
          $('#custcity').val(),
          $('#custstate').val(),
          $('#custzip').val(),
          window.localStorage.getItem('ssp_TechID'),
          $('#custemail').val(),
          '00000:00000',
          1,
          currenttime
        ],
        ssp.webdb.getCustomersFav(),
        ssp.webdb.onError
      );
    }
  });
  return false;
};

ssp.webdb.addCustomerNote = function(ACCOUNT) {
  ssp.webdb.db.transaction(function(tx) {
    var currenttime = Math.round(new Date().getTime() / 1000);
    tx.executeSql(
      'INSERT INTO tblCustomerNotes (PKIDDroid, TECH_NO,ACCT_NO,NOTE,MODSTAMP,MOD) values (?,?,?,?,?,?)',
      [
        currenttime + '.' + window.localStorage.getItem('ssp_TechID'),
        window.localStorage.getItem('ssp_TechID'),
        ACCOUNT,
        $('#txtAddNote').val(),
        currenttime,
        1
      ],
      ssp.webdb.getCustomersNotes(ACCOUNT),
      ssp.webdb.onError
    );
  });
  return false;
};

ssp.webdb.deleteCustomerNote = function(PKID, DelID) {
  if ($('#delnote' + DelID).attr('class') == 'button red') {
    ssp.webdb.db.transaction(function(tx) {
      tx.executeSql(
        'DELETE FROM tblCustomerNotes WHERE PKIDDroid = ?',
        [PKID],
        ssp.webdb.getCustomersNotes($('#acctid').html()),
        ssp.webdb.onError
      );
    });
  } else {
    $('#delnote' + DelID)
      .removeClass('button')
      .addClass('button red');
    $('#delnote' + DelID).html($('#delnote' + DelID).html() + 'sure?');
  }
};

ssp.webdb.deleteCustomer = function(PKID) {
  if ($('#del' + PKID).attr('class') == 'button red') {
    ssp.webdb.db.transaction(function(tx) {
      tx.executeSql(
        'DELETE FROM tblCustomers WHERE ACCT_NO = ? ',
        [PKID],
        ssp.webdb.getCustomers(),
        ssp.webdb.onError
      );
    });
  } else {
    $('#del' + PKID)
      .removeClass('button')
      .addClass('button red');
    $('#del' + PKID).html($('#del' + PKID).html() + 'sure?');
  }
};

ssp.webdb.setCustomerFav = function(ACCOUNT) {
  var fav = $('#fav_' + ACCOUNT).attr('src');
  var currenttime = Math.round(new Date().getTime() / 1000);
  if (fav == 'img/star.png') {
    ssp.webdb.db.transaction(function(tx) {
      tx.executeSql(
        'UPDATE tblCustomers SET FAV = 0,MOD=1,MODSTAMP=' +
          currenttime +
          ' WHERE ACCT_NO = "' +
          ACCOUNT +
          '"',
        [],
        ssp.webdb.onSucess,
        ssp.webdb.onError
      );
    });
    $('#fav_' + ACCOUNT).attr('src', 'img/starEmpty.png');
  } else {
    ssp.webdb.db.transaction(function(tx) {
      tx.executeSql(
        'UPDATE tblCustomers SET FAV = 1,MOD=1,MODSTAMP=' +
          currenttime +
          ' WHERE ACCT_NO = "' +
          ACCOUNT +
          '"',
        [],
        ssp.webdb.onSuccess,
        ssp.webdb.onError
      );
    });
    $('#fav_' + ACCOUNT).attr('src', 'img/star.png');
  }
};

ssp.webdb.searchCustomers = function(buttonpressed, searchstring) {
  if (typeof searchstring == 'undefined') {
    $('#customerlist0').html('<div id="customerlist0"></div>');
    $('#customermore').html('<div id="customermore"></div>');
    if (buttonpressed) {
      window.localStorage.setItem(
        'ssp_custsearch_5',
        window.localStorage.getItem('ssp_custsearch_4')
      );
      window.localStorage.setItem(
        'ssp_custsearch_4',
        window.localStorage.getItem('ssp_custsearch_3')
      );
      window.localStorage.setItem(
        'ssp_custsearch_3',
        window.localStorage.getItem('ssp_custsearch_2')
      );
      window.localStorage.setItem(
        'ssp_custsearch_2',
        window.localStorage.getItem('ssp_custsearch_1')
      );
      window.localStorage.setItem(
        'ssp_custsearch_1',
        $('#searchcustomers').val()
      );
      loadCustomerContentBlockHeader();
    }
    ssp.webdb.getCustomersList($('#searchcustomers').val());
  } else {
    $('#menu').toggleClass('active');
    loadCustomersContentBlock();
    ssp.webdb.getCustomersList(searchstring);
    $('#searchcustomers').val(searchstring);
  }
  return false;
};

ssp.webdb.setCustomerCount = function() {
  ssp.webdb.db.transaction(function(tx) {
    tx.executeSql(
      'SELECT COUNT(*) AS cntCustomer FROM tblCustomers',
      [],
      function(tx, rs) {
        if (rs.rows.length > 0) {
          $('#sideCustomerCount').html(rs.rows.item(0).cntCustomer);
        }
      },
      ssp.webdb.onError
    );
  });
};

ssp.webdb.modCustomerEmail = function(email) {
  //var rowOutput = '<p style="display:inline-block">';
  rowOutput =
    '<input type="text" name="CustomerEmail" id="ModCustomerEmail" value="' +
    email +
    '" >';
  rowOutput +=
    '<a href="#" class="float-right" style="display:inline-block" title="save" onclick="ssp.webdb.SaveCustomerEmail();"><img src="img/computer.png" alt="save" width="16" height="16"/>save</a>';
  //rowOutput += '</p>';
  $('#CustomerEmail').html(rowOutput);
};

ssp.webdb.SaveCustomerEmail = function() {
  var currenttime = Math.round(new Date().getTime() / 1000);
  var emailaddr = $('#ModCustomerEmail').val();
  ssp.webdb.db.transaction(function(tx) {
    tx.executeSql(
      'UPDATE tblCustomers SET MEMBER = "' +
        emailaddr +
        '",MOD=1,MODSTAMP=' +
        currenttime +
        ' WHERE ACCT_NO = "' +
        $('#acctid').html() +
        '"',
      [],
      ssp.webdb.onSucess,
      ssp.webdb.onError
    );
  });
  $('#CustomerEmail').html(
    emailaddr +
      '&nbsp;&nbsp;<a href="#" class="float-right" title="modcustemail" onclick="ssp.webdb.modCustomerEmail(\'' +
      emailaddr +
      '\')"><img src="img/pencil.png" width="12" alt="pencil" height="12"/></a>'
  );
};

function randomString() {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
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
  rowOutput +=
    '<h1><a href="#" class="float-right" onclick="loadCustomerNew();"><img src="img/plusCircleBlue.png" alt="plus circle" width="16" height="16"></a>Customer List<div id="customerkeyword"></div></h1>';
  rowOutput +=
    '<form class="form input-with-button full-width" onsubmit="return ssp.webdb.searchCustomers(true)" >';
  rowOutput += '<p><span class="input-type-text">';
  rowOutput +=
    '<a href="#" class="button float-right" onclick="ssp.webdb.searchCustomers(true)" title="messages"><img src="img/zoom.png" alt="zoom" width="16" height="16"></a>';
  rowOutput +=
    '<input type="text" name="searchcustomers" id="searchcustomers" class="full-width" ';
  if ($('#searchcustomers').val() != undefined)
    rowOutput += 'value="' + $('#searchcustomers').val() + '"';
  rowOutput += '>';
  rowOutput += '</p></span>';
  rowOutput += '</form>';
  rowOutput += '</br>';
  rowOutput += '<div id="customerlist0"></div><div id="customermore"></div>';
  if (typeof acctid == 'undefined') rowOutput += '</div>';
  rowOutput += '</div></section></article>';
  $('#maincontent').html(rowOutput);
}

function loadCustomerContentBlockHeader() {
  var cs1 = window.localStorage.getItem('ssp_custsearch_1');
  var cs2 = window.localStorage.getItem('ssp_custsearch_2');
  var cs3 = window.localStorage.getItem('ssp_custsearch_3');
  var cs4 = window.localStorage.getItem('ssp_custsearch_4');
  var cs5 = window.localStorage.getItem('ssp_custsearch_5');
  var homeHeader = 'SSP';
  switch (window.localStorage.getItem('ssp_projectid')) {
    case 'sess':
      homeHeader = 'SESS';
      break;
    case 'ssc':
      homeHeader = 'SSC';
      break;
    case 'ps':
      homeHeader = 'PSSS';
      break;
    case 'ecss':
      homeHeader = 'ECSS';
      break;
  }
  var header =
    "<header id='mainheader'><h1>" +
    homeHeader +
    ' - ' +
    (window.localStorage.getItem('ssp_techfunc') == 1 ? 'Tech' : 'ASM') +
    '</h1></header>';
  header += "<a href='#' onclick='location.reload();' id='home'>Home</a>";
  header += '<div id="menu">';
  header += '<a href="#">Searches</a>';
  header += '<ul>';
  if (cs1 != 'null')
    header +=
      '<li><a href="#" onclick="ssp.webdb.searchCustomers(false,' +
      "'" +
      cs1 +
      "'" +
      ');">' +
      cs1 +
      '</a></li>';
  if (cs2 != 'null')
    header +=
      '<li><a href="#" onclick="ssp.webdb.searchCustomers(false,' +
      "'" +
      cs2 +
      "'" +
      ');">' +
      cs2 +
      '</a></li>';
  if (cs3 != 'null')
    header +=
      '<li><a href="#" onclick="ssp.webdb.searchCustomers(false,' +
      "'" +
      cs3 +
      "'" +
      ');">' +
      cs3 +
      '</a></li>';
  if (cs4 != 'null')
    header +=
      '<li><a href="#" onclick="ssp.webdb.searchCustomers(false,' +
      "'" +
      cs4 +
      "'" +
      ');">' +
      cs4 +
      '</a></li>';
  if (cs5 != 'null')
    header +=
      '<li><a href="#" onclick="ssp.webdb.searchCustomers(false,' +
      "'" +
      cs5 +
      "'" +
      ');">' +
      cs5 +
      '</a></li>';
  header += '</ul>';
  header += '</div>';
  $('#headercontent').html(header);
  var menu = $('#menu > ul'),
    menuHeight = menu.height(),
    currentMenu = menu;

  // Open
  $('#menu > a').click(function(event) {
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

function loadCustomers(tx, rs) {
  var reccount = 0;
  var currtechid = window.localStorage.getItem('ssp_TechID');
  var currfilter = $('#customerkeyword').html();
  var rowOutput = '';
  if (rs.rows.length == 0) {
    // rowOutput += '<p class="message warning">Sorry, no customers found.</p>';
  } else {
    rowOutput += '<div id="tab-users"><ul class="extended-list">';
    for (var i = 0; i < Math.min(CUSTPAGING, rs.rows.length); i++) {
      rowOutput +=
        '<li><a href="#" onclick="ssp.webdb.getCustomerByID(' +
        "'" +
        rs.rows.item(i).ACCT_NO +
        "'" +
        ');">';
      rowOutput += '<span class="icon"></span>';
      rowOutput += rs.rows.item(i).NAME + '<br>';
      rowOutput += '<small>' + rs.rows.item(i).ADDR2 + '</small>';
      rowOutput +=
        '<br><small>' +
        rs.rows.item(i).CITY +
        ', ' +
        rs.rows.item(i).STATE +
        '</small>';
      rowOutput +=
        '<div><small><strong>' +
        rs.rows.item(i).ACCT_NO +
        '</strong></small></div>';
      rowOutput += '</a>';
      if (rs.rows.item(i).TECH_NO == currtechid) {
        rowOutput += '<ul class="extended-options"><li>';
        rowOutput +=
          rs.rows.item(i).FAV == 1
            ? '<img id="fav_' +
              rs.rows.item(i).ACCT_NO +
              '" width="16" height="16" alt="" src="img/star.png" onclick="ssp.webdb.setCustomerFav(' +
              "'" +
              rs.rows.item(i).ACCT_NO +
              "'" +
              ')"/>'
            : '<img id="fav_' +
              rs.rows.item(i).ACCT_NO +
              '" width="16" height="16" alt="" src="img/starEmpty.png" onclick="ssp.webdb.setCustomerFav(' +
              "'" +
              rs.rows.item(i).ACCT_NO +
              "'" +
              ')"/>'; // + '</span>';
        if (window.localStorage.getItem('ssp_custsalesbubble') == 1)
          rowOutput +=
            '<span class="number">' + rs.rows.item(i).NUMSALES + '</span>';
        rowOutput += '</li></ul>';
      } else {
        rowOutput +=
          '<ul class="extended-options"><li><strong>' +
          rs.rows.item(i).TECH_NO +
          '</strong></li></ul>';
      }

      rowOutput += '</li>';
    }
    //rowOutput += '</ul></div></div></div></section></article>';
    reccount = Math.max(0, $('#customerlistcount').html()) + i;
    var listid = Math.max(0, Math.ceil(reccount / CUSTPAGING));
    rowOutput += '<div id="customerlist' + listid + '"></div>';
    rowOutput += '</ul></div>';
    var rectotal = Math.max(rs.rows.length, $('#customerlisttotal').html());
    var moreOutput =
      '<div id="customermore"><img src="img/arrowCurveLeft.png" width="16" alt="arrow curve" height="16" class="picto"> <div style="display:inline-block" id="customerlistcount">' +
      reccount +
      '</div> of <div style="display:inline-block" id="customerlisttotal">' +
      rectotal +
      '</div> items  ';
    if (reccount != rectotal)
      moreOutput +=
        '<button type="button" onClick="ssp.webdb.getCustomersList(\'' +
        currfilter +
        "'," +
        Math.min(reccount, rectotal) +
        ');">Show More</button></div>';
  }
  $('#customerlist' + Math.max(0, Math.ceil(reccount / CUSTPAGING) - 1)).html(
    rowOutput
  );
  $('#customermore').html(moreOutput);
  $(document.body).applyTemplateSetup();

  $('#searchcustomers').keyup(function() {
    delay(function() {
      ssp.webdb.searchCustomers();
    }, 500);
  });
}

function loadCustomerDetail(tx, rs) {
  var rowOutput = '<article>';
  rowOutput += '<div id="custmsg" class="block-border">';
  rowOutput += '<div id="fallcreditmsg" class="block-border">';
  rowOutput += '<div class="block-content no-padding">';
  rowOutput += '<h1>';
  rowOutput +=
    '<div id="custname">' +
    rs.rows.item(0).NAME +
    '</div><div id="acctid">' +
    rs.rows.item(0).ACCT_NO +
    '</div>';
  rowOutput +=
    '<div id="custdisc1" style="display:none">' +
    rs.rows.item(0).DISC1 +
    '</div><div id="custdisc2" style="display:none">' +
    rs.rows.item(0).DISC2 +
    '</div>';
  if (
    window.localStorage.getItem('ssp_projectid') == 'ssc' ||
    window.localStorage.getItem('ssp_projectid') == 'sess' ||
    window.localStorage.getItem('ssp_projectid') == 'ecss'
  ) {
    rowOutput +=
      '<div id="custrate1" style="display:none">' +
      rs.rows.item(0).TAXABLE.split(':')[0] * 0.00001 +
      '</div><div id="custrate2" style="display:none">' +
      rs.rows.item(0).TAXABLE.split(':')[1] * 0.00001 +
      '</div>';
  }
  rowOutput += '</h1>';
  rowOutput += '<div class="block-controls">';
  rowOutput += '<ul class="controls-tabs js-tabs">';
  rowOutput +=
    '<li class="current"><a href="#tab-orders" title="Orders">Orders</a></li>';
  rowOutput +=
    '<li><a href="#tab-notes" title="Notes">Notes' +
    (rs.rows.item(0).NUMNOTES > 0
      ? '<span class="nb-events"> ' + rs.rows.item(0).NUMNOTES + '</span>'
      : '') +
    '</a></li>';
  rowOutput += '<li><a href="#tab-info" title="Info">Info</a></li>';
  rowOutput += '<li><a href="#tab-ar" title="A/R">Finance</a></li>';
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
  rowOutput +=
    '<li><strong>PHONE/CONTACT:</strong> ' + rs.rows.item(0).ADDR1 + '</li>';
  rowOutput +=
    '<li><strong>ADDRESS:</strong> ' + rs.rows.item(0).ADDR2 + '</li>';
  rowOutput += '<li><strong>CITY:</strong> ' + rs.rows.item(0).CITY + '</li>';
  rowOutput += '<li><strong>STATE:</strong> ' + rs.rows.item(0).STATE + '</li>';
  rowOutput += '<li><strong>ZIP:</strong> ' + rs.rows.item(0).ZIP + '</li>';
  //	rowOutput += '<li><strong>EMAIL:</strong> ' + rs.rows.item(0).MEMBER + '</li>';
  rowOutput += '<li>';
  //	rowOutput += '<p class="inline-mini-label">';
  //	rowOutput += '<strong>EMAIL:</strong>';
  //	rowOutput += '<input type="text" name="orderpdf" id="orderpdf" class="full-width" value="' + window.localStorage.getItem("ssp_orderpdf") + '">';
  //	rowOutput += '</p>';
  //	rowOutput += '<p class="inline-mini-label">';
  rowOutput +=
    '<strong>EMAIL:</strong> <div id="CustomerEmail" style="display:inline-block">' +
    rs.rows.item(0).MEMBER +
    '&nbsp;&nbsp;<a href="#" class="float-right" title="modcustemail" onclick="ssp.webdb.modCustomerEmail(\'' +
    rs.rows.item(0).MEMBER +
    '\')"><img src="img/pencil.png" width="16" alt="" height="16"/></a></div>';
  //	rowOutput += '</p>';
  rowOutput += '</li>';
  rowOutput +=
    '<li><strong>DISCOUNT %:</strong> ' + rs.rows.item(0).DISC1 + '</li>';
  rowOutput +=
    '<li><strong>DISC MAX $: </strong> ' +
    (!rs.rows.item(0).DISC2 ? 0 : rs.rows.item(0).DISC2.toFixed(2));
  +'</li>';
  if (window.localStorage.getItem('ssp_projectid') == 'ssc') {
    rowOutput +=
      '<li><strong>G.S.T./H.S.T. (RT869132142):</strong> ' +
      rs.rows.item(0).TAXABLE.split(':')[0] * 0.00001 +
      '</li>';
    rowOutput +=
      '<li><strong>T.V.Q. (1087751925):</strong> ' +
      rs.rows.item(0).TAXABLE.split(':')[1] * 0.00001 +
      '</li>';
  }
  if (window.localStorage.getItem('ssp_projectid') == 'sess') {
    rowOutput +=
      '<li><strong>Tax Rate 1:</strong> ' +
      rs.rows.item(0).TAXABLE.split(':')[0] * 0.00001 +
      '</li>';
    rowOutput +=
      '<li><strong>Tax Rate 2:</strong> ' +
      rs.rows.item(0).TAXABLE.split(':')[1] * 0.00001 +
      '</li>';
  }
  rowOutput +=
    '<li><div class="align-right"><a href="#" class="button" id="del' +
    rs.rows.item(0).ACCT_NO +
    '" title="delete" onclick="ssp.webdb.deleteCustomer(' +
    "'" +
    rs.rows.item(0).ACCT_NO +
    "'" +
    ')"><img src="img/bin.png" alt="" width="16" height="16"></a></div></li>';
  rowOutput += '</ul>';
  rowOutput += '</div>';
  rowOutput += '<div id="tab-ar">';
  rowOutput += '<div id="custar">';
  rowOutput += '</div>';
  rowOutput += '</div>';
  rowOutput += '</div>';
  rowOutput += '</div>';
  rowOutput += '</article>';

  $('#maincontent').html(rowOutput);
  $('#tab-orders').onTabShow(function() {
    ssp.webdb.getCustomersOrders(rs.rows.item(0).ACCT_NO);
  });
  $('#tab-notes').onTabShow(function() {
    ssp.webdb.getCustomersNotes(rs.rows.item(0).ACCT_NO);
  });
  $('#tab-ar').onTabShow(function() {
    ssp.webdb.getCustomersAR(rs.rows.item(0).ACCT_NO);
  });
  $(document.body).applyTemplateSetup();

  if (window.localStorage.getItem('ssp_projectid') == 'sess') {
    var fcAS400 = rs.rows.item(0).SP_RATE;
    var fcPending = 0;
    ssp.webdb.db.transaction(function(tx) {
      tx.executeSql(
        'SELECT SUM(SIQTY*SIPRC) AS amtSales FROM tblSales WHERE (SIINVO = "0" OR SIINVO IS NULL) AND (SILVL4="1.0" OR SILVL4="1") AND SIACT = "' +
          rs.rows.item(0).ACCT_NO +
          '"',
        [],
        function(tx, rs) {
          if (rs.rows.item(0).amtSales) {
            fcPending = rs.rows.item(0).amtSales * 0.5;
          }
          if (fcAS400 + fcPending > 0) {
            var fcMsg = 'Fall Credit: $' + fcAS400.toFixed(2);
            if (fcPending > 0) {
              fcMsg += ' (pend:' + fcPending.toFixed(2) + ')';
            }
            $('#fallcreditmsg')
              .removeBlockMessages()
              .blockMessage(fcMsg, { type: 'success' });
          }
        },
        ssp.webdb.onError
      );
    });
  }

  //check 90 day balance
  ssp.webdb.db.transaction(function(tx) {
    tx.executeSql(
      'SELECT * FROM tblCustomersAR WHERE ACCT_NO = "' +
        rs.rows.item(0).ACCT_NO +
        '"',
      [],
      function(tx, rs) {
        if (rs.rows.length > 0) {
          if (rs.rows.item(0).OVER_90 > 0) {
            $('#custmsg')
              .removeBlockMessages()
              .blockMessage('Customer has balance over 90 days.', {
                type: 'error'
              });
          }
        }
      },
      ssp.webdb.onError
    );
  });
}

function loadCustomerAR(tx, rs) {
  var rowOutput = '<ul class="simple-list with-icon icon-info with-padding">';
  rowOutput +=
    '<li><strong>BALANCE:</strong> ' + rs.rows.item(0).BALANCE + '</li>';
  rowOutput +=
    '<li><strong>CURRENT:</strong> ' + rs.rows.item(0).CURRENT + '</li>';
  rowOutput +=
    '<li><strong>OVER DUE:</strong> ' + rs.rows.item(0).OVER_DUE + '</li>';
  rowOutput +=
    '<li><strong>OVER 90:</strong> ' + rs.rows.item(0).OVER_90 + '</li>';
  rowOutput +=
    '<li><strong>LAST PAY DATE:</strong> ' +
    format120Date(rs.rows.item(0).OVER_120) +
    '</li>';
  rowOutput +=
    '<li><strong>LAST PAYMENT:</strong> ' +
    rs.rows.item(0).PAYMENTS.toFixed(2) +
    '</li>';
  rowOutput += '</ul>';

  $('#custar').html(rowOutput);
}

function loadCustomerNotes(tx, rs) {
  var rowOutput = '<div class="task">';
  rowOutput += '<ul class="task-dialog">';
  rowOutput += '<li>';
  rowOutput +=
    '<form class="form input-with-button" onsubmit="return ssp.webdb.addCustomerNote(' +
    "'" +
    $('#acctid').html() +
    "'" +
    ');">';
  rowOutput += '<button class="float-right" type="submit">Add</button>';
  rowOutput +=
    '<textarea id="txtAddNote" name="txtAddNote" value="" class="form input-with-button"></textarea>';
  rowOutput += '</form>';
  rowOutput += '</li>';

  if (rs.rows.length == 0) {
    rowOutput += '<li>Sorry, no messages to list.</li>';
  } else {
    for (var i = 0; i < rs.rows.length; i++) {
      var note_date = formatDate(rs.rows.item(i).MODSTAMP);
      var note_html = rs.rows.item(i).NOTE.replace(/\n\r?/g, '<br />');
      rowOutput += '<li>';
      rowOutput += note_html;
      rowOutput +=
        '<br /><strong>' +
        rs.rows.item(i).TECH_NO +
        '</strong><em>-' +
        note_date +
        '  </em>';
      if (rs.rows.item(i).MOD) {
        rowOutput +=
          '<a href="#" class="button" id="delnote' +
          i +
          '" title="delete" onclick="ssp.webdb.deleteCustomerNote(' +
          "'" +
          rs.rows.item(i).PKIDDroid +
          "'," +
          i +
          ')"><img src="img/bin.png" alt="" width="16" height="16"></a>';
      }
      rowOutput += '</li>';
    }
  }
  rowOutput += '</ul></div>';
  $('#notelist').html(rowOutput);
}

function loadCustomerOrders(tx, rs) {
  var rowOutput =
    '<p style="margin-top: 5px" ><button class="full-width" onclick="ssp.webdb.getOrder(-1,1);">Create Order</button></p>';
  rowOutput += '<ul class="blocks-list with-padding ">';

  if (rs.rows.length == 0) {
    rowOutput += '<li>Sorry, no orders to list.</li>';
    rowOutput += '</ul>';
  } else {
    for (var i = 0; i < rs.rows.length; i++) {
      rowOutput +=
        '<li onclick="ssp.webdb.getOrder(' +
        "'" +
        rs.rows.item(i).SIORNM +
        "'" +
        ',' +
        (rs.rows.item(i).MODIFIED > 0 ? 1 : 0) +
        ')">';
      rowOutput +=
        '<a href="#" class="float-left"><img src="img/status' +
        (rs.rows.item(i).MODIFIED > 0 ? '-away' : '') +
        '.png" width="16" alt="" height="16"> ' +
        rs.rows.item(i).SIORNM +
        '<h4>' +
        (rs.rows.item(i).MODIFIED > 0
          ? 'items to sync: ' + rs.rows.item(i).MODIFIED
          : rs.rows.item(i).SIINVO) +
        '</h4></a>';
      rowOutput += '<ul class="floating-tags float-right">';
      rowOutput +=
        '<li class="tag-date"> ' + formatDate(rs.rows.item(i).SIDATO) + '</li>';
      rowOutput +=
        '<li class="tag-money"> ' +
        rs.rows.item(i).ORDERCOUNTITEM +
        ' - ' +
        (rs.rows.item(i).ORDERTOTAL + rs.rows.item(i).ARMTOTAL).toFixed(2) +
        '</li>';
      if (!!rs.rows.item(i).NITROCOUNT) {
        rowOutput += '<span class="number"> ' + 'Nitrogen' + '</span>';
      }
      if (!!rs.rows.item(i).POATOTAL) {
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
  $('#custacct').html(
    'N' +
      window.localStorage.getItem('ssp_TechID') +
      randomString().substr(
        0,
        3 + (4 - window.localStorage.getItem('ssp_TechID').length)
      )
  );
}

function loadCustomerNew() {
  var divContent = '<section id="login-block">';
  divContent +=
    '<div class="block-border"><form class="form block-content" name="login-form" id="login-form" onsubmit="return ssp.webdb.addCustomer()" action="">';
  divContent += '<h1>New Customer</h1>';

  divContent +=
    '<div class="block-border with-margin"><h3>Temporary Customer ID</h3>';
  divContent += '<h4><div id="custacct"></div></h4></div>';

  divContent += '<p class="inline-mini-label">';
  divContent += '<label for="name">Name</label>';
  divContent +=
    '<input type="text" name="custname" id="custname" class="full-width" value="">';
  divContent += '</p>';
  divContent += '<p class="inline-mini-label">';
  divContent += '<label for="mail">Address</label>';
  divContent +=
    '<input type="text" name="custaddr2" id="custaddr2" class="full-width" value="">';
  divContent += '</p>';
  divContent += '<p class="inline-mini-label">';
  divContent += '<label for="mail">City</label>';
  divContent +=
    '<input type="text" name="custcity" id="custcity" class="full-width" value="">';
  divContent += '</p>';
  divContent += '<p class="inline-mini-label">';
  divContent += '<label for="mail">State</label>';
  divContent +=
    '<input type="text" name="custstate" id="custstate" class="full-width" value="">';
  divContent += '</p>';
  divContent += '<p class="inline-mini-label">';
  divContent += '<label for="mail">Zip</label>';
  divContent +=
    '<input type="text" name="custzip" id="custzip" class="full-width" value="">';
  divContent += '</p>';
  divContent += '<p class="inline-mini-label">';
  divContent += '<label for="mail">Phone</label>';
  divContent +=
    '<input type="text" name="custaddr" id="custaddr" class="full-width" value="">';
  divContent += '</p>';
  divContent += '<p class="inline-mini-label">';
  divContent += '<label for="mail">Email</label>';
  divContent +=
    '<input type="text" name="custemail" id="custemail" class="full-width" value="">';
  divContent += '</p>';

  divContent += '<p><button type="submit" class="full-width">Save</button></p>';
  divContent += '</form></div></section>';

  $('#maincontent').html(divContent);
  getNewCustomerID();
}

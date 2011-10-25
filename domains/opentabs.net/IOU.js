var tabs = localStorage.getItem('tabs');
var you = 'michiel@unhosted.org';
var peers = {};
for(i in tabs) {
  peers[tabs[i].payer]=true;
  peers[tabs[i].payee]=true;
}
delete peers[you];

var importantStr = '<h2>IMPORTANT</h2><ul>';
for(i in sampleData) {
  var iou = sampleData[i];
  if((iou.proposer != 'you') && (iou.status == 'proposed') && (iou.payer == 'you')) {
    importantStr += '<li style="background-color:yellow">[incoming invoice:] [?]'+iou.payee+' '+iou.amount+iou.currency+'</li>';
  }
  if((iou.proposer != 'you') && (iou.status == 'proposed') && (iou.payee == 'you')) {
    importantStr += '<li style="background-color:yellow">[incoming IOU:] [?]'+iou.payer+' '+iou.amount+iou.currency+'</li>';
  }
  if((iou.proposer == 'you') && (iou.status == 'declined') && (iou.payer == 'you')) {
    importantStr += '<li style="background-color:yellow">[declined your IOU:] [X]'+iou.payee+' '+iou.amount+iou.currency+'</li>';
  }
  if((iou.proposer == 'you') && (iou.status == 'declined') && (iou.payee == 'you')) {
    importantStr += '<li style="background-color:yellow">[declined your invoice:] [X]'+iou.payer+' '+iou.amount+iou.currency+'</li>';
  }
}
importantStr += '</ul><h2>Contacts:</h2><table id="contacts"></table>';
document.write(importantStr);


for(var peer in peers) {
  document.write('<h2>'+peer+'</h2><ul>');

  for(i in sampleData) {
    var iou = sampleData[i];
    if((iou.payee == peer) && (iou.status == 'requested')) {
      document.write('<li style="background-color:pink">[hurry:] [!]'+iou.amount+iou.currency+'</li>');
    }
    if((iou.payer == peer) && (iou.status == 'sent')) {
      document.write('<li style="background-color:green">[got it?] [&#10003;]'+iou.amount+iou.currency+'</li>');
    }
    if((iou.payer == peer) && (iou.status == 'requested')) {
      document.write('<li style="background-color:green">[you said hurry] [!]'+iou.amount+iou.currency+'</li>');
    }
  }
  document.write('</ul><hr><ul>');
  for(i in sampleData) {
    var iou = sampleData[i];
    if((iou.payee == peer) && (iou.status == 'accepted')) {
      document.write('<li style="background-color:pink">[you owe them]'+iou.amount+iou.currency+'</li>');
    }
    if((iou.payer == peer) && (iou.status == 'accepted')) {
      document.write('<li style="background-color:green">[they owe you]'+iou.amount+iou.currency+'</li>');
    }
    if((iou.payee == peer) && (iou.status == 'proposed')) {
      document.write('<li style="background-color:pink">[you proposed] [?]'+iou.amount+iou.currency+'</li>');
    }
  }
  document.write('</ul>');
}

document.write('<h2>HISTORY</h2><ul>');
for(i in sampleData) {
  var iou = sampleData[i];
  if((iou.proposer != 'you') && (iou.status == 'declined') && (iou.payee=='you')) {
    document.write('<li style="background-color:yellow">[you declined] [X]'+iou.payer+' '+iou.amount+iou.currency+'</li>');
  }
  if((iou.proposer != 'you') && (iou.status == 'declined') && (iou.payer=='you')) {
    document.write('<li style="background-color:yellow">[you declined] [X]'+iou.payee+' '+iou.amount+iou.currency+'</li>');
  }
  if((iou.payer == 'you') &&(iou.status == 'closed')) {
    document.write('<li style="background-color:yellow">[was declined] [X]'+iou.payee+' '+iou.amount+iou.currency+'</li>');
  }
  if((iou.payee == 'you') &&(iou.status == 'closed')) {
    document.write('<li style="background-color:yellow">[was declined] [X]'+iou.payer+' '+iou.amount+iou.currency+'</li>');
  }
  if((iou.payer == 'you') && (iou.status == 'sent')) {
    document.write('<li style="background-color:pink">[you sent] [&#10003;]'+iou.payee+' '+iou.amount+iou.currency+'</li>');
  }
  if((iou.payer == 'you') && (iou.status == 'received')) {
    document.write('<li style="background-color:pink">[they received] [&#10003;]'+iou.payee+' '+iou.amount+iou.currency+'</li>');
  }
  if((iou.payee == 'you') && (iou.status == 'received')) {
    document.write('<li style="background-color:green">[you received] [&#10003;]'+iou.payer+' '+iou.amount+iou.currency+'</li>');
  }
}

document.write('</ul>');
// IMPORTANT (highlighted, by timestamp)
// [?]Y proposed (rcv)
// [X]Y declined (snd)

// PER PEER (peers with ! items inside sorted on top, otherwise by timestamp)
// [!]R requested (payer) highlighted
// [&#10003;]G sent (payee) highlighted
//-------------------------------------
// accepted (both)
// [?]Y proposed (snd)
// [!]G requested (payee)

// HISTORY (greyed out, by timestamp)
// [X]Y declined (rcv)
// [X]Y closed (both)
// [&#10003;]R sent (payer)
// [&#10003;]R/G received (both)



//tab fields:
// payer, payee, timestamp, amount, currency,
//and optionally:
// description, location

function openNewTab(tab, signature) {
  tab.status='proposed';
  //add the first signature:
  tab.signatures = [signature];
  var tabId = localStorage.length;
  localStorage.setItem(tabId, JSON.stringify(tab));
  return tabId;
}

function declineTab(tabId, message, signature) {
  var tab = JSON.parse(localStorage.getItem(tabId));
  tab.status='declined';
  tab.message=message;
  //add the second signature:
  tab.signatures.push(signature);
  localStorage.setItem(tabId, JSON.stringify(tab));
}

function acceptTab(tabId, signature) {
  var tab = JSON.parse(localStorage.getItem(tabId));
  tab.status='accepted';
  //add the second signature:
  tab.signatures.push(signature);
  localStorage.setItem(tabId, JSON.stringify(tab));
}

function requestPayment(tabId, signature) {
  var tab = JSON.parse(localStorage.getItem(tabId));
  tab.status='paymentRequested';
  //add the third signature:
  tab.signatures.push(signature);
  localStorage.setItem(tabId, JSON.stringify(tab));
}

function markAsPaid(tabId, byWhom, signature) {
  var tab = JSON.parse(localStorage.getItem(tabId));
  if(byWhom=='payer') {
    tab.status='paymentSent';
  } else {
    tab.status='paymentReceived';
  }
  //add the extra signature:
  tab.signatures.push(signature);
  localStorage.setItem(tabId, JSON.stringify(tab));
}

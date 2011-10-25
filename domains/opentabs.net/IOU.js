var tabs = localStorage.getItem('tabs');
var you = 'michiel@unhosted.org';
var peers = {};
for(i in tabs) {
  peers[tabs[i].payer]=true;
  peers[tabs[i].payee]=true;
}
delete peers[you];

var importantStr = '<h2>IMPORTANT</h2><ul>';
for(i in tabs) {
  var iou = tabs[i];
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

  for(i in tabs) {
    var iou = tabs[i];
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
  for(i in tabs) {
    var iou = tabs[i];
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
for(i in tabs) {
  var iou = tabs[i];
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

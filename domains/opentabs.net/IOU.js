remoteStorage.setItem('you', 'michiel@unhosted.org');

function getImportantString() {
  var tabs = JSON.parse(remoteStorage.getItem('tabs'));
  var you = remoteStorage.getItem('you');

  var importantStr = '<ul>';
  for(i in tabs) {
    var iou = tabs[i];
    if(!iou.description) {
      iou.description='';
    }
    if((iou.proposer != you) && (iou.status == 'proposed') && (iou.payer == you)) {
      importantStr += '<li style="background-color:yellow">[incoming invoice:] [?]'
        +iou.payee+' '
        +iou.description+' '
        +iou.amount+iou.currency
        +'<input type="submit" value="Decline" onclick="declineIncoming('+i+');">'
        +'<input type="submit" value="Accept" onclick="acceptIncoming('+i+');">'
        +'</li>';
    }
    if((iou.proposer != you) && (iou.status == 'proposed') && (iou.payee == you)) {
      importantStr += '<li style="background-color:yellow">[incoming IOU:] [?]'+iou.payer+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
    if((iou.proposer == you) && (iou.status == 'declined') && (iou.payer == you)) {
      importantStr += '<li style="background-color:yellow">[declined your IOU:] [X]'+iou.payee+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
    if((iou.proposer == you) && (iou.status == 'declined') && (iou.payee == you)) {
      importantStr += '<li style="background-color:yellow">[declined your invoice:] [X]'+iou.payer+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
  }
  importantStr += '</ul>';
  return importantStr;
}
function getContactsString() {
  var contacts = JSON.parse(remoteStorage.getItem('contacts'));
  var tabs = JSON.parse(remoteStorage.getItem('tabs'));
  var you = remoteStorage.getItem(you);
  var contactsStr = '';
  for(var i in contacts) {
    contactsStr += '<div id="'+i+'"><strong id="contact'+i+'">'+contacts[i]+'</strong>'
           +'<input type="submit" id="owe'+i+'" value="+" onclick="owe('+i+');">'
           +'<ul>';
    for(j in tabs) {
      var iou = tabs[j];
      if(!iou.description) {
        iou.description='';
      }
      if((iou.payee == contacts[i]) && (iou.status == 'requested')) {
        contactsStr += '<li style="background-color:pink">[hurry:] [!]'+iou.description+' '+iou.amount+iou.currency+'</li>';
      }
      if((iou.payer == contacts[i]) && (iou.status == 'sent')) {
        contactsStr += '<li style="background-color:green">[got it?] [&#10003;]'+iou.description+' '+iou.amount+iou.currency+'</li>';
      }
      if((iou.payer == contacts[i]) && (iou.status == 'requested')) {
        contactStr += '<li style="background-color:green">[you said hurry] [!]'+iou.description+' '+iou.amount+iou.currency+'</li>';
      }
    }
    contactsStr += '</ul><hr><ul>';
    for(j in tabs) {
      var iou = tabs[j];
      if(!iou.description) {
        iou.description='';
      }
      if((iou.payee == contacts[i]) && (iou.status == 'accepted')) {
        contactsStr += '<li style="background-color:pink">[you owe them]'+iou.description+' '+iou.amount+iou.currency+'</li>';
      }
      if((iou.payer == contacts[i]) && (iou.status == 'accepted')) {
        contactsStr += '<li style="background-color:green">[they owe you]'+iou.description+' '+iou.amount+iou.currency+'</li>';
      }
      if((iou.payee == contacts[i]) && (iou.status == 'proposed') && (iou.proposer == you)) {
        contactsStr += '<li style="background-color:pink">[you proposed] [?]'+iou.description+' '+iou.amount+iou.currency+'</li>';
      }
    }
    contactsStr += '</ul></div>';
  }
  return contactsStr;
}
function getHistoryString() {
  var tabs = JSON.parse(remoteStorage.getItem('tabs'));
  var you = remoteStorage.getItem(you);
  historyStr = '<ul>';
  for(i in tabs) {
    var iou = tabs[i];
    if(!iou.description) {
      iou.description='';
    }
    if((iou.proposer != you) && (iou.status == 'declined') && (iou.payee==you)) {
      historyStr += '<li style="background-color:yellow">[you declined] [X]'+iou.payer+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
    if((iou.proposer != you) && (iou.status == 'declined') && (iou.payer==you)) {
      historyStr += '<li style="background-color:yellow">[you declined] [X]'+iou.payee+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
    if((iou.payer == you) &&(iou.status == 'closed')) {
      historyStr += '<li style="background-color:yellow">[was declined] [X]'+iou.payee+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
    if((iou.payee == you) &&(iou.status == 'closed')) {
      historyStr += '<li style="background-color:yellow">[was declined] [X]'+iou.payer+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
    if((iou.payer == you) && (iou.status == 'sent')) {
      historyStr += '<li style="background-color:pink">[you sent] [&#10003;]'+iou.payee+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
    if((iou.payer == you) && (iou.status == 'received')) {
      historyStr += '<li style="background-color:pink">[they received] [&#10003;]'+iou.payee+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
    if((iou.payee == you) && (iou.status == 'received')) {
      historyStr += '<li style="background-color:green">[you received] [&#10003;]'+iou.payer+' '+iou.description+' '+iou.amount+iou.currency+'</li>';
    }
  }
  historyStr += '</ul>';
  return historyStr;
}

remoteStorage.setItem('you', 'michiel@unhosted.org');

function getImportantString() {
  var tabs = JSON.parse(remoteStorage.getItem('tabs'));
  var you = remoteStorage.getItem('you');
  var totals = {};
  var importantStr = '<ul>';
  for(i in tabs) {
    var iou = tabs[i];
    if(!iou.description) {
      iou.description='';
    }
    if((iou.proposer != you) && (iou.status == 'proposed') && (iou.payer == you)) {
      importantStr += '<li style="background-color:yellow">[incoming invoice:] [?]'
        +iou.payee+' '+iou.description+' '+iou.amount+iou.currency
        +'<input type="submit" value="Decline (msg)" onclick="declineIncoming('+i+');">'
        +'<input type="submit" value="Accept" onclick="acceptIncoming('+i+');">'
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.proposer != you) && (iou.status == 'proposed') && (iou.payee == you)) {
      importantStr += '<li style="background-color:yellow">[incoming IOU:] [?]'
        +iou.payer+' '+iou.description+' '+iou.amount+iou.currency
        +'<input type="submit" value="Decline (msg)" onclick="declineIncoming('+i+');">'
        +'<input type="submit" value="Accept" onclick="acceptIncoming('+i+');">'
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.proposer == you) && (iou.status == 'declined') && (iou.payer == you)) {
      importantStr += '<li style="background-color:yellow">[declined your IOU:] [X]'
        +iou.payee+' '+iou.description+' '+iou.amount+iou.currency
        +'<input type="submit" value="Close" onclick="closeDeclined('+i+');">'
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.proposer == you) && (iou.status == 'declined') && (iou.payee == you)) {
      importantStr += '<li style="background-color:yellow">[declined your invoice:] [X]'
        +iou.payer+' '+iou.description+' '+iou.amount+iou.currency
        +'<input type="submit" value="Close" onclick="closeDeclined('+i+');">'
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    for(currency in totals) {
      importantStr +='<h4>TOTAL: '+totals[currency]+currency+'</h4>';
    }
  }
  importantStr += '</ul>';
  return importantStr;
}
function getContactsString() {
  var contacts = JSON.parse(remoteStorage.getItem('contacts'));
  var tabs = JSON.parse(remoteStorage.getItem('tabs'));
  var you = remoteStorage.getItem('you');
  var contactsStr = '';
  for(var i in contacts) {
    var totals = {};
    contactsStr += '<div id="'+i+'"><strong id="contact'+i+'">'+contacts[i]+'</strong>'
           +'<input type="submit" id="owe'+i+'" value="+" onclick="owe('+i+');">'
           +'<ul>';
    for(j in tabs) {
      var iou = tabs[j];
      if(!iou.description) {
        iou.description='';
      }
      if((iou.payee == contacts[i]) && (iou.status == 'requested')) {
        contactsStr += '<li style="background-color:pink">[hurry:] [!]'
          +iou.description+' '+iou.amount+iou.currency
          +'<input type="submit" value="Mark as paid" onclick="markAsPaid('+j+');">'
          +'</li>';
        if(totals[iou.currency]==undefined) {
          totals[iou.currency]=0;
        }
        if(iou.payee==you) {
          totals[iou.currency]+= parseInt(iou.amount);
        } else {
          totals[iou.currency]-= parseInt(iou.amount);
        }
      }
      if((iou.payer == contacts[i]) && (iou.status == 'sent')) {
        contactsStr += '<li style="background-color:green">[got it?] [&#10003;]'
          +iou.description+' '+iou.amount+iou.currency
          +'<input type="submit" value="Mark as paid" onclick="markAsPaid('+j+');">'
          +'</li>';
        if(totals[iou.currency]==undefined) {
          totals[iou.currency]=0;
        }
        if(iou.payee==you) {
          totals[iou.currency]+= parseInt(iou.amount);
        } else {
          totals[iou.currency]-= parseInt(iou.amount);
        }
      }
      if((iou.payer == contacts[i]) && (iou.status == 'requested')) {
        contactsStr += '<li style="background-color:green">[you said hurry] [!]'
          +iou.description+' '+iou.amount+iou.currency
          +'<input type="submit" value="Mark as paid" onclick="markAsPaid('+j+');">'
          +'</li>';
        if(totals[iou.currency]==undefined) {
          totals[iou.currency]=0;
        }
        if(iou.payee==you) {
          totals[iou.currency]+= parseInt(iou.amount);
        } else {
          totals[iou.currency]-= parseInt(iou.amount);
        }
      }
    }
    contactsStr += '</ul><div onclick="unfold('+i+');">...<div id="folded'+i+'" style="display:none"><ul>';
    for(j in tabs) {
      var iou = tabs[j];
      if(!iou.description) {
        iou.description='';
      }
      if((iou.payee == contacts[i]) && (iou.status == 'accepted')) {
        contactsStr += '<li style="background-color:pink">[you owe them]'
          +iou.description+' '+iou.amount+iou.currency
          +'<input type="submit" value="Mark as paid" onclick="markAsPaid('+j+');">'
          +'</li>';
        if(totals[iou.currency]==undefined) {
          totals[iou.currency]=0;
        }
        if(iou.payee==you) {
          totals[iou.currency]+= parseInt(iou.amount);
        } else {
          totals[iou.currency]-= parseInt(iou.amount);
        }
      }
      if((iou.payer == contacts[i]) && (iou.status == 'accepted')) {
        contactsStr += '<li style="background-color:green">[they owe you]'
          +iou.description+' '+iou.amount+iou.currency
          +'<input type="submit" value="Request payment" onclick="requestPayment('+j+');">'
          +'<input type="submit" value="Mark as paid" onclick="markAsPaid('+j+');">'
          +'</li>';
        if(totals[iou.currency]==undefined) {
          totals[iou.currency]=0;
        }
        if(iou.payee==you) {
          totals[iou.currency]+= parseInt(iou.amount);
        } else {
          totals[iou.currency]-= parseInt(iou.amount);
        }
      }
      if((iou.payee == contacts[i]) && (iou.status == 'proposed') && (iou.proposer == you)) {
        contactsStr += '<li style="background-color:pink">[you proposed to owe] [?]'
          +iou.description+' '+iou.amount+iou.currency
          +'<input type="submit" value="Cancel" onclick="cancelProposed('+j+');">'
          +'</li>';
        if(totals[iou.currency]==undefined) {
          totals[iou.currency]=0;
        }
        if(iou.payee==you) {
          totals[iou.currency]+= parseInt(iou.amount);
        } else {
          totals[iou.currency]-= parseInt(iou.amount);
        }
      }
      if((iou.payer == contacts[i]) && (iou.status == 'proposed') && (iou.proposer == you)) {
        contactsStr += '<li style="background-color:pink">[invoice you proposed] [?]'
          +iou.description+' '+iou.amount+iou.currency
          +'<input type="submit" value="Cancel" onclick="cancelProposed('+j+');">'
          +'</li>';
        if(totals[iou.currency]==undefined) {
          totals[iou.currency]=0;
        }
        if(iou.payee==you) {
          totals[iou.currency]+= parseInt(iou.amount);
        } else {
          totals[iou.currency]-= parseInt(iou.amount);
        }
      }
    }
    contactsStr += '</ul></div></div></div>';
    for(currency in totals) {
      contactsStr +='<h4>TOTAL: '+totals[currency]+currency+'</h4>';
    }
  }
  return contactsStr;
}
function getHistoryString() {
  var tabs = JSON.parse(remoteStorage.getItem('tabs'));
  var you = remoteStorage.getItem('you');
  historyStr = '<ul>';
  var totals= {};
  for(i in tabs) {
    var iou = tabs[i];
    if(!iou.description) {
      iou.description='';
    }
    if((iou.proposer != you) && (iou.status == 'declined') && (iou.payee==you)) {
      historyStr += '<li style="background-color:yellow">[offer you refused] [X]'
        +iou.payer+' '+iou.description+' '+iou.amount+iou.currency
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.proposer != you) && (iou.status == 'declined') && (iou.payer==you)) {
      historyStr += '<li style="background-color:yellow">[invoice you declined] [X]'
        +iou.payee+' '+iou.description+' '+iou.amount+iou.currency
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.payer == you) &&(iou.status == 'closed')) {
      historyStr += '<li style="background-color:yellow">[was declined] [X]'
        +iou.payee+' '+iou.description+' '+iou.amount+iou.currency
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.payee == you) &&(iou.status == 'closed')) {
      historyStr += '<li style="background-color:yellow">[was declined] [X]'
        +iou.payer+' '+iou.description+' '+iou.amount+iou.currency
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.payer == you) && (iou.status == 'sent')) {
      historyStr += '<li style="background-color:pink">[you sent] [&#10003;]'
        +iou.payee+' '+iou.description+' '+iou.amount+iou.currency
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.payer == you) && (iou.status == 'received')) {
      historyStr += '<li style="background-color:pink">[they received] [&#10003;]'
        +iou.payee+' '+iou.description+' '+iou.amount+iou.currency
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
    if((iou.payee == you) && (iou.status == 'received')) {
      historyStr += '<li style="background-color:green">[you received] [&#10003;]'
        +iou.payer+' '+iou.description+' '+iou.amount+iou.currency
        +'</li>';
      if(totals[iou.currency]==undefined) {
        totals[iou.currency]=0;
      }
      if(iou.payee==you) {
        totals[iou.currency]+= parseInt(iou.amount);
      } else {
        totals[iou.currency]-= parseInt(iou.amount);
      }
    }
  }
  historyStr += '</ul>';
  for(currency in totals) {
    historyStr +='<h4>TOTAL: '+totals[currency]+currency+'</h4>'
  }
  return historyStr;
}

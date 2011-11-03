var you = localStorage.getItem('nick')+'@opentabs.net';

function getImportantString() {
  var tabs = JSON.parse(localStorage.getItem('tabs'));
  var totals = {};
  var importantStr = '<ul>';
  for(i in tabs) {
    var iou = tabs[i];
    if(!iou.description) {
      iou.description='';
    }
    if((iou.proposer != you) && (iou.status == 'proposed') && (iou.payer == you)) {
      // incoming invoice
      importantStr += '<li><strong>?</strong> '
        +iou.payee+' '+iou.description+' <span class="negative">'+iou.amount+iou.currency+'</span>'
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
      // incoming IOU
      importantStr += '<li><strong>?</strong>'
        +iou.payer+' '+iou.description+' <span class="positive">'+iou.amount+iou.currency+'</span>'
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
      // declined your IOU
      importantStr += '<li><strong>X</strong> '
        +iou.payee+' '+iou.description+' <span class="negative">'+iou.amount+iou.currency+'</span>'
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
      // declined your invoice
      importantStr += '<li><strong>X</strong> '
        +iou.payer+' '+iou.description+' <span class="positive">'+iou.amount+iou.currency+'</span>'
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
      importantStr +='<h4>Total: '+totals[currency]+currency+'</h4>';
    }
  }
  importantStr += '</ul>';
  return importantStr;
}
function getContactsString() {
  var contacts = JSON.parse(localStorage.getItem('contacts'));
  var tabs = JSON.parse(localStorage.getItem('tabs'));
  var contactsStr = '';
  for(var i in contacts) {
    var totals = {};
    contactsStr += '<span id="'+i+'"><span onclick="owe('+i+');" class="avatar" id="avatar'+i+'">'+contacts[i][0]+'</span>'
           +'<span onclick="owe('+i+');" class="contactName" id="contact'+i+'">'+contacts[i]+'</span>'
           +'<span id="add'+i+'"></span>';
    var thisContactsStr='';
    for(j in tabs) {
      var iou = tabs[j];
      if(!iou.description) {
        iou.description='';
      }
      if((iou.payee == contacts[i]) && (iou.status == 'requested')) {
        // hurry
        thisContactsStr += '<li><strong>!</strong> '
          +iou.description+' <span class="negative">'+iou.amount+iou.currency+'</span>'
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
        // got it?
        thisContactsStr += '<li><strong>&#10003;</strong> '
          +iou.description+' <span class="positive">'+iou.amount+iou.currency+'</span>'
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
        // you said hurry
        thisContactsStr += '<li><strong>!</strong> '
          +iou.description+' <span class="positive">'+iou.amount+iou.currency+'</span>'
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
    thisContactsStr2 = '';
    for(j in tabs) {
      var iou = tabs[j];
      if(!iou.description) {
        iou.description='';
      }
      if((iou.payee == contacts[i]) && (iou.status == 'accepted')) {
        // you owe them
        thisContactsStr2 += '<li> '
          +iou.description+' <span class="negative">'+iou.amount+iou.currency+'</span>'
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
        // they owe you
        thisContactsStr2 += '<li>'
          +iou.description+' <span class="positive">'+iou.amount+iou.currency+'</span>'
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
        // you proposed to owe
        thisContactsStr2 += '<li><strong>?</strong> '
          +iou.description+' <span class="negative">'+iou.amount+iou.currency+'</span>'
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
        // invoice you proposed
        thisContactsStr2 += '<li><strong>?</strong> '
          +iou.description+' <span class="positive">'+iou.amount+iou.currency+'</span>'
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
    for(currency in totals) {
      contactsStr +='<h4>Total: '+totals[currency]+currency+'</h4>';
    }
    if(thisContactsStr.length) {
      contactStr  += '<ul>'+thisContactsStr+'</ul>';
    }
    if(thisContactsStr2.length) {
      contactsStr += '<div onclick="fold('+i+');">...<div id="folded'+i+'"><ul>'+thisContactsStr2 + '</ul></div></div></div>';
    }
  }
  return contactsStr;
}
function getHistoryString() {
  var tabs = JSON.parse(localStorage.getItem('tabs'));
  historyStr = '<ul>';
  var totals= {};
  for(i in tabs) {
    var iou = tabs[i];
    if(!iou.description) {
      iou.description='';
    }
    if((iou.proposer != you) && (iou.status == 'declined') && (iou.payee==you)) {
      // offer you refused
      historyStr += '<li><strong>X</strong>'
        +iou.payer+' '+iou.description+'<span class="positive">'+iou.amount+iou.currency+'</span>'
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
      // invoice you declined
      historyStr += '<li><strong>X</strong> '
        +iou.payee+' '+iou.description+' <span class="negative">'+iou.amount+iou.currency+'</span>'
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
    if((iou.payer == you) && (iou.status == 'closed')) {
      // was declined
      historyStr += '<li><strong>X</strong> '
        +iou.payee+' '+iou.description+' <span class="negative">'+iou.amount+iou.currency+'</span>'
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
    if((iou.payee == you) && (iou.status == 'closed')) {
      // was declined
      historyStr += '<li><strong>X</strong> '+iou.payer+' '+iou.description+' <span class="positive">'+iou.amount+iou.currency+'</span></li>';
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
      // you sent
      historyStr += '<li><strong>&#10003;</strong> '+iou.payee+' '+iou.description+' <span class="negative">'+iou.amount+iou.currency+'</span></li>';
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
      // they received
      historyStr += '<li><strong>&#10003;</strong> '+iou.payee+' '+iou.description+' <span class="negative>'+iou.amount+iou.currency+'</span></li>';
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
      // you received
      historyStr += '<li><strong>&#10003;</strong> '+iou.payer+' '+iou.description+' <span class="positive">'+iou.amount+iou.currency+'</span></li>';
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
    historyStr +='<h4>Total: '+totals[currency]+currency+'</h4>'
  }
  return historyStr;
}

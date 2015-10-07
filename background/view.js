chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: 'Add to Type and Learn',
    contexts: ['selection'],
    id: 'context-tal-create-card'
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  newCardPopupView.open(info.selectionText);
});


var newCardPopupView = {
  template: document.getElementById('new-card-popup-template'),

  open: function(selectedText) {
    var fragment = document.importNode(this.template.content, true);

    var tmp = document.createElement('div');
    tmp.appendChild(fragment);

    $(tmp).find('#input-side-a').attr('value', selectedText);
    
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: {
          type: 'renderPopUp',
          selectedText: selectedText,
          html: tmp.innerHTML
        }
      });
    });
  }
};
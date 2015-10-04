var newCardPopupView = {
  template: document.getElementById('new-card-popup-template'),

  init: function(selectedText) {
    var result = document.importNode(this.template.content, true),
        resultHTML = this.fragment2str(result);
    
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: {
          type: 'renderPopUp',
          selectedText: selectedText,
          html: resultHTML
        }
      });
    });
  },

  fragment2str: function (frag) {
    var tmp = document.createElement('div');
    tmp.appendChild(frag);
    return tmp.innerHTML;
  },
  
};
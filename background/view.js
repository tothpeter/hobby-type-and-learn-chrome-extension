var newCardPopupView = {
  template: document.getElementById('new-card-popup-template'),

  init: function(selectedText) {
    var resultHTML = this.fragment2str(this.template.content);

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
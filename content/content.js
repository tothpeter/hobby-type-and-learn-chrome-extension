chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message.type === 'renderPopUp') {
    newCardPopup.init(request.message.selectedText, request.message.html);
  }
});

var newCardPopup = {
  popup: null,
  root: null,
  
  init: function(selectedText, html) {
    if (!this.$popup) {
      this.$popup = document.createElement('div');
      this.$popup.id = "type-and-learn-new-card-popup";

      this.root = this.$popup.createShadowRoot();
      this.root.innerHTML = html;
      // this.root.innerHTML = "HTMLString: " + selectedText;

      document.body.appendChild(this.$popup);
    }
  }
}

// newCardPopup.init();
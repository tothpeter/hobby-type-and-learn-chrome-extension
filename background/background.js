// Init context menu
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: 'Add to Type and Learn',
    contexts: ['selection'],
    id: 'context-tal-create-card'
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  newCardPopupView.init(info.selectionText);
});
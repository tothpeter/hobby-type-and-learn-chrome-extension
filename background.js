// Init context menu
chrome.contextMenus.create({
  title: 'Add to Type and Learn',
  contexts: ['selection'],
  id: 'context-tal-create-card'
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log(info);
  console.log(tab);

  var sText = info.selectionText;

  console.log(info.selectionText);
});
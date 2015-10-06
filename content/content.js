chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message.type === 'renderPopUp') {
    newCardPopup.init(request.message.html);
  }
});

var newCardPopup = {
  popup: null,
  root: null,
  
  init: function(html) {
    if (!this.$popup) {
      this.$popup = document.createElement('div');
      this.$popup.id = "type-and-learn-new-card-popup";

      this.root = this.$popup.createShadowRoot();
      this.root.innerHTML = html;

      document.body.appendChild(this.$popup);

      this.bindEvents();
    }
  },

  bindEvents: function() {
    var $wrapper = $(this.root).find('#new-card-popup-wrapper');
    
    $wrapper.submit(function(event) {
      event.preventDefault();
      var params = {
        sideA: $wrapper.find('#input-side-a').val(),
        sideB: $wrapper.find('#input-side-b').val(),
        proficiencyLevel: $wrapper.find('#input-proficiency-level').val()
      }

      Card.create(params);
    });
  }
}

var Adapter = {
  host: 'http://type-and-learn-api.dev'
}

var Card = {
  create: function(params) {
    chrome.storage.sync.get({
      token: null
    }, function(items) {
      $.ajax({
        method: 'post',
        url: Adapter.host + '/cards',
        data: {data: {attributes: params}},
        beforeSend: function(request) {
          request.setRequestHeader('Authorization', 'Token token="' + items.token + '"');
        }
      })
      .done(function() {
        console.log("success");
      })
      .fail(function(xhr) {
        if (xhr.status === 422) {
          var response = JSON.parse(xhr.responseText);
          alert('Validation error');
        }
        else {
          alert('Something went wrong on our servers, please try later.');
        }
      })
      .always(function() {
        console.log("complete");
      });
    });
  }
}
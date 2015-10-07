chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message.type === 'openPopUp') {
    newCardPopup.init(request.message.templateHTML, request.message.selectedText);
  }
});

var newCardPopup = {
  root: null,
  $wrapper: null,
  
  init: function(templateHTML, selectedText) {
    if (!this.$wrapper) {
      var popup = document.createElement('div');
      popup.id = "type-and-learn-new-card-popup";

      this.root = popup.createShadowRoot();
      this.root.innerHTML = templateHTML;

      document.body.appendChild(popup);
      this.$wrapper = $(this.root).find('#new-card-popup-wrapper');

      this.bindEvents();
    }
    
    this.open(selectedText);
  },

  open: function(selectedText) {
    this.$wrapper.find('#input-side-a, #input-side-b').val(selectedText).eq(0).focus();
    this.$wrapper.addClass('open');
  },

  close: function() {
    this.$wrapper.removeClass('open');
  },

  bindEvents: function() {
    var _this = this;

    this.$wrapper.submit(function(event) {
      event.preventDefault();
      var params = {
        sideA: _this.$wrapper.find('#input-side-a').val(),
        sideB: _this.$wrapper.find('#input-side-b').val(),
        proficiencyLevel: _this.$wrapper.find('#input-proficiency-level').val()
      }

      _this.disableForm();
      Card.create(params);
    });

    this.$wrapper.on('click', function(event) {
      if ($(event.target).data('dismiss') === 'modal') {
        event.preventDefault();
        _this.close();
      }
    });

    this.$wrapper.on('keydown', function(event) {
      if (event.which == 27) {
        event.preventDefault();
        _this.close();
      }
    });
  },

  enableForm: function(clear) {
    this.$wrapper.find('#input-side-a').removeAttr('disabled');
    this.$wrapper.find('#input-side-b').removeAttr('disabled');
    this.$wrapper.find('#input-proficiency-level').removeAttr('disabled');
    this.$wrapper.find('#btn-create-card').removeAttr('disabled');

    if (clear === true) {
      this.$wrapper.find('#input-side-a, #input-side-b').val('').eq(0).focus();
      this.$wrapper.find('#input-proficiency-level option:first-child')[0].selected = true;
    }
  },

  disableForm: function() {
    this.$wrapper.find('#input-side-a').attr('disabled', true);
    this.$wrapper.find('#input-side-b').attr('disabled', true);
    this.$wrapper.find('#input-proficiency-level').attr('disabled', true);
    this.$wrapper.find('#btn-create-card').attr('disabled', true);
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
        newCardPopup.enableForm(true);
      });
    });
  }
}
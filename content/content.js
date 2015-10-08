chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message.type === 'openPopUp') {
    newCardPopup.init(request.message.templateHTML, request.message.selectedText);
  }
});

var newCardPopup = {
  root: null,
  $wrapper: null,
  shouldValidate: false,
  
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
    this.$wrapper.find('.has-error').removeClass('has-error');
    this.shouldValidate = false;
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
      _this.shouldValidate = true;
      
      if (!_this.validate()) {
        return false;
      }

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
        event.stopPropagation();
        _this.close();
      }
    });

    this.$wrapper.on('keyup', function() {
      if (_this.shouldValidate) {
        _this.validate();
      }

    });
  },

  enableForm: function(clear) {
    this.$wrapper.find('#input-side-a').removeAttr('disabled');
    this.$wrapper.find('#input-side-b').removeAttr('disabled');
    this.$wrapper.find('#input-proficiency-level').removeAttr('disabled');
    this.$wrapper.find('#btn-create-card').removeAttr('disabled');
    
    this.$wrapper.find('.loading-message-wrapper').removeClass('active');

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
    this.$wrapper.find('.loading-message-wrapper').addClass('active');
  },

  validate: function() {
    var result = true,
        $inputSideA = this.$wrapper.find('#input-side-a'),
        $inputSideB = this.$wrapper.find('#input-side-b');

    if ($inputSideA.val() === '') {
      $inputSideA.parent().addClass('has-error');
      if (!$inputSideB.is(':focus')) {
        $inputSideA.focus();
      }

      result = false;
    }
    else {
      $inputSideA.parent().removeClass('has-error');
    }

    if ($inputSideB.val() === '') {
      result = false;
      $inputSideB.parent().addClass('has-error');
      
      if (!$inputSideA.is(':focus')) {
        $inputSideB.focus();
      }
    }
    else {
      $inputSideB.parent().removeClass('has-error');
    }

    return result;
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
        newCardPopup.enableForm(true);
        console.log("success");
      })
      .fail(function(xhr) {
        if (xhr.status === 422) {
          var response = JSON.parse(xhr.responseText);
          alert('Validation error');
        }
        else if (xhr.status === 401) {
          Session.invalidate();
          alert('You are not logged in, please log in (use the icon above).');
        }
        else {
          alert('Something went wrong on our servers, please try later.');
        }

        newCardPopup.enableForm();
      });
    });
  }
}
Session.isAuthenticated().then(
  function() {
    $('.panel-logged-in').addClass('active');
  },
  function() {
    $('.panel-login').addClass('active');
  }
);

$('#login-form').submit(function(event) {
  event.preventDefault();
  Notification.hide();

  const credentials = {
    email: $('#email').val(),
    password: $('#password').val()
  }

  Session.authenticate(credentials).then(
    function() {
      $('.panel-login').removeClass('active');
      $('.panel-logged-in').addClass('active');
    },
    function(xhr) {
      if (xhr.status === 401) {
        $('#email').focus();
        Notification.error('Invalid email or password.');
      }
      else if (xhr.status >= 500) {
        Notification.error('Something went wrong on our servers, please try later.');
      }
      else {
        Notification.error('Something went wrong, please try later.');
      }
    }
  );
});

$('body').on('keydown', function() {
  Notification.hide();
});


$('#btn-log-out').click(function() {
  Session.invalidate();
  $('.panel-login').addClass('active');
  $('.panel-logged-in').removeClass('active');
});

var Notification = {
  $container: $('#notification-wrapper'),
  $message: $('#notification-wrapper .message'),

  error: function(message) {
    this.$message.text(message);
    this.$container.addClass('error visible');
  },

  hide: function() {
    this.$container.removeClass('visible');
  }
}
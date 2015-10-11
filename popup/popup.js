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
        alert('Invalid email or password');
      }
      else if (xhr.status >= 500) {
        alert('Something went wrong on our servers, please try later.');
      }
      else {
        alert('Something went wrong, please try later.');
      }
    }
  );
});

$('#btn-log-out').click(function() {
  Session.invalidate();
  $('.panel-login').addClass('active');
  $('.panel-logged-in').removeClass('active');
});
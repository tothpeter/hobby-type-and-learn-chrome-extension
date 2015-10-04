var statusDisplay = null;

function login() {
    event.preventDefault();

    var postUrl = 'http://type-and-learn-api.dev/sessions/login_chrome_plugin',
        xhr = new XMLHttpRequest();
    
    var email = encodeURIComponent(document.getElementById('email').value),
        password = encodeURIComponent(document.getElementById('password').value);

    var params = 'user[email]=' + email + '&user[password]=' + password;

    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        statusDisplay.innerHTML = '';
        if (xhr.status >= 200 && xhr.status < 300) {
          var response = JSON.parse(xhr.response);
          // console.log(response.user);
        }
        else {
          statusDisplay.innerHTML = 'Error: ' + xhr.statusText;
        }
      }
    };
    
    xhr.send(params);
    statusDisplay.innerHTML = 'Working...';
}

window.addEventListener('load', function(evt) {
  statusDisplay = document.getElementById('status-display');

  document.getElementById('debug').addEventListener('click', function() {
    location.reload(true);
  });

  document.getElementById('login-form').addEventListener('submit', login);
});
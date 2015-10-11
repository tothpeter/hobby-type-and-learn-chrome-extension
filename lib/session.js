var Session = function() {
  var self = this;

  this.create = function create(token, user) {
    chrome.storage.sync.set({
      token: token,
      user: JSON.stringify(user)
    });
  }

  function authToken() {
    var promise = new Promise(function(resolve, reject) {
      chrome.storage.sync.get({
        token: null
      }, function(items) {
        resolve(items.token)
      });
    });

    return promise;
  }

  this.currentUser = function currentUser() {
    var promise = new Promise(function(resolve, reject) {
      chrome.storage.sync.get({
        user: null
      }, function(items) {
        if (items.user) {
          resolve();
        }
        else {
          reject();
        }
      });
    });

    return promise;
  }  

  this.isAuthenticated = function isAuthenticated() {
    var promise = new Promise(function(resolve, reject) {
      chrome.storage.sync.get({
        token: null
      }, function(items) {
        if (items.token) {
          resolve();
        }
        else {
          reject();
        }
      });
    });

    return promise;
  }

  this.authenticate = function authenticate(params) {
    var promise = new Promise(function(resolve, reject) {
      $.ajax({
        url: Adapter.host + '/sessions/login_chrome_plugin',
        type: 'POST',
        data: { 'user[email]': params.email, 'user[password]': params.password },
      })
      .done(function(response) {
        self.create(response.token, response.user);
        resolve();
      })
      .fail(function(xhr) {
        reject(xhr);
      });
    });

    return promise;
  }

  this.invalidate = function() {
    chrome.storage.sync.set({
      token: null,
      user: null
    });
  }
  
  return {
    authenticate: authenticate,
    isAuthenticated: isAuthenticated,
    invalidate: invalidate,
    currentUser: currentUser,
    authToken: authToken
  }
}();
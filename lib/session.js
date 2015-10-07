var Session = function() {

  this.create = function create(token, user) {
    chrome.storage.sync.set({
      token: token,
      user: JSON.stringify(user)
    }, function() {
      console.log("Token set");
    });
  }

  function authToken() {
    return localStorage.token;
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

  this.authenticate = function() {
    
  }

  this.invalidate = function() {
    chrome.storage.sync.set({
      token: null,
      user: null
    });
  }
  
  return {
    authenticate: authenticate,
    create: create,
    isAuthenticated: isAuthenticated,
    invalidate: invalidate,
    currentUser: currentUser,
    authToken: authToken
  }
}();
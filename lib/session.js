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

  this.currentUser = function currentUser(callback) {
    chrome.storage.sync.get({
      token: null,
      user: null
    }, function(items) {
      callback(items.user)

      console.log("Get set");
      console.log(items);
    });
  }  

  this.isAuthenticated = function isAuthenticated() {
    return localStorage.token !== undefined;
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
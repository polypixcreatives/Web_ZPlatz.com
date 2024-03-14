const firebaseConfig = {
  apiKey: "AIzaSyBIAg_71Rq-Ma6BZBlaqjZhW4uPfZ254tY",
  authDomain: "zplatz-database.firebaseapp.com",
  databaseURL: "https://zplatz-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zplatz-database",
  storageBucket: "zplatz-database.appspot.com",
  messagingSenderId: "371563563136",
  appId: "1:371563563136:web:21dab9cd363a2d055dbe65",
  measurementId: "G-P33J1TQJS3"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const provider = new firebase.auth.GoogleAuthProvider();

// Set up our register function
function register () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Invalid Email or Password')
    return
    // Don't continue running the code
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Get current date and time
    var now = new Date();
    var lastLoginDateTime = now.toLocaleString();

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : email,
      last_login: lastLoginDateTime
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)

    // Done
    alert('ZPlatz account created!')

    // Redirect to dashboard after successful account creation
     window.location.href = 'dashboard.html';
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })    
}

// Set up our login function
function login () {
  // Get all our input fields
  email = document.getElementById('sign-in-email').value
  password = document.getElementById('sign-in-password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Invalid Email or Password!')
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    var now = new Date();
    var lastLoginDateTime = now.toLocaleString();

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login: lastLoginDateTime
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)

    // Done
    alert('ZPlatz account successfully logged in!')

     // Redirect to dashboard after successful login
     window.location.href = 'dashboard.html';

  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

const googleLogin = document.getElementById("google-login-button");
googleLogin.addEventListener("click", function(){
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;

        // Get current date and time
        var now = new Date();
        var lastLoginDateTime = now.toLocaleString();

        // Retrieve email from the signed-in user
        var email = user.email;

        console.log("User:", user);
        console.log("Email:", email);

        // Add this user to Firebase Database
        var database_ref = database.ref()

        // Create User data
        var user_data = {
          email : email,
          last_login: lastLoginDateTime
        }

        console.log("User Data:", user_data);

        // Push to Firebase Database
        database_ref.child('users/' + user.uid).set(user_data)

        // Done
        alert('ZPlatz account successfully logged in!')

        // Redirect to dashboard after successful account creation
        // window.location.href = 'dashboard.html';


      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;

      });
})

const googleCreate = document.getElementById("google-create-button");
googleCreate.addEventListener("click", function(){
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;

        // Get current date and time
        var now = new Date();
        var lastLoginDateTime = now.toLocaleString();

        // Retrieve email from the signed-in user
        var email = user.email;

        console.log("User:", user);
        console.log("Email:", email);

        // Add this user to Firebase Database
        var database_ref = database.ref()

        // Create User data
        var user_data = {
          email : email,
          last_login: lastLoginDateTime
        }

        console.log("User Data:", user_data);

        // Push to Firebase Database
        database_ref.child('users/' + user.uid).set(user_data)

        // Done
        alert('ZPlatz account created!')

        // Redirect to dashboard after successful account creation
        // window.location.href = 'dashboard.html';

      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;

        console.error("Error:", errorMessage);
      });
})
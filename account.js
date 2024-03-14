function signInAccount() {
    login();
}

function registerAccount() {
    register();
}

function registerForm() {
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');

    if (registerForm.style.display === 'none') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    }
}

function loginForm() {
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');

    if (loginForm.style.display === 'none') {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}
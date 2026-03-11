document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    const userError = document.getElementById('user-error');
    const passError = document.getElementById('pass-error');
    const mainError = document.getElementById('main-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        usernameInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');
        userError.classList.add('hidden');
        passError.classList.add('hidden');
        mainError.classList.add('hidden');

        if (username.length < 3) {
            usernameInput.classList.add('input-error');
            userError.classList.remove('hidden');
            isValid = false;
        }

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasDigit = /\d/.test(password);

        if (password.length < 6 || !hasLetter || !hasDigit) {
            passwordInput.classList.add('input-error');
            passError.classList.remove('hidden');
            isValid = false;
        }

        if (isValid) {
            if (username === 'student1' && password === 'qwe123') {
                window.location.href = 'Student/dashboard-student.html';
            } else if (username === 'profesor1' && password === 'qwe123') {
                window.location.href = 'Profesor/dashboard-profesor.html';
            } else {
                mainError.classList.remove('hidden');
                usernameInput.classList.add('input-error');
                passwordInput.classList.add('input-error');
            }
        }
    });

    usernameInput.addEventListener('input', () => {
        usernameInput.classList.remove('input-error');
        userError.classList.add('hidden');
        mainError.classList.add('hidden');
    });

    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('input-error');
        passError.classList.add('hidden');
        mainError.classList.add('hidden');
    });
});
"use strict";
const Endpoints = {
    login: "http://localhost:3000/login",
    register: "http://localhost:3000/register",
    logout: "http://localhost:3000/logout",
    refreshToken: "http://localhost:3000/token",
    weatherLinks: "http://localhost:3000/weather",
};
const tabsLoginBox = {
    loginBoxColor: "rgb(59, 59, 59)",
    loginBoxNotchosenColor: "rgb(121, 120, 120)",
    loginBox: document.querySelector(".login-box__choose-tab__login"),
    registerBox: document.querySelector(".login-box__choose-tab__register"),
    loginForm: document.querySelector(".login-box__login-form"),
    registerForm: document.querySelector(".login-box__register-form"),
    clickedLogin: function () {
        if (this.registerBox === null ||
            this.loginBox === null ||
            this.loginForm === null ||
            this.registerForm === null)
            return "err";
        this.loginForm.style.visibility = "visible";
        this.registerForm.style.visibility = "hidden";
        this.registerBox.style.zIndex = "1";
        this.registerBox.style.backgroundColor = this.loginBoxNotchosenColor;
        this.registerBox.style.borderRadius = "10px 10px 0 10px";
        this.registerBox.style.cursor = "pointer";
        //
        this.registerBox.style.setProperty("--registerVisibility", "hidden");
        this.loginBox.style.backgroundColor = this.loginBoxColor;
        this.loginBox.style.cursor = "default";
        this.loginBox.style.borderRadius = "10px 10px 0 0";
        //
        this.loginBox.style.setProperty("--loginVisibility", "visible");
        this.loginBox.style.zIndex = "0";
    },
    clickedRegister: function () {
        if (this.registerBox === null ||
            this.loginBox === null ||
            this.loginForm === null ||
            this.registerForm === null)
            return "err";
        this.loginForm.style.visibility = "hidden";
        this.registerForm.style.visibility = "visible";
        this.loginBox.style.zIndex = "1";
        this.loginBox.style.cursor = "pointer";
        this.loginBox.style.backgroundColor = this.loginBoxNotchosenColor;
        this.loginBox.style.borderRadius = "10px 10px 10px 0";
        this.loginBox.style.setProperty("--loginVisibility", "hidden", "important");
        this.registerBox.style.backgroundColor = this.loginBoxColor;
        this.registerBox.style.cursor = "default";
        this.registerBox.style.borderRadius = "10px 10px 0 0";
        this.registerBox.style.setProperty("--registerVisibility", "visible");
        this.registerBox.style.zIndex = "0";
    },
};
function login() {
    const username = document.querySelector(".login-box__login-form__username");
    const password = document.querySelector(".login-box__login-form__password");
    if (username === null || password === null)
        return;
    const loginInfo = {
        username: username.value,
        password: password.value,
    };
    fetch(Endpoints.login, {
        method: "POST",
        body: JSON.stringify(loginInfo),
    }).then((response) => {
        // Handle the response
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        console.log(response.json());
    });
}

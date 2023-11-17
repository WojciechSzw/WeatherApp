const Endpoints = {
  login: "http://localhost:3000/login",
  register: "http://localhost:3000/register",
  logout: "http://localhost:3000/logout",
  refreshToken: "http://localhost:3000/token",
  weatherLinks: "http://localhost:3000/weather",
} as const;

let tokensData: { accessToken: string; refreshToken: string };

const tabsLoginBox = {
  loginBoxColor: "rgb(59, 59, 59)",
  loginBoxNotchosenColor: "rgb(121, 120, 120)",

  loginBox: document.querySelector<HTMLElement>(
    ".login-box__choose-tab__login"
  ),
  registerBox: document.querySelector<HTMLElement>(
    ".login-box__choose-tab__register"
  ),
  loginForm: document.querySelector<HTMLElement>(".login-box__login-form"),
  registerForm: document.querySelector<HTMLElement>(
    ".login-box__register-form"
  ),

  clickedLogin: function () {
    if (
      this.registerBox === null ||
      this.loginBox === null ||
      this.loginForm === null ||
      this.registerForm === null
    )
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
    if (
      this.registerBox === null ||
      this.loginBox === null ||
      this.loginForm === null ||
      this.registerForm === null
    )
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

const loginButton = document.querySelector(".login-box__login-form__submit");

function login() {
  const username = document.querySelector<HTMLInputElement>(
    ".login-box__login-form__username"
  );
  const password = document.querySelector<HTMLInputElement>(
    ".login-box__login-form__password"
  );
  if (username === null || password === null) return;
  const loginInfo = {
    username: username.value,
    password: password.value,
  };

  fetch(Endpoints.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  })
    .then((response) => {
      // Handle the response
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json() as Promise<{ accessToken: string }>;
    })
    .then((data) => {
      tokensData = data as any;
      getWeather();
    });
}

function getWeather() {
  console.log(tokensData.accessToken);
  console.log(tokensData.refreshToken);

  fetch(Endpoints.weatherLinks, {
    method: "GET",
    headers: {
      authorization: tokensData.accessToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
}

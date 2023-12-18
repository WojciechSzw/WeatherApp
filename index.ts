export const Endpoints = {
  login: "http://localhost:3000/login",
  register: "http://localhost:3000/register",
  logout: "http://localhost:3000/logout",
  refreshToken: "http://localhost:3000/token",
  weatherLinks: "http://localhost:3000/weather",
  weatherapi:
    "https://api.weatherapi.com/v1/forecast.json?key=7208f54d803847c09c1155442231811&q=city&days=5&aqi=no&alerts=no",
} as const;

let tokensData: { accessToken: string; refreshToken: string };

document.addEventListener("click", (event) => {
  if (
    (event?.target as HTMLElement).classList.contains(
      "login-box__choose-tab__register"
    )
  ) {
    tabsLoginBox.clickedRegister();
  }
  if (
    (event?.target as HTMLElement).classList.contains(
      "login-box__choose-tab__login"
    )
  ) {
    tabsLoginBox.clickedLogin();
  }
  if (
    (event?.target as HTMLElement).classList.contains(
      "login-box__login-form__submit"
    )
  ) {
    login();
  }
  if (
    (event?.target as HTMLElement).classList.contains(
      "login-box__register-form__submit"
    )
  ) {
    register();
  }
});

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
  wrongPassword: document.querySelector<HTMLElement>(
    ".login-box__login-form__wrongUsernamePassword"
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
      this.registerForm === null ||
      this.wrongPassword === null
    )
      return "err";
    this.wrongPassword.style.visibility = "hidden";
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

async function login() {
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

  await fetch(Endpoints.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  })
    .then((response) => {
      if (!response.ok) {
        document.querySelector<HTMLElement>(
          ".login-box__login-form__wrongUsernamePassword"
        )!.style.display = "block";
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
      // as Promise<{ accessToken: string }>;
    })
    .then((data) => {
      tokensData = data as any;
      localStorage.setItem("Ltoken", (data as any).accessToken);
      localStorage.setItem("RToken", (data as any).refreshToken);
      localStorage.setItem("backgroundImg", data.backgroundImg);
      localStorage.setItem("profileImg", data.profileImg);

      window.location.href = "weather.html";
    });
}

async function register() {
  const passwordsNotMatch = document.querySelector<HTMLElement>(
    ".login-box__register-form__passwordsNotMatch"
  );
  const accountCreated = document.querySelector<HTMLElement>(
    ".login-box__register-form__accountCreated"
  );
  const usernameInUse = document.querySelector<HTMLElement>(
    ".login-box__register-form__wrongUsernamePassword"
  );
  const username = document.querySelector<HTMLInputElement>(
    ".login-box__register-form__username"
  );
  const password = document.querySelector<HTMLInputElement>(
    ".login-box__register-form__password"
  );
  const password2 = document.querySelector<HTMLInputElement>(
    ".login-box__register-form__password2"
  );

  if (
    username === null ||
    password === null ||
    password2 === null ||
    usernameInUse === null ||
    accountCreated === null ||
    passwordsNotMatch === null
  )
    return;
  if (password.value !== password2.value) {
    usernameInUse.style.display = "none";
    passwordsNotMatch.style.display = "block";
    return;
  }

  const registerInfo = {
    username: username.value,
    password: password.value,
  };
  await fetch(Endpoints.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerInfo),
  })
    .then((response) => {
      if (!response.ok) {
        passwordsNotMatch.style.display = "none";
        usernameInUse.style.display = "block";
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json() as any;
    })
    .then((data) => {
      username.value = "";
      password.value = "";
      password2.value = "";
      passwordsNotMatch.style.display = "none";
      usernameInUse.style.display = "none";
      accountCreated.style.display = "block";
    });
}

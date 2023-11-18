import { tokensData } from "./index.js";
console.log(tokensData);
console.log("dupa");
// () => {
//   console.log(tokensData.accessToken);
//   console.log(tokensData.refreshToken);
//   fetch(Endpoints.weatherLinks, {
//     method: "GET",
//     headers: {
//       authorization: tokensData.accessToken,
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//     });
// };

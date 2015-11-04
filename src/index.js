import httpPromises from "http-promises";


const http = httpPromises
  .header("Authorization", `token ${ process.env.GITHUB_TOKEN }`)
  .header("User-Agent", "file-system-github");



console.log("calling github....");
http
  .get("https://api.github.com/user")
  .then(result => {
    console.log("result", result);
  });

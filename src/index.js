import httpPromises from "http-promises";


const http = httpPromises
  .header("Authorization", `token ${ process.env.GITHUB_TOKEN }`)
  .header("User-Agent", "file-system-github");


const get = (url) => {
  console.log("");
  console.log("calling github....");
  console.log(url);
  console.log("");
  http
    .get(`https://api.github.com/${ url }`)
    .then((result) => {
        console.log(result.data);
        console.log("");
    })
    .catch(err => console.log("err", err));
};



// get("user");
get("repos/philcockfield/file-system-github/contents/src?ref=master")
get("repos/philcockfield/file-system-github/contents/README.md?ref=master")

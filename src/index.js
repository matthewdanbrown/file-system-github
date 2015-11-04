import httpPromises from "http-promises";
import github from "./github-http";


const http = github("file-system-github", { authToken: process.env.GITHUB_TOKEN });



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

const foo;

// foo.copy()


// get("user");
get("repos/philcockfield/file-system-github/contents/src?ref=master")
console.log("-------------------------------------------");
get("repos/philcockfield/file-system-github/contents/README.md?ref=master")

"use strict";
import { expect } from "chai";
import githubPaths from "../../src/github-paths";
import githubHttp from "../../src/github-http";


// NOTE: This will work if the GITHUB_TOKEN is not present.
//       The rate-limit will be lower though, so when testing locally
//       if you run into a rate-limit problem add a token to your bash script.
//
//          https://github.com/settings/tokens
//
const http = githubHttp("file-system-github:test", { token: process.env.GITHUB_TOKEN });



describe("github-paths (integration)", function() {
  this.timeout(8 * 1000);
  let github;
  beforeEach(() => {
      github = githubPaths(http, "philcockfield/file-system-github");
  });



  it("retrieves files within folder (shallow)", (done) => {
    github.files("/test/sample", { deep: false })
    .then(result => {
        expect(result.files.length).to.equal(1);
        done();
    })
    .catch(err => console.error("ERROR", err));
  });


  it("retrieves files within folder (deep)", (done) => {
    github.files("/test/sample", { deep: true })
    .then(result => {
        expect(result.files.length).to.equal(6);
        expect(result.files[0].path).to.equal("test/sample/README.md");
        expect(result.files[1].path).to.equal("test/sample/folder/README.md");
        expect(result.files[2].path).to.equal("test/sample/folder/index.js");
        expect(result.files[3].path).to.equal("test/sample/folder/sub-folder-2/foo.js");
        expect(result.files[4].path).to.equal("test/sample/folder/sub-folder-1/astronaut.png");
        expect(result.files[5].path).to.equal("test/sample/folder/sub-folder-1/sub-folder-1a/README.md");
        done();
    })
    .catch(err => console.error("ERROR", err));
  });


  it("retrieves a single file", (done) => {
    github.files("/test/sample/README.md", { deep: false })
    .then(result => {
        expect(result.files.length).to.equal(1);
        expect(result.files[0].path).to.equal("test/sample/README.md");
        done();
    })
    .catch(err => console.error("ERROR", err));
  });


  it("rejects when path does not exist", (done) => {
    github.files("/this/is/not/a/path")
    .catch(err => {
        expect(err.message).to.contain("not/a/path");
        done()
    })
    .catch(err => console.error("ERROR", err));
  });
});

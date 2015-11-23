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



  it("retrieves files within folder (shallow)", () => {
    return github.files("/test/sample", { deep: false })
      .then(result => {
          expect(result.files.length).to.equal(1);
      });
  });


  it("retrieves files within folder (deep)", () => {
    return github.files("/test/sample", { deep: true })
      .then(result => {
          expect(result.files.length).to.equal(7);
      });
  });


  it("retrieves a single file", () => {
    return github.files("/test/sample/README.md", { deep: false })
      .then(result => {
          expect(result.files.length).to.equal(1);
          expect(result.files[0].path).to.equal("test/sample/README.md");
      });
  });


  it("rejects when path does not exist", (done) => {
    github.files("/this/is/not/a/path")
    .catch(err => {
        expect(err.message).to.contain("not/a/path");
        done()
    })
  });
});

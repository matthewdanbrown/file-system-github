"use strict";
import R from "ramda";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import githubRepo from "../../src/github-repo";


describe("github-repo (integration)", function() {
  this.timeout(8 * 1000);
  let repo;

  beforeEach(() => {
    // NOTE: This will work if the GITHUB_TOKEN is not present.
    //       The rate-limit will be lower though, so when testing locally
    //       if you run into a rate-limit problem add a token to your bash script.
    //
    //          https://github.com/settings/tokens
    //
    repo = githubRepo("file-system-github:test",
                      "philcockfield/file-system-github",
                      { token: process.env.GITHUB_TOKEN });
  });
  afterEach(() => fs.removeSync("./test/.temp"));



  it("throws if the user-agent is not specified", () => {
    expect(() => githubRepo(null, "user/my-repo")).to.throw();
  });


  it("throw if the repo is not specified", () => {
    expect(() => githubRepo("my-user-agent")).to.throw();
  });


  it("stores the repo name", () => {
    expect(githubRepo("my-user-agent", "user/my-repo").name).to.equal("user/my-repo");
  });


  it("retrieves paths", (done) => {
    repo.filePaths("/test/sample/README.md")
    .then(result => {
        expect(result.files[0].name).to.equal("README.md");
        done();
    })
    .catch(err => console.log("ERROR", err));
  });


  describe("copy", function() {
    it("copies a single file ('master' branch by default)", (done) => {
      repo.copy("/test/sample/README.md", "./test/.temp")
      .then(result => {
          const path = fsPath.join(result.base, result.files[0]);
          const content = fs.readFileSync(path).toString();
          expect(content).to.contain("# Sample README file.");
          expect(content).to.contain("Branch: master");
          done();
      })
      .catch(err => console.log("ERROR", err));
    });

    it("copies a single file (specified branch)", (done) => {
      repo.copy("/test/sample/README.md", "./test/.temp", { branch: "sample-test-branch" })
      .then(result => {
          const path = fsPath.join(result.base, result.files[0]);
          const content = fs.readFileSync(path).toString();
          expect(content).to.contain("# Sample README file.");
          expect(content).to.contain("Branch: sample-test-branch");
          done();
      })
      .catch(err => console.log("ERROR", err));
    });


    it("copies a set of files (deep)", (done) => {
      repo.copy("/test/sample", "./test/.temp")
      .then(result => {
          const path = fsPath.join(result.base, result.files.sort()[0]);
          const content = fs.readFileSync(path).toString();
          expect(content).to.contain("# Sample README file.");
          done();
      })
      .catch(err => console.log("ERROR", err));
    });
  });
});

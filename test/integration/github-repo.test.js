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
    .catch(err => console.error("ERROR", err));
  });


  describe("get", function() {
    it("gets a single file ('master' branch by default)", (done) => {
      repo.get("/test/sample/README.md")
      .then(result => {
          const file = result.files[0];
          expect(file.path).to.equal("README.md");
          expect(file.content).to.contain("# Sample README file.");
          expect(file.content).to.contain("Branch: master");
          expect(result.save).to.be.an.instanceof(Function);
          done();
      })
      .catch(err => console.error("ERROR", err));
    });


    it("copies a single file (specified branch)", (done) => {
      repo.get("/test/sample/README.md", { branch: "sample-test-branch" })
      .then(result => {
          const file = result.files[0];
          expect(file.path).to.equal("README.md");
          expect(file.content).to.contain("# Sample README file.");
          expect(file.content).to.contain("Branch: sample-test-branch");
          done();
      })
      .catch(err => console.error("ERROR", err));
    });


    it("copies a set of files (deep)", (done) => {
      repo.get("/test/sample")
      .then(result => {
          const files = R.sortBy(R.prop("path"), result.files);
          expect(files.length).to.equal(6);

          expect(files[0].path).to.equal("README.md");
          expect(files[0].content).to.contain("# Sample README file.");

          expect(files[1].path).to.equal("folder/README.md");
          expect(files[1].content).to.contain("# Test conflict with matching file-name");
          done();
      })
      .catch(err => console.error("ERROR", err));
    });
  });
});

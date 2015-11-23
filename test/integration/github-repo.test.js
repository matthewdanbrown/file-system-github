"use strict";
import R from "ramda";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import githubRepo from "../../src/github-repo";

const SAVE_PATH = "./test/.temp";
const decode = (value) => new Buffer(value, "base64").toString();


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
  afterEach(() => fs.removeSync(SAVE_PATH));



  it("throws if the user-agent is not specified", () => {
    expect(() => githubRepo(null, "user/my-repo")).to.throw();
  });


  it("throw if the repo is not specified", () => {
    expect(() => githubRepo("my-user-agent")).to.throw();
  });


  it("stores the repo name", () => {
    expect(githubRepo("my-user-agent", "user/my-repo").name).to.equal("user/my-repo");
  });


  it("retrieves paths", () => {
    return repo.filePaths("/test/sample/README.md")
      .then(result => {
          expect(result.files[0].name).to.equal("README.md");
      });
  });


  describe("get", function() {
    it("gets a single file ('master' branch by default)", () => {
      return repo.get("/test/sample/README.md")
        .then(result => {
            const file = result.files[0];
            expect(file.path).to.equal("README.md");
            expect(decode(file.content)).to.contain("# Sample README file.");
            expect(decode(file.content)).to.contain("Branch: master");
            expect(result.save).to.be.an.instanceof(Function);
        });
    });


    it("copies a single file (specified branch)", () => {
      return repo.get("/test/sample/README.md", { branch: "sample-test-branch" })
        .then(result => {
            const file = result.files[0];
            expect(file.path).to.equal("README.md");
            expect(decode(file.content)).to.contain("# Sample README file.");
            expect(decode(file.content)).to.contain("Branch: sample-test-branch");
        });
    });


    it("copies a set of files (deep)", () => {
      return repo.get("/test/sample")
        .then(result => {
            const files = R.sortBy(R.prop("path"), result.files);
            expect(files.length).to.equal(7);

            expect(files[0].path).to.equal("README.md");
            expect(decode(files[0].content)).to.contain("# Sample README file.");

            expect(files[1].path).to.equal("folder/README.md");
            expect(decode(files[1].content)).to.contain("# Test conflict with matching file-name");
        })
    });
  });


  describe("save files", function() {
    it("saves a text file", () => {
      return repo.get("/test/sample/folder/index.js")
        .then(files => {
          return files.save(SAVE_PATH)
            .then(result => {
                const savedContent = fs.readFileSync("./test/.temp/index.js").toString();
                const originalContent = fs.readFileSync("./test/sample/folder/index.js").toString();
                expect(savedContent).to.equal(originalContent);
            });
        });
    });

    it("saves an image", () => {
      return repo.get("/test/sample/folder/octocat.jpg")
        .then(files => {
          return files.save(SAVE_PATH)
            .then(result => {
                const savedContent = fs.readFileSync("./test/.temp/octocat.jpg").toString();
                const originalContent = fs.readFileSync("./test/sample/folder/octocat.jpg").toString();
                expect(savedContent).to.equal(originalContent);
            });
        });
    });
  });
});

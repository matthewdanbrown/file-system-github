"use strict";
import R from "ramda";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import repoFiles from "../src/repo-files";


const encode = (value) => new Buffer(value).toString("base64");


describe("repo-files", function() {
  afterEach(() => fs.removeSync("./test/.temp"));


  it("has a given set of files", () => {
    const repo = repoFiles([
      { path: "/one", content: "one" },
      { path: "/two", content: "two" }
    ]);
    expect(repo.files[0].path).to.equal("/one");
    expect(repo.files[1].content).to.equal("two");
  });


  describe("save", function() {
    let repo;
    beforeEach(() => {
      repo = repoFiles([
        { path: "README.md", content: encode("# Title") },
        { path: "/folder/index.js", content: encode("var foo = 123;") }
      ]);
    });


    it("throws if a 'targetFolder' is not specified", () => {
      expect(() => repo.save()).to.throw();
    });


    it("saves files to disk", () => {
      return repo.save("./test/.temp")
        .then(result => {
            const files = result.files.sort();
            const content = (path) => fs.readFileSync(fsPath.resolve(path)).toString();
            expect(content(files[0])).to.contain("# Title");
            expect(content(files[1])).to.contain("var foo = 123;");
        });
    });
  });
});

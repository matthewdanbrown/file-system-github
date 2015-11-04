"use strict";
import { expect } from "chai";
import githubFs from "../../src/github-fs";


describe("github-fs (integration)", function() {

  it("throws if the user-agent is not specified", () => {
    expect(() => githubFs(null, "user/my-repo")).to.throw();
  });


  it("throw if the repo is not specified", () => {
    expect(() => githubFs("my-user-agent")).to.throw();
  });


  it("stores the repo name", () => {
    expect(githubFs("my-user-agent", "user/my-repo").repo).to.equal("user/my-repo");
  });


  it.skip("passes through from root 'fs' API", () => {

  });


});

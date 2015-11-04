"use strict";
import { expect } from "chai";
import githubRepo from "../../src/github-repo";


describe("github-repo (integration)", function() {

  it("throws if the user-agent is not specified", () => {
    expect(() => githubRepo(null, "user/my-repo")).to.throw();
  });


  it("throw if the repo is not specified", () => {
    expect(() => githubRepo("my-user-agent")).to.throw();
  });


  it("stores the repo name", () => {
    expect(githubRepo("my-user-agent", "user/my-repo").repo).to.equal("user/my-repo");
  });


  it.skip("passes through from root 'fs' API", () => {

  });


});

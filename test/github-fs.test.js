"use strict";
import { expect } from "chai";
import githubFs from "../src/github-fs";


describe("github-fs", function() {
  it("throws if the user-agent is not specified", () => {
    expect(() => githubFs()).to.throw();
  });
});

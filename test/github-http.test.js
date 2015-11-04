"use strict";
import { expect } from "chai";
import githubHttp from "../src/github-http";


describe("github-http", function() {
  it("throws if the user-agent is not specified", () => {
    expect(() => githubHttp()).to.throw();
  });

  it("has the user-agent set as a header", () => {
    const http = githubHttp("my-app");
    expect(http.headers["User-Agent"]).to.equal("my-app");
  });

  it("does not have an authorization token", () => {
    const http = githubHttp("my-app", { authToken: 'a12345' });
    expect(http.headers["Authorization"]).to.equal("token a12345");
  });
});

import R from "ramda";
import githubHttp from "./github-http";
import githubPaths from "./github-paths";




/**
 * A representation of a Github repository.
 *
 * @param {string} userAgent: The callers Github username or application name.
 * @param {string} repo:      The repository, eg: "username/my-repo"
 * @param {object} options:
 *                    - token: The authorization token to use for calls to
 *                             restricted resources.
 *                             see: https://github.com/settings/tokens
 */
export default (userAgent, repo, options = {}) => {
  const http = githubHttp(userAgent, options);

  // Ensure the repository was specified.
  if (!R.is(String, repo) || R.isEmpty(repo)) {
    throw new Error("A repository must be specific, eg: 'username/my-repo'.");
  }


  // API.
  return {
    repo,
    // filePaths: (path, options) => githubPaths(http).paths(repo, path, options)
  };
};

import R from "ramda";
import githubHttp from "./github-http";


/**
 * An [http-promises] object initialized with github user-agent.
 * @param {string} userAgent: The callers Github username or application name.
 * @param {object} options:
 *                    - authToken: The authorization token to use for calls to
 *                                 restricted resources.
 *                                 see: https://github.com/settings/tokens
 */
export default (userAgent, options = {}) => {
  const http = githubHttp(userAgent, options);
  return {


  };
};

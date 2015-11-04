import R from "ramda";
import httpPromises from "http-promises";


/**
 * An [http-promises] object initialized with github user-agent.
 * @param {string} userAgent: The callers Github username or application name.
 * @param {object} options:
 *                    - token: The authorization token to use for calls to
 *                             restricted resources.
 *                             see: https://github.com/settings/tokens
 */
export default (userAgent, options = {}) => {
  // Setup the user-agent.
  if (!R.is(String, userAgent) || R.isEmpty(userAgent)) {
    throw new Error("The github API user-agent must be specified.  See: https://developer.github.com/v3/#user-agent-required");
  }
  let http = httpPromises.header("User-Agent", userAgent);

  // Add authorization.
  const token = options.token;
  if (!R.isNil(token)) {
    http = http.header("Authorization", `token ${ token }`);
  }

  // Finish up.
  return http;
};

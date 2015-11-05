import R from "ramda";
import fs from "fs-extra";
import fsPath from "path";
import githubHttp from "./github-http";
import githubPaths from "./github-paths";
import Promise from "bluebird";



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


  const filePaths = (path, options) => githubPaths(http, repo).files(path, options);


  /**
   * Copies files from the remote repository to the given path.
   *
   * @param {string} entryPath:   The path within the repository to copy.
   *                              Pass "/" or nothing to copy from root.
   * @param {string} targetPath:  The local path to copy to.
   * @param {object} options:
   *                    - deep:   Flag indicating if the folder structure should
   *                              be recursively retrieved.
   *                              Default: true.
   *                    - branch: The branch to query.
   *                              Default: "master".
   * @return {Promise}
   */
  const copy = (entryPath, targetPath, options = {}) => {
    // Setup initial conditions.
    const deep = options.deep === undefined ? true : options.deep;
    targetPath = fsPath.resolve(targetPath);

    return new Promise((resolve, reject) => {
        const saveFile = (path, content) => {
            return new Promise((resolve, reject) => {
                const saveTo = fsPath.join(targetPath, path);
                fs.outputFile(saveTo, content, (err) => {
                  if (err) { reject(err); } else { resolve(); }
                });
              });
            };

        const downloadFile = (url) => {
              return new Promise((resolve, reject) => {
                http.get(url)
                  .then(result => resolve(result.data))
                  .catch(err => reject(err));
              });
            };

        // Retrieve paths then save the files.
        filePaths(entryPath, options)
          .then(result => {
            let savedCount = 0;
            const saved = { base: targetPath, files: [] };
            const onSaved = (path) => {
                  savedCount += 1;
                  saved.files.push(path)
                  if (savedCount == result.files.length) { resolve(saved); }
                };
            result.files.forEach(file => {
                  downloadFile(file.download_url)
                  .then(content => {
                      saveFile(file.path, content)
                      .then(() => onSaved(file.path))
                      .catch(err => reject(err));
                  })
                  .catch(err => reject(err));
                });
          })
          .catch(err => reject(err));
    });
  };

  // API.
  return { name: repo, filePaths, copy };
};

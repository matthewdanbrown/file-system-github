import R from "ramda";
import fs from "fs-extra";
import Promise from "bluebird";
import fsPath from "path";
import githubHttp from "./github-http";
import githubPaths from "./github-paths";
import repoFiles from "./repo-files";



const removeRootSlash = (path) => path.replace(/^\//, "");
const trimmedFolderPath = (path, entryFolder) => {
    path = path.replace(new RegExp(`${ entryFolder }`), "");
    path = fsPath.dirname(path);
    path = removeRootSlash(path);
    return path;
  };



const trimEntryPath = (entryPath, files) => {
    files = R.clone(files);
    let entryFolder = entryPath;
    if (files.length === 1 && files[0].type === "file") {
      // A single file was downloaded.
      // Extract the directory part of the string.
      entryFolder = fsPath.dirname(entryFolder);
    }
    entryFolder = removeRootSlash(entryFolder);
    files.forEach(file => file.folder = trimmedFolderPath(file.path, entryFolder));
    return files;
  };


const decode = (value) => {
    if (value) {
      return new Buffer(value, "base64").toString();
    }
  };



/**
 * A representation of a Github repository.
 *
 * @param {string} userAgent: The caller's Github username or application name.
 *                            See: https://developer.github.com/v3/#user-agent-required
 *
 * @param {string} repo:      The repository, eg: "username/my-repo"
 *
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
  const get = (entryPath, options = {}) => {
    // Setup initial conditions.
    const deep = options.deep === undefined ? true : options.deep;
    entryPath = entryPath || "/";

    // Download an individual file.
    const downloadedFiles = [];
    const downloadFile = (file) => {
          return new Promise((resolve, reject) => {
            const done = (content) => {
                  const item = {
                    content, // Base64 encoded.
                    path: fsPath.join(file.folder, file.name),
                    toString: () => decode(content)
                  };
                  downloadedFiles.push(item);
                  resolve(item);
            };

            if (file.content) {
              // The content is already downloaded.
              done(file.content);
            } else {
              // Content not included within payload. Download it now.
              http.get(file.url)
                .then(result => done(result.data.content))
                .catch(err => reject(err));
            }
          });
        };

    // Retrieve paths then retrieve each to memory.
    return new Promise((resolve, reject) => {
        filePaths(entryPath, options)
          .then(result => {
            // Trim entry-folder from the start of the retrieved file paths.
            const files = trimEntryPath(entryPath, result.files);
            const onFileDownloaded = () => {
                  if (downloadedFiles.length === files.length) {
                    resolve(repoFiles(downloadedFiles));
                  }
                };

            // Download files.
            files.forEach(file => {
                  downloadFile(file)
                    .then(content => onFileDownloaded())
                    .catch(err => reject(err));
                });
          })
          .catch(err => reject(err));
    });
  };


  // API.
  return { name: repo, filePaths, get };
};

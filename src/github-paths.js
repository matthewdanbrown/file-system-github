import R from "ramda";
const filesOnly = R.filter(item => item.type === "file");
const foldersOnly = R.filter(item => item.type === "dir");
import Promise from "bluebird";


/**
 * Methods for recursively retrieveing path details about a repository.
 *
 * @param http: The {GithubHttp} object.
 * @param repo: The name of the repository, eg: "bob/my-repo".
 */
export default (http, repo) => {
  if (!http) { throw new Error("A valid github [http] object must be supplied."); }
  if (!R.is(String, repo) || R.isEmpty(repo)) { throw new Error("A repository must be specified, eg: 'username/my-repo'."); }
  const get = (path) => http.get(`https://api.github.com/${ path }`);


  /**
   * Retrieves the flat array of paths to content starting at the given
   * entry point.
   *
   * @param {string} path: The entry path from the root of the repo, to
   *                       either a file of folder.
   *                       eg: "/src"
   *                       Default reads from the root of the repo.
   * @param {object} options:
   *                    - deep:   Flag indicating if the folder structure should
   *                              be recursively retrieved.
   *                              Default: true.
   *                    - branch: The branch to query.
   *                              Default: "master".
   *
   * @return {Promise} => flat array of files
   */
  const getFilePaths = (path, options = {}) => {
    // Setup initial conditions.
    path = path.replace(/^\//, ""); // Remove initial forward-slash.
    const deep = options.deep === undefined ? true : options.deep;
    const branch = options.branch || "master";

    const getChildFiles = (items) => {
      return new Promise((resolve, reject) => {
            // Filter by type.
            let files = filesOnly(items);
            const folders = foldersOnly(items);
            const done = () => resolve({ files });

            // Add child items
            let totalFoldersProcessed = 0;
            const addChildren = (items = []) => {
              totalFoldersProcessed += 1;
              files = R.union(files, items);
              if (totalFoldersProcessed >= folders.length) { done(); }
            };

            // Retrieve each folder's children.
            if (folders.length === 0) {
              done(); // No children to process.
            } else {
              folders.forEach(folder => {
                    getFilePaths(folder.path, options) // <== RECURSION.
                        .then(result => addChildren(result.files))
                        .catch(err => reject(err));
                  });
            }
      });
    };

    // See: https://developer.github.com/v3/repos/contents/
    return new Promise((resolve, reject) => {
        const url = `repos/${ repo }/contents/${ path || "" }?ref=${ branch }`;
        get(url)
        .then(result => {
            let data = result.data;
            if (R.is(Array, data)) {
              // A collection of files...
              if (deep) {
                resolve(getChildFiles(data)); // ...process the child-folders.
              } else {
                resolve({ files: filesOnly(data) }); // ...deep scan not required.
              }
            } else {
              resolve({ files: [data] }); // Single file.
            }
        })
        .catch(err => reject({
          message: `Failed to retrieve file-paths at url: ${ url }`,
          error: err
        }));
    });
  };

  // API.
  return { files: getFilePaths };
};

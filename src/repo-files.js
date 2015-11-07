import R from "ramda";
import fs from "fs-extra";
import fsPath from "path";


const saveFile = (path, content) => {
    return new Promise((resolve, reject) => {
        fs.outputFile(path, content, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };



/**
 * Saves the collection of files to disk.
 * @param {string} targetFolder: The path to the folder to save the files within.
 * @return {Promise}
 */
const save = (files, targetFolder) =>  {
    if (R.isNil(targetFolder) || R.isEmpty(targetFolder)) { throw new Error("A target folder must be specified."); }
    return new Promise((resolve, reject) => {
        let savedPaths = []
        const onSaved = (path) => {
              savedPaths.push(path);
              if (savedPaths.length === files.length) {
                resolve({ files: savedPaths });
              }
            };

        files.forEach(file => {
            const path = fsPath.join(targetFolder, file.path);
            saveFile(path, file.content)
              .then(() => onSaved(path))
              .catch(err => reject(err));
        });
    });
  };



/**
 * Represents a repository of files (in-memory).
 * @param {array} files: Set of { path, content } file objects.
 */
export default (files) => {
  return {
    files,
    save: (targetFolder) => save(files, targetFolder)
  };
};

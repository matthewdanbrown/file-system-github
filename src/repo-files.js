import R from "ramda";

/**
 * Represents a repository of files (in-memory).
 * @param {array} files: Set of { path, content } file objects.
 */
export default (files) => {
  return {
    files,

    /**
     * Saves the collection of files to disk.
     * @return {Promise}
     */
    save() {
      // TODO
    }
  };
};

# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [1.1.0]
#### Added
- `.get()` to retrieve a remote repos files in memory.
- `.save()` method on the result of the `.get` call to persist files to disk.

#### Changed
- When an entry path is specified to `.copy()` the resulting files are copied into the root of the `target` folder.

- Removed `copy` method (in favor of the `.get().save()` chain).


## [1.0.0] - 2015-11-5
#### Added
- Connect to a repo, optionally authenticating, and make calls against the REST api.
- Retrieves a deep set of paths for files within a repo, starting at any place within the repo.
- Copy files to the local file system.
- Optionally copy based on specified branch.

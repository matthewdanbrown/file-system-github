# file-system-github
[![Build Status](https://travis-ci.org/philcockfield/file-system-github.svg)](https://travis-ci.org/philcockfield/file-system-github)

File-system synchronization with a remote repository on Github.


## Usage

Create a repository connector:
```js
const GITHUB_TOKEN = process.env.GITHUB_TOKEN // See: https://github.com/settings/tokens
const repo = github.repo(
  "my-user-agent",
  "philcockfield/app-sync",
  { token: GITHUB_TOKEN }
);
```

Get and save a single file on the `master` branch:

```js
repo.get("/README.md")
  .then(result => {
    // File(s) returned as in-memory array.
    // Save the files to disk by using the save method:    
    return result.save("/path/to/save/to");
  });

```

Get and save an entire repository on the `devel` branch:

```js

repo.get("/", { branch: "devel" })
  .then(result => {
    return result.save("/path/to/save/to");
  });


```




## Test
    # Run tests.
    npm test

    # Watch and re-run tests.
    npm run tdd


---
### License: MIT

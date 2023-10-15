# Contributing

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![SemVer](https://img.shields.io/badge/SemVer-v2.0.0-green)](https://semver.org/spec/v2.0.0.html)


When contributing to this repository, it is usually a good idea to first discuss the change you
wish to make via issue, email, or any other method with the owners of this repository before
making a change. This could potentially save a lot of wasted hours.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Development

To obtain the source simply clone our git

```bash
git clone https://git.qoto.org/fedipage/fedipage
```

### Trigger post deploy

Typically every 5 minutes the server will call send-note automatically. However
you can trigger it manually with the following code.

```
curl -G -X POST --data-urlencode token="<token>" https://<your domain>/send-note
```
Keep in mind the POLL_MILLISECONDS env variable acts as a guard against this
being called too often. You will need to set this to a low value for debugging.

### Release Process

Make sure the version is correct in the following locations:
* `/api/nodeinfo/2.1.ts`
* `/CHANGELOG.md`

Consider updating dependencies in `/package.json`.

Optionally: Create a news post announcing the release of the new version.

Now just create the git tag for the new version and push it.

```bash
git tag -a "v1.0.0" "Release version 1.0.0"
git push origin v1.0.0:v1.0.0
```

Now bump all the versions to the next patch version in the two files listed
above and push that to master.

### Commit Message Format

All commits on the repository repository follow the
[Conventional Changelog standard](https://github.com/conventional-changelog/conventional-changelog-eslint/blob/master/convention.md).
It is a very simple format so you can still write commit messages by hand. However it is
recommended developers install [Commitizen](https://commitizen.github.io/cz-cli/),
it extends the git command and will make writing commit messages a breeze.

Getting Commitizen installed is usually trivial, just install it via npm. You will also
need to install the cz-customizable adapter which the this repository is configured
to use. However the format is simple enough to use manually this makes it easier not to forget,
especially for developers not accustomed to the format yet.

```bash

npm install -g commitizen@2.8.6 cz-customizable@4.0.0
```

Below is an example of Commitizen in action. It replaces your usual `git commit` command
with `git cz` instead. The new command takes all the same arguments however it leads you
through an interactive process to generate the commit message.

![Commitizen friendly](http://aparapi.com/images/commitizen.gif)

Commit messages are used to automatically generate detailed changelogs, and to ensure
commits are searchable in a useful way. So please use the Commitizen tool or adhere to
the commit message standard or else we cannot accept Pull Requests without editing
them first.

Below is an example of a properly formated commit message.

```
chore(commitizen): Made repository Commitizen friendly.

Added standard Commitizen configuration files to the repo along with all the custom rules.

ISSUES CLOSED: #31
```

### Pull Request Process

1. Ensure that install or build dependencies do not appear in any commits in your code branch.
2. Ensure all commit messages follow the [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog-eslint/blob/master/convention.md)
   standard explained earlier.
3. Update the CONTRIBUTORS.md file to add your name to it if it isn't already there (one entry
   per person).
4. Adjust the project version to the new version that this Pull Request would represent. The
   versioning scheme we use is [Semantic Versioning](http://semver.org/).
5. Your pull request will either be approved or feedback will be given on what needs to be
   fixed to get approval. We usually review and comment on Pull Requests within 48 hours.

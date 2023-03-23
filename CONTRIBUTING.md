---
title: Contributing
description: Thank you for contributing to saboteur-ts! Here's everything you need to know before you open a pull request.
---

# Contributing

Our goal is for development to be steady, stable, and open.
We can't do that without our wonderful community of users!

This document will familiarize you with our development process as well as how to get your environment set up.

**To ensure your work has the best chance of being accepted, please read this before contributing anything!**

## Roles

This document refers to contributors with the following roles:

- **Admins**: GitHub organization team with admin rights, they set and manage the Roadmap.
- **Collaborators**: GitHub organization team with write access. They manage issues, PRs, discussion, etc.
- **Contributors**: you!

---

## Development Process

### Feature Development

If you have an idea for a new feature, please don't send a Pull Request, but follow this process instead:

1. Contributors add a **Ideas** to [GitHub Discussions][ideas].
2. The **Admin Team** accepts Ideas in the **Roadmap Planning** meeting.
3. The Admins assign an **Owner** to the issue.
   - Owners are responsible for shipping the feature including all decisions for APIs, behavior, and implementation.
   - Owners organize the work with other contributors for larger issues.
   - Owners may be contributors from inside or outside of the team.
4. Owners create an **RFC** from the Proposal and development can begin.
5. Pairing is highly encouraged, particularly at the start.

### Bug-Fix Pull Requests

If you think you've found a bug we'd love a PR that fixes it! Please follow these guidelines:

1. Contributors add a failing test along with the fix in a Pull Request
   - It's ideal if the first commit is a failing test followed by the changes to the code that fix it.
   - This is not strictly enforced but very appreciated!
2. The Admins will review open bugfix PRs as part of Roadmap Planning.
   - Simple bugfixes will be merged on the spot.
   - Others will be added to the Roadmap and assigned an Owner to review the work and get it over the finish line.

Bug fix PRs without a test case might be closed immediately (some things are hard to test, we’ll use discretion here)

### Bug Report Issues

If you think you've found a bug but don't have the time to send a PR, please follow these guidelines:

1. Create a minimal reproduction of the issue somewhere like Stackblitz, Replit, Codesandbox, etc. that we can visit and observe the bug
2. If this is not possible (related to some hosting setup, etc.) please create a GitHub repo that we can run with clear instructions in the README to observe the bug.
3. Open an issue and link to the reproduction.

Bug reports without a reproduction will be immediately closed asking for a reproduction.

### RFCs

- All Issues that are planned must have an RFC posted in the Official RFCs Discussion category before the Issue moves from _Planned_ to _In Progress_.
- Some Proposals may already be a sufficient RFC and can simply be moved to the Official RFCs Discussion category.
- Once the RFC is posted, development can begin, though Owners are expected to consider the community's feedback to alter their direction when needed.

### Support for Owners

- Owners will be added to the `#collaborators` private channel on [discord][discord] to get help with architecture and implementation. This channel is private to help keep noise to a minimum so Admins don't miss messages and owners can get unblocked. Owners can also discuss these questions in any channel or anywhere!
- Admins will actively work with owners to ensure their issues and projects are organized (correct status, links to related issues, etc.), documented, and moving forward.
- An issue's Owner may be reassigned if progress is stagnating.

### Weekly Roadmap Reviews

Once a week, the team and any external **Owners** are invited to review the Roadmap

- Identify blockers
- Find pairing opportunities within the team and the community

### Collaborator's Role

To help keep the repositories clean and organized, Collaborators will take the following actions:

### Issues Tab

- Bug reports without a reproduction will be immediately closed asking for a reproduction.
- Issues that should be proposals will be converted to a Ideas.
- Questions will be converted to a **Q\&A Discussion**.
- Issues with valid reproduction will be labeled as **Verified Bugs** and added to the Roadmap by the Admins in the Roadmap Planning Meeting.

### Pull Requests Tab

- Features that did not go through the **Development Process** will be immediately closed and asked to open a discussion instead.
- Bug fix PRs without a test case might be closed immediately asking for a test. (Some things are hard to test, Collaborators will use discretion here.)

---

## Development Setup

Before you can contribute to the codebase, you will need to fork the repo.
This will look a bit different depending on what type of contribution you are making:

The following steps will get you setup to contribute changes to this repo:

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of [this page][this-page]).

1. Clone your fork locally.

   ```bash
   # in a terminal, cd to parent directory where you want your clone to be, then
   git clone https://github.com/<your_github_username>/saboteur-remix.git
   cd saboteur-remix
   ```

1. Install dependencies by running `yarn`. We uses [Yarn (version 1)][yarn-version-1], so you should too.
   If you install using `npm`, unnecessary `package-lock.json` files will be generated.

1. Verify you've got everything set up for local development by running `yarn test`.

### Branches

**Important:** When creating the PR in GitHub, make sure that you set the base to the correct branch.

- **`main`**: is for changes to documentation and some templates.

### Tests

We use a mix of `jest` and `vitest` for our testing in this project.
We have a suite of integration tests in the integration folder and packages have their own jest configuration,
which are then referenced by the primary jest config in the root of the project.

We also have watch mode plugins for these. So, you can run `yarn test --watch` and hit `w` to see the available watch commands.

## Development Workflow

### Packages

Remix uses a monorepo to host code for multiple packages. These packages live in the `packages` directory.

We use [Yarn workspaces][yarn-workspaces] to manage installation of dependencies and running various scripts. To get everything installed, make sure you have [Yarn (version 1) installed][yarn-version-1], and then run `yarn` or `yarn install` from the repo root.

### Building

Running `yarn build` from the root directory will run the build.

### Testing

Before running the tests, you need to run a build.
After you build, running `yarn test` from the root directory will run **every** package's tests.

```bash
# Test all packages
yarn test
```

## Repository Branching

This repo maintains separate branches for different purposes. They will look something like this:

```
- main   > the most recent release and current docs
```

There may be other branches for various features and experimentation, but all of the magic happens from these branches.

## Conclusion

Thanks

[this-page]: https://github.com/Game-as-a-Service/saboteur-remix
[ideas]: https://github.com/Game-as-a-Service/saboteur-remix/discussions/categories/ideas
[yarn-version-1]: https://classic.yarnpkg.com/lang/en/docs/install
[pull-request]: https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request

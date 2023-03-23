# Welcome to Saboteur Remix + Nestjs

![cover](https://www.littledayout.com/wp-content/uploads/01-saboteur.jpg)

We are happy you're here!

This project is handle by game as a service team,
our goal is porting the famous card game called [Saboteur][saboteur].

This repository contains the source code.
This repo is a work in progress, so we appreciate your patience as we figure things out.

## Requirement

Please make sure you have been installed the following:

- Node.js >=16.10 [install](https://nodejs.org/en/download)
- yarn >= 1.22 [install](https://yarnpkg.com/getting-started/install)

For developer who want to develop backend:

- Docker >= 20.10 [install](https://www.docker.com/)

For developer who handle deployment:

- Docker >= 20.10 [install](https://www.docker.com/)
- flyctl stable 0.0.499 [install](https://fly.io/docs/hands-on/install-flyctl/)

## Testing

Run testing before you start anything

- start testing for all applications

```bash
yarn test
```

- test backend only

```bash
yarn test --filter=backend

# or
# cd apps/backend
# yarn test
```

- test frontend only

```bash
yarn test --filter=frontend

# or
# cd apps/frontend
# yarn test
```

## Development

- start dev server for all applications

```bash
yarn dev
```

- backend only development

```bash
# navigate to working directory
cd apps/backend

# start the dev server
yarn dev
```

- frontend only development

```bash
# navigate to working directory
cd apps/frontend

# start the dev server
yarn dev
```

## Deployment

We use [fly.io][fly] as our infrastructure for deployment,
which can be done by using [flyctl][fly-ctl], the CLI for [fly.io][fly].
There are multiple applications on [fly.io][fly] that are used for different purposes.

The detailed list is given below:👇

| purpose  |        application name        |        domain name        |
| :------: | :----------------------------: | :-----------------------: |
| backend  |        saboteur-backend        | saboteur-backend.fly.dev  |
| frontend |       saboteur-frontend        | saboteur-frontend.fly.dev |
| postgres |      saboteur-backend-db       |                           |
|  redis   |     saboteur-backend-redis     |                           |
|  build   | fly-builder-billowing-sea-9192 |                           |

In the future, we plan to separate into multiple environments, at least production and staging.
But since we are in the early phase of development, we don't need it for now.
Deployment is already handled by [GitHub action][github-action], which also supports triggers for manual deployment.
If you really need to deploy from your local environment, there are some details that you need to understand.

Even though we use a [turborepo][turborepo] for managing multiple applications,
we don't actually use [turborepo][turborepo] for deployment.
Instead of using [turborepo remote caching][turborepo-remote-caching],
we use [GitHub action][github-action-catch] and [Docker][docker-cache] for caching.
The [turborepo cache][turborepo-caching] is still valuable during development to provide a blazingly fast development build.

Since we have multiple applications to handle, we have multiple configurations for each application.
Instead of putting every configuration into one directory,
we put each configuration into a working directory related to its application because it's much easier to manage.
So each application has at least two configurations for deployment, [Dockerfile][docker-file] and [fly.toml][fly-toml].

The command below which used to deploy specific application:

```bash
flyctl deploy [WORKING_DIRECTORY] [--remote-only]
```

- `WORKING_DIRECTORY`: path to the working directory for your app's source code.
- `--remote-only`: use remote builder on [fly.io][fly].

example:

```bash
# deploy backend app
flyctl deploy apps/backend [--remote-only]
```

You can also check dashboard on [fly.io][fly].
In the dashboard you can check some information like hostname, version, image detail, monitoring...etc.

```bash
flyctl dashboard [--app <application-name>]
```

- `instance-name`: which stands for application name on [fly.io][fly], check detailed list above.

example:

```bash
# check backend app dashboard
flyctl dashboard --app saboteur-backend
```

For more detail please check [documentation][fly-doc].

## CI / CD

We using [GitHub action][github-action] as our CI/CD service.

There are two kinds of workflow in this project:

- callable workflow, which could be called by caller workflow to reuse same workflow.
  callable workflow also can trigger manually by `workflow_dispatch`.

- caller workflow, which will listen the specific event occur in this project and do the related job.

The current workflows list below:

|     name     |                                description                                |
| :----------: | :-----------------------------------------------------------------------: |
|  Type Check  |          callable workflow, which handle typecheck by typescript          |
|     Lint     |              callable workflow, which handle lint by eslint               |
|  Deployment  |              callable workflow, which handle fly deployment               |
|     Test     |              callable workflow, which handle test by vitest               |
| Pull Request | workflow runs on pull request, which handle check before review and merge |
|   Releases   |      workflow runs on push to main, which handle releases processing      |

## Contributing

If you're interested in contributing code and/or documentation, please see our guide to contributing.

[saboteur]: https://en.wikipedia.org/wiki/Saboteur_(card_game)
[fly]: https://fly.io/
[fly-ctl]: https://fly.io/docs/flyctl/
[fly-doc]: https://fly.io/docs/
[fly-toml]: https://fly.io/docs/reference/configuration/
[github-action]: https://github.com/features/actions
[github-action-catch]: https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows
[turborepo]: https://turbo.build/repo
[turborepo-caching]: https://turbo.build/repo/docs/core-concepts/caching
[turborepo-remote-caching]: https://turbo.build/repo/docs/core-concepts/remote-caching
[docker-cache]: https://docs.docker.com/build/cache/
[docker-file]: https://docs.docker.com/engine/reference/builder/

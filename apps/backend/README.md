# Welcome to Saboteur - Backend

## Development

```bash
yarn dev
```

## Testing

```bash
yarn test
```

## Controller

The purpose of a controller is to receive specific requests for the application. We are using NestJS as our controller.
For more details, please refer to the [documentation][2].

[2]: https://docs.nestjs.com/controllers

> **notice**
> Since we don't want to build an OOP structure, we don't have to use all the features in NestJS, just the controller.

### Design Principle

#### OpenAPI Specification

For more details, see the [specification][1].

[1]: https://swagger.io/specification/

#### Endpoint Design

- Should be based around resources.
- Use **nouns** instead of **verbs**.
- Use **param-case**.

#### Avoid using _express_ or _fastify_ directly

Although _NestJS_ uses _Express_ behind the scenes, try to avoid using _Express_ or _Fastify_ API directly.

To avoid relying on platform-specific APIs, _NestJS_ provides a list of decorators to inject the information we need.
For more details, see the [request object][3].

[3]: https://docs.nestjs.com/controllers#request-object

#### Using Built-in HTTP exceptions

_NestJS_ provides a set of standard exceptions.
Consider using it before create custom exceptions.
For more details, see the [exceptions][4].

[4]: https://docs.nestjs.com/exception-filters#built-in-http-exceptions

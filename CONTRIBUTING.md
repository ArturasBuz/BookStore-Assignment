# 🤝️ Contributing to the project 🤝

To contribute, please follow the guidelines in this contributing file.

## Architecture

Our application architecture is based on a few strategical design decisions:

- Domain Driven Design [DDD Angular](https://www.angulararchitects.io/en/aktuelles/tactical-domain-driven-design-with-monorepos/)
- Re-usability (and separation of Component-based concerns) through Presentation / Container pattern

### Domain Driven Design

The application is designed around the principles of Domain Driven Design, that is:

- Domains are identified, based on a given context
- These domains / contexts are well-defined and isolated from one another
- These domains have clear-defined APIs (structures) for communicating with one another
- The code's structure reflects the architecture

### Presentation / Container pattern

The application is based around a couple of patterns.

Angular dictates the development to be based Component-based design, but we scope it even further (by using the Presentation / Container pattern).

The pattern attempts to two distinct, separate principles:

**Container components**, which:

- Have the responsibility of managing state
- Communicate with "the outside" world (may be over HTTP, through browser API's such as local storage etc.)
- Manage presentation business logic
- Never (hardly ever) re-usability multiple places in your application
- Are **never** nested - they're always the root Component of a Page, Dialog etc.
  - Which means they don't use `Input` or `Output`-decorated fields / properties / set'ers
  - Communicate with the outside world through DI
- Use `Observables` (and the `async`-pipe), but don't use "plain"-properties

**Presentation components**, which:

- Have to responsibility of making things look right
- Never (hardly ever) have internal state
- Are re-usability by nature (this is not a requirement)
- Are **always** found in a nested Component structure
  - They **never** get state (data) based on dependency injection (no direct service injection)
  - They use `Input`-decorated fields / properties / setters for getting state (data) to present
  - They use `Output`-decorated event emitters to mediate information about state changing
- Don't (hardly ever) use `Observables`

## Code and conventions

Code is formatted using [prettier](#prettier) and linted using [ESLint][eslint] (as well as [stylelint]).

The codebase is (or should be at least) thoroughly unit tested using [jest].

## Scripts

Various scripts are made available in the `package.json`'s `script`-section. A summary of the most useful ones are:

| Command                 | Description                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run start`         | Runs the mock frontend on the Angular dev-server with a mock backend (see more [here](#ng-apimock)) (accessible through http://localhost:3001/ ) |
| `npm run start:mock`    | Runs the mock frontend on the Angular dev-server with a mock backend (see more [here](#ng-apimock)) (accessible through http://localhost:3001/ ) |
| `npm run openapi`       | Generates OpenAPI services and models (see more [here](#OpenAPI-Generator---typescript-angular), automatically run when dev server is started)   |
| `npm run test`          | Runs the [unit tests](#jest) for the application (runs one, then exits regardless of completion error)                                           |
| `npm run test:watch`    | Runs the [unit tests](#jest) in watch-mode. Compiles the code, watches and re-runs tests upon alterations of code or tests                       |
| `npm run lint:fix`      | Fixes ALL code formatting issues on the entire codebase (this should automatically happen on `git commit`)                                       |
| `npm run prettier:fix`  | Fixes prettier code formatting issues on the entire codebase (this should automatically happen on `git commit`)                                  |
| `npm run lint:ts:fix`   | Fixes linting issues on the entire codebase, for `*.js` and `*.ts` (this should automatically happen on `git commit`)                            |
| `npm run lint:scss:fix` | Fixes linting issues on the entire codebase, for `*.css` and `*.scss` (this should automatically happen on `git commit`)                         |

## Libraries

The "Book Store" uses the following libraries:

| Name                         | Description                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------- |
| [Angular Material][material] | Component library (of choice) following the Angular Material design specification |
| [ng-mocks]                   | Library for mocking declarative constructs in Angular                             |

## Tooling

The "Book Store" uses the following tooling for increasing productivity

### [OpenAPI Generator - typescript-angular](https://openapi-generator.tech/docs/generators/typescript-angular)

[GitHub Repo - openapi-generator](https://github.com/OpenAPITools/openapi-generator)

[GitHub Repo - openapi-generator-cli](https://www.npmjs.com/package/@openapitools/openapi-generator-cli)

#### This OpenApi generator section describes how to generate Angular services, models, and enums from an OpenAPI YAML file and integrate them into an Angular application.

#### Installation

To use the OpenAPI Generator CLI, you need to install it as a global package:

```bash
$ npm install @openapitools/openapi-generator-cli -g
```

#### Configuration

Update the configuration file openapitools.json in your project's root directory to your teams liking.

This configuration uses the typescript-angular generator, with the input OpenAPI specification file openapi.yaml, and outputs the generated code to the openapi-generator directory.
It also adds a "environment.path" as basePath to support multiple environments.

#### Generating API client code

To generate the API client code using the provided openapitools.json, run the following command:

1. Run the generator command in the directory containing the OpenAPI YAML file (replace `path/to/openapi.yaml` with the correct path):

2. `openapi-generator-cli generate`
   or
   `npm run openapi`

#### OpenAPI YAML File

The OpenAPI YAML file used for this example contains the following API structure:

- Two API endpoints:
  - `GET /users/{id}`: Retrieve a single user by ID.
  - `GET /users`: Retrieve a list of all users.
- A User schema defining the user model.

#### Generating Angular Files

To generate Angular services, models, and enums from the OpenAPI YAML file, use the `@openapitools/openapi-generator-cli`.
Read more about [openapitools here](https://openapi-generator.tech/).

Follow these steps:

#### Generated Files Structure

The generated files will have the following structure inside the `src/app/api` folder:

```
src/
└── app/
    └── api/
        ├── api.module.ts
        ├── configuration.ts
        ├── base.service.ts
        ├── api-client.ts
        ├── model/
        │   └── user.ts
        └── api/
            └── user.service.ts
```

- `api.module.ts`: The API module file for bundling all generated services.
- `configuration.ts`: The configuration file containing settings for the API client.
- `base.service.ts`: The base service file with common logic for making API calls.
- `api-client.ts`: The API client file, which is a simple HTTP client that wraps the Angular HttpClient.

Inside the `model` folder:

- `user.ts`: TypeScript model file representing the User schema.

Inside the `api` folder:

- `user.service.ts`: TypeScript service file containing methods for making HTTP requests to the User API endpoints.

### [ng-apimock]

Acts as a dummy / mock backend, serving static (pre-defined) responses based upon static JSON-response.

The mock data is accessible from port `3001`, and provides a dashboard for managing how the mock server behaves at [http://localhost:3001/mocking](http://localhost:3001/mocking/)

The contents served by the API mock server is located as:

| Folder            | Description                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `/mocks`          | Root-folder, contains server script, and configuration and data folders                  |
| `/mocks/api`      | Describes the API endpoints and response variations (linking to data folder)             |
| `/mocks/api-data` | Contains response data for endpoints (and variations) as defined in configuration folder |

### [jest]

Test-runner for unit tests.

Jest has a few benefits compared to [jasmine] and [jest] (which Angular comes "bundled with"), these are:

1. Jest is fast, since it runs tests in parallel and on a virtual DOM
2. Jest is smart (to be fast), since it tries only to run test modifications, based upon changes made to code and test
3. Jest has a Sensible CLI - when run in "watch"-mode, you can target specific scenarios etc.

### [eslint]

Performs static code analysis (linting) for our JavaScript and TypeScript code.

ESLint (and linting in general) should let us become more productive, adding a layer of "protection" to what the compiler already provides.

Configured rules are applied to:

- Adhere to Angular's list of "dos and don'ts"
- Sorting of imports and exports (to lessen the likelihood of merge conflicts)
- Avoid having unused imports
- Enforce usage of `ChangeDetection.OnPush`
- ...and more

### [stylelint]

Performs static code analysis (linting) for our CSS and SCSS code.

Stylelint applies best practices and rules for better working with CSS (and SCSS for that matter).

Rules are applied to enforce:

- No usage of global keywords
- No usage of deprecated constructs (ie. use `@use` over `@import`, to avoid naming clashes etc.)
- Ordering of code (list rules by specificity)
- ...and more

### [prettier]

Formats our code in a standardized way.

Prettier is an opinionated formatter that removes any discussions about what's formatted how (and lets us avoid having the notorious "tabs vs. spaces" quarrel).
As an additional bonus, sane defaults are set to avoid most merge conflicts (hopefully improving productivity even further).

This is integrated with [lint-staged](#lint-staged)-tool (see below) , which means that the formatted should automatically occur upon committing any files.

Prettier is integrated into the [ESLint](#eslint) tooling, so that whenever [ESLint][eslint] is run, prettier will run as well!

### [lint-staged]

Runs linting (and formatting) on git staged files.

It does so by (in our case) delegating to our various linting and formatting tools, which in our case are:

- [ESLint][eslint] for linting `*.js`- and `*.ts`
- [stylelint] for linting of `*.css` and `*.scss`
- [prettier] for formatting of (more or less) everything

The configuration of what is linted and which tool is used, can be found in the `package.json`-file at the path: `$.lint-staged`

### [simple-git-hooks]

Manages git hooks, in a simple way.

This is automatically run upon after `npm install`, and can be explicitly run by running the `npm run prepare`-command.

The configuration of how the tool is configured, can be found in the `package.json`-file at the path: `$.simple-git-hooks`

[ng-apimock]: https://ngapimock.org/docs/mocks
[jest]: https://jestjs.io/
[jasmine]: https://jasmine.github.io/
[material]: https://material.angular.io/
[ng-mocks]: https://ng-mocks.sudo.eu/
[spectator]: https://github.com/ngneat/spectator
[prettier]: https://prettier.io/
[lint-staged]: https://github.com/okonet/lint-staged
[simple-git-hooks]: https://github.com/toplenboren/simple-git-hooks
[eslint]: https://eslint.org/
[stylelint]: https://stylelint.io/

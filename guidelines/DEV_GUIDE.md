# Antwerp UI dev guide

## Available commands

Since the Antwerp UI library was created using `lerna`, all lerna commands are available to use during development. You can use a global install (make sure to check the supported version in the root `package.json` file) or the local copy installed in the dev dependencies:

```bash
lerna
```
or
```bash
npm run lerna
```

Some useful commands:

* `npm run bootstrap`: executes lerna bootstrap
* `npm run lint`: run the linter on the entire library
* `npm test`: run the unit tests for the entire library
* `npm run build`: build the entire library (see below)
* `npm run deploy`: deploy all changes following [lernas update policy](https://github.com/lerna/lerna#publish)

## Package vs Library

To make contributing as smooth as possible and treeshaking as flexible as possible, each package is built individually to the dist folder and published individually to npm. Since this repo contains mostly utils and self contained libraries, it makes more sense to cherry-pick depending on your (apps) requirements.

Or the entire library:

You can import a single package in your app by name:

```javascript
import { DateHelper } from '@acpaas-ui/js-date-utils';
```

## Dependencies

If you have a dependency between 2 packages, you can use the same import paths as you would in your app:

```typescript
import { DateHelper } from '@acpaas-ui/js-date-utils';
```

Lerna will resolve all `antwerp-ui` paths for you, as long as you have run the `bootstrap` command after adding a new package.
We discourage creating dependencies between the different libraries in this repo, since they are supposed to be self contained tools to be used independent from other packages.
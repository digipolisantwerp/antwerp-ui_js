# ACPaaS UI dev guide

## Available commands

Since the ACPaaS UI library was created using `lerna`, all lerna commands are available to use during development. You can use a global install (make sure to check the supported version in the root `package.json` file) or the local copy installed in the dev dependencies:

```bash
lerna
```
or
```bash
npm run lerna
```

Some useful commands:

* `npm run lint`: run the linter on the entire library
<!-- * `ng lint <package>`: run the linter on a specific package -->
* `npm test`: run the unit tests for the entire library
<!-- * `ng test <package>`: run the unit tests for a specific package -->
* `npm run build`: build the entire library (see below)
<!-- * `ng build <package>`: build a specific package -->
* `npm run deploy`: deploy all changes following [lernas update policy](https://github.com/lerna/lerna#publish)
<!-- * `npm run package -- --name=<package>`: generate a new package -->

## Package vs Library

To make contributing as smooth as possible and treeshaking as flexible as possible, each package is built individually to the dist folder and published individually to npm. Since this repo contains mostly utils and self contained libraries, it makes more sense to cherry-pick depending on your (apps) requirements.

You can build a single package while developing:

```bash
npm run build my-new-package
```

Or the entire library:

```bash
npm run build
```

You can run tests on a single package:

```bash
npm run test my-new-package
```

Or on the entire library:

```bash
npm test
```

You can import a single package in your app by name:

```javascript
import { DateHelper } from '@acpaas-ui/js-date-utils';
```

## Dependencies

If you have a dependency between 2 packages, you can use the same import paths as you would in your app:

```typescript
import { DateHelper } from '@acpaas-ui/js-date-utils';
```

Lerna will resolve all `acpaas-ui` paths for you, as long as you have run the `bootstrap` command after adding a new package.
We discourage creating dependencies between the different libraries in this repo, since they are supposed to be self contained tools to be used independent from other packages.
<!-- 
**An example:**

The `leaflet` package has a depenency on the `flyout` package, to show off some fancy dropdown menus.

This means:

* you can import assets from the `flyout` package like you would in your app
* the `leaflet` package cannot be built before the `flyout` package is built

### Building

When building the entire library, we need to make sure packages are built in the correct order. In our example, the `flyout` package needs to be built before the `leaflet` package.

When using the `ng build` command, the build will most likely fail, since packages are handled by alphabetical order and dependencies might not yet exist.

To ensure dependencies are built in the correct order, you can specify dependencies in the `package.json` of your package:

```json
{
    "name": "leaflet",
    ...
    "acpaas-ui": {
        "dependencies": [
            "flyout"
        ]
    }
}
```

An using the `npm run build` command, dependencies will be resolved properly: the `flyout` package will always be built before the `leaflet` package, regardless the alphabetical order. -->
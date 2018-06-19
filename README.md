# ACPaaS UI - Javacript Libraries

[![acpaas-ui-js-build]][acpaas-ui-js-travis]

**This documentation is work-in-progress!**

## Introduction

Antwerp City Platform as a Service User Interface (ACPaas UI) is a **component interface library** for building user interfaces and responsive web apps. It's designed to provide developers with functionality en UI/UX patterns that matches the Antwerpen styleguide. This part of the library provides vanilla javascript utilities.

## Ecosystem

This library is part of [ACPaaS UI][acpaas-ui].

| Name              | Framework  | Status  |
| ----------------- | ---------- | ------- |
| Schematics        | ES5+       | [![acpaas-ui-schematics-github]][acpaas-ui-schematics] |
| Javascript        | ES5+       | [![acpaas-ui-js-github]][acpaas-ui-js] |
| Angular           | Angular 6+ | [![acpaas-ui-angular-github]][acpaas-ui-angular] |
| React             | React 16+  | [acpaas-ui-react] |
| VueJS             | TBA        | TBA  |

## Documentation

To check out [live examples]() and docs, visit [acpaas-ui.digipolis.be/ui-components](https://acpaas-ui.digipolis.be/ui-components).

## Library Contents

| Name              | Description                              | Status | URL                                                      |
| ----------------- | ---------------------------------------- | ------ |--------------------------------------------------------- |
| DateUtils         | Utilities for dates, such as formatting. | [![js-date-utils-status]][js-date-utils-package]   |[Documentation](./packages/date-utils/README.md)  |
| EIDUtils          | EidMiddleware module wrapper for Dios EidMiddleware | [![js-eid-utils-status]][js-eid-utils-package]   |[Documentation](./packages/eid-utils/README.md)  |
| ReduxUtils        | Utilities for Redux                      | [![js-redux-utils-status]][js-redux-utils-package] |[Documentation](./packages/redux-utils/README.md) |
| NotificationStore | Redux store for notifications            | [![js-notification-store-status]][js-notification-store-package] |[Documentation](./packages/notification-store/README.md) |

## Questions

For questions and support please use [StackOverflow Issues][stackoverflow-issues]. The issue list of this repo is **exclusively** for bug reports and feature requests.

## Issues

Please make sure to read the [Issue Reporting Checklist]() before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## Changelog

Detailed changes for each release are documented in the [changelog](./CHANGELOG.md).

## Contributing

Please make sure to read the [Contributing Guide]() before making a pull request.

Thank you to all the people who already contributed to ACPaaS UI!

**List of contributors here**

## Stay In Touch

- [Twitter]()
- [Slack]()
- [Blog]()

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present, Digipolis

<!-- Generic Links -->
[acpaas-ui]: https://acpaas-ui.digipolis.be

<!-- StackOverflow -->
[stackoverflow-issues]: https://stackoverflow.com/questions/tagged/acpaas-ui

<!-- Travis -->
[acpaas-ui-js-build]: https://img.shields.io/travis/digipolisantwerp/acpaas-ui-js.svg
[acpaas-ui-js-travis]: https://travis-ci.org/digipolisantwerp/acpaas-ui-js

<!-- Github URL -->
[acpaas-ui-schematics]: https://github.com/digipolisantwerp/acpaas-ui_schematics
[acpaas-ui-js]: https://github.com/digipolisantwerp/acpaas-ui_js
[acpaas-ui-angular]: https://github.com/digipolisantwerp/acpaas-ui_angular
[acpaas-ui-react]: https://github.com/digipolisantwerp/acpaas-ui_react

<!-- GitHub Version Badge -->
[acpaas-ui-schematics-github]: https://img.shields.io/github/package-json/v/digipolisantwerp/acpaas-ui_schematics.svg
[acpaas-ui-angular-github]: https://img.shields.io/github/package-json/v/digipolisantwerp/acpaas-ui_angular.svg
[acpaas-ui-js-github]: https://img.shields.io/github/package-json/v/digipolisantwerp/acpaas-ui_js.svg

<!-- NPM Package links -->
[js-date-utils-package]: https://www.npmjs.com/package/@acpaas-ui/js-date-utils
[js-eid-utils-package]: https://www.npmjs.com/package/@acpaas-ui/js-eid-utils
[js-redux-utils-package]: https://www.npmjs.com/package/@acpaas-ui/js-redux-utils
[js-notification-store-package]: https://www.npmjs.com/package/@acpaas-ui/js-notification-store

<!-- NPM Version Badge -->
[js-date-utils-status]: https://img.shields.io/npm/v/@acpaas-ui/js-date-utils.svg
[js-eid-utils-status]: https://img.shields.io/npm/v/@acpaas-ui/js-eid-utils.svg
[js-redux-utils-status]: https://img.shields.io/npm/v/@acpaas-ui/js-redux-utils.svg
[js-notification-store-status]: https://img.shields.io/npm/v/@acpaas-ui/js-notification-store.svg
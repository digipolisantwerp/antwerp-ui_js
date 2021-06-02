# Antwerp UI - Javacript Libraries

![build][antwerp-ui-js-ci]

**This documentation is work-in-progress!**

## Introduction

Antwerp City Platform as a Service User Interface (Antwerp UI) is a **component interface library** for building user interfaces and responsive web apps. It's designed to provide developers with functionality en UI/UX patterns that matches the Antwerpen styleguide. This part of the library provides vanilla javascript utilities.

## Ecosystem

This library is part of [Antwerp UI][antwerp-ui].

| Name              | Framework  | Status  |
| ----------------- | ---------- | ------- |
| Schematics        | ES5+       | [![antwerp-ui-schematics-github]][antwerp-ui-schematics] |
| Javascript        | ES5+       | [![antwerp-ui-js-github]][antwerp-ui-js] |
| Angular           | Angular 6+ | [![antwerp-ui-angular-github]][antwerp-ui-angular] |
| React             | React 16+  | [antwerp-ui-react] |
| VueJS             | TBA        | TBA  |

## Documentation

To check out [live examples]() and docs, visit [antwerp-ui.digipolis.be/ui-components](https://antwerp-ui.digipolis.be/ui-components).

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

Thank you to all the people who already contributed to Antwerp UI!

**List of contributors here**

## Stay In Touch

- [Twitter]()
- [Slack]()
- [Blog]()

## Support

Jasper Van Proeyen (<jasper.vanproeyen@digipolis.be>)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present, Digipolis

<!-- Generic Links -->
[antwerp-ui]: https://antwerp-ui.digipolis.be

<!-- StackOverflow -->
[stackoverflow-issues]: https://stackoverflow.com/questions/tagged/antwerp-ui

<!-- GitHub actions -->
[antwerp-ui-js-ci]: https://github.com/digipolisantwerp/antwerp-ui_js/workflows/CI/badge.svg

<!-- Github URL -->
[antwerp-ui-schematics]: https://github.com/digipolisantwerp/antwerp-ui_schematics
[antwerp-ui-js]: https://github.com/digipolisantwerp/antwerp-ui_js
[antwerp-ui-angular]: https://github.com/digipolisantwerp/antwerp-ui_angular
[antwerp-ui-react]: https://github.com/digipolisantwerp/antwerp-ui_react

<!-- GitHub Version Badge -->
[antwerp-ui-schematics-github]: https://img.shields.io/github/package-json/v/digipolisantwerp/antwerp-ui_schematics.svg
[antwerp-ui-angular-github]: https://img.shields.io/github/package-json/v/digipolisantwerp/antwerp-ui_angular.svg
[antwerp-ui-js-github]: https://img.shields.io/github/package-json/v/digipolisantwerp/antwerp-ui_js.svg

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

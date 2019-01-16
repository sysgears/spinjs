# SpinJS

[![Join the chat at https://gitter.im/sysgears/spinjs](https://badges.gitter.im/sysgears/spinjs.svg)](https://gitter.im/sysgears/spinjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/spinjs.svg)](https://badge.fury.io/js/spinjs) [![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Description

SpinJS is a JavaScript tool that helps to build projects for production, run them in test mode, and launch projects in 
watch mode for development. SpinJS relieves you from the pains of configuring the project builds for client, server, 
and native mobile applications so you can focus on the actual development.

In the simplest terms, SpinJS aims to analyze your JavaScript project from various aspects: 

* What dependencies your project has; 
* What structure it has whether it's a standalone project, a Lerna monorepo, or a Yarn Workspaces project; and
* what tool would be the best to build the project with.

SpinJS tries to understands a project by reading the `package.json` file as well as by reading the actually installed 
dependencies in the `node_modules` directory and then configures the technologies it knows about using custom [plugins].

SpinJS does its best to provide you with an advanced build setup using the minimal information that you provide about
the technology stack while still giving you the possibility to configure every aspect of how your project gets built.

SpinJS is different from similar build tools in that it doesn't tie you to a specific framework. And SpinJS doesn't lock
you out from the generated configurations.

## Installation

Install SpinJS in development dependencies of your project using Yarn:

```bash
yarn add spinjs --dev
```

Alternately, you can use NPM:

```bash
npm install spinjs --save-dev
```

## Getting Started

To start using SpinJS, you only need to create a basic project and then install the necessary dependencies (including
SpinJS). You can then build and run your project with SpinJS using the command below:

```bash
# Without scripts
yarn spin watch
```

SpinJS will [build your project for development] and launch it in watch mode: upon changes in code, SpinJS will rebuild
the project and reload the build using hot code reload or live code reload.

**NOTE**: If you're using NPM rather than Yarn, you need to add a few scripts to `package.json` to be able to run your 
project with SpinJS.

## SpinJS Documentation

You can follow to the documentation to learn more about SpinJS:

* [Concepts]
* [Configuration]
* [How SpinJS Works]
* [SpinJS Scripts]

## Community Support

* [Gitter channel] - ask your questions, find answers, and participate in general discussions!
* [GitHub issues] - submit issues and request new features!

## Commercial Support

The [SysGears] team provides advanced support for commercial partners. A commercial partner will have premium access to
our team to get help with Spin. Contact us using [Skype] or via email **info@sysgears.com**.

## Contributors

Very many thanks to our contributors ([emoji key]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/1259926?v=3" width="100px;"/><br /><sub>Victor Vlasenko</sub>](https://ua.linkedin.com/in/victorvlasenko)<br />[💻](https://github.com/sysgears/spin.js/commits?author=vlasenko "Code") [🔧](#tool-vlasenko "Tools") [📖](https://github.com/sysgears/spin.js/commits?author=vlasenko "Documentation") [⚠️](https://github.com/sysgears/spin.js/commits?author=vlasenko "Tests") [💬](#question-vlasenko "Answering Questions") [👀](#review-vlasenko "Reviewed Pull Requests") | [<img src="https://avatars0.githubusercontent.com/u/4072250?v=3" width="100px;"/><br /><sub>Ujjwal</sub>](https://github.com/mairh)<br />[💻](https://github.com/sysgears/spin.js/commits?author=mairh "Code") [🔧](#tool-mairh "Tools") [📖](https://github.com/sysgears/spin.js/commits?author=mairh "Documentation") [⚠️](https://github.com/sysgears/spin.js/commits?author=mairh "Tests") [💬](#question-mairh "Answering Questions") [👀](#review-mairh "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/20957416?v=4" width="100px;"/><br /><sub>cdmbase</sub>](https://github.com/cdmbase)<br />[💻](https://github.com/sysgears/spin.js/commits?author=cdmbase "Code") |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors] specification.
We welcome any contributions to the project!

## License

Copyright © 2018 [SysGears INC]. This source code is licensed under the [MIT] license.

[webpack]: https://webpack.js.org/
[plugins]: https://github.com/sysgears/spinjs/blob/master/docs/concepts.md#plugins
[spinjs scripts]: https://github.com/sysgears/spinjs/blob/master/docs/scripts.md
[build your project for development]: https://github.com/sysgears/spinjs/blob/master/docs/scripts.md#spin-watch
[Concepts]: https://github.com/sysgears/spinjs/blob/master/docs/concepts.md
[Configuration]: https://github.com/sysgears/spinjs/blob/master/docs/configuration.md
[How SpinJS Works]: https://github.com/sysgears/spinjs/blob/master/docs/howSpinWorks.md
[SpinJS Scripts]: https://github.com/sysgears/spinjs/blob/master/docs/scripts.md
[Gitter channel]: https://gitter.im/sysgears/spinjs
[GitHub issues]: https://github.com/sysgears/spinjs/issues
[SysGears]: https://sysgears.com
[skype]: http://hatscripts.com/addskype?sysgears
[emoji key]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[SysGears INC]: http://sysgears.com
[MIT]: LICENSE

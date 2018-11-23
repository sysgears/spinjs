# SpinJS

[![Join the chat at https://gitter.im/sysgears/spinjs](https://badges.gitter.im/sysgears/spinjs.svg)](https://gitter.im/sysgears/spinjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/spinjs.svg)](https://badge.fury.io/js/spinjs) [![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Description

SpinJS is a JavaScript library that creates project bundles for development, production, and testing. SpinJS relieves 
you from the pains of configuring your project with [webpack] for web, server, and native mobile applications so you can 
focus on the actual development.

In the simplest terms, SpinJS understands what dependencies you installed for your JavaScript project by reading the 
`package.json` file and then configures the technologies it knows about using custom [plugins].

SpinJS does its best to provide you with an advanced build setup using the minimal information that you provide about
your technology stack while still giving you the possibility to further configure every aspect of how the project gets
built.

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

To start using SpinJS, you only need to create a basic project and then install the necessary dependencies. Finally, add
a few [SpinJS scripts] to your `package.json` like this:

```json
{
  "scripts": {
    "build": "spin build",
    "start": "spin start",
    "watch": "spin watch",
    "test": "spin test"
  }
}
```

And now just run your project:

```bash
yarn watch
# or you can use NPM
npm run watch
```

SpinJS will [build your project for development] and launch it in the webpack `watch` mode. You can start changing your
project code, and the bundle will be automatically reloaded using the Hot Module Replacement plugin.

## SpinJS Documentation

You can follow to the [documentation] to learn more about SpinJS:

* [Concepts]
* [Configuration]
* [How SpinJS works]
* [Scripts]

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
[documentation]: https://github.com/sysgears/spinjs/blob/master/docs/
[concepts]: https://github.com/sysgears/spinjs/blob/master/docs/concepts.md
[configuration]: https://github.com/sysgears/spinjs/blob/docs/master/docs/configuration.md
[how spinjs works]: https://github.com/sysgears/spinjs/blob/master/docs/docs/howSpinWorks.md
[scripts]: https://github.com/sysgears/spinjs/blob/master/docs/docs/scripts.md
[gitter channel]: https://gitter.im/sysgears/spinjs
[github issues]: https://github.com/sysgears/spinjs/issues
[sysgears]: https://sysgears.com
[skype]: http://hatscripts.com/addskype?sysgears
[emoji key]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[sysgears inc]: http://sysgears.com
[mit]: LICENSE
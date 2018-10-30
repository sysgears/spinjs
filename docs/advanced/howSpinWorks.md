# How SpinJS Works

SpinJS first reads the contents of the project `package.json` file and then recursively watches the project dependencies
as well as the dependencies of the project dependencies. SpinJS does that to build a complete list of dependencies.

After SpinJS has built the list of dependencies, it selects the ones that it knows. For example, if SpinJS noticed 
`express` in the list of dependencies, then it understands that this is an Express server application. Similarly, if 
there's the `react-native` dependency, then SpinJS understands the project is a React Native mobile app (internally, 
SpinJS first tries to understand if this is an Android app, and then if this is an iOS app).

The next phase is building the internal model of the project, using which SpinJS understands what technologies are used
in the project and tries to generate the webpack configuration for those technologies.

Webpack configuration is done with the help of plugins. Each plugin gets its own list of technologies that SpinJS found 
in the project, and then plugin analyzes the list of technologies in a bid to understand if it know this subset of 
technologies or not.

For example, SpinJS has a plugin for Angular and webpack and generates the configuration that includes configs for 
Angular and webpack. The generated configuration is merged into the main configuration using webpack-merge to ensure 
that the configuration is created without conflicts. 

Each SpinJS plugin knows how to create a part of webpack configuration for a specific technology. Each plugin also 
understands for what environment the configuration must be generated: for development or for production, or whether you
need to compile webpack DLL files?
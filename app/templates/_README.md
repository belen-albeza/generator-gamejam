# <%= gameName %>

<%= gameName %> by
[<%= github.username %>](https://github.com/<%= github.username %>).

Initial scaffolding generated with [generator-gamejam](https://github.com/belen-albeza/generator-gamejam/).

## Installation

### Requirements

This games uses [gulp](http://gulpjs.com/) for building and tasks automation.

You can install gulp with npm:

```
npm install -g gulp
```

### Build

Clone this repository and install dependencies:

```
git clone <%= github.repository %>
cd <%= github.repoName %>
npm install
```

To **build** the game, run the `dist` task from the project root:

```
gulp dist
```

The `dist` folder will contain a build of the game. You can then start a local server that serves this directory statically to play the game in local:

```
npm install -g http-server
http-server dist
```

You can **clean up** the temporary files and the `dist` folder by running:

```
gulp clean
```

## Development

This project uses [Browserify](http://browserify.org) to handle JavaScript modules.

There is a task that will automatically run Browserify when a JavaScript file changes, and it will also reload the browser.

```
gulp run
```

<% if (!deployTarget === 'none') { %>
## Deployment <% } %>

<% if (deployRsync) { %>You can deploy to your own server via **rsync**. This is done with the `deploy:rsync` task, which will build the project and then copy the `dist` folder to the remote server.

```
gulp deploy:rsync
```

In order for this to work, you need to edit or create a `gulp.config.json` file with the following fields:

```
{
  "deploy": {
    "user": "root",
    "host": "somewhere.com",
    "destination": "/path/to/folder/"
  }
}
```
<% } %>

<% if (deployPages) { %>You can deploy to **Github Pages** with the `deploy:ghpages` task, which will build the project and then push the `dist` folder in the `gh-pages` branch.

```
gulp deploy:ghpages
```
<% } %>

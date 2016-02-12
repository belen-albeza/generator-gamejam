# generator-gamejam

This is a [Yeoman](http://yeoman.io) generator for game jam HTML5 projects. With this you can quickly create a project skeleton that contains:

- An `index.html` file that displays your game using the awesome [Phaser](http://phaser.io) game framework.
- A local web server you can run your game into (needed for Phaser).
- Developer tools: Gulp, Browserify, livereload.
- A task to create a release of your game that you can zip or backup.
- A task to deploy your game into your own server online.


## Getting Started

You need to install both Yeoman and this generator globally:

```bash
npm install -g yo generator-gamejam
```

Create a directory for your project and run yeoman from within:

```
mkdir awesome-game
cd awesome-game
yo gamejam
```

You will get this project skeleton:

```
├── src
│   ├── images
│   │   ├── phaser.png
│   │   └── preloader_bar.png
│   ├── index.html
│   ├── raw.html
│   ├── js
│   │   ├── main.js
│   │   └── play_scene.js
│   └── styles.css
├── gulp.config.json
├── gulpfile.js
├── node_modules
└── package.json
```

You will see a `gulpfile.js`, which is to setup [Gulp](http://gulpjs.com), a task automator and building system. It is very useful to speed up our workflow.

## Developing your game

### Modules

This project includes [Browserify](http://browserify.org/), a tool for managing dependencies and modules (like RequireJS). One of the cool things about Browserify is that it allows you to use node modules in your browser application. For instance, if you need Lo-Dash in your project, you would install it as a regular npm package:

```
npm install lodash-node
```

And then in your JavaScript files, you would just need:

```
var _ = require('lodash-module');
```

You can require local files too in this fashion, but you need to put a path (relative to the current file):

```
var PlayScene = require('./play_scene.js');
```

### Running the game

In the `gulpfile.js` there are defined some tasks to aid development. The default task will build the project in a `dist` folder.

```
gulp
```

You can now run a local server over `dist`. For instance:

```
npm -g install http-server
http-server dist
```

Now open [0.0.0.0:8080](http://0.0.0.0:8080) and you will see a "Hello, world" game.

However, while you are developing, **you will want to use the `run` task**. This is similar to the default task, but will watch your JS files for changes and re-run Browserify automatically. This also uses browser-sync to reload your browser automatically whenever there are changes to JavaScript, HTML or CSS files.

```
gulp run
```

#### Releasing and deploying

You can create a build, which will create a directory with only your project files ready to be distributed.

```
gulp dist
```

#### Embedding your game

There are several places you can submit your game to, like itch.io or Ludum Dare. These websites have their own wrapper or viewer over your game. That's why `raw.html` exists: it is the bare game ready to be embedded in an iframe.

## Changelog

**1.2.1** (12 Feb 2016)

- Updated README

**1.2.0** (12 Feb 2016)

- Used `browser-sync` instead of relying on live-reload.
- Added `README.md` file to the scaffolding
- Added deployment with Github Pages
- Made deployment optional
- Fixed gulp not running when `config.local.json` could not be found

**1.1.0** (1 May 2015)

- Used `gulp-livereload`.
- Now the game itself is in its own html file (`raw.html`) so it can be embedded into an iframe by third-party websites.
- Removed linter (this is aimed for gamejams, after all).

## License

© 2014-2016 Belén "BenKo" Albeza.

`generator-gamejam` is released under the MIT license. Read `LICENSE` for details.

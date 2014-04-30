'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

var hello =
"\n" +
"\n" +
chalk.green("\n                               888") +
chalk.green("\n                               888") +
chalk.green("\n                               888") +
chalk.green("\n    888  888  888    .d88b.    888    .d8888b    .d88b.    88888b.d88b.     .d88b.") +
chalk.green("\n    888  888  888   d8P  Y8b   888   d88P       d88  88b   888  888  88b   d8P  Y8b") +
chalk.green("\n    888  888  888   88888888   888   888        888  888   888  888  888   88888888") +
chalk.green("\n    Y88b 888 d88P   Y8b.       888   Y88b.      Y88..88P   888  888  888   Y8b.") +
chalk.green("\n      Y8888888P       Y8888    888     Y8888P     Y88P     888  888  888     Y8888") +
"\n" +
"\n";

var FoundationS = module.exports = function FoundationS(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(FoundationS, yeoman.generators.Base);

FoundationS.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(hello);

  var prompts = [
  {
    name: 'themename',
    message: 'What is the name of your theme?',
    default: 'Foundation_s'
  },
  {
    name: 'themeuri',
    message: 'What is the URL of your theme?',
    default: 'https://github.com/mrdink/generator-foundation_s'
  },
  {
    name: 'author',
    message: 'What is your name?',
    default: 'Justin Peacock'
  },
  {
    name: 'authoruri',
    message: 'What is your URL?',
    default: 'http://byjust.in'
  },
  {
    name: 'themedescription',
    message: 'Enter the theme description:',
    default: 'WordPress theme built with Foundation and Underscores'
  },
  {
    name: 'themeversion',
    message: 'Enter the verison number:',
    default: '1.0.0'
  }
  ];

  this.prompt(prompts, function (props) {
    this.themename = props.themename;
    this.themeuri = props.themeuri;
    this.author = props.author;
    this.authoruri = props.authoruri;
    this.themedescription = props.themedescription;
    this.themeversion = props.themeversion;
    cb();
  }.bind(this));
};

FoundationS.prototype.installunderscores = function installunderscores() {
  this.startertheme = 'https://github.com/Automattic/_s/archive/master.tar.gz';
  this.log.info('Downloading & extracting ' + chalk.yellow('_s'));
  this.tarball(this.startertheme, '.', this.async());
};

FoundationS.prototype.addfiles = function addfiles() {
  this.log(chalk.yellow('Creating dev folders and files'));
  // make directories
  this.mkdir('assets/img');
  this.mkdir('assets/fonts');
  this.mkdir('assets/css');
  this.mkdir('assets/js');
  this.mkdir('assets/js/vendor');
  this.mkdir('scss');
  this.mkdir('src');
  // move Sass files
  this.copy('_settings.scss', 'scss/_settings.scss');
  this.copy('_globals.scss', 'scss/_globals.scss');
  this.copy('_app.scss', 'scss/app.scss');
  this.directory('inc', 'inc');
  this.directory('wordpress', 'scss/wordpress');
  this.directory('theme', 'scss/theme');
  // move grunt files
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('Gruntfile.js');
  this.copy('_gitignore', '.gitignore');
  // _s files
  this.directory('src', 'src');
  this.copy('_functions.php', 'functions.php');
  this.copy('_editor-styles.css', 'editor-styles.css');
};

function findandreplace(dir) {
  var self = this;
  var _ = this._;

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);

    if (stat.isFile() && (path.extname(file) == '.php' || path.extname(file) == '.css' || file == 'Gruntfile.js')) {
      self.log.info('Find and replace _s in ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result;
      result = data.replace(/Text Domain: _s/g, "Text Domain: " + _.slugify(self.themename) + "");
      result = result.replace(/'_s'/g, "'" + _.slugify(self.themename) + "'");
      result = result.replace(/_s_/g, _.underscored(_.slugify(self.themename)) + "_");
      result = result.replace(/ _s/g, " " + self.themename);
      result = result.replace(/_s-/g, _.slugify(self.themename) + "-");

      if (file == 'footer.php') {
        self.log.info('Updating theme information in ' + file);
        result = result.replace(/http:\/\/automattic.com\//g, self.authoruri);
        result = result.replace(/Automattic/g, self.author);
        result = result.replace(/site-footer/g, 'site-footer row');
        result = result.replace(/site-info/g, 'site-info large-12 columns');
      }

      // Add Row
      else if (file == 'header.php') {
        self.log.info('Added row in ' + file);
        result = result.replace(/site-content/g, 'site-content row');
      }

      // Add Columns
      else if (file == 'index.php' || file == 'single.php' || file == 'page.php' || file == 'archive.php' || file == 'search.php') {
        self.log.info('Added columns in ' + file);
        result = result.replace(/content-area/g, 'content-area medium-8 columns');
      }
      else if (file == 'sidebar.php') {
        self.log.info('Added columns in ' + file);
        result = result.replace(/widget-area/g, 'widget-area medium-4 columns');
      }
      else if (file == '404.php') {
        self.log.info('Added columns in ' + file);
        result = result.replace(/content-area/g, 'content-area medium-12 columns');
      }
      fs.writeFileSync(file, result, 'utf8');
    }
    else if (stat.isFile() && path.basename(file) == '_s.pot') {
      self.log.info('Renaming language file ' + chalk.yellow(file));
      fs.renameSync(file, path.join(path.dirname(file), _.slugify(self.themename) + '.pot'));
    }
    else if (stat.isFile() && path.basename(file) == 'README.md') {
      self.log.info('Updating ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result = data.replace(/((.|\n)*)Getting Started(.|\n)*/i, '$1');
      fs.writeFileSync(file, result, 'utf8');
    }
    else if (stat.isDirectory()) {
      findandreplace.call(self, file);
    }
  });
}

FoundationS.prototype.renameunderscores = function renameunderscores() {
  findandreplace.call(this, '.');
  this.log.ok('Done replacing string ' + chalk.yellow('_s'));
};
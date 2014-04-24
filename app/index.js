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
    default: 'My Theme'
  },
  {
    name: 'themeuri',
    message: 'What is the URL of your theme?',
    default: 'http://github.com/mrdink/'
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

FoundationS.prototype.addfiles = function addfiles() {
  this.log(chalk.yellow('Creating dev folders and files'));
  this.mkdir('assets/img');
  this.mkdir('assets/fonts');
  this.mkdir('assets/css');
  this.mkdir('assets/js');
  this.mkdir('assets/js/vendor');
  this.mkdir('scss');
  this.copy('_settings.scss', 'scss/_settings.scss');
  this.copy('_app.scss', 'scss/app.scss');
  this.directory('wordpress', 'scss/wordpress');
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('Gruntfile.js');
  this.copy('_gitignore', '.gitignore');
};

FoundationS.prototype.installunderscores = function installunderscores() {
  this.startertheme = 'https://github.com/Automattic/_s/archive/master.tar.gz';
  this.log.info('Downloading & extracting ' + chalk.yellow('_s'));
  this.tarball(this.startertheme, '.', this.async());
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
      if (file == 'Gruntfile.js') {
        self.log.info('Updating theme information in ' + file);
        result = result.replace(/(Theme Name: )(.+)/g, '$1' + self.themename + "\\n'+");
        result = result.replace(/(Theme URI: )(.+)/g, '$1' + self.themeuri + "\\n'+");
        result = result.replace(/(Author: )(.+)/g, '$1' + self.author + "\\n'+");
        result = result.replace(/(Author URI: )(.+)/g, '$1' + self.authoruri + "\\n'+");
        result = result.replace(/(Description: )(.+)/g, '$1' + self.themedescription + "\\n'+");
        result = result.replace(/(Version: )(.+)/g, '$1'  + self.themeversion + "\\n'+");
      }
      else if (file == 'footer.php') {
        self.log.info('Updating theme information in ' + file);
        result = result.replace(/http:\/\/automattic.com\//g, self.authoruri);
        result = result.replace(/Automattic/g, self.author);
      }
      else if (file == 'functions.php') {
        self.log.info('Updating theme information in ' + file);
        var themejs = "$1  wp_enqueue_script( '" + _.slugify(self.themename) + "-theme', get_template_directory_uri() . '/assets/js/scripts.min.js', array('jquery'), '0.0.1' );\n  if (in_array($_SERVER['SERVER_ADDR'], ['127.0.0.1', '192.168.50.4']) || pathinfo($_SERVER['SERVER_NAME'], PATHINFO_EXTENSION) == 'dev') {\n    wp_enqueue_script( 'livereload', '//localhost:35729/livereload.js', '', false, true );\n  }\n $2"
        result = result.replace(/(get_stylesheet_uri\(\) \);\n)(\n.wp_enqueue_script\()/, themejs);
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
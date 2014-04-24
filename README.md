# generator-foundation_s

A very simple [Yeoman](http://yeoman.io) generator for WordPress starter theme [_s](github.com/automattic/_s) using [Foundation](http://foundation.zurb.com/).


## Getting Started

Install [Yeoman](http://yeoman.io)

```
npm install -g yo
```

Install generator-wp-underscores

```
git clone git@github.com:mrdink/generator-foundation_s.git
```

cd into that repository and run [npm link](https://www.npmjs.org/doc/cli/npm-link.html). It'll install required dependencies and install the package globally, using a symbolic link to your local version.

```
cd generator-foundation_s
npm link
```

Create a folder in your WordPress themes folder and initiate the generator

```
mkdir theme-name && cd $_
yo foundation_s
```

Answer some questions in the prompt and you're done!

Run

```
grunt
```
to watch `.scss` files and live reload!

**Note:** live reload works only if you're working on localhost, 192.168.50.4, or an URL ending in .dev

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

## Credits

[generator-wp-underscores](https://github.com/kdo/generator-wp-underscores)

[Foundation by Zurb](http://foundation.zurb.com/)

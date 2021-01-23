# Sequelize Quick SSCCE Base Repository

Use this repository to quickly create an [SSCCE](http://www.sscce.org/) for your issue! This way your issue will be much easier to investigate.

By using this repository, you won't have to worry about setting up any database. You don't need to install anything, you don't need docker, you don't need to spend time configuring a development environment to create your SSCCE. Everything is already set up for you.

**You just [write your code](src/sscce.js) and it works, directly from GitHub!**

## Step 1 - Create the SSCCE

Go to the [src/sscce.js](https://github.com/papb/sequelize-sscce/blob/master/src/sscce.js) file in this repository, and click the edit button (a pencil).

Since this is not your repository, a fork will be automatically created for you to perform your edit. You will see this message:

<div align="center"><img src="https://i.imgur.com/g2rjLmb.png" /></div>

Just create your SSCCE in that file, and commit it to your fork:

<div align="center"><img src="https://i.imgur.com/HZP9oIg.png" /></div>

## Step 2 - Run your SSCCE with GitHub Actions

This step is **extremely easy**. Now that you have commited your SSCCE to your fork, just open a Pull Request (don't worry, *I won't accept it!*):

<div align="center"><img src="https://i.imgur.com/TTvuBEM.png" /></div>

The idea here is that once you open the pull request, GitHub Actions will automatically execute it for you, since I have it configured in the main repository. I won't accept the pull request, since the goal is just to have your code executed.

It will run your SSCCE and show show a green checkmark (or a red X) next to the commit:

<div align="center"><img src="https://i.imgur.com/QVAKvnz.png" /></div>

## What if you want to make some changes to the SSCCE?

Just add more commits on top of it, in your fork, and your PR will be updated automatically, and the SSCCE will be executed again.

## I don't want to open a pull request for this

Why not? This repository was created exactly for this purpose. Please feel free to use it.

However, if you prefer, you can also have your SSCCE executed in your own fork, via GitHub actions.

## Creating a dialect-specific SSCCE

By default, your SSCCE will be executed on all dialects. If you only want a specific dialect, you can check the `process.env.DIALECT` variable. For example, if you only want to run your SSCCE for postgres, you can add the following at the beginning of your SSCCE code:

```js
if (process.env.DIALECT !== "postgres") return;
// The rest of the SSCCE goes here...
```

## Enabling specific postgres extensions

If your issue needs a postgres extension such as `uuid-ossp`, you should enable it at the beginning of your SSCCE:

```js
await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
// The rest of the SSCCE goes here...
```

## Creating a SSCCE with TypeScript

Just use the [src/sscce.ts](src/sscce.ts) file instead of the [src/sscce.js](src/sscce.js) file. That's it, super easy. Also works directly from GitHub.

## Running the SSCCE locally

This repository also comes with built-in support for running your SSCCE locally on SQLite:

* Clone this repository
* `npm install`
* Edit the `src/sscce.js` as you like
* `npm start`

The above will run your SSCCE locally on SQLite, with no need for any other extra setup.

There is no local support for other dialects; this is harder because requires setting up local databases. It is doable, but out of scope for this repository. [Learn more](https://github.com/sequelize/sequelize/blob/master/CONTRIBUTING.md#3-database).

### Running the SSCCE locally for TypeScript

Do the same as above, except:

* Edit the `src/sscce.ts` file instead of the `src/sscce.js` file
* Run `npm run ts` instead of `npm start`

## License

MIT (c) Pedro Augusto de Paula Barbosa

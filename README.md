# Sequelize SSCCE Template Repository

Use this repository to create an [SSCCE](http://www.sscce.org/) for your issue! This way your issue will be much easier to investigate.

By using this repository, you won't have to worry about setting up any database. You don't need to install anything, you don't need docker, you don't need to waste time configuring a development environment to create your SSCCE. You just [write your code](blob/master/src/sscce.js) and it works. Everything is already set up for you.

## Step 1 - Use this template

This repository is a [GitHub Template Repository](https://help.github.com/en/articles/creating-a-repository-from-a-template). Click the green 'Use this Template' button. This will create a new repository under your account with everything you need for your SSCCE demonstration fully set up!

<div align="center"><img src="https://i.imgur.com/jIwrHg4.jpg" /></div>

## Step 2 - Enable Travis CI and AppVeyor

[Travis CI](https://travis-ci.org/) and [AppVeyor](https://www.appveyor.com/) are two [Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) services that you can (and should) associate to your GitHub repository in order to automatically run your SSCCE. They are used in Sequelize itself to run all the automated tests, such as [here](https://travis-ci.org/sequelize/sequelize/builds/579153246) and [here](https://ci.appveyor.com/project/sushantdhiman/sequelize/builds/27092698), and are responsible for the green checkmarks next to commits:

<div align="center"><img src="https://i.imgur.com/yZUPYor.png" /></div>

They are free to use for open source projects (such as Sequelize and even your SSCCE).

To enable Travis and AppVeyor in your repository, install them into your GitHub account for free and enable them in your [application settings](https://github.com/settings/installations) (by clicking the *Configure* button):

<div align="center"><img src="https://i.imgur.com/szhymAV.png" /></div>

## Step 3 - Edit the SSCCE file with your SSCCE

Normally, you will only change the [`src/sscce.js`](blob/master/src/sscce.js) file. This template comes with an example there, so you just have to change the code to have your own SSCCE.

When you edit the `src/sscce.js` file directly from the GitHub interface, or when you push a new commit to GitHub, your SSCCE will be automatically executed by Travis and AppVeyor (see the green/yellow/red mark to the right of your commit in the [commit list](commits/master) of your repository).

## Step 4 - Link your SSCCE repository in your issue!

Open the issue with a link for your repository. If you are opening multiple issues, you should keep one branch for each issue.

## Note: running locally

You can run your SSCCE locally with `npm start`. Your SSCCE will be executed in SQLite.

Since the databases for each dialect are created and configured in the Continuous Integration environments (Travis CI and AppVeyor), you can only run your SSCCE locally in SQLite, since it is the only dialect that works directly with Node without any extra installation or configuration required. Running the SSCCE in other dialects locally needs more setup effort, and is beyond the scope of this Sequelize SSCCE Template repository. Also, most issues can be reproduced in SQLite anyway!

## Note: running for only one/some dialect(s)

If you only want to run your SSCCE in a specific dialect, you can check the `process.env.DIALECT` variable to decide. For example, if you only want to run your SSCCE for postgres, you can add the following at the beginning of your SSCCE code:

```js
if (process.env.DIALECT !== "postgres") return;
```

## Note: enabling specific postgres extensions

If your issue needs a postgres extension such as `uuid-ossp`, you should enable it at the beginning of your SSCCE:

```js
await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
```
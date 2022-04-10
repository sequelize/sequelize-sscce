# Sequelize Quick SSCCE Base Repository

Use this repository to create an [SSCCE](http://www.sscce.org/) for your issue! It will greatly help us figure out what is going wrong and your issue
will be much easier to investigate.

## Method 1: Create your SSCCE locally (preferred)

### Step 1 - Install this repository locally

Start by [Forking this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo),
then [clone it on your machine](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

Run `npm install` or `yarn` to install the necessary dependencies.

### Step 1 - Create the SSCCE

You now need to create a failing test that accurately represents the issue you're experiencing.

If you want to test against Sequelize 6, modify [src/sscce-sequelize-6.ts](./src/sscce-sequelize-6.ts).
If you want to test against Sequelize 7, modify [src/sscce-sequelize-7.ts](./src/sscce-sequelize-7.ts).

If you are using a version older than Sequelize 6, unfortunately these versions are now EOL and won't receive support.
You should consider migrating to Sequelize 6.

Remember the [SSCCE rules](http://www.sscce.org/). It should be:

- *Short (Small)* - It should not include anything that is not relevant to your issue.
- *Self Contained* - Ensure everything is included, ready to go.
- *Correct* - It should demonstrate the problem you're encountering (i.e. the sscce should fail, but with the right error).
- *Example* - Displays the problem we are trying to solve.

### Step 2 - Run the SSCCE

Use one of our npm scripts to run your SSCCE.

Running with a dialect other than sqlite will require installing an extra package
& having a database running. For convenience, we provide docker containers for each database.

You can also opt to open a pull request, and run the code directly in our CI.

#### sqlite

The easiest of the bunch. Simply run:

```shell
npm run test:sqlite
```

#### postgres

You'll need to install the `pg` package and have a postgres database running.

```shell
# Do this only once.
npm install pg
# or
npm install pg-native

# if you need to use DataTypes.HSTORE, you also need this dependency
npm install pg-hstore

# Start the postgres database using docker.
# Requires docker. You can also run your own database if you prefer.
npm run start:postgres

# run the sscce!
npm run test:postgres
# or
npm run test:postgres-native

# Remember to stop the docker container once you're done.
npm run stop:postgres
```

#### mariadb

```shell
# Do this only once.
npm install mariadb

# Start the mariadb database using docker.
# Requires docker. You can also run your own database if you prefer.
npm run start:mariadb

# run the sscce!
npm run test:mariadb

# Remember to stop the docker container once you're done.
npm run stop:mariadb
```

#### mysql

```shell
# Do this only once.
npm install mysql2

# Start the mysql database using docker.
# Requires docker. You can also run your own database if you prefer.
npm run start:mysql

# run the sscce!
npm run test:mysql

# Remember to stop the docker container once you're done.
npm run stop:mysql
```

#### mssql (SQL Server)

```shell
# Do this only once.
npm install tedious

# Start the mssql database using docker.
# Requires docker. You can also run your own database if you prefer.
npm run start:mssql

# run the sscce!
npm run test:mssql

# Remember to stop the docker container once you're done.
npm run stop:mssql
```

### Step 3 - Commit your SSCCE & sent it to us

Open an issue on the [main sequelize repo](https://github.com/sequelize/sequelize/) describing
your problem and include a link to your SSCCE in it.

You can also open a PR of your fork to [this repository](https://github.com/sequelize/sequelize-sscce),
this way your SSCCE will be run on our CI and will continue existing even if you delete your fork.

## Method 2: Create your SSCCE on GitHub

By using this method, you won't have to worry about setting up any database.
You don't need to install anything, you don't need docker, you don't need to spend time configuring a development environment to create your SSCCE.
Everything is already set up for you in our GitHub actions.

**You just write your code and it works, directly from GitHub!**

### Step 1 - Create the SSCCE

If you want to test against Sequelize 6, go to this file: [src/sscce-sequelize-6.ts](./src/sscce-sequelize-6.ts).
If you want to test against Sequelize 7, go to this file: [src/sscce-sequelize-7.ts](./src/sscce-sequelize-7.ts).

Then click the edit button (a pencil).

Since this is not your repository, a fork will be automatically created for you to perform your edit. You will see this message:

<div align="center"><img src="https://i.imgur.com/g2rjLmb.png" /></div>

Just create your SSCCE in that file, and commit it to your fork:

<div align="center"><img src="https://i.imgur.com/HZP9oIg.png" /></div>

### Step 2 - Run your SSCCE with GitHub Actions

This step is **extremely easy**. Now that you have commited your SSCCE to your fork, just open a Pull Request (don't worry, *I won't accept it!*):

<div align="center"><img src="https://i.imgur.com/TTvuBEM.png" /></div>

The idea here is that once you open the pull request, GitHub Actions will automatically execute it for you, since I have it configured in the main repository. I won't accept the pull request, since the goal is just to have your code executed.

It will run your SSCCE and show a green checkmark (or a red X) next to the commit:

<div align="center"><img src="https://i.imgur.com/QVAKvnz.png" /></div>

## FAQ

### What if you want to make some changes to the SSCCE?

Just add more commits on top of it, in your fork, and your PR will be updated automatically, and the SSCCE will be executed again.

### I don't want to open a pull request for this

You don't have to! If you've opted for method 1, you can just add a link to your forked repository in your issue.

However, opening a pull request will ensure the SSCCE continues to exist even if you delete your fork. Less clutter in your repository list!

### Creating a dialect-specific SSCCE

By default, your SSCCE will be executed on all dialects. If you only want a specific dialect,
you can remove dialects you don't need to test on from the `testingOnDialects` variable in your `sscce-sequelize-x.ts` file.

For example, if you only want to run your SSCCE for postgres, change the following line:

```typescript
// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['mssql', 'sqlite', 'mysql', 'mariadb', 'postgres', 'postgres-native']);
```

to this:

```typescript
// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['postgres']);
```

### Enabling specific postgres extensions

If your issue needs a postgres extension such as `uuid-ossp`, you should enable it at the beginning of your SSCCE:

```js
export async function run() {
  const sequelize = createSequelize6Instance();

  // add it here, after createSequelizeInstance:
  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  // The rest of the SSCCE goes here...
}
```

## License

MIT (c) Pedro Augusto de Paula Barbosa & The Sequelize Team

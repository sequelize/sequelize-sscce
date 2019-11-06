'use strict';

/**
 * Your SSCCE goes inside this function.
 * 
 * Please do everything inside it, including requiring dependencies.
 * 
 * Two parameters, described below, are automatically passed to this
 * function for your convenience. You should use them in your SSCCE.
 * 
 * @param {function(options)} createSequelizeInstance This parameter
 * is a function that you should call to create the sequelize instance
 * for you. You should use this instead of `new Sequelize(...)` since
 * it will automatically setup every dialect in order to automatically
 * run it on all dialects once you push it to GitHub (by using Travis
 * CI and AppVeyor). You can pass options to this function, they will
 * be sent to the Sequelize constructor.
 * 
 * @param {function} log This is a convenience function to log results
 * from queries in a clean way, without all the clutter that you would
 * get from simply using `console.log`. You should use it whenever you
 * would use `console.log` unless you have a good reason not to do it.
 */
module.exports = async function(createSequelizeInstance, log) {
    /**
     * Below is an example of SSCCE. Change it to your SSCCE.
     * Recall that SSCCEs should be minimal! Try to make the shortest
     * possible code to show your issue. The shorter your code, the
     * more likely it is for you to get a fast response.
     */

    // Require necessary things from Sequelize
    const { Sequelize, Op, Model, DataTypes } = require('sequelize');

    // Create an instance, using the convenience function instead
    // of the usual instantiation with `new Sequelize(...)`
    const sequelize = createSequelizeInstance({ benchmark: true });

    // You can use await in your SSCCE!
    await sequelize.authenticate();

    const Author = sequelize.define('Author', {
    name: {
      type: DataTypes.TEXT
    },
    nickname: {
      type: DataTypes.TEXT
    }
  })

  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.TEXT
    }
  })

  const Reader = sequelize.define('Reader', {
    username: {
      type: DataTypes.TEXT
    }
  })

  Author.hasMany(Book)
  Book.belongsTo(Author)
  Book.hasMany(Reader)
  Reader.belongsTo(Book)

  // Since you defined some models above, don't forget to sync them.
  // Using the `{ force: true }` option is not necessary because the
  // database is always created from scratch when the SSCCE is
  // executed after pushing to GitHub (by Travis CI and AppVeyor).
  await sequelize.sync()

  const searchTerm = 'Steve'

  const anAuthor = await Author.create({ name: 'Jim', nickname: 'Jimbo' }).then(i => i.get({ plain: true }))
  const aBook = await Book.create({ title: 'The Smallest Problems', AuthorId: anAuthor.id }).then(i => i.get({ plain: true }))
  await Reader.create({ username: 'Steve', BookId: aBook.id }).then(i => i.get({ plain: true }))

  /* 
    The problem is I need to provide a result that will return the record
    if author.name OR author.nickname OR reader.username is a match for the where clause

    This only works if the search term is in Author.name or Author.nickname AND Reader.username

    Changing name or nickname to Steve will return a result, but if i want to return a result
    when only Reader.username is a match for the search term, it returns nothing. 

    Proposition: allow for nested where clauses inside includes to be an OR relationship 
    with where clause in parent where clause
  */

  log(
    await Author.findAll({
      where: { [Op.or]: [{ name: searchTerm }, { nickname: searchTerm }] },
      include: [{ model: Book, include: [{ model: Reader, where: { username: searchTerm } }] }]
    })
  )
}

};

'use strict';

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function () {
  const sequelize = createSequelizeInstance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });

  class User extends Model { }
  class Post extends Model { }
  class Like extends Model { }
  class Comment extends Model { }
  class Relationship extends Model { }

  User.init({
    // attributes
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Username can't be empty.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists.",
      },
      validate: {
        isEmail: {
          args: true,
          msg: "Enter a valid email address.",
        },
        notEmpty: {
          args: true,
          msg: "Email can't be empty.",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Username has been taken.",
      },
      validate: {
        len: {
          args: [2],
          msg: "Username must be at least 2 characters long.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Password can't be empty.",
        },
      },
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          args: true,
          msg: "Avatar URL must be a valid URL.",
        },
      },
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    followedUserCount: {
      // number of users a user is following
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    followingUserCount: {
      // number of user's followers
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
    {
      sequelize,
      modelName: "user",
      underscored: true,
      // options
      indexes: [
        { unique: true, fields: ["email"] },
        { unique: true, fields: ["username"] },
      ],
    });

  // ==========
  Post.init({
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          args: true,
          msg: "Media URL must be a valid URL.",
        },
      },
    },
    userLocation: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      allowNull: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "User location can't be empty.",
        },
        isCoord() {
          if (this.userLocation) {
            // if userLocation exists
            if (
              !Array.isArray(this.userLocation) ||
              this.userLocation.length !== 2
            ) {
              throw new Error(
                "User location must be an array of latitude and longitude."
              );
            }
          }
        },
      },
    },
    caption: {
      type: DataTypes.CITEXT,
      allowNull: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "Caption can't be empty.",
        },
        len: {
          args: [0, 140],
          msg: "Caption must be less than 100 characters.",
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      unique: true,
    },
  },
    {
      sequelize,
      modelName: "post",
      underscored: true,
      indexes: [{ unique: true, fields: ["slug"] }],
    },
    // create CITEXT column type
    sequelize.query("CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;")
  );

  // ==========
  Relationship.init({},
    {
      sequelize,
      modelName: "relationship",
      underscored: true,
      indexes: [{ unique: true, fields: ["followed_user_id", "following_user_id"] }]
    }
  );

  // ==========
  Like.init({},
    {
      sequelize,
      modelName: "like",
      underscored: true,
      indexes: [{ unique: true, fields: ["post_id", "user_id"] }]
    }
  );

  // ==========
  Comment.init({
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Comment can't be empty.",
        },
      },
    },
  },
    {
      sequelize,
      modelName: "comment",
      underscored: true,
    });

  // associations
  User.hasMany(Post, { onDelete: "CASCADE" });
  User.hasMany(Like, { onDelete: "CASCADE" });
  User.hasMany(Relationship, {
    as: "followedUsers",
    foreignKey: "followed_user_id",
    onDelete: "CASCADE",
  });
  User.hasMany(Relationship, {
    as: "followingUsers",
    foreignKey: "following_user_id",
    onDelete: "CASCADE",
  });
  User.hasMany(Comment, { onDelete: "CASCADE" });
  Post.belongsTo(User);
  Post.hasMany(Like, { onDelete: "CASCADE" });
  Post.hasMany(Comment, { onDelete: "CASCADE" });
  Relationship.belongsTo(User, {
    as: "followedUsers",
    foreignKey: "followed_user_id",
  });
  Relationship.belongsTo(User, {
    as: "followingUsers",
    foreignKey: "following_user_id",
  });
  Comment.belongsTo(User);



  // ==========
  await sequelize.sync();

  // ==========
  const user = await User.create({ fullName: "John Doe", email: "john@gmail.com", username: "johndoe", password: "super_password" });
  const postObjects = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item, index) => ({ mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Eiffel_Tower_24_December_2011.jpg', slug: `slug-${index}`, userId: user.id }))
  log(await Post.bulkCreate(postObjects));
  await Like.create({ userId: user.id, postId: 1 });
  await Comment.create({ text: 'Lorem seqsum', postId: 1, userId: user.id });

  //   the query
  const posts_1 = await Post.findAll({
    where: { user_id: [1] },
    limit: 9,
    offset: 0,
    attributes: {
      exclude: ["updatedAt", "user_id"],
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("likes.user_id")),
          "likeCount",
        ],
        [
          sequelize.fn("array_agg", sequelize.col("likes.user_id")),
          "likedUserIds",
        ],
      ],
    },
    order: [
      ["createdAt", "DESC"]
    ],
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatarUrl"],
      },
      {
        model: Like,
        attributes: [],
        duplicating: false,
      },
      {
        model: Comment,
        attributes: ["id", "text"],
        duplicating: false,
        include: {
          model: User,
          attributes: ["id", "username"],
        },
      },
    ],
    group: ["post.id", "user.id", "comments.id", "comments->user.id"],
  });

  log('-------running second query-------')
  const posts_2 = await Post.findAll({
    where: { user_id: [1] },
    limit: 9,
    offset: 9,
    attributes: {
      exclude: ["updatedAt", "user_id"],
      include: [
        [
          sequelize.fn("COUNT", sequelize.col("likes.user_id")),
          "likeCount",
        ],
        [
          sequelize.fn("array_agg", sequelize.col("likes.user_id")),
          "likedUserIds",
        ],
      ],
    },
    order: [
      ["createdAt", "DESC"]
    ],
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatarUrl"],
      },
      {
        model: Like,
        attributes: [],
        duplicating: false,
      },
      {
        model: Comment,
        attributes: ["id", "text"],
        duplicating: false,
        include: {
          model: User,
          attributes: ["id", "username"],
        },
      },
    ],
    group: ["post.id", "user.id", "comments.id", "comments->user.id"],
  });

  const post1_ids = posts_1.map(post => post.id);
  const post2_ids = posts_2.map(post => post.id);
  const all_ids = post1_ids.concat(post2_ids)
  const unique_ids = new Set(all_ids);
  expect(all_ids.length).to.equal(unique_ids.size)
};

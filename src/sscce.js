'use strict';

if (process.env.DIALECT !== 'mysql') return;

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is a utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// Your SSCCE goes inside this function.
module.exports = async function() {
      const DEFAULT_LIMIT_PER_PAGE = 5

      const paginator = {
          DEFAULT_LIMIT_PER_PAGE,
          calculateOffset: (page, limit = DEFAULT_LIMIT_PER_PAGE) => {
              return (page - 1) * limit
          },
         calculateTotalPages: (total, limit = DEFAULT_LIMIT_PER_PAGE) => {
              return Math.ceil(total / limit)
          }
       }

      const prepareConds = (prevConditions, key, cond, val) => {
         const opts = {
            ...prevConditions
        }
         if (!opts.where) {
             opts.where = {}
         }
         if (!opts.where[key]) {
             opts.where[key] = {}
         }
         opts.where[key][cond] = val
         return opts
     }
    
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });
    const Foo = sequelize.define('Foo', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
      },
      order_state: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: 'DRAFT'
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'usd'
      },
      reg_date: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    await sequelize.sync();
  
  
    async function find ({
      id = null,
      someState = null,
      elapsedTime: elapsedTime = null,
      page = 1,
      limit = DEFAULT_LIMIT_PER_PAGE
    } = {}) {
      limit = limit || DEFAULT_LIMIT_PER_PAGE

      const offset = paginator.calculateOffset(page, limit)
      let opts = {
        limit,
        offset
      }

      if (id) {
        opts = prepareConds(opts, 'id', Op.eq, id)
      }

      someState = someState ? someState.filter(item => item) : []

      if (someState && Array.isArray(someState) && someState.length) {
        if (someState.length === 1) {
          opts = prepareConds(opts, 'order_state', Op.like, `%${someState[0].toUpperCase()}%`)
        } else {
          opts = prepareConds(opts, 'order_state', Op.in, someState.map(item => item.toUpperCase()))
        }
      }

      if (elapsedTime) {
        opts = prepareConds(opts, 'reg_date', Op.gt, Sequelize.fn(
          'DATE_SUB',
          Sequelize.literal('NOW()'),
          Sequelize.literal(`INTERVAL ${elapsedTime} MINUTE`)
        ))
      }

      const result = await Foo.findAndCountAll(opts)
      const collection = result.rows.map(item => item.toJSON())

      return {
        total: result.count,
        page,
        limit,
        collection
      }
    }
  
    async function initialize () {
      const states = ['DRAFT', 'PENDING', 'WORKING', 'DONE']
      
      for (let i = 0; i < 20; i++) {
        log(await Foo.create({
          order_state: states[i % states.length],
          currency: 'usd',
          amount: 12.34,
          reg_date: new Date(2019, 12, 4, 12, 30, 0, 0)
        }))
      }
      
      log(await find({
        someState: states,
        elapsedTime: 1,
        page: 1,
        limit: 3
      }))     
    }
  
    await initialize()
};

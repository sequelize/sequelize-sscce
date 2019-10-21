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
  const { Op, DataTypes } = require('sequelize');

  // Create an instance, using the convenience function instead
  // of the usual instantiation with `new Sequelize(...)`
  const sequelize = createSequelizeInstance({ benchmark: true });

  // You can use await in your SSCCE!
  await sequelize.authenticate();

  // Define some models and whatever you need for your SSCCE.
  // Note: recall that SSCCEs should be minimal! Try to make the
  // shortest possible code to show your issue. The shorter your
  // code, the more likely it is for you to get a fast response
  // on your issue.
  const patient = sequelize.define('patient', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    fullName: DataTypes.STRING
  });
  const inpatient = sequelize.define('inpatient', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    patientId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    patientInsurerId: DataTypes.UUID,
    roomNameId: DataTypes.UUID
  });
  const unit = sequelize.define('unit', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING
  });
  const patientInsurer = sequelize.define('patientInsurer', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    patientId: DataTypes.UUID,
    cardNo: DataTypes.STRING,
    companyPartnerId: DataTypes.UUID
  });
  const companyPartner = sequelize.define('companyPartner', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    companyName: DataTypes.STRING
  })
  patient.hasMany(patientInsurer)
  inpatient.belongsTo(patient)
  inpatient.belongsTo(unit, { as: 'room', foreignKey: 'roomNameId' })
  patientInsurer.belongsTo(patient)
  patientInsurer.belongsTo(companyPartner)

  // Since you defined some models above, don't forget to sync them.
  // Using the `{ force: true }` option is not necessary because the
  // database is always created from scratch when the SSCCE is
  // executed after pushing to GitHub (by Travis CI and AppVeyor).
  await sequelize.sync();

  // Call your stuff to show the problem...

  const unitBougenville = await unit.create({ name: 'Bougenville' })
  const unitRose = await unit.create({ name: 'Rose' })

  const company1 = await companyPartner.create({ companyName: 'Private 1' })
  const company2 = await companyPartner.create({ companyName: 'Private 2' })

  const patientJohn = await patient.create({ fullName: 'John Doe' })
  const patientJane = await patient.create({ fullName: 'Jane Doe' })

  const insurerJohn1 = await patientInsurer.create({ patientId: patientJohn.id, cardNo: '100000001', companyPartnerId: company1.id })
  const insurerJane1 = await patientInsurer.create({ patientId: patientJane.id, cardNo: '100000002', companyPartnerId: company1.id })
  const insurerJohn2 = await patientInsurer.create({ patientId: patientJohn.id, cardNo: '200000001', companyPartnerId: company2.id })

  const inpatientJohn1 = await inpatient.create({ patientId: patientJohn.id, patientInsurerId: insurerJohn1.id, roomNameId: unitBougenville.id })
  const inpatientJane1 = await inpatient.create({ patientId: patientJane.id, patientInsurerId: insurerJane1.id, roomNameId: unitRose.id })

  // non result option
  let nonResultOption = {
    limit: 20,
    include: [{
      model: unit,
      as: 'room',
      where: {
        'name': {
          [Op.iLike]: '%bou%'
        }
      }
    }, {
      model: patient,
      include: [{
        model: patientInsurer,
        include: [{
          model: companyPartner
        }]
      }]
    }]
  }
  log(await inpatient.findAll(nonResultOption));

  // working options with result
  let balancedConditionOption = {
    limit: 20,
    include: [{
      model: unit,
      as: 'room',
      where: {
        'name': {
          [Op.iLike]: '%bou%'
        }
      }
    }, {
      model: patient,
      where: {
        'fullName': {
          [Op.iLike]: '%john%'
        }
      },
      include: [{
        model: patientInsurer,
        include: [{
          model: companyPartner
        }]
      }]
    }]
  }
  log(await inpatient.findAll(balancedConditionOption));

  let noLimitOption = {
    include: [{
      model: unit,
      as: 'room',
      where: {
        'name': {
          [Op.iLike]: '%bou%'
        }
      }
    }, {
      model: patient,
      include: [{
        model: patientInsurer,
        include: [{
          model: companyPartner
        }]
      }]
    }]
  }
  log(await inpatient.findAll(noLimitOption));
};

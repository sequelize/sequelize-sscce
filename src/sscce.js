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

  const modelOptions = {
    underscored: true,
    timestamp: false
  };

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
  }, modelOptions);
  const inpatients = sequelize.define('inpatients', {
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
  }, modelOptions);
  const unit = sequelize.define('unit', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING
  }, modelOptions);
  const patientInsurer = sequelize.define('patientInsurer', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    patientId: DataTypes.UUID,
    cardNo: DataTypes.STRING,
    companyPartnerId: DataTypes.UUID
  }, modelOptions);
  const companyPartner = sequelize.define('companyPartner', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    companyName: DataTypes.STRING
  }, modelOptions);
  patient.hasMany(patientInsurer);
  inpatients.belongsTo(patient);
  inpatients.belongsTo(unit, { as: 'room', foreignKey: 'roomNameId' });
  patientInsurer.belongsTo(patient);
  patientInsurer.belongsTo(companyPartner);

  // Since you defined some models above, don't forget to sync them.
  // Using the `{ force: true }` option is not necessary because the
  // database is always created from scratch when the SSCCE is
  // executed after pushing to GitHub (by Travis CI and AppVeyor).
  await sequelize.sync();

  // Call your stuff to show the problem...
  try {
    await sequelize.query('truncate table inpatients cascade;\n' +
      'truncate table units cascade;\n' +
      'truncate table patient_insurers cascade;\n' +
      'truncate table patients cascade;\n' +
      'truncate table company_partners cascade;\n');
  } catch (e) {
    console.log(e.message)
  }

  await sequelize.query('INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'491f1717-0e6b-41ae-bdbc-9759c92ab0b3\', \'fewfwffwe\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'4c9a7611-ee77-49b3-aafe-02fbccbe05fe\', \'Inhealth\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'8e89cf63-1ad3-4d7b-a766-35b7577669be\', \'kfc\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'9e733aca-e42f-4702-949b-7c1035bfa61a\', \'Allianz\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'e29cbc8d-b2c0-46c8-a1fc-c337866e3b6e\', \'top\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'df425ead-2ed4-4031-be0b-abb1520a689e\', \'Telkomsel Regional Jawa Barat\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'d299707e-a2a1-4b5a-bd00-c6c8dd45f47f\', \'dove\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'b6f01683-a01a-4198-aea3-b70524b51fba\', \'Telkomsel Regional Jawa Barat\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'ae22aeb4-addf-46ac-a9f4-b4e19e41b267\', \'bk\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'9695d50b-ea4a-42b6-94b2-9ecdf9be4e9d\', \'company\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'92f6d502-d5ee-4b31-88d8-c0f2bd572c7a\', \'t32\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'1662709d-88bd-4e64-b23d-f2e605e4470f\', \'Perum Damri\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'285b1d14-7496-489d-999b-7c39a89117ef\', \'PT RNI (Persero)\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'58db6374-65df-47bc-b7c4-a4992ca24f8d\', \'Perum PFN\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'67b03df0-ae9d-4911-9d73-62d154a2df65\', \'Telkom Property\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'8bfd0040-72c5-408c-a508-b02ad56e5be1\', \'hp\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'898de5cf-3ee5-448f-ae0d-2ed98bd1fa32\', \'fwefw\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'8373cf47-ef9b-4868-95bf-5fed7191aca1\', \'mcd\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'7ec6d872-ceb6-4996-be2f-f2ce552f6e8e\', \'ADMEDIKA\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'762adb7e-de73-40f4-911a-89042be17358\', \'test company\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'4f9cc4ab-cda6-4b24-9421-02ef3b216555\', \'PT Akasha Wira Internasional\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'2d90b920-975e-4adf-8319-17966bd7b292\', \'Telkomsel\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'519fc4bb-2032-4d64-9acf-d41eb2c1b57c\', \'PT Dinamika Informatika\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'cb74b6db-5d2c-4d86-9b34-f29ea29535ac\', \'IMD Global Services\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'c999f5a5-e262-4514-9040-e41efe8bf3d6\', \'PT Paragon Technology and Innovation\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'fb9faf93-0faa-40f5-bfa6-2d3df10485f0\', \'bengbeng\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'01dd472e-7512-4764-bb3a-f4af56a005f6\', \'PT PELNI\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    'INSERT INTO company_partners(id, company_name, created_at, updated_at) VALUES (\'37a4cc31-5dac-4b8c-a9be-be129ffcd5be\', \'PT Paragon Indonesia\', \'2019-10-21 08:59:29.482088\', \'2019-10-21 08:59:29.482088\');\n' +
    '\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'17657ff4-21a3-44d6-8b34-f83c5947d679\', \'angga\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'d2de76ab-9d81-4cb2-9eef-475924f2e16c\', \'temp patient\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'1af73cf4-c031-45e2-99ac-2ec3f45039a2\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'e31d3314-16b5-4908-93bb-f1332b3933e6\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'1e352d75-1351-44e3-a83a-c5538c37b888\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'03192cf8-d519-4850-91aa-cce1eb7069a1\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'d13d9501-0d32-49e4-86ec-be4423c0a5ed\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'74c3f203-f08e-4acb-9ce2-061080f30efc\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'866626e3-977e-42f3-9242-5366e9c2bacb\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'e2faeea6-c790-4ddd-af57-4d809834b4c4\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'a4fb6153-916e-48c1-9dc9-bfc8a5a98bc8\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'2af8cce7-6021-429e-a5f2-c6ba6e6f302b\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'d286dbff-7d8b-43f6-b777-5e0abe5914fd\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'8855b54a-d231-4659-96aa-e94ee7f2fcf3\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'39c7e879-021f-4016-8e67-6e743e585377\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'3ebd5cc3-67a6-4cd3-9fef-c117a2589e3b\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'57ffd972-17a8-4639-8564-a967dba12da1\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'c0856430-8859-404b-9a6e-763984cb62d5\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'e41422b9-b7de-4038-abf2-a13cee77a92a\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'a424a8b7-9644-4ff6-b629-001dbc1ec432\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'bfdb6f96-7ae3-4387-973e-423b87357131\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'02287e81-70bb-4b84-ae5d-4f8aaa1c66e5\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'464ac010-11e4-4c0b-a04c-e831803421a5\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'edb5b00d-d94d-474e-9370-ec9ada0eea09\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'a0a3b580-6264-4af6-b14d-f380dfc58c65\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'9694f588-fc08-41b2-af83-39fc70a9e5c7\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'dfd72a8e-771f-4c84-bc24-c7b7ffd20c20\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'6507d167-880c-48dd-836a-67a855d9a658\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'e8507089-1044-49a9-bb6d-d899bbe21e86\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'80287022-c342-44f7-a08b-4208c44bc198\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'908ce2b3-fe3c-4469-ad03-9aa4d701e28b\', \'anak\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'08d75dbd-57e1-4a75-8f3b-c1042ef3e236\', \'baby\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'9456f398-d419-4213-8cff-c8119fb4703f\', \'San Wawa\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'2ab988f4-2e6a-4b17-bbdb-505ac922ce40\', \'Wulan\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'54e4444a-1507-4c5b-bf70-2172db10db7f\', \'uuSA\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'3c7814a3-9a74-4bb6-8286-f5f7c0481447\', \'annisa\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'e10fe707-db30-4bad-b140-62411c1b7c15\', \'cahyani\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'fa8b5edb-276c-434c-8116-e0452f64dab6\', \'Kemila Isdiandini\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'66fe612e-4ea0-4dfb-9a7b-b76abaf7b20e\', \'Hasna Afifa\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'fd785b71-5330-4bd6-8090-887e8a63ffd4\', \'Triana Septiani\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'7965271f-edba-4d2f-b435-ada391d4a1d9\', \'Ruti Agum Gumelar\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'5f7de053-8c2f-4668-a819-34be1cff117a\', \'Bruno priori\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'7d628f34-5631-44a5-bedb-f8be9fd97ac6\', \'temp patient\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'a40a078c-99f5-4794-aefa-e0ecec6c902c\', \'pat\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'e80b98aa-9e20-4a07-9c73-17f50ab4b98a\', \'Mr. X\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f\', \'Rizky Riadhy\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'3d375016-952e-45c6-aca5-a600bbb143f8\', \'Erly Handayani\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'d80419b9-e2ed-4e06-ab63-6f860c4341a7\', \'temp patient\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8\', \'Andi Pratiwi\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'5006cf6f-e08a-47dd-a33a-17b126c527fc\', \'Karunya pisan\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'0fec9db5-cf00-4b57-beed-9c8ba0c2e296\', \'babacoco\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'cb71f750-7518-460c-87e0-c1f7723170dd\', \'Wirawan\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'6026c9a2-aa9f-47f1-a2c0-00f5b0e1c8a5\', \'Roni Kurniawan\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'88044809-ce37-4bcc-bbab-423a2e82634e\', \'Jelema Gering\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'387ee372-3f72-444a-8964-562ac7b4c355\', \'temp pati\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'b1e4e500-7017-41e0-a8a3-a7468515a0ea\', \'Andini Pratiwi\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'a8071e5f-3d70-41b8-81f1-7a0fdbdebd53\', \'Husni Ambar\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'d32d28f2-bc9a-4b02-a593-7dcb34d36766\', \'test\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'d7ebbd53-32c1-411b-bc5c-97550831a01e\', \'Atang\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    'INSERT INTO patients(id, full_name, created_at, updated_at) VALUES (\'ffe738a1-c7be-40f1-88a7-4640036bea8d\', \'Yahya\', \'2019-10-21 08:59:57.806147\', \'2019-10-21 08:59:57.806147\');\n' +
    '\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'c02e4c41-2733-4f84-afcd-ea0b71fd9f9c\', \'d2de76ab-9d81-4cb2-9eef-475924f2e16c\', \'345678-ngbfdsfads-8765432\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'b73dd617-bb7d-4e2d-97a3-1a7fe57ca580\', \'17657ff4-21a3-44d6-8b34-f83c5947d679\', \'000111\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'f4227ec0-6047-4948-a990-2ff224459919\', \'d13d9501-0d32-49e4-86ec-be4423c0a5ed\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'f7afcd96-f93e-4742-ace0-bf7402d8d447\', \'03192cf8-d519-4850-91aa-cce1eb7069a1\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'a14e4dc1-f8bb-488d-9797-b51126c3e554\', \'74c3f203-f08e-4acb-9ce2-061080f30efc\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'da1a6a3a-2151-423f-9953-cee4522d7757\', \'e2faeea6-c790-4ddd-af57-4d809834b4c4\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'0b8f1056-5450-4288-851d-99939942d66b\', \'a4fb6153-916e-48c1-9dc9-bfc8a5a98bc8\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'e865b809-5da3-49f3-ba9b-808af4e10762\', \'2af8cce7-6021-429e-a5f2-c6ba6e6f302b\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'580b0e1f-4b14-4df3-841d-4d4dbe172856\', \'d286dbff-7d8b-43f6-b777-5e0abe5914fd\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'9fd75241-b7ad-4504-89fb-eca11e82ffb4\', \'8855b54a-d231-4659-96aa-e94ee7f2fcf3\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'60555c16-bd3e-4ffa-98e8-b6f6d35486fa\', \'39c7e879-021f-4016-8e67-6e743e585377\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'a0b1220b-c842-4fea-9dde-a4ad364c704e\', \'3ebd5cc3-67a6-4cd3-9fef-c117a2589e3b\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'05eb3e40-5e66-44a6-a5bc-444cb589da5c\', \'57ffd972-17a8-4639-8564-a967dba12da1\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'48310564-a4f8-4bee-b80d-ababb078bfb2\', \'c0856430-8859-404b-9a6e-763984cb62d5\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'95d3a33a-b23d-4fe2-af71-44b041ec31d2\', \'e41422b9-b7de-4038-abf2-a13cee77a92a\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'d5d61cee-fb30-4f95-a300-38795c6f6636\', \'a424a8b7-9644-4ff6-b629-001dbc1ec432\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'61ed602c-13e2-4cac-a7ae-ab67b59bd1da\', \'bfdb6f96-7ae3-4387-973e-423b87357131\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'d775784b-f215-4e68-b0b5-4837b605753f\', \'02287e81-70bb-4b84-ae5d-4f8aaa1c66e5\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'95cb6cb0-cf39-4271-a67b-92877cddea8f\', \'464ac010-11e4-4c0b-a04c-e831803421a5\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'2b5ab231-a803-4663-94f4-6a8016dc0d9c\', \'edb5b00d-d94d-474e-9370-ec9ada0eea09\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'119cb505-88d2-4fb4-936e-da2dce29a256\', \'a0a3b580-6264-4af6-b14d-f380dfc58c65\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'6dda421e-b840-4109-913c-c1d56c478559\', \'e31d3314-16b5-4908-93bb-f1332b3933e6\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'2c371222-045c-43c4-a564-b333f09d4a8d\', \'9694f588-fc08-41b2-af83-39fc70a9e5c7\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'50a0a56b-7731-441e-a666-a6f5b6977c4a\', \'dfd72a8e-771f-4c84-bc24-c7b7ffd20c20\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'cc154993-1508-44fb-b92e-5c7f53132131\', \'6507d167-880c-48dd-836a-67a855d9a658\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'58873d76-c31b-470c-a4e3-3d0c3e850303\', \'e8507089-1044-49a9-bb6d-d899bbe21e86\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'630f848b-fcdd-449f-bca6-d1cd91837c1b\', \'80287022-c342-44f7-a08b-4208c44bc198\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'df0da6e1-c28d-4672-87bd-b2f22ba03ef6\', \'1af73cf4-c031-45e2-99ac-2ec3f45039a2\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'c0a7707b-b759-47a9-a9fe-da7e981f7af7\', \'908ce2b3-fe3c-4469-ad03-9aa4d701e28b\', \'90909\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'3fc78b16-6021-4446-92d8-0430f2caa598\', \'9456f398-d419-4213-8cff-c8119fb4703f\', \'11111\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'7141e51b-f580-4ca7-a499-680aef0c0a33\', \'fd785b71-5330-4bd6-8090-887e8a63ffd4\', \'1234\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'ae76044a-7367-409b-bee3-4121f83a5656\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'d3ae90fa-1126-4401-a4db-65a48c22a716\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'63453423-6452343\', \'fb9faf93-0faa-40f5-bfa6-2d3df10485f0\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'797d271a-3ead-4c4c-af69-59184768ef77\', \'2ab988f4-2e6a-4b17-bbdb-505ac922ce40\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'0fdb77ae-375c-494b-af54-f33493b963a9\', \'2ab988f4-2e6a-4b17-bbdb-505ac922ce40\', \'89281982102910\', \'b6f01683-a01a-4198-aea3-b70524b51fba\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'f998a917-a586-40e4-8535-456aaea53ee6\', \'fa8b5edb-276c-434c-8116-e0452f64dab6\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'f8316a96-77e9-4dd2-8981-d035749674c8\', \'7965271f-edba-4d2f-b435-ada391d4a1d9\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'915ddf83-6d25-4092-89ae-cab80bd3bef7\', \'7965271f-edba-4d2f-b435-ada391d4a1d9\', \'28198219829\', \'01dd472e-7512-4764-bb3a-f4af56a005f6\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'567936a9-7c6c-4a6f-8be6-47ba8f4e889d\', \'7965271f-edba-4d2f-b435-ada391d4a1d9\', \'9201921092\', \'285b1d14-7496-489d-999b-7c39a89117ef\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'9f7a19f7-dc9a-4d62-a8c1-56454ce96a6f\', \'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'569a1f7f-4fe2-4f34-8aeb-690ed9ca6e5f\', \'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8\', \'892109201\', \'4f9cc4ab-cda6-4b24-9421-02ef3b216555\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'6f3639dd-7d4a-475c-ac5e-26da107ce670\', \'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'47b60284-e9e9-4487-abd4-1f7d8aa5962c\', \'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f\', \'213123101910100\', \'cb74b6db-5d2c-4d86-9b34-f29ea29535ac\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'3cef20a8-3493-4dff-b180-5c91c1628921\', \'cb71f750-7518-460c-87e0-c1f7723170dd\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'139a94c0-3011-491b-bfbe-2d0b2b0576c9\', \'cb71f750-7518-460c-87e0-c1f7723170dd\', \'001\', \'58db6374-65df-47bc-b7c4-a4992ca24f8d\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'40f1a476-3967-4205-a6db-6d05672c67d2\', \'cb71f750-7518-460c-87e0-c1f7723170dd\', \'009\', \'2d90b920-975e-4adf-8319-17966bd7b292\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'dd5e07dc-68c2-4766-8fb4-e7e06cc3830b\', \'cb71f750-7518-460c-87e0-c1f7723170dd\', \'004\', \'4f9cc4ab-cda6-4b24-9421-02ef3b216555\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'c7986cca-6866-49c1-9e61-8781ff47f952\', \'cb71f750-7518-460c-87e0-c1f7723170dd\', \'1233333\', \'2d90b920-975e-4adf-8319-17966bd7b292\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'89f32ad1-cfe7-4b4a-99c7-d8d33c9444c4\', \'cb71f750-7518-460c-87e0-c1f7723170dd\', \'123131\', \'cb74b6db-5d2c-4d86-9b34-f29ea29535ac\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'c32251f2-747f-469c-bdee-c37c5b8d3aac\', \'6026c9a2-aa9f-47f1-a2c0-00f5b0e1c8a5\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'0946d5c5-d256-4fe4-9e13-107a3bdca08d\', \'b1e4e500-7017-41e0-a8a3-a7468515a0ea\', \'829129\', \'2d90b920-975e-4adf-8319-17966bd7b292\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'e0e7a505-5de3-41b6-a065-f0fe3fd58635\', \'fa8b5edb-276c-434c-8116-e0452f64dab6\', \'829182918\', \'4f9cc4ab-cda6-4b24-9421-02ef3b216555\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'27013409-6005-42fb-a40d-495b63cee0a9\', \'5f7de053-8c2f-4668-a819-34be1cff117a\', \'\', null, \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'5cf6f404-624b-4691-8f6c-f8843cd5b5f8\', \'5f7de053-8c2f-4668-a819-34be1cff117a\', \'23109391239183918391\', \'519fc4bb-2032-4d64-9acf-d41eb2c1b57c\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    'INSERT INTO patient_insurers(id, patient_id, card_no, company_partner_id, created_at, updated_at) VALUES (\'04bf49fe-9af7-43cb-a77a-835124b1a7c2\', \'5f7de053-8c2f-4668-a819-34be1cff117a\', \'2913810381902381092381\', \'285b1d14-7496-489d-999b-7c39a89117ef\', \'2019-10-21 09:00:21.358468\', \'2019-10-21 09:00:21.358468\');\n' +
    '\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'f2ec5dab-4dcb-4dd7-81a2-99c141dbf554\', \'Parent\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'72623922-8991-4582-8b60-1809bc459120\', \'USER\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'e718695d-1f7c-49f9-bc0f-a8ba420936b2\', \'wirawan\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'97f7a7f0-9fb9-4b50-9369-b15fd183600f\', \'Klinik Internis\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'cc7c2d28-1a4a-464c-b42c-c438e111495b\', \'Klinik Jantung\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'e09782ed-ac94-4907-a69b-f5c75acc14b3\', \'Klinik Ortopedi\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'9c8fc579-b052-465d-9ce9-41025b9b89b2\', \'Klinik THT\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'b25662b9-b8fc-4734-a137-7e2933c714e7\', \'Klinik bedah THT\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'1b743cab-67fa-4c6d-9247-21739c891c84\', \'Klinik biasa\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'c501fc85-cb65-4fec-bbc6-3d1ee6c7aec1\', \'klinik yah\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'9bbf43bd-0014-40fd-ba2f-e5d6354a4ec1\', \'ADMIN3\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'7ad0e456-1719-49ae-b4be-f3fc4359bd05\', \'Farmasi rawat dan jalan\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'c88338e1-ae1f-45a8-bd2d-e40f852b5e6c\', \'Poliklinik Gizi\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'2e5838a9-ece5-404f-805c-ad57f80e03b8\', \'yey\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'eeb2533a-2628-4359-a56c-90c34aaf3e8d\', \'hhh\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'0bf25977-70bb-4919-916d-0d3ad1b2fb06\', \'jantungan\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'de4ca38e-3418-469b-b4d5-63811704324a\', \'ADMIN3\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'f255634d-aba0-445e-96ac-34ed9e3b197c\', \'Unit baru\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'57acad18-9087-4da7-987a-d16e71aa5903\', \'gigi susu\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'86386f1b-cb78-4211-b534-94efaa3d5edb\', \'Lab\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'78e2c726-f77f-422e-a330-b554909f4d84\', \'jantung\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'dadc9e2d-c37f-4737-9ef9-335ff1b83b8f\', \'Poliklinik\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'fd054762-04c4-410a-85a5-70434cf78701\', \'klinik\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'e457de85-ef34-488e-bf59-f9c740ff5bae\', \'Rawat Inap\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'d30926cd-103a-40f7-b5fa-bee3ab8dabe0\', \'tulang rawan\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'44ec53d2-68d5-4c5d-a37e-73524605c856\', \'Poliklinik Pulmonologi dan Kedokteran Respirasi (Paru)\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'a87a94ba-d827-42e6-8fd5-7ce2bbd6b544\', \'Rawat  inap 2\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'f8fcb730-acaf-4752-b95f-da614d947bab\', \'Rawat Inap Ex\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'2a767b87-ae51-4980-8d07-db832bd7b77b\', \'Klinik Konsultasi Gizi\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'16012792-d441-4a8d-bbc5-dccb879018e2\', \'Andini Pratiwi\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'a1c5d34e-95ca-49fe-8703-e16040efa228\', \'Andini Pratiwiwiwi\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'551e53e0-10c9-402e-b261-061c8ac64a33\', \'ITB\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'ffc34001-29d3-45e7-90f0-28323128b403\', \'ITS\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'b50b8d7d-d153-48e9-91cf-405cdaf57fde\', \'Klinik Anak\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'a3276ad8-3af2-464d-9e32-e5f906b26bb1\', \'Klinik Gigii\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'05677198-1bfc-4ef1-840b-94878f61a9af\', \'Klinik Gizi\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'e1003d83-c309-4a21-9cd9-a465dbe8fc33\', \'Rawat Jalan 11\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'ab08d0ed-4f7e-4d68-8917-ef55775681e8\', \'Yuda\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'cdd1d298-3cf3-4f9b-a1b8-c05f06de79a9\', \'adimin\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'c1e2cf55-e62f-40b8-959f-7c73b1e5d292\', \'andpratiwi\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'9324ec72-5c39-4be1-b2fb-461774458a05\', \'gigi\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'b6c62366-4539-4f58-8f46-5d2280408f78\', \'Laboratorium\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'54d5d1be-f0bb-4b57-959d-df29ebbc5d17\', \'Poliklinik Penyakit Dalam\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'32300b08-a395-45af-a68f-4efc26faa833\', \'Poliklinik Telinga Hidung Tenggorokan\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'a99ecd9a-82cc-4508-aaaa-91a7f7dbecd5\', \'Poliklinik Kedokteran Jiwa atau Psikiatri\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'e8dd649c-4946-4a5c-89fa-567ba91d0e32\', \'Poliklinik Gigi Umum\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'0367619d-6e14-4053-8883-98330e43e1e9\', \'Poliklinik Gigi Spesialis\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'ab55ccc1-4e90-4651-9797-6ec63b85095e\', \'Poliklinik Jantung dan Pembuluh Darah\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'43c58dd4-8f28-435f-bc9d-07f88dde115e\', \'Klinik Vaksin\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'bd9d0c29-214c-4f01-99ce-e8eeaf80e726\', \'Admission Office\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'25cd09d5-ecde-495e-a474-3dee359c56a4\', \'Poliklinik Kandungan dan Kebidanan (Obgyn)\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'b2469425-425c-4e57-a356-c4d6a13af275\', \'Poliklinik Bedah Saraf\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'bfccdf5e-0736-429c-8ce6-3ac8e44cf20a\', \'Rawat Jalan\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'1eda8651-41d8-49f8-b82c-98c78c467946\', \'Bougenville\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'5b28738b-4f30-44c6-89d1-1ee06f1a0792\', \'Handayani\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'0d496091-2aa7-4990-a313-8ecf3aa40d17\', \'Doctor Umum\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    'INSERT INTO units(id, name, created_at, updated_at) VALUES (\'bb1a78a3-e6e8-4c89-a9bb-c7dccd2fc597\', \'Poliklinik Anak\', \'2019-10-21 09:00:53.651155\', \'2019-10-21 09:00:53.651155\');\n' +
    '\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'b0e92d45-ea34-44c7-90e2-7de23526133a\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'3d200fb3-3505-4b8a-a023-400f45cf35d0\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'199ef846-6c00-44c8-8674-d322213d980c\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'9d923d18-8808-4c77-bf93-350d85ea664d\', \'fa8b5edb-276c-434c-8116-e0452f64dab6\', \'f998a917-a586-40e4-8535-456aaea53ee6\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'b557698f-b5ac-4c49-a034-abac2a0fc769\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'e03ceca9-e7a1-4511-886c-5f0cbc537773\', \'fa8b5edb-276c-434c-8116-e0452f64dab6\', \'f998a917-a586-40e4-8535-456aaea53ee6\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'11fbcf77-c51e-405f-8c8e-2277f30d557e\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'b0df33de-54e1-47cc-b054-38074f9b2ebb\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'c8d6ee76-6732-44a3-a19f-4e896738cfcf\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', \'1eda8651-41d8-49f8-b82c-98c78c467946\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'32c2765e-4045-49c2-b8de-90d4d0fde8ba\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'a9e1dadc-7f91-4585-af69-19f4013ef286\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', \'1eda8651-41d8-49f8-b82c-98c78c467946\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'a23098c5-248f-47eb-b613-4fc3842ea20c\', \'fa8b5edb-276c-434c-8116-e0452f64dab6\', \'f998a917-a586-40e4-8535-456aaea53ee6\', \'5b28738b-4f30-44c6-89d1-1ee06f1a0792\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'0fa51634-a641-443c-a3fb-e3d224cb7676\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'f53844b4-b03b-43c1-bdad-a11514fb5f7a\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', \'1eda8651-41d8-49f8-b82c-98c78c467946\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'cbd6a819-24e7-4bca-ab63-96318a91f516\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'df4d1ad4-7f9c-4e2e-8a28-135b33cbf3fa\', \'fa8b5edb-276c-434c-8116-e0452f64dab6\', \'f998a917-a586-40e4-8535-456aaea53ee6\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'7324ca66-ffa2-4a9a-9d49-dad4dcac8bd7\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'a52f3392-d386-40be-be03-1493f61fa539\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'e2020ad6-94b8-4f17-8851-7917947613c6\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'a6240902-683c-483e-af1f-e9baeecbe331\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'6dc10099-db84-4348-bd78-b58a73521f67\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', \'1eda8651-41d8-49f8-b82c-98c78c467946\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'06d3a629-6b88-4362-a619-d02ed2eed58f\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', \'1eda8651-41d8-49f8-b82c-98c78c467946\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'45201641-742e-462c-9c5c-fbf26eb11149\', \'fd785b71-5330-4bd6-8090-887e8a63ffd4\', \'7141e51b-f580-4ca7-a499-680aef0c0a33\', \'5b28738b-4f30-44c6-89d1-1ee06f1a0792\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'57659bf0-6e5c-487d-8d8e-904863db012b\', \'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8\', \'569a1f7f-4fe2-4f34-8aeb-690ed9ca6e5f\', \'5b28738b-4f30-44c6-89d1-1ee06f1a0792\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'d944187f-012a-4555-a400-07560872172f\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'8c6fd74f-4d2d-40be-9d53-59c99b3df953\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'464debd5-7ac0-4eb7-9812-3b2bba6a4721\', \'fa8b5edb-276c-434c-8116-e0452f64dab6\', \'e0e7a505-5de3-41b6-a065-f0fe3fd58635\', \'bb1a78a3-e6e8-4c89-a9bb-c7dccd2fc597\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'c18afb26-18af-4a42-961b-8f5c3b101d6d\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'f3b353f7-1eb5-466e-b75e-3756bacdba31\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', \'5b28738b-4f30-44c6-89d1-1ee06f1a0792\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'a524d013-e6fc-47f4-a9b2-43a4e01546a4\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'5656a263-f393-4d61-b8cf-0754f9e3ecd9\', \'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f\', \'47b60284-e9e9-4487-abd4-1f7d8aa5962c\', \'1eda8651-41d8-49f8-b82c-98c78c467946\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'fe737ccf-36eb-4704-bc19-2db4fa375afa\', \'b1e4e500-7017-41e0-a8a3-a7468515a0ea\', \'0946d5c5-d256-4fe4-9e13-107a3bdca08d\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'fd66d8c7-919c-40b0-a906-0c5470cbb279\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'ae76044a-7367-409b-bee3-4121f83a5656\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'ce8e10e9-dedc-46e6-8beb-097a17da3e78\', \'5f7de053-8c2f-4668-a819-34be1cff117a\', \'5cf6f404-624b-4691-8f6c-f8843cd5b5f8\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'635d938d-511a-4046-a7de-5d822cad42ca\', \'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f\', \'47b60284-e9e9-4487-abd4-1f7d8aa5962c\', \'1eda8651-41d8-49f8-b82c-98c78c467946\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'430161cb-118b-4369-8548-08c96cdf2206\', \'6026c9a2-aa9f-47f1-a2c0-00f5b0e1c8a5\', \'c32251f2-747f-469c-bdee-c37c5b8d3aac\', \'1eda8651-41d8-49f8-b82c-98c78c467946\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'866a9fc1-96a4-40ef-a839-1e0f24e26325\', \'7965271f-edba-4d2f-b435-ada391d4a1d9\', \'915ddf83-6d25-4092-89ae-cab80bd3bef7\', \'bb1a78a3-e6e8-4c89-a9bb-c7dccd2fc597\', \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'960cd0e6-82cd-437a-b052-28f2880ef109\', \'5f7de053-8c2f-4668-a819-34be1cff117a\', \'5cf6f404-624b-4691-8f6c-f8843cd5b5f8\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'0684c342-2457-4fff-8bcd-669638236d3a\', \'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8\', \'569a1f7f-4fe2-4f34-8aeb-690ed9ca6e5f\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'3e223285-69d7-4986-b384-43edd0c08dcb\', \'3d375016-952e-45c6-aca5-a600bbb143f8\', \'d3ae90fa-1126-4401-a4db-65a48c22a716\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'77116037-443d-4b44-8fc1-3e9e121fe70c\', \'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f\', \'47b60284-e9e9-4487-abd4-1f7d8aa5962c\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'0391e3be-0f76-45f4-9051-470a321a2ef0\', \'b1e4e500-7017-41e0-a8a3-a7468515a0ea\', \'0946d5c5-d256-4fe4-9e13-107a3bdca08d\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n' +
    'INSERT INTO inpatients(id, patient_id, patient_insurer_id, room_name_id, created_at, updated_at) VALUES (\'52e8f0a7-12a9-4003-a165-9d53d5bed775\', \'fd785b71-5330-4bd6-8090-887e8a63ffd4\', \'7141e51b-f580-4ca7-a499-680aef0c0a33\', null, \'2019-10-21 09:01:24.917352\', \'2019-10-21 09:01:24.917352\');\n');

  // non result option
  let nonResultOption = {
    distinct: true,
    limit: 20,
    include: [{
      model: unit,
      as: 'room',
      where: {
        'name': {
          [Op.eq]: 'Bougenville'
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
  };
  log(await inpatients.findAndCountAll(nonResultOption));

  // working options with result
  let balancedConditionOption = {
    distinct: true,
    limit: 20,
    include: [{
      model: unit,
      as: 'room',
      where: {
        'name': {
          [Op.eq]: 'Bougenville'
        }
      }
    }, {
      model: patient,
      where: {
        'fullName': {
          [Op.eq]: 'Rizky Riadhy'
        }
      },
      include: [{
        model: patientInsurer,
        include: [{
          model: companyPartner
        }]
      }]
    }]
  };
  log(await inpatients.findAndCountAll(balancedConditionOption));

  let noLimitOption = {
    distinct: true,
    include: [{
      model: unit,
      as: 'room',
      where: {
        'name': {
          [Op.eq]: 'Bougenville'
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
  };
  log(await inpatients.findAndCountAll(noLimitOption));
};

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
module.exports = async function (createSequelizeInstance, log) {
  /**
   * Below is an example of SSCCE. Change it to your SSCCE.
   * Recall that SSCCEs should be minimal! Try to make the shortest
   * possible code to show your issue. The shorter your code, the
   * more likely it is for you to get a fast response.
   */

    // Require necessary things from Sequelize
  const {Op, DataTypes} = require('sequelize');

  // Create an instance, using the convenience function instead
  // of the usual instantiation with `new Sequelize(...)`
  const sequelize = createSequelizeInstance({benchmark: true});

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
  inpatient.belongsTo(patient);
  inpatient.belongsTo(unit, {as: 'room', foreignKey: 'roomNameId'});
  patientInsurer.belongsTo(patient);
  patientInsurer.belongsTo(companyPartner);

  // Since you defined some models above, don't forget to sync them.
  // Using the `{ force: true }` option is not necessary because the
  // database is always created from scratch when the SSCCE is
  // executed after pushing to GitHub (by Travis CI and AppVeyor).
  await sequelize.sync();

  // Call your stuff to show the problem...
  const companyPartnersData = [
    {id: '491f1717-0e6b-41ae-bdbc-9759c92ab0b3', companyName: 'fewfwffwe'},
    {id: '4c9a7611-ee77-49b3-aafe-02fbccbe05fe', companyName: 'Inhealth'},
    {id: '8e89cf63-1ad3-4d7b-a766-35b7577669be', companyName: 'kfc'},
    {id: '9e733aca-e42f-4702-949b-7c1035bfa61a', companyName: 'Allianz'},
    {id: 'e29cbc8d-b2c0-46c8-a1fc-c337866e3b6e', companyName: 'top'},
    {id: 'df425ead-2ed4-4031-be0b-abb1520a689e', companyName: 'Telkomsel Regional Jawa Barat'},
    {id: 'd299707e-a2a1-4b5a-bd00-c6c8dd45f47f', companyName: 'dove'},
    {id: 'b6f01683-a01a-4198-aea3-b70524b51fba', companyName: 'Telkomsel Regional Jawa Barat'},
    {id: 'ae22aeb4-addf-46ac-a9f4-b4e19e41b267', companyName: 'bk'},
    {id: '9695d50b-ea4a-42b6-94b2-9ecdf9be4e9d', companyName: 'company'},
    {id: '92f6d502-d5ee-4b31-88d8-c0f2bd572c7a', companyName: 't32'},
    {id: '1662709d-88bd-4e64-b23d-f2e605e4470f', companyName: 'Perum Damri'},
    {id: '285b1d14-7496-489d-999b-7c39a89117ef', companyName: 'PT RNI (Persero)'},
    {id: '58db6374-65df-47bc-b7c4-a4992ca24f8d', companyName: 'Perum PFN'},
    {id: '67b03df0-ae9d-4911-9d73-62d154a2df65', companyName: 'Telkom Property'},
    {id: '8bfd0040-72c5-408c-a508-b02ad56e5be1', companyName: 'hp'},
    {id: '898de5cf-3ee5-448f-ae0d-2ed98bd1fa32', companyName: 'fwefw'},
    {id: '8373cf47-ef9b-4868-95bf-5fed7191aca1', companyName: 'mcd'},
    {id: '7ec6d872-ceb6-4996-be2f-f2ce552f6e8e', companyName: 'ADMEDIKA'},
    {id: '762adb7e-de73-40f4-911a-89042be17358', companyName: 'test company'},
    {id: '4f9cc4ab-cda6-4b24-9421-02ef3b216555', companyName: 'PT Akasha Wira Internasional'},
    {id: '2d90b920-975e-4adf-8319-17966bd7b292', companyName: 'Telkomsel'},
    {id: '519fc4bb-2032-4d64-9acf-d41eb2c1b57c', companyName: 'PT Dinamika Informatika'},
    {id: 'cb74b6db-5d2c-4d86-9b34-f29ea29535ac', companyName: 'IMD Global Services'},
    {id: 'c999f5a5-e262-4514-9040-e41efe8bf3d6', companyName: 'PT Paragon Technology and Innovation'},
    {id: 'fb9faf93-0faa-40f5-bfa6-2d3df10485f0', companyName: 'bengbeng'},
    {id: '01dd472e-7512-4764-bb3a-f4af56a005f6', companyName: 'PT PELNI'},
    {id: '37a4cc31-5dac-4b8c-a9be-be129ffcd5be', companyName: 'PT Paragon Indonesia'}
  ];

  companyPartnersData.forEach(async companyPartnerData => {
    await companyPartner.create(companyPartnerData)
  });

  const patientsData = [
    {id: '17657ff4-21a3-44d6-8b34-f83c5947d679', fullName: 'angga'},
    {id: 'd2de76ab-9d81-4cb2-9eef-475924f2e16c', fullName: 'temp patient'},
    {id: '1af73cf4-c031-45e2-99ac-2ec3f45039a2', fullName: 'anak'},
    {id: 'e31d3314-16b5-4908-93bb-f1332b3933e6', fullName: 'anak'},
    {id: '1e352d75-1351-44e3-a83a-c5538c37b888', fullName: 'anak'},
    {id: '03192cf8-d519-4850-91aa-cce1eb7069a1', fullName: 'anak'},
    {id: 'd13d9501-0d32-49e4-86ec-be4423c0a5ed', fullName: 'anak'},
    {id: '74c3f203-f08e-4acb-9ce2-061080f30efc', fullName: 'anak'},
    {id: '866626e3-977e-42f3-9242-5366e9c2bacb', fullName: 'anak'},
    {id: 'e2faeea6-c790-4ddd-af57-4d809834b4c4', fullName: 'anak'},
    {id: 'a4fb6153-916e-48c1-9dc9-bfc8a5a98bc8', fullName: 'anak'},
    {id: '2af8cce7-6021-429e-a5f2-c6ba6e6f302b', fullName: 'anak'},
    {id: 'd286dbff-7d8b-43f6-b777-5e0abe5914fd', fullName: 'anak'},
    {id: '8855b54a-d231-4659-96aa-e94ee7f2fcf3', fullName: 'anak'},
    {id: '39c7e879-021f-4016-8e67-6e743e585377', fullName: 'anak'},
    {id: '3ebd5cc3-67a6-4cd3-9fef-c117a2589e3b', fullName: 'anak'},
    {id: '57ffd972-17a8-4639-8564-a967dba12da1', fullName: 'anak'},
    {id: 'c0856430-8859-404b-9a6e-763984cb62d5', fullName: 'anak'},
    {id: 'e41422b9-b7de-4038-abf2-a13cee77a92a', fullName: 'anak'},
    {id: 'a424a8b7-9644-4ff6-b629-001dbc1ec432', fullName: 'anak'},
    {id: 'bfdb6f96-7ae3-4387-973e-423b87357131', fullName: 'anak'},
    {id: '02287e81-70bb-4b84-ae5d-4f8aaa1c66e5', fullName: 'anak'},
    {id: '464ac010-11e4-4c0b-a04c-e831803421a5', fullName: 'anak'},
    {id: 'edb5b00d-d94d-474e-9370-ec9ada0eea09', fullName: 'anak'},
    {id: 'a0a3b580-6264-4af6-b14d-f380dfc58c65', fullName: 'anak'},
    {id: '9694f588-fc08-41b2-af83-39fc70a9e5c7', fullName: 'anak'},
    {id: 'dfd72a8e-771f-4c84-bc24-c7b7ffd20c20', fullName: 'anak'},
    {id: '6507d167-880c-48dd-836a-67a855d9a658', fullName: 'anak'},
    {id: 'e8507089-1044-49a9-bb6d-d899bbe21e86', fullName: 'anak'},
    {id: '80287022-c342-44f7-a08b-4208c44bc198', fullName: 'anak'},
    {id: '908ce2b3-fe3c-4469-ad03-9aa4d701e28b', fullName: 'anak'},
    {id: '08d75dbd-57e1-4a75-8f3b-c1042ef3e236', fullName: 'baby'},
    {id: '9456f398-d419-4213-8cff-c8119fb4703f', fullName: 'San Wawa'},
    {id: '2ab988f4-2e6a-4b17-bbdb-505ac922ce40', fullName: 'Wulan'},
    {id: '54e4444a-1507-4c5b-bf70-2172db10db7f', fullName: 'uuSA'},
    {id: '3c7814a3-9a74-4bb6-8286-f5f7c0481447', fullName: 'annisa'},
    {id: 'e10fe707-db30-4bad-b140-62411c1b7c15', fullName: 'cahyani'},
    {id: 'fa8b5edb-276c-434c-8116-e0452f64dab6', fullName: 'Kemila Isdiandini'},
    {id: '66fe612e-4ea0-4dfb-9a7b-b76abaf7b20e', fullName: 'Hasna Afifa'},
    {id: 'fd785b71-5330-4bd6-8090-887e8a63ffd4', fullName: 'Triana Septiani'},
    {id: '7965271f-edba-4d2f-b435-ada391d4a1d9', fullName: 'Ruti Agum Gumelar'},
    {id: '5f7de053-8c2f-4668-a819-34be1cff117a', fullName: 'Bruno priori'},
    {id: '7d628f34-5631-44a5-bedb-f8be9fd97ac6', fullName: 'temp patient'},
    {id: 'a40a078c-99f5-4794-aefa-e0ecec6c902c', fullName: 'pat'},
    {id: 'e80b98aa-9e20-4a07-9c73-17f50ab4b98a', fullName: 'Mr. X'},
    {id: 'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f', fullName: 'Rizky Riadhy'},
    {id: '3d375016-952e-45c6-aca5-a600bbb143f8', fullName: 'Erly Handayani'},
    {id: 'd80419b9-e2ed-4e06-ab63-6f860c4341a7', fullName: 'temp patient'},
    {id: 'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8', fullName: 'Andi Pratiwi'},
    {id: '5006cf6f-e08a-47dd-a33a-17b126c527fc', fullName: 'Karunya pisan'},
    {id: '0fec9db5-cf00-4b57-beed-9c8ba0c2e296', fullName: 'babacoco'},
    {id: 'cb71f750-7518-460c-87e0-c1f7723170dd', fullName: 'Wirawan'},
    {id: '6026c9a2-aa9f-47f1-a2c0-00f5b0e1c8a5', fullName: 'Roni Kurniawan'},
    {id: '88044809-ce37-4bcc-bbab-423a2e82634e', fullName: 'Jelema Gering'},
    {id: '387ee372-3f72-444a-8964-562ac7b4c355', fullName: 'temp pati'},
    {id: 'b1e4e500-7017-41e0-a8a3-a7468515a0ea', fullName: 'Andini Pratiwi'},
    {id: 'a8071e5f-3d70-41b8-81f1-7a0fdbdebd53', fullName: 'Husni Ambar'},
    {id: 'd32d28f2-bc9a-4b02-a593-7dcb34d36766', fullName: 'test'},
    {id: 'd7ebbd53-32c1-411b-bc5c-97550831a01e', fullName: 'Atang'},
    {id: 'ffe738a1-c7be-40f1-88a7-4640036bea8d', fullName: 'Yahya'}
  ];

  patientsData.forEach(async patientData => {
    await patient.create(patientData)
  });

  const patientInsurersData = [
    {
      id: 'c02e4c41-2733-4f84-afcd-ea0b71fd9f9c',
      patientId: 'd2de76ab-9d81-4cb2-9eef-475924f2e16c',
      cardNo: '345678-ngbfdsfads-8765432',
      companyPartnerId: null
    },
    {
      id: 'b73dd617-bb7d-4e2d-97a3-1a7fe57ca580',
      patientId: '17657ff4-21a3-44d6-8b34-f83c5947d679',
      cardNo: '111',
      companyPartnerId: null
    },
    {
      id: 'f4227ec0-6047-4948-a990-2ff224459919',
      patientId: 'd13d9501-0d32-49e4-86ec-be4423c0a5ed',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'f7afcd96-f93e-4742-ace0-bf7402d8d447',
      patientId: '03192cf8-d519-4850-91aa-cce1eb7069a1',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'a14e4dc1-f8bb-488d-9797-b51126c3e554',
      patientId: '74c3f203-f08e-4acb-9ce2-061080f30efc',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'da1a6a3a-2151-423f-9953-cee4522d7757',
      patientId: 'e2faeea6-c790-4ddd-af57-4d809834b4c4',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '0b8f1056-5450-4288-851d-99939942d66b',
      patientId: 'a4fb6153-916e-48c1-9dc9-bfc8a5a98bc8',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'e865b809-5da3-49f3-ba9b-808af4e10762',
      patientId: '2af8cce7-6021-429e-a5f2-c6ba6e6f302b',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '580b0e1f-4b14-4df3-841d-4d4dbe172856',
      patientId: 'd286dbff-7d8b-43f6-b777-5e0abe5914fd',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '9fd75241-b7ad-4504-89fb-eca11e82ffb4',
      patientId: '8855b54a-d231-4659-96aa-e94ee7f2fcf3',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '60555c16-bd3e-4ffa-98e8-b6f6d35486fa',
      patientId: '39c7e879-021f-4016-8e67-6e743e585377',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'a0b1220b-c842-4fea-9dde-a4ad364c704e',
      patientId: '3ebd5cc3-67a6-4cd3-9fef-c117a2589e3b',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '05eb3e40-5e66-44a6-a5bc-444cb589da5c',
      patientId: '57ffd972-17a8-4639-8564-a967dba12da1',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '48310564-a4f8-4bee-b80d-ababb078bfb2',
      patientId: 'c0856430-8859-404b-9a6e-763984cb62d5',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '95d3a33a-b23d-4fe2-af71-44b041ec31d2',
      patientId: 'e41422b9-b7de-4038-abf2-a13cee77a92a',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'd5d61cee-fb30-4f95-a300-38795c6f6636',
      patientId: 'a424a8b7-9644-4ff6-b629-001dbc1ec432',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '61ed602c-13e2-4cac-a7ae-ab67b59bd1da',
      patientId: 'bfdb6f96-7ae3-4387-973e-423b87357131',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'd775784b-f215-4e68-b0b5-4837b605753f',
      patientId: '02287e81-70bb-4b84-ae5d-4f8aaa1c66e5',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '95cb6cb0-cf39-4271-a67b-92877cddea8f',
      patientId: '464ac010-11e4-4c0b-a04c-e831803421a5',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '2b5ab231-a803-4663-94f4-6a8016dc0d9c',
      patientId: 'edb5b00d-d94d-474e-9370-ec9ada0eea09',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '119cb505-88d2-4fb4-936e-da2dce29a256',
      patientId: 'a0a3b580-6264-4af6-b14d-f380dfc58c65',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '6dda421e-b840-4109-913c-c1d56c478559',
      patientId: 'e31d3314-16b5-4908-93bb-f1332b3933e6',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '2c371222-045c-43c4-a564-b333f09d4a8d',
      patientId: '9694f588-fc08-41b2-af83-39fc70a9e5c7',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '50a0a56b-7731-441e-a666-a6f5b6977c4a',
      patientId: 'dfd72a8e-771f-4c84-bc24-c7b7ffd20c20',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'cc154993-1508-44fb-b92e-5c7f53132131',
      patientId: '6507d167-880c-48dd-836a-67a855d9a658',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '58873d76-c31b-470c-a4e3-3d0c3e850303',
      patientId: 'e8507089-1044-49a9-bb6d-d899bbe21e86',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '630f848b-fcdd-449f-bca6-d1cd91837c1b',
      patientId: '80287022-c342-44f7-a08b-4208c44bc198',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'df0da6e1-c28d-4672-87bd-b2f22ba03ef6',
      patientId: '1af73cf4-c031-45e2-99ac-2ec3f45039a2',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: 'c0a7707b-b759-47a9-a9fe-da7e981f7af7',
      patientId: '908ce2b3-fe3c-4469-ad03-9aa4d701e28b',
      cardNo: '90909',
      companyPartnerId: null
    },
    {
      id: '3fc78b16-6021-4446-92d8-0430f2caa598',
      patientId: '9456f398-d419-4213-8cff-c8119fb4703f',
      cardNo: '11111',
      companyPartnerId: null
    },
    {
      id: '7141e51b-f580-4ca7-a499-680aef0c0a33',
      patientId: 'fd785b71-5330-4bd6-8090-887e8a63ffd4',
      cardNo: '1234',
      companyPartnerId: null
    },
    {
      id: 'ae76044a-7367-409b-bee3-4121f83a5656',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      cardNo: '63453423-6452343',
      companyPartnerId: 'fb9faf93-0faa-40f5-bfa6-2d3df10485f0'
    },
    {
      id: '797d271a-3ead-4c4c-af69-59184768ef77',
      patientId: '2ab988f4-2e6a-4b17-bbdb-505ac922ce40',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: '0fdb77ae-375c-494b-af54-f33493b963a9',
      patientId: '2ab988f4-2e6a-4b17-bbdb-505ac922ce40',
      cardNo: '89281982102910',
      companyPartnerId: 'b6f01683-a01a-4198-aea3-b70524b51fba'
    },
    {
      id: 'f998a917-a586-40e4-8535-456aaea53ee6',
      patientId: 'fa8b5edb-276c-434c-8116-e0452f64dab6',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: 'f8316a96-77e9-4dd2-8981-d035749674c8',
      patientId: '7965271f-edba-4d2f-b435-ada391d4a1d9',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: '915ddf83-6d25-4092-89ae-cab80bd3bef7',
      patientId: '7965271f-edba-4d2f-b435-ada391d4a1d9',
      cardNo: '28198219829',
      companyPartnerId: '01dd472e-7512-4764-bb3a-f4af56a005f6'
    },
    {
      id: '567936a9-7c6c-4a6f-8be6-47ba8f4e889d',
      patientId: '7965271f-edba-4d2f-b435-ada391d4a1d9',
      cardNo: '9201921092',
      companyPartnerId: '285b1d14-7496-489d-999b-7c39a89117ef'
    },
    {
      id: '9f7a19f7-dc9a-4d62-a8c1-56454ce96a6f',
      patientId: 'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: '569a1f7f-4fe2-4f34-8aeb-690ed9ca6e5f',
      patientId: 'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8',
      cardNo: '892109201',
      companyPartnerId: '4f9cc4ab-cda6-4b24-9421-02ef3b216555'
    },
    {
      id: '6f3639dd-7d4a-475c-ac5e-26da107ce670',
      patientId: 'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: '47b60284-e9e9-4487-abd4-1f7d8aa5962c',
      patientId: 'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f',
      cardNo: '213123101910100',
      companyPartnerId: 'cb74b6db-5d2c-4d86-9b34-f29ea29535ac'
    },
    {
      id: '3cef20a8-3493-4dff-b180-5c91c1628921',
      patientId: 'cb71f750-7518-460c-87e0-c1f7723170dd',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: '139a94c0-3011-491b-bfbe-2d0b2b0576c9',
      patientId: 'cb71f750-7518-460c-87e0-c1f7723170dd',
      cardNo: '1',
      companyPartnerId: '58db6374-65df-47bc-b7c4-a4992ca24f8d'
    },
    {
      id: '40f1a476-3967-4205-a6db-6d05672c67d2',
      patientId: 'cb71f750-7518-460c-87e0-c1f7723170dd',
      cardNo: '9',
      companyPartnerId: '2d90b920-975e-4adf-8319-17966bd7b292'
    },
    {
      id: 'dd5e07dc-68c2-4766-8fb4-e7e06cc3830b',
      patientId: 'cb71f750-7518-460c-87e0-c1f7723170dd',
      cardNo: '4',
      companyPartnerId: '4f9cc4ab-cda6-4b24-9421-02ef3b216555'
    },
    {
      id: 'c7986cca-6866-49c1-9e61-8781ff47f952',
      patientId: 'cb71f750-7518-460c-87e0-c1f7723170dd',
      cardNo: '1233333',
      companyPartnerId: '2d90b920-975e-4adf-8319-17966bd7b292'
    },
    {
      id: '89f32ad1-cfe7-4b4a-99c7-d8d33c9444c4',
      patientId: 'cb71f750-7518-460c-87e0-c1f7723170dd',
      cardNo: '123131',
      companyPartnerId: 'cb74b6db-5d2c-4d86-9b34-f29ea29535ac'
    },
    {
      id: 'c32251f2-747f-469c-bdee-c37c5b8d3aac',
      patientId: '6026c9a2-aa9f-47f1-a2c0-00f5b0e1c8a5',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: '0946d5c5-d256-4fe4-9e13-107a3bdca08d',
      patientId: 'b1e4e500-7017-41e0-a8a3-a7468515a0ea',
      cardNo: '829129',
      companyPartnerId: '2d90b920-975e-4adf-8319-17966bd7b292'
    },
    {
      id: 'e0e7a505-5de3-41b6-a065-f0fe3fd58635',
      patientId: 'fa8b5edb-276c-434c-8116-e0452f64dab6',
      cardNo: '829182918',
      companyPartnerId: '4f9cc4ab-cda6-4b24-9421-02ef3b216555'
    },
    {
      id: '27013409-6005-42fb-a40d-495b63cee0a9',
      patientId: '5f7de053-8c2f-4668-a819-34be1cff117a',
      cardNo: '',
      companyPartnerId: null
    },
    {
      id: '5cf6f404-624b-4691-8f6c-f8843cd5b5f8',
      patientId: '5f7de053-8c2f-4668-a819-34be1cff117a',
      cardNo: '23109391239183900000',
      companyPartnerId: '519fc4bb-2032-4d64-9acf-d41eb2c1b57c'
    },
    {
      id: '04bf49fe-9af7-43cb-a77a-835124b1a7c2',
      patientId: '5f7de053-8c2f-4668-a819-34be1cff117a',
      cardNo: '2,91381038190238E+21',
      companyPartnerId: '285b1d14-7496-489d-999b-7c39a89117ef'
    }
  ];

  patientInsurersData.forEach(async patientInsurerData => {
    await patientInsurer.create(patientInsurerData)
  });

  const unitsData = [
    {id: 'f2ec5dab-4dcb-4dd7-81a2-99c141dbf554', name: 'Parent'},
    {id: '72623922-8991-4582-8b60-1809bc459120', name: 'USER'},
    {id: 'e718695d-1f7c-49f9-bc0f-a8ba420936b2', name: 'wirawan'},
    {id: '97f7a7f0-9fb9-4b50-9369-b15fd183600f', name: 'Klinik Internis'},
    {id: 'cc7c2d28-1a4a-464c-b42c-c438e111495b', name: 'Klinik Jantung'},
    {id: 'e09782ed-ac94-4907-a69b-f5c75acc14b3', name: 'Klinik Ortopedi'},
    {id: '9c8fc579-b052-465d-9ce9-41025b9b89b2', name: 'Klinik THT'},
    {id: 'b25662b9-b8fc-4734-a137-7e2933c714e7', name: 'Klinik bedah THT'},
    {id: '1b743cab-67fa-4c6d-9247-21739c891c84', name: 'Klinik biasa'},
    {id: 'c501fc85-cb65-4fec-bbc6-3d1ee6c7aec1', name: 'klinik yah'},
    {id: '9bbf43bd-0014-40fd-ba2f-e5d6354a4ec1', name: 'ADMIN3'},
    {id: '7ad0e456-1719-49ae-b4be-f3fc4359bd05', name: 'Farmasi rawat dan jalan'},
    {id: 'c88338e1-ae1f-45a8-bd2d-e40f852b5e6c', name: 'Poliklinik Gizi'},
    {id: '2e5838a9-ece5-404f-805c-ad57f80e03b8', name: 'yey'},
    {id: 'eeb2533a-2628-4359-a56c-90c34aaf3e8d', name: 'hhh'},
    {id: '0bf25977-70bb-4919-916d-0d3ad1b2fb06', name: 'jantungan'},
    {id: 'de4ca38e-3418-469b-b4d5-63811704324a', name: 'ADMIN3'},
    {id: 'f255634d-aba0-445e-96ac-34ed9e3b197c', name: 'Unit baru'},
    {id: '57acad18-9087-4da7-987a-d16e71aa5903', name: 'gigi susu'},
    {id: '86386f1b-cb78-4211-b534-94efaa3d5edb', name: 'Lab'},
    {id: '78e2c726-f77f-422e-a330-b554909f4d84', name: 'jantung'},
    {id: 'dadc9e2d-c37f-4737-9ef9-335ff1b83b8f', name: 'Poliklinik'},
    {id: 'fd054762-04c4-410a-85a5-70434cf78701', name: 'klinik'},
    {id: 'e457de85-ef34-488e-bf59-f9c740ff5bae', name: 'Rawat Inap'},
    {id: 'd30926cd-103a-40f7-b5fa-bee3ab8dabe0', name: 'tulang rawan'},
    {id: '44ec53d2-68d5-4c5d-a37e-73524605c856', name: 'Poliklinik Pulmonologi dan Kedokteran Respirasi (Paru)'},
    {id: 'a87a94ba-d827-42e6-8fd5-7ce2bbd6b544', name: 'Rawat  inap 2'},
    {id: 'f8fcb730-acaf-4752-b95f-da614d947bab', name: 'Rawat Inap Ex'},
    {id: '2a767b87-ae51-4980-8d07-db832bd7b77b', name: 'Klinik Konsultasi Gizi'},
    {id: '16012792-d441-4a8d-bbc5-dccb879018e2', name: 'Andini Pratiwi'},
    {id: 'a1c5d34e-95ca-49fe-8703-e16040efa228', name: 'Andini Pratiwiwiwi'},
    {id: '551e53e0-10c9-402e-b261-061c8ac64a33', name: 'ITB'},
    {id: 'ffc34001-29d3-45e7-90f0-28323128b403', name: 'ITS'},
    {id: 'b50b8d7d-d153-48e9-91cf-405cdaf57fde', name: 'Klinik Anak'},
    {id: 'a3276ad8-3af2-464d-9e32-e5f906b26bb1', name: 'Klinik Gigii'},
    {id: '05677198-1bfc-4ef1-840b-94878f61a9af', name: 'Klinik Gizi'},
    {id: 'e1003d83-c309-4a21-9cd9-a465dbe8fc33', name: 'Rawat Jalan 11'},
    {id: 'ab08d0ed-4f7e-4d68-8917-ef55775681e8', name: 'Yuda'},
    {id: 'cdd1d298-3cf3-4f9b-a1b8-c05f06de79a9', name: 'adimin'},
    {id: 'c1e2cf55-e62f-40b8-959f-7c73b1e5d292', name: 'andpratiwi'},
    {id: '9324ec72-5c39-4be1-b2fb-461774458a05', name: 'gigi'},
    {id: 'b6c62366-4539-4f58-8f46-5d2280408f78', name: 'Laboratorium'},
    {id: '54d5d1be-f0bb-4b57-959d-df29ebbc5d17', name: 'Poliklinik Penyakit Dalam'},
    {id: '32300b08-a395-45af-a68f-4efc26faa833', name: 'Poliklinik Telinga Hidung Tenggorokan'},
    {id: 'a99ecd9a-82cc-4508-aaaa-91a7f7dbecd5', name: 'Poliklinik Kedokteran Jiwa atau Psikiatri'},
    {id: 'e8dd649c-4946-4a5c-89fa-567ba91d0e32', name: 'Poliklinik Gigi Umum'},
    {id: '0367619d-6e14-4053-8883-98330e43e1e9', name: 'Poliklinik Gigi Spesialis'},
    {id: 'ab55ccc1-4e90-4651-9797-6ec63b85095e', name: 'Poliklinik Jantung dan Pembuluh Darah'},
    {id: '43c58dd4-8f28-435f-bc9d-07f88dde115e', name: 'Klinik Vaksin'},
    {id: 'bd9d0c29-214c-4f01-99ce-e8eeaf80e726', name: 'Admission Office'},
    {id: '25cd09d5-ecde-495e-a474-3dee359c56a4', name: 'Poliklinik Kandungan dan Kebidanan (Obgyn)'},
    {id: 'b2469425-425c-4e57-a356-c4d6a13af275', name: 'Poliklinik Bedah Saraf'},
    {id: 'bfccdf5e-0736-429c-8ce6-3ac8e44cf20a', name: 'Rawat Jalan'},
    {id: '1eda8651-41d8-49f8-b82c-98c78c467946', name: 'Bougenville'},
    {id: '5b28738b-4f30-44c6-89d1-1ee06f1a0792', name: 'Handayani'},
    {id: '0d496091-2aa7-4990-a313-8ecf3aa40d17', name: 'Doctor Umum'},
    {id: 'bb1a78a3-e6e8-4c89-a9bb-c7dccd2fc597', name: 'Poliklinik Anak'}
  ];

  unitsData.forEach(async unitData => {
    await unit.create(unitData)
  });

  const inpatientsData = [
    {
      id: 'b0e92d45-ea34-44c7-90e2-7de23526133a',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: '3d200fb3-3505-4b8a-a023-400f45cf35d0',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: '199ef846-6c00-44c8-8674-d322213d980c',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: '9d923d18-8808-4c77-bf93-350d85ea664d',
      patientId: 'fa8b5edb-276c-434c-8116-e0452f64dab6',
      patientInsurerId: 'f998a917-a586-40e4-8535-456aaea53ee6',
      roomNameId: null
    },
    {
      id: 'b557698f-b5ac-4c49-a034-abac2a0fc769',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: 'e03ceca9-e7a1-4511-886c-5f0cbc537773',
      patientId: 'fa8b5edb-276c-434c-8116-e0452f64dab6',
      patientInsurerId: 'f998a917-a586-40e4-8535-456aaea53ee6',
      roomNameId: null
    },
    {
      id: '11fbcf77-c51e-405f-8c8e-2277f30d557e',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: 'b0df33de-54e1-47cc-b054-38074f9b2ebb',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: null
    },
    {
      id: 'c8d6ee76-6732-44a3-a19f-4e896738cfcf',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: '1eda8651-41d8-49f8-b82c-98c78c467946'
    },
    {
      id: '32c2765e-4045-49c2-b8de-90d4d0fde8ba',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: 'a9e1dadc-7f91-4585-af69-19f4013ef286',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: '1eda8651-41d8-49f8-b82c-98c78c467946'
    },
    {
      id: 'a23098c5-248f-47eb-b613-4fc3842ea20c',
      patientId: 'fa8b5edb-276c-434c-8116-e0452f64dab6',
      patientInsurerId: 'f998a917-a586-40e4-8535-456aaea53ee6',
      roomNameId: '5b28738b-4f30-44c6-89d1-1ee06f1a0792'
    },
    {
      id: '0fa51634-a641-443c-a3fb-e3d224cb7676',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: 'f53844b4-b03b-43c1-bdad-a11514fb5f7a',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: '1eda8651-41d8-49f8-b82c-98c78c467946'
    },
    {
      id: 'cbd6a819-24e7-4bca-ab63-96318a91f516',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: 'df4d1ad4-7f9c-4e2e-8a28-135b33cbf3fa',
      patientId: 'fa8b5edb-276c-434c-8116-e0452f64dab6',
      patientInsurerId: 'f998a917-a586-40e4-8535-456aaea53ee6',
      roomNameId: null
    },
    {
      id: '7324ca66-ffa2-4a9a-9d49-dad4dcac8bd7',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: 'a52f3392-d386-40be-be03-1493f61fa539',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: null
    },
    {
      id: 'e2020ad6-94b8-4f17-8851-7917947613c6',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: 'a6240902-683c-483e-af1f-e9baeecbe331',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: null
    },
    {
      id: '6dc10099-db84-4348-bd78-b58a73521f67',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: '1eda8651-41d8-49f8-b82c-98c78c467946'
    },
    {
      id: '06d3a629-6b88-4362-a619-d02ed2eed58f',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: '1eda8651-41d8-49f8-b82c-98c78c467946'
    },
    {
      id: '45201641-742e-462c-9c5c-fbf26eb11149',
      patientId: 'fd785b71-5330-4bd6-8090-887e8a63ffd4',
      patientInsurerId: '7141e51b-f580-4ca7-a499-680aef0c0a33',
      roomNameId: '5b28738b-4f30-44c6-89d1-1ee06f1a0792'
    },
    {
      id: '57659bf0-6e5c-487d-8d8e-904863db012b',
      patientId: 'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8',
      patientInsurerId: '569a1f7f-4fe2-4f34-8aeb-690ed9ca6e5f',
      roomNameId: '5b28738b-4f30-44c6-89d1-1ee06f1a0792'
    },
    {
      id: 'd944187f-012a-4555-a400-07560872172f',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: null
    },
    {
      id: '8c6fd74f-4d2d-40be-9d53-59c99b3df953',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: '464debd5-7ac0-4eb7-9812-3b2bba6a4721',
      patientId: 'fa8b5edb-276c-434c-8116-e0452f64dab6',
      patientInsurerId: 'e0e7a505-5de3-41b6-a065-f0fe3fd58635',
      roomNameId: 'bb1a78a3-e6e8-4c89-a9bb-c7dccd2fc597'
    },
    {
      id: 'c18afb26-18af-4a42-961b-8f5c3b101d6d',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: null
    },
    {
      id: 'f3b353f7-1eb5-466e-b75e-3756bacdba31',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: '5b28738b-4f30-44c6-89d1-1ee06f1a0792'
    },
    {
      id: 'a524d013-e6fc-47f4-a9b2-43a4e01546a4',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: null
    },
    {
      id: '5656a263-f393-4d61-b8cf-0754f9e3ecd9',
      patientId: 'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f',
      patientInsurerId: '47b60284-e9e9-4487-abd4-1f7d8aa5962c',
      roomNameId: '1eda8651-41d8-49f8-b82c-98c78c467946'
    },
    {
      id: 'fe737ccf-36eb-4704-bc19-2db4fa375afa',
      patientId: 'b1e4e500-7017-41e0-a8a3-a7468515a0ea',
      patientInsurerId: '0946d5c5-d256-4fe4-9e13-107a3bdca08d',
      roomNameId: null
    },
    {
      id: 'fd66d8c7-919c-40b0-a906-0c5470cbb279',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'ae76044a-7367-409b-bee3-4121f83a5656',
      roomNameId: null
    },
    {
      id: 'ce8e10e9-dedc-46e6-8beb-097a17da3e78',
      patientId: '5f7de053-8c2f-4668-a819-34be1cff117a',
      patientInsurerId: '5cf6f404-624b-4691-8f6c-f8843cd5b5f8',
      roomNameId: null
    },
    {
      id: '635d938d-511a-4046-a7de-5d822cad42ca',
      patientId: 'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f',
      patientInsurerId: '47b60284-e9e9-4487-abd4-1f7d8aa5962c',
      roomNameId: '1eda8651-41d8-49f8-b82c-98c78c467946'
    },
    {
      id: '430161cb-118b-4369-8548-08c96cdf2206',
      patientId: '6026c9a2-aa9f-47f1-a2c0-00f5b0e1c8a5',
      patientInsurerId: 'c32251f2-747f-469c-bdee-c37c5b8d3aac',
      roomNameId: '1eda8651-41d8-49f8-b82c-98c78c467946'
    },
    {
      id: '866a9fc1-96a4-40ef-a839-1e0f24e26325',
      patientId: '7965271f-edba-4d2f-b435-ada391d4a1d9',
      patientInsurerId: '915ddf83-6d25-4092-89ae-cab80bd3bef7',
      roomNameId: 'bb1a78a3-e6e8-4c89-a9bb-c7dccd2fc597'
    },
    {
      id: '960cd0e6-82cd-437a-b052-28f2880ef109',
      patientId: '5f7de053-8c2f-4668-a819-34be1cff117a',
      patientInsurerId: '5cf6f404-624b-4691-8f6c-f8843cd5b5f8',
      roomNameId: null
    },
    {
      id: '0684c342-2457-4fff-8bcd-669638236d3a',
      patientId: 'a80c7d39-7c3d-4c66-88fa-4e7a9c4711c8',
      patientInsurerId: '569a1f7f-4fe2-4f34-8aeb-690ed9ca6e5f',
      roomNameId: null
    },
    {
      id: '3e223285-69d7-4986-b384-43edd0c08dcb',
      patientId: '3d375016-952e-45c6-aca5-a600bbb143f8',
      patientInsurerId: 'd3ae90fa-1126-4401-a4db-65a48c22a716',
      roomNameId: null
    },
    {
      id: '77116037-443d-4b44-8fc1-3e9e121fe70c',
      patientId: 'ea3bcbd9-4eb3-47c9-8cdb-1b860c90c13f',
      patientInsurerId: '47b60284-e9e9-4487-abd4-1f7d8aa5962c',
      roomNameId: null
    },
    {
      id: '0391e3be-0f76-45f4-9051-470a321a2ef0',
      patientId: 'b1e4e500-7017-41e0-a8a3-a7468515a0ea',
      patientInsurerId: '0946d5c5-d256-4fe4-9e13-107a3bdca08d',
      roomNameId: null
    },
    {
      id: '52e8f0a7-12a9-4003-a165-9d53d5bed775',
      patientId: 'fd785b71-5330-4bd6-8090-887e8a63ffd4',
      patientInsurerId: '7141e51b-f580-4ca7-a499-680aef0c0a33',
      roomNameId: null
    }
  ];

  inpatientsData.forEach(async inpatientData => {
    await inpatient.create(inpatientData)
  });

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
  log(await inpatient.findAndCountAll(nonResultOption));

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
  log(await inpatient.findAndCountAll(balancedConditionOption));

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
  log(await inpatient.findAndCountAll(noLimitOption));
};

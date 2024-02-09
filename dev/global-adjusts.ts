import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiDatetime from 'chai-datetime';
import sinonChai from 'sinon-chai';

// Enable same settings to chai from Sequelize main repo
chai.use(chaiDatetime);
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.config.includeStack = true;
chai.should();

process.on('uncaughtException', e => {
  console.error('An unhandled exception occurred:');
  console.error(e);

  process.exit(1);
});

process.on('unhandledRejection', e => {
  console.error('An unhandled rejection occurred:');
  console.error(e);

  process.exit(1);
});

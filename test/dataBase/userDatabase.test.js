if (process.env.NODE_MODE !== 'production') {
  /* eslint-disable global-require */
  require('dotenv').config({
    path: `${__dirname}/../../.env`
  });
  /* eslint-enable global-require */
}

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const userDatabase = require('../../src/dataBase/userDatabase');
const testTools = require('../utils/testTools');
const { user } = require('./models');
const { expect } = chai;

chai.use(dirtyChai);

const insertUser = async () => {
  return await userDatabase.insertUser(user);
};

describe('userDataBase.test.js', function() {
  this.timeout(10000);

  before(async () => {
    await userDatabase.connect();
    await userDatabase.clear();
  });

  beforeEach(async () => {
    await insertUser();
  });

  after(async () => {
    await userDatabase.close();
  });

  afterEach(async () => {
    await userDatabase.clear();
  });

  it('Can insert user', async () => {
    await userDatabase.clear();
    let result = await userDatabase.insertUser(user);

    result = testTools.deleteMongooseId(result);

    expect(result).to.be.deep.equal(user);
  });
});

class TestTools {
  constructor() {
    this.sleep = this.sleep.bind(this);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  deleteMongooseId(data) {
    const { _id, ...doc } = data.toJSON();
    return doc;
  }
}

const testTools = new TestTools({});

module.exports = testTools;

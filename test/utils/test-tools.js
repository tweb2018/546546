class TestTools {
  constructor() {
    this.sleep = this.sleep.bind(this);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const testTools = new TestTools({});

module.exports = testTools;

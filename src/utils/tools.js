/**
 * Tools features
 *
 * @class Tools
 */
class Tools {
  constructor() {
    this.delay = this.delay.bind(this);
  }

  /**
   * Calculated the delay between 2 requests
   *
   * @param {*} queryDate The date to calcule the delay
   * @returns The calculated delay
   * @memberof Tools
   */
  delay(queryDate) {
    return (new Date() - queryDate) / 1000;
  }
}

const tools = new Tools({});

module.exports = tools;

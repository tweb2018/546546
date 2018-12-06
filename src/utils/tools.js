class Tools {
  constructor() {
    this.delay = this.delay.bind(this);
  }

  /* *************************************************************
   *
   * @function delay()
   * @description calculated the delay between 2 requests on the same user or repo
   * @return return this delay
   *
   ************************************************************ */
  delay(queryDate) {
    return (new Date() - queryDate) / 1000;
  }
}

const tools = new Tools({});

module.exports = tools;

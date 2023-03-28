class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path) {
    await this.page.goto(`${process.env.BASE_URL}/${path}`);
  }
}

module.exports = BasePage;

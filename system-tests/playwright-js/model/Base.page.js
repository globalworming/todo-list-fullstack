class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(path) {
        await this.page.goto(`${process.env.CUSTOM_URL}/${path}`)
    }
}

module.exports = BasePage;
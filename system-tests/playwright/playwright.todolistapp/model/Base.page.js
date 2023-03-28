class BasePage{
    constructor(page){
        this.page = page;
    }

    async navigate(path){
        await this.page.goto(`https://single-page-application-fg5blhx72q-ey.a.run.app/${path}`)
    }
}
module.exports = BasePage;
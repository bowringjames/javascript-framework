import { ComponentBase } from "./componentBase.js";

export class PageBase extends ComponentBase {
    constructor() {
        super();
        this.templatePath = "";
    }

    async connectedCallback() {
        await this.setup(
            () => this.loadData(),
            () => this.render(),
            () => this.wireEvents()
        );
    }

    async render() {
        if (!this.templatePath) return;
        const template = await this.loadTemplate(this.templatePath);
        this.innerHTML = this.populateTemplate(template, this.templateData());
    }

    templateData() {
        return {};
    }

    wireEvents() {}
    async loadData() {}
}
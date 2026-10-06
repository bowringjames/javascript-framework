import { ComponentBase } from "./componentBase.js";

import "../ui/error/components/error-view.js";

export class PageBase extends ComponentBase {
    constructor() {
        super();
        this.templatePath = "";
    }

    async connectedCallback() {
        try {
            await this.setup(
                () => this.loadData(),
                () => this.render(),
                () => this.wireEvents()
            );
        } catch (error) {
            console.error("Page error:", error);

            this.error = error;
            this.showError();
        }
    }

    showError() {
        const errorView = document.createElement("error-view");

        this.replaceChildren(errorView);
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
import { ComponentBase } from "../core/componentBase.js";

export class ErrorView extends ComponentBase {
    constructor() {
        super();

        this.templatePath = "/app/components/error.html";
    }

    async connectedCallback() {
        await this.render();
    }

    async render() {
        const template = await this.loadTemplate(this.templatePath);

        this.innerHTML = template;
    }
}

customElements.define("error-view", ErrorView);
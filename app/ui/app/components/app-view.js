import { ComponentBase } from "../../../core/componentBase.js";

export class AppView extends ComponentBase {
    connectedCallback() {
        this.addSubscription(this.app
            .get("eventBus")
            .subscribe("routeChanged", route => this.show(route))
        );
    }

    async show(route) {
        const componentName = await this.app.get("routeRegistry").resolve(route);

        if (!componentName) {
            this.innerHTML = "<h1>Page not found</h1>";
            return;
        }

        const page = document.createElement(componentName);

        page.app = this.app;
        this.replaceChildren(page);
    }
}

customElements.define("app-view", AppView);
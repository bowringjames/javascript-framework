export class ComponentBase extends HTMLElement {
    constructor() {
        super();

        this.unsubscribers = [];
        this.app = null;
        this._templates = {};
    }

    async loadTemplate(path) {
        console.log(path);
        if (!this._templates[path]) {
            const response = await fetch(`${path}?v=${Date.now()}`);
            this._templates[path] = await response.text();
        }

        return this._templates[path];
    }

    async setup(dataFn, renderFn, wireFn) {
        await dataFn?.();
        await renderFn?.();
        await wireFn?.();
    }

    populateTemplate(template, values) {
        let html = template;

        for (const [key, value] of Object.entries(values)) {
            html = html.replaceAll(`{{${key}}}`, value ?? "");
        }

        return html;
    }

    addSubscription(unsubscribe) {
        this.unsubscribers.push(unsubscribe);
    }

    disconnectedCallback() {
        this.unsubscribers.forEach(unsubscribe => {
            unsubscribe?.();
        });

        this.unsubscribers = [];
    }
}
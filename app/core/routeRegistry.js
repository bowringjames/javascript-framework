export class RouteRegistry {
    constructor() {
        this.modules = {};
    }

    async loadModule(application, module) {
        const key = `${application}/${module}`;

        if (this.modules[key]) {
            return this.modules[key];
        }

        const manifest = await import(`/app/modules/${module}/manifest.js`);

        this.modules[key] = manifest.default;
        return manifest.default;
    }

    async resolve(route) {
        if (!route.application || !route.module || !route.page) {
            return null;
        }

        const manifest = await this.loadModule(route.application, route.module);

        return manifest?.routes?.[route.page] ?? null;
    }
}
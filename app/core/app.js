export class App {
    constructor() {
        this.services = {};
    }

    register(name, instance) {
        this.services[name] = instance;
    }

    get(name) {
        return this.services[name];
    }
}
export class Router {
    constructor(eventBus, store, routeResolver) {
        this.eventBus = eventBus;
        this.store = store;
        this.routeResolver = routeResolver;
    }

    start() {
        window.addEventListener("popstate", () => this.resolve());
        this.resolve();
    }

    resolve() {
        const route = this.routeResolver.resolve(window.location);

        this.store.set("route", route);
        this.eventBus.publish("routeChanged", route);
    }
}
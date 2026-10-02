import { App } from "./core/app.js";
import { EventBus } from "./core/eventBus.js";
import { Store } from "./core/store.js";
import { Router } from "./core/router.js";
import { Navigation } from "./core/navigation.js";
import { RouteResolver } from "./core/routeResolver.js";
import { RouteRegistry } from "./core/routeRegistry.js";

import "./components/app-view.js";

import { ApiClient } from "./services/apiClient.js";
import { TestService } from "./services/testService.js";

export class Application {
    constructor() {
        this.app = new App();
    }

    start() {
        const eventBus = new EventBus();
        const store = new Store();
        const routeResolver = new RouteResolver();
        const routeRegistry = new RouteRegistry();
        const apiClient = new ApiClient();
        const testService = new TestService(apiClient);

        const router = new Router(eventBus, store, routeResolver);
        const navigation = new Navigation(router);

        this.app.register("eventBus", eventBus);
        this.app.register("store", store);
        this.app.register("router", router);
        this.app.register("navigation", navigation);
        this.app.register("routeRegistry", routeRegistry);

        this.app.register("apiClient", apiClient);
        this.app.register("testService", testService);

        const appView = document.createElement("app-view");

        appView.app = this.app;
        document.querySelector("#app").appendChild(appView);

        router.start();
    }
}
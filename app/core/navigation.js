export class Navigation {
    constructor(router) {
        this.router = router;
    }

    go(url) {
        history.pushState({}, "", url);
        this.router.resolve();
    }

    replace(url) {
        history.replaceState({}, "", url);
        this.router.resolve();
    }

    refresh() {
        this.router.resolve();
    }
}
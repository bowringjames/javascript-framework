export class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
    }

    // Give me everything
    getState() {
        return this.state;
    }

    // Walk down the object and give me the particular value
    get(path) {
        return path
            .split(".")
            .reduce((obj, key) => obj?.[key], this.state);
    }

    // Walk down the object and create missing objects
    // until we reach the property we want to change
    set(path, value) {
        const keys = path.split(".");
        let current = this.state;

        while(keys.length > 1) {
            const key = keys.shift();

            current[key] ??= {};
            current = current[key];
        }

        current[keys[0]] = value;
    }

    // Make a new state from the old state
    // plus the supplied changes
    setState(partial) {
        this.state = {
            ...this.state,
            ...partial
        };

        this.notify();
    }

    // Add somebody who wants to know when state changes
    subscribe(listener) {
        this.listeners.push(listener);

        return() => {
            this.listeners = this.listeners.filter(
                l => l !== listener
            );
        }
    }

    // Tell every subscriber that the state changed
    notify() {
        this.listeners.forEach(listener => {
            listener(this.state);
        });
    }
}
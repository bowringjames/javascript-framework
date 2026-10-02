export class EventBus {
    constructor() {
        this.events = {};
    }

    subscribe(event, handler) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(handler);

        return () => {
            this.events[event] = this.events[event].filter(h => h !== handler);
        };
    }

    publish(event, data = null) {
        (this.events[event] || []).forEach(handler => {
            handler(data);
        });
    }

    clear(event) {
        delete this.events[event];
    }
}
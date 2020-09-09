export class Event<T extends any[]> {
    private handlers: ((...args: T) => void)[] = [];
    
    public attach(handler: (...args: T) => void) {
        this.handlers.push(handler);
    }

    public trigger(...args: T) {
        this.handlers.forEach(handler => handler(...args));
    }

    public dispose(handler: (...args: T) => void) {
        this.handlers.splice(this.handlers.indexOf(handler), 1);
    }
}
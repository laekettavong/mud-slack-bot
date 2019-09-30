const uuidv4 = require('uuid/v4')

import {
    Observable,
    Observer,
    SlackAction,
    RequestContext,
    Subscriber,
    Subscribable
} from './types'




export class SlackBroadcaster implements Observable {
    private observers: Map<string, Observer> = new Map();

    public attach(observer: Observer, id: string = uuidv4()): string {
        this.observers.set(id, observer);
        return id;
    }

    public detach(id: string): boolean {
        return this.observers.delete(id);
    }

    public notify(action: SlackAction): void {
        for (let observer of this.observers) {
            observer[1].update(action);
        }
    }
}


export class SlackPublisher implements Subscribable {
    private subscribers: Map<string, Subscriber> = new Map();

    public add(subscriber: Subscriber, id: string = uuidv4()): string {
        this.subscribers.set(id, subscriber);
        return id;
    }

    public remove(id: string): boolean {
        return this.subscribers.delete(id);
    }

    public notify(requestCtx: RequestContext): void {
        for (let subscriber of this.subscribers) {
            subscriber[1].respond(requestCtx);
        }
    }
}


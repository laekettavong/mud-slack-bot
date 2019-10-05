import * as R from 'ramda';
import {
    StateUtil,
    AiLogger
} from './util';
import { ComponentDecorator } from './decorator'

import {
    Player,
    RequestContext,
    RoomItem,
    RequestType,
    Subscriber,
} from './types'


export class SlackSubscriber implements Subscriber {
    private httpHandler: any;
    private handlerMap: Map<string, Function>;

    constructor(httpHandler: any) {
        this.httpHandler = httpHandler;
        this.mapHandlers();
    }

    private mapHandlers() {
        this.handlerMap = new Map();
        this.handlerMap.set(RequestType.Move, this.handleInteractiveComponent);
        this.handlerMap.set(RequestType.Play, this.handleInteractiveComponent);
        this.handlerMap.set(RequestType.Start, this.handleInteractiveComponent);
        this.handlerMap.set(RequestType.Pickup, this.handlePickup);
        this.handlerMap.set(RequestType.Inventory, this.handleInventory);
        this.handlerMap.set(RequestType.Chat, this.handleChat);
        this.handlerMap.set(RequestType.Verify, this.handleChallenge);
    }


    public respond(requestCtx: RequestContext): void {
        const { ctx, type, challenge, dungeon, itemName, roomName } = requestCtx
        const lae = { first: "Lae", last: "Kettavong", address: "1188 Louise Way", age: 45, title: "Software Engineer" }
        // AiLogger._.withHeader({ header: "SlackSubscriber.respond", color: AiLogger.Color.Red, body: { type, roomName, itemName } });
        // AiLogger.green().withHeader({ header: "SlackSubscriber.respond", body: { type, roomName, itemName } });
        // AiLogger.yellow().withHeader({ header: "SlackSubscriber.respond", body: { type, roomName, itemName } });
        // AiLogger.red().withHeader({ header: "SlackSubscriber.respond", body: { type, roomName, itemName } });
        // AiLogger.yellow().trace("one", "two", "three", "four");
        // AiLogger.cyan().trace("one", "two", "three", "four");
        // AiLogger.lightblue().stringify({ body: lae });
        // AiLogger.blue().tablize({ body: lae });

        // const logger = AiLogger.makeYellowLogger();
        // const logger2 = AiLogger.makeCyanLogger();

        // logger.withHeader({ header: "SlackSubscriber.respond", body: { type, roomName, itemName } });
        // logger.trace("one", "two", "three", "four");
        // logger2.trace("one", "two", "three", "four");
        // logger.stringify({ body: lae });
        // logger.tablize({ body: lae });

        this.handlerMap.get(type)(requestCtx);
        // switch (requestCtx.type) {
        //     case RequestType.Move:
        //     case RequestType.Play:
        //     case RequestType.Start:
        //         this.handleInteractiveComponent(requestCtx);
        //         break;
        //     case RequestType.Pickup:
        //         this.handlePickup(requestCtx);
        //         break;
        //     case RequestType.Inventory:
        //         this.handleInventory(requestCtx);
        //         break;
        //     case RequestType.Chat:
        //         this.handleChat(requestCtx);
        //         break;
        //     case RequestType.Verify:
        //     default: // Slack bot endpoint verification, just send back 'challenge token
        //         this.handleChallenge(requestCtx);
        // }

    }

    private handleChallenge = (requestCtx: RequestContext): void => {
        const { ctx, challenge } = requestCtx;
        ctx.status = 200;
        ctx.body = { challenge };
    }

    private handleChat = (requestCtx: RequestContext): any => {
        let response = this.getCommonResponse(requestCtx);
        response = ComponentDecorator.decorate({ response, requestCtx });
        this.sendReponse({ response, requestCtx });
    }

    private handleInteractiveComponent = (requestCtx: RequestContext): void => {
        const { dungeon, roomName, user } = requestCtx;
        const room = StateUtil.getRoomStateByName(dungeon.rooms, roomName);
        Object.assign(requestCtx, { room, inventory: [] });
        const player: Player = StateUtil.getPlayerState(dungeon, user);
        if (player) {
            Object.assign(requestCtx, { inventory: player.inventory });
        }
        let response = this.getCommonResponse(requestCtx);
        response = ComponentDecorator.decorate({ response, requestCtx });
        this.sendReponse({ response, requestCtx });
    }

    private handlePickup = (requestCtx: RequestContext): any => {
        const { dungeon, roomName, itemName, user } = requestCtx;
        StateUtil.pickupItem(dungeon, user, roomName, itemName);
        this.handleInteractiveComponent(requestCtx);
    }

    private getCommonResponse = (requestCtx: RequestContext): any => {
        const { user, timestamp } = requestCtx;
        return {
            channel: user, //using user for direct messaging
            as_user: true,
            callback_id: "myCallback",
            ts: timestamp
        }
    }

    private handleStart = (requestCtx: RequestContext): any => {
        let response = this.getCommonResponse(requestCtx);
        response = ComponentDecorator.decorate({ response, requestCtx });
        return this.sendReponse({ response, requestCtx });
    }

    private handleInventory = (requestCtx: RequestContext): any => {
        const { dungeon, user } = requestCtx;
        const { inventory } = StateUtil.getPlayerState(dungeon, user);
        //console.log("***handleInventory:", user, JSON.stringify(inventory));
        Object.assign(requestCtx, { inventory });
        let response = this.getCommonResponse(requestCtx);
        response = ComponentDecorator.decorate({ response, requestCtx });
        this.sendReponse({ response, requestCtx });
    }

    private handleDrop = (requestCtx: RequestContext): any => { }
    private handleResume = (requestCtx: RequestContext): any => { }

    private sendReponse = ({ response, requestCtx }: any) => {
        const postActions = [RequestType.Chat, RequestType.Move, RequestType.Play, RequestType.Resume, RequestType.Start];
        const url = R.includes(requestCtx.type, postActions) ? 'https://slack.com/api/chat.postMessage' : requestCtx.responseUrl;
        //console.log("Slack POST URL2:", url, JSON.stringify(response));
        const res = (async () => {
            return await this.httpHandler({
                method: 'POST',
                url,
                headers: {
                    'Authorization': `Bearer ${process.env.SLACK_BOT_USER_OAUTH_TOKEN}`,
                    'Content-type': 'application/json; charset=utf-8'
                },
                json: true,
                body: response
            });
        })();
        //console.log("isOK?", JSON.stringify(res));
    }
}

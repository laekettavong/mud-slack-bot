import * as R from 'ramda';
import { StateUtil } from './util';
import { ComponentDecorator } from './decorator'

import {
    RequestContext,
    Subscriber,
    Subscribable,
    RequestType
} from './types'


export class SlackSubscriber implements Subscriber {
    private httpHandler: any;

    constructor(httpHandler: any) {
        this.httpHandler = httpHandler;
    }

    public respond(requestCtx: RequestContext): void {
        const { ctx, type, challenge, dungeon, roomName } = requestCtx
        if (type === RequestType.Verify) {
            // Slack bot endpoint verification, just send back 'challenge token
            this.handleChallenge(requestCtx);
        } else {
            console.log("HERE1 TYPE", requestCtx.type)
            if (requestCtx.type === RequestType.Chat) {
                this.handleChat(requestCtx);
            } else if (requestCtx.type === RequestType.Start || requestCtx.type === RequestType.Play) {
                this.handleInteractiveComponent(requestCtx);
            }
        }
    }

    private handleChallenge = (requestCtx: RequestContext): void => {
        const { ctx, challenge } = requestCtx;
        ctx.body = { challenge };
    }

    private handleChat = (requestCtx: RequestContext): any => {
        let response = this.getCommonResponse(requestCtx);
        response = ComponentDecorator.decorate({ response, requestCtx });
        this.sendReponse({ response, requestCtx });
    }

    private handleInteractiveComponent = (requestCtx: RequestContext): void => {
        const { dungeon, roomName } = requestCtx;
        const room = StateUtil.getRoomStateByName(dungeon.rooms, roomName);
        Object.assign(requestCtx, { room });
        let response = this.getCommonResponse(requestCtx);
        response = ComponentDecorator.decorate({ response, requestCtx });
        this.sendReponse({ response, requestCtx });
    }

    private getCommonResponse = (requestCtx: RequestContext): any => {
        const { ctx, user, dungeon, room, timestamp } = requestCtx;
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
        this.sendReponse({ response, requestCtx });
    }


    private handlePlay = (requestCtx: RequestContext): any => { }
    private handleMove = (requestCtx: RequestContext): any => { }
    private handlePickup = (requestCtx: RequestContext): any => { }
    private handleDrop = (requestCtx: RequestContext): any => { }
    private handleInventory = (requestCtx: RequestContext): any => { }
    private handleResume = (requestCtx: RequestContext): any => { }



    private sendReponse = async ({ response, requestCtx }: any) => {
        const postActions = [RequestType.Chat, RequestType.Move, RequestType.Resume, RequestType.Start];
        console.log("Slack POST URL1:", requestCtx.type, postActions, R.includes(requestCtx.type, postActions));
        const url = R.includes(requestCtx.type, postActions) ? 'https://slack.com/api/chat.postMessage' : requestCtx.responseUrl;
        console.log("Slack POST URL2:", url, requestCtx.responseUrl);
        const res = await this.httpHandler({
            method: 'POST',
            url,
            headers: {
                'Authorization': 'Bearer xoxb-525990151425-767913038884-mCRmZ8MZazq7KE88jKpndZsD',
                'Content-type': 'application/json; charset=utf-8'
            },
            json: true,
            body: response
        });
        console.log("Slack POST RESULT:", res);
    }
}


/*
switch (requestCtx.type) {
    case RequestType.Start:
        this.handleStart(requestCtx);
        break;
    case RequestType.Move:
        this.handleMove(requestCtx);
        break;
    case RequestType.Pickup:
        this.handlePickup(requestCtx);
        break;
    case RequestType.Resume:
        this.handleResume(requestCtx);
        break;
    case RequestType.Inventory:
        this.handleInventory(requestCtx);
        break;
    case RequestType.Drop:
        this.handleDrop(requestCtx);
        break;
    case RequestType.Verify:
        this.handleChallenge(requestCtx);
        break;
    default:
        this.handleChat(requestCtx);
}
*/
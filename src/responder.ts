import { StateUtil } from './util';
import { ComponentDecorator } from './decorator'

import {
    Observer,
    SlackAction,
    Room,
    MessageType,
    RequestContext,
    Subscriber,
    Subscribable,
    RequestType
} from './types'


import { DecoratorFactory } from './decorator'

export class SlackResponder implements Observer {
    private httpHandler: any;

    constructor(httpHandler: any) {
        this.httpHandler = httpHandler;
    }

    public async update(action: SlackAction): Promise<boolean> {

        const { type, slackUserId, messageType, messageTimeStamp, responseUrl } = action
        // TODO: remove hardcoded
        //    1. fetch URL and token form config
        //    2. get room info state machine?

        const room: Room = {
            "roomName": "The Goblin Cloak Room",
            "roomDesc": "You enter a small room lined on two sides with open closets full of empty hangers.  There is a drab brown cloak hanging all alone on a hanger in the middle of one closet.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/06-dragon-age-dungeon.jpg",
            "north": "The Entrance Hall",
            "south": "The Goblin Cloak Room",
            "east": "The Tomb of the Unknown Goblin",
            "west": "The Entrance Hall",
            "up": "Second Floor",
            "down": "Basement",
            "items": [
                {
                    "itemName": "The Gem of Sorrows",
                    "itemDesc": "A tiny, blue gemstone that sparkles with fire, casting a troubling blue glow out into the room.",
                    "itemValue": 25,
                    "itemProperty": ""
                },
                {
                    "itemName": "Mordua's Crown",
                    "itemDesc": "A silver crown fashioned of delicate vines and leaves.  The legends say that Mordua's dying words were a spell that enchanted this crown to bring its owner luck.",
                    "itemValue": 35,
                    "itemProperty": ""
                }
            ]
        }
        //console.log("[BBB] messageType", messageType);
        const url = messageType == MessageType.Post ? 'https://slack.com/api/chat.postMessage' : responseUrl;//'https://slack.com/api/chat.update';
        console.log("[BBB] URL", url);
        const response = await this.httpHandler({
            method: 'POST',
            //url: 'https://slack.com/api/chat.postMessage',
            //url: 'https://slack.com/api/chat.update',
            //url: 'https://hooks.slack.com/actions/TFFV44FCH/776627985200/wX1DSrV852NVeVI0yR6kno15',
            url,
            headers: {
                'Authorization': 'Bearer xoxb-525990151425-767913038884-0ikzdX3hQndMGjN4CFq1Fc4L',
                'Content-type': 'application/json; charset=utf-8'
            },
            json: true,
            body: DecoratorFactory.getDecorator(type).decorate({ channel: slackUserId, messageTimeStamp, room })
            // body: {
            //     timestamp: '1569642962.364010',
            //     name: 'thumbsup'
            // }
        });
        // console.log("XXXX response", response)
        return response.ok;
    }
}


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
            this.handleInteractiveComponent(requestCtx);
        }
    }

    private handleChallenge = (requestCtx: RequestContext): void => {
        const { ctx, challenge } = requestCtx;
        ctx.body = { challenge };
    }

    private handleInteractiveComponent = (requestCtx: RequestContext): void => {
        const { dungeon, roomName } = requestCtx;
        const room = StateUtil.getRoomStateByName(dungeon.rooms, roomName);
        requestCtx = Object.assign({ room }, requestCtx);
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

    private handleChat = (requestCtx: RequestContext): any => { }
    private handlePlay = (requestCtx: RequestContext): any => { }
    private handleMove = (requestCtx: RequestContext): any => { }
    private handlePickup = (requestCtx: RequestContext): any => { }
    private handleDrop = (requestCtx: RequestContext): any => { }
    private handleInventory = (requestCtx: RequestContext): any => { }
    private handleResume = (requestCtx: RequestContext): any => { }



    private sendReponse = ({ response, requestCtx }: any) => {
        const url = requestCtx.type == MessageType.Post ? 'https://slack.com/api/chat.postMessage' : requestCtx.responseUrl;
        console.log("Slack POST URL:", url);
        const res = this.httpHandler({
            method: 'POST',
            url,
            headers: {
                'Authorization': 'Bearer xoxb-525990151425-767913038884-0ikzdX3hQndMGjN4CFq1Fc4L',
                'Content-type': 'application/json; charset=utf-8'
            },
            json: true,
            body: response
        });
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
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import rp from 'request-promise';
import { SlackPublisher } from './broadcaster';
import { SlackSubscriber } from './responder';
import { handleRequest } from './request-context'
import * as forsakenGoblin from './dungeon.json'

// import {
//     SlackAction,
//     ActionType,
//     MessageType,
//     DungeonRoom,
//     DungeonRoomMetadata,
//     DungeonRoomState,
//     RoomDirectionState,
//     RequestContext,
//     RequestType
// } from './types';

const app = new Koa();
const router = new Router();
router.prefix('/slack');
app.use(bodyParser());


const slackPublisher = new SlackPublisher();
slackPublisher.add(new SlackSubscriber(rp))

router.get('/bot', async (ctx, next) => {
    ctx.body = 'Hello world!'
});

router.post('/bot', async (ctx, next) => {
    slackPublisher.notify(handleRequest(ctx, forsakenGoblin))
    //ctx.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(5555);





/*

// console.log(/play/gi.test(text));
// console.log(/start/gi.test(text));
// console.log(/pickup/gi.test(text));
// console.log(/move/gi.test(text));

// TODO:

 Create:
    ActionDelegator
        -sniffs out user action, create corresponding action and pass to broadcaster


                    let slackAction: SlackAction = {
                type: ActionType.Play,
                messageType, //MessageType.Update,
                slackUserId: user.id,
                channelId: channel.id,
                messageTimeStamp: action_ts,
                responseUrl: response_url
            }
// observer needs
    type, slackUserId, messageType, messageTimeStamp, responseUrl
// decorator needs
    channel: slackUserId, messageTimeStamp, room

const requestCtx = {
    ctx: any;
    requestType: any;
    user: string;
    channel: string;
    team: string
    timestamp: string;
    responseUrl: string
    challenge: string
    text: string

}




// export type RequestContext = {
//     ctx: any;
//     type: RequestType;
//     user: string;
//     channel: string;
//     team: string
//     dungeon: string,
//     room: string,
//     timestamp: string;
//     responseUrl: string
//     challenge: string
//     text: string
// }

// export enum RequestType {
//     Play = 'PLAY',
//     Chat = 'CHAT',
//     Move = 'MOVE',
//     Pickup = 'PICKUP',
//     Start = 'START',
//     Resume = 'RESUME',
//     Inventory = 'INVENTORY',
//     Drop = 'DROP',
//     Verify = 'VERIFY'
// }


const getRequestContext = (ctx: any): RequestContext => {
    const { body } = ctx.ctx.request.body;
    const { challenge, event, payload } = body;
    const { user, channel, text, event_ts, team, client_msg_id } = event;

    ctx.status = 200;
    let requestCtx: RequestContext = {
        ctx,
        type: undefined,
        user: '',
        channel: '',
        team: '',
        dungeon: undefined,
        room: undefined,
        roomName: '',
        itemName: '',
        timestamp: '',
        responseUrl: '',
        challenge: '',
        text: ''
    };

    // send back Slack 'challenge' token for endpoint verification
    if (challenge) {
        requestCtx = Object.assign({
            type: RequestType.Verify,
            challenge
        }, requestCtx);
    }

    // respond only to message from user
    if (client_msg_id) {
        //const { user, channel, text, team, event_ts } = event;
        // user entered 'play' in response to 'Do you want to play a game?'
        if (/play/gi.test(text)) {
            // send user game intro interactive component (IC)
            requestCtx = Object.assign({
                type: RequestType.Play,
                timestamp: event_ts,
                user,
                channel,
                team,
                text,
                dungeon: forsakenGoblin,
                //room: "TODO",
            }, requestCtx);
        } else {
            // respond to user DM - i.e. '@mudbot ...'
            // respond with 'Do you want to play a game...'
            requestCtx = Object.assign({ type: RequestType.Chat }, requestCtx);
        }
    }

    // get user response from IC
    if (!event && payload) {
        const { actions, channel, team, user, response_url } = JSON.parse(payload);
        const { name, value, text, action_ts } = actions[0];

        requestCtx = Object.assign({
            user,
            channel,
            team,
            text,
            dungeon: forsakenGoblin,
            timestamp: action_ts,
            responseUrl: response_url
        }, requestCtx);

        if (/move/gi.test(name)) {
            requestCtx = Object.assign({
                type: RequestType.Move,
                direction: name, // chosen direction
                roomName: value, // chosen room name
            }, requestCtx);
        }

        if (text && /pickup/gi.test(text.text)) {
            requestCtx = Object.assign({
                type: RequestType.Pickup,
                itemName: value // chosen item name
            }, requestCtx);
        }

    }

    return requestCtx;
}




*/
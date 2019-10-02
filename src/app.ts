import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import rp from 'request-promise';
import { SlackBroadcaster, SlackPublisher } from './broadcaster';
import { SlackSubscriber, SlackResponder } from './responder';
import * as R from 'ramda';

import * as forsakenGoblin from './dungeon.json'


import {
    SlackAction,
    ActionType,
    MessageType,
    DungeonRoom,
    DungeonRoomMetadata,
    DungeonRoomState,
    RoomDirectionState,
    RequestContext,
    RequestType
} from './types';

const app = new Koa();
const router = new Router();
router.prefix('/slack');
app.use(bodyParser());

const slackBroadcaster = new SlackBroadcaster();
const slackResponder = new SlackResponder(rp);
slackBroadcaster.attach(slackResponder);

const slackPublisher = new SlackPublisher();
slackPublisher.add(new SlackSubscriber(rp))


router.post('/bot', async (ctx, next) => {
    console.log("\n\nXXXX bot is alive", ctx.request.body)
    // for URL validation during bot event subscription set up/config
    if (ctx.request.body.challenge) {
        ctx.body = { challenge: ctx.request.body.challenge };
    }

    // get user response from interactive component
    if (!ctx.request.body.event && ctx.request.body.payload) {
        try {
            const { actions, channel, team, user, response_url } = JSON.parse(ctx.request.body.payload);
            console.log("\nresponse_url: ", response_url);
            // action.text.text: 'Pickup'
            // action.value: 'The Gem of Sorrows'
            // action.action_ts: '1569635959.136702'

            const { name, value, type, action_ts } = actions[0];
            //console.log("\nUser made a move: action", actions);  // user: { id: 'UFGEC4XNX', username: 'laekettavong',name: 'laekettavong',team_id: 'TFFV44FCH' }
            //console.log("\nUser made a move: user", user);  // user: { id: 'UFGEC4XNX', username: 'laekettavong',name: 'laekettavong',team_id: 'TFFV44FCH' }
            // TODO: user just made a move on the board, handle accordingly. Currently, bot just sends "OK" message

            console.log("\nActions[0]", actions[0])
            console.log("\nDirection/Room", name, value)
            let messageType = MessageType.Update;

            let item = null;
            if (actions[0].text && actions[0].text.text === 'Pickup') {
                item = actions[0].value;
                messageType = MessageType.Post;
            }

            let moveDir = null;
            if (actions[0].name === 'move') {
                moveDir = actions[0].value;
            }


            console.log("\nXXX MOVE?", moveDir)
            console.log("\nXXXX ITEM?", item)
            let slackAction: SlackAction = {
                type: ActionType.Play,
                messageType, //MessageType.Update,
                slackUserId: user.id,
                channelId: channel.id,
                messageTimeStamp: action_ts,
                responseUrl: response_url
            }

            //console.log("[AAA] messageType", slackAction);

            slackBroadcaster.notify(slackAction);
        } catch (error) {
            // TODO: most likely JSON parsing error, log & handle
        }
    }

    // reply only to client message and not bot's
    const event = ctx.request.body.event;
    if (event && event.client_msg_id) {

        //(ctx.request.body.event)
        const { user, channel, text, event_ts } = event;
        let slackAction: SlackAction = {
            type: ActionType.Chat,
            messageType: MessageType.Post,
            slackUserId: user,
            channelId: channel,
            messageTimeStamp: event_ts
        }

        if (text && text.toLowerCase().includes('play')) {
            //
            slackAction = { ...slackAction, type: ActionType.Play }
            slackBroadcaster.notify(slackAction);
        } else {
            // laconic intro message
            slackBroadcaster.notify(slackAction);
        }
    }
    ctx.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(4444);

// console.log(/play/gi.test(text));
// console.log(/start/gi.test(text));
// console.log(/pickup/gi.test(text));
// console.log(/move/gi.test(text));

// TODO:
/*
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



*/
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


router.post('/lae', async (ctx, next) => {
    slackPublisher.notify(getRequestContext(ctx))
});
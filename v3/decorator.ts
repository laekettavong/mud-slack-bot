import * as R from 'ramda';
import {
    DecoratorUtil,
    AiLogger as Console,
} from './util';

import {
    RequestContext,
    RequestType
} from './types';

import { Underworld } from './model'

export const Decorator = (() => {

    const _decorateChat = ({ response, requestCtx }: any): any => {
        // TODO: add text parser and response accordingly
        const playMsg: string = "Not in the mood to chat. Would you like to play a game instead? Type 'play' to begin.";
        Object.assign(response, { text: playMsg });
        return response;
    }

    const _decoratePlay = ({ response, requestCtx }: any): any => {
        const { dungeonMaster } = requestCtx;
        const { underworld } = dungeonMaster;
        const { name, description, image, helpText } = underworld;
        Object.assign(response, { text: "Dungeon entrance, enter at your own risk" });
        const blocks: Array<any> = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${name}* ${description}`
                }
            },
            {
                "type": "image",
                "title": {
                    "type": "plain_text",
                    "text": "Dungeon",
                    "emoji": true
                },
                "image_url": `${image}`,
                "alt_text": "Dungeon"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${helpText}`
                }
            }
        ];
        Object.assign(response, { blocks });
        // add 'Start' button
        const attachments: Array<any> = [
            {
                text: "Let's go find some gold!",
                callback_id: "myCallback", //TODO: developer defined in Slack admin/config page, still not clear on purpose of this
                color: "#C2061E",
                attachment_type: "default",
                actions: [{
                    name: "start",
                    type: "button",
                    action_id: "start",
                    text: "Start",
                    value: "start"
                }]
            }
        ];
        Object.assign(response, { attachments });
        return response;
    }

    const _decorateMove = ({ response, requestCtx }: any): any => {
        const { dungeonMaster, player, room } = requestCtx;
        //const { underworld } = dungeonMaster;
        const { id, name, description, image, directions, items } = room;
        // const {id, name, desription, image} = room;
        //Console.cyan().log('CCC _decorateMove[1]', JSON.stringify(player), JSON.stringify(room), JSON.stringify(dungeonMaster));
        Object.assign(response, { type: "mrkdwn", text: id });

        // add room description/image
        const blocks: Array<any> = [
            { type: "divider" },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*_${name}_*\n${description}`
                },
                accessory: {
                    type: "image",
                    image_url: `${image}`,
                    alt_text: "Dungeon"
                }
            }
        ];

        if (items.length > 0) {
            blocks.push(
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "_Items up for grabs_"
                        }
                    ]
                }
            );
            //blocks.push({ type: "divider" });

            for (let item of items) {
                let { id, name, description, value, property } = item;
                blocks.push(
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `:moneybag: *_${name}_ (${value} gold coins)*\n${description}`
                        },
                        accessory: {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "pickup"
                            },
                            "value": id
                        }
                    }
                );
            }
        }
        Object.assign(response, { blocks });
        // add navigation buttons
        if (directions.length > 0) {
            let attachments = [
                {
                    text: "*_Make your next move_*",
                    callback_id: "myCallback", //TODO: callbackId from Slack
                    color: "#3AA3E3",
                    attachment_type: "default",
                }
            ];

            let actions = [];
            for (let move of directions) {
                actions.push({
                    name: "move",
                    type: "button",
                    action_id: move.direction,
                    text: DecoratorUtil.getNavigationLabel(move.direction),
                    value: move.id
                })
            }

            if (player.inventory.length > 0) {
                actions.push({
                    name: "inventory",
                    type: "button",
                    action_id: "inventory",
                    text: "i",
                    value: "inventory"
                });
            }

            Object.assign(attachments[0], { actions });
            Object.assign(response, { attachments });
        }
        return response;
    }

    const _decorateInventory = ({ response, requestCtx }: any): any => {
        //const { player } = requestCtx;
        const { inventory, gold } = requestCtx.player;
        Object.assign(response, { type: "mrkdwn", text: 'Inventory' });
        const blocks: Array<any> = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*_Current inventory_*"
                }
            },
            {
                type: "divider"
            }
        ];

        if (inventory.length > 0) {
            for (let item of inventory) {
                let { id, name, description, value, property } = item;
                blocks.push(
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `:moneybag: *_${name} (x${value} gold coins)_*: ${description}`
                        }
                    });
            }

            blocks.push(
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `:moneybag: *_ x ${gold} gold coins_*`
                    }
                });
        }
        Object.assign(response, { blocks });
        const attachments: Array<any> = [{
            text: "Let's continue playing!",
            callback_id: "myCallback", //TODO: callbackId from Slack
            color: "#C2061E",
            attachment_type: "default",
            actions: [{
                name: "resume",
                type: "button",
                action_id: "resume",
                text: "Resume",
                value: "resume"
            }]
        }];
        Object.assign(response, { attachments });
        return response;
    }

    const _handlerMap: Map<string, Function> = new Map();
    _handlerMap.set(RequestType.Chat, _decorateChat);
    _handlerMap.set(RequestType.Play, _decoratePlay);
    _handlerMap.set(RequestType.Start, _decorateMove);
    _handlerMap.set(RequestType.Move, _decorateMove);
    _handlerMap.set(RequestType.Pickup, _decorateMove);
    _handlerMap.set(RequestType.Inventory, _decorateInventory);
    _handlerMap.set(RequestType.Resume, () => 'TODO: resume');
    _handlerMap.set(RequestType.Drop, () => 'TODO: drop');
    _handlerMap.set(RequestType.Ignore, () => 'No action');

    const _decorate = ({ response, requestCtx }: any) => {
        const { type } = requestCtx;
        //Console.lightblue().withHeader({ header: 'Decorator#decorate', body: type })
        if (type !== RequestType.Ignore) return _handlerMap.get(type)({ response, requestCtx });
    }

    return {
        decorate: _decorate
    }

})();






export class ComponentDecoratorDELETE {


    public static decorate({ response, requestCtx }: any) {
        switch (requestCtx.type) {
            case RequestType.Play:
                return this.decoratePlay({ response, requestCtx });
            case RequestType.Start:
            case RequestType.Move:
            case RequestType.Pickup:
                return this.decorateMove({ response, requestCtx });
            case RequestType.Inventory:
                return this.decorateInventory({ response, requestCtx });
            case RequestType.Resume:
            case RequestType.Drop:
                break;
            default:
                return this.decorateChat({ response, requestCtx });
        }
    }

    private static decorateChat = ({ response, requestCtx }: any): any => {
        // TODO: add text parser and response accordingly
        const playMsg: string = "Not in the mood to chat. Would you like to play a game instead? Type 'play' to begin.";
        Object.assign(response, { text: playMsg });
        return response;
    }

    private static decoratePlay = ({ response, requestCtx }: any): any => {
        const { dungeon } = requestCtx;
        Object.assign(response, { text: "Dungeon entrance, enter at your own risk" });
        // add description/image
        const blocks: Array<any> = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${dungeon.dungeonName}* ${dungeon.dungeonDesc}`
                }
            },
            {
                "type": "image",
                "title": {
                    "type": "plain_text",
                    "text": "Dungeon",
                    "emoji": true
                },
                "image_url": `${dungeon.dungeonImg}`,
                "alt_text": "Dungeon"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `${dungeon.helpText}`
                }
            }
        ];
        Object.assign(response, { blocks });
        // add 'Start' button
        const attachments: Array<any> = [
            {
                text: "Let's go find some gold!",
                callback_id: "myCallback", //TODO: callbackId from Slack
                color: "#C2061E",
                attachment_type: "default",
                actions: [{
                    name: "start",
                    type: "button",
                    action_id: "start",
                    text: "Start",
                    value: "start"
                }]
            }
        ];
        Object.assign(response, { attachments });
        return response;
    }

    private static decorateMove = ({ response, requestCtx }: any): any => {
        const { roomName, room, inventory } = requestCtx;
        //console.log("ROOM", roomName, room)
        Object.assign(response, { type: "mrkdwn", text: roomName });

        // add room description/image
        const blocks: Array<any> = [
            { type: "divider" },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*_${room.roomName}_*\n${room.roomDesc}`
                },
                accessory: {
                    type: "image",
                    image_url: `${room.roomImg}`,
                    alt_text: "Dungeon"
                }
            }
        ];
        const { items } = room;
        if (items.length > 0) {
            blocks.push(
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "_Items up for grabs_"
                        }
                    ]
                }
            );
            //blocks.push({ type: "divider" });

            for (let item of items) {
                blocks.push(
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `:moneybag: *_${item.itemName}_ (${item.itemValue} gold coins)*\n${item.itemDesc}`
                        },
                        accessory: {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "pickup"
                            },
                            "value": item.itemName
                        }
                    }
                );
            }
        }
        Object.assign(response, { blocks });
        // add navigation buttons
        const { directions } = room;
        if (directions.length > 0) {
            let attachments = [
                {
                    text: "*_Make your next move_*",
                    callback_id: "myCallback", //TODO: callbackId from Slack
                    color: "#3AA3E3",
                    attachment_type: "default",
                }
            ];

            let actions = [];
            for (let move of directions) {
                let direction = Object.keys(move)[0];
                let roomName = Object.values(move)[0]
                actions.push({
                    name: "move",
                    type: "button",
                    action_id: direction,
                    text: DecoratorUtil.getNavigationLabel(direction),
                    value: roomName
                })
            }

            if (inventory.length > 0) {
                actions.push({
                    name: "inventory",
                    type: "button",
                    action_id: "inventory",
                    text: "i",
                    value: "inventory"
                });
            }

            Object.assign(attachments[0], { actions });
            Object.assign(response, { attachments });
        }
        return response;
    }

    private static decorateInventory = ({ response, requestCtx }: any): any => {
        const { roomName, room, user, inventory } = requestCtx;
        console.log("decorateInventory", inventory)
        Object.assign(response, { type: "mrkdwn", text: roomName });
        const blocks: Array<any> = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*_Current inventory_*"
                }
            },
            {
                type: "divider"
            }
        ];

        if (inventory.length > 0) {
            let gold = 0;
            for (let item of inventory) {

                gold += +item.itemValue;
                blocks.push(
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `:moneybag: *_${item.itemName} (x${item.itemValue})_*: ${item.itemDesc}`
                        }
                    });
            }

            blocks.push(
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `:moneybag: *_ x ${gold}_*`
                    }
                });
        }
        Object.assign(response, { blocks });
        const attachments: Array<any> = [{
            text: "Let's continue playing!",
            callback_id: "myCallback", //TODO: callbackId from Slack
            color: "#C2061E",
            attachment_type: "default",
            actions: [{
                name: "resume",
                type: "button",
                action_id: "resume",
                text: "Resume",
                value: "resume"
            }]
        }];
        Object.assign(response, { attachments });
        console.log("\***decorateInventory", JSON.stringify(response))
        return response;
    }

    private static decorateResume = ({ response, requestCtx }: any): any => {
        const { foo } = response;
        return {};
    }



    private static decorateDrop = ({ response, requestCtx }: any): any => {
        const { foo } = response;
        return {};
    }
}

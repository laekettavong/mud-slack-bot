import * as R from 'ramda';
import {
    StateUtil,
    DecoratorUtil
} from './util';

import {
    RequestContext,
    RequestType
} from './types'

export class ComponentDecorator {
    public static decorate({ commonResponse, requestCtx }: any) {
        switch (requestCtx.type) {
            case RequestType.Start:
                return this.decorateStart({ commonResponse, requestCtx });
                break;
            case RequestType.Move:
                return this.decorateMove({ commonResponse, requestCtx });
                break;
            case RequestType.Pickup:
                break;
            case RequestType.Resume:
                break;
            case RequestType.Inventory:
                break;
            case RequestType.Drop:
                break;
            default:
                break;
        }
    }

    private static decorateStart = ({ response, requestCtx }: any): any => {
        const { dungeon } = requestCtx;
        response = Object.assign({
            text: "START decorator dungeon description here???", //dungeon.dungeonName
        }, response);

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
        response = Object.assign(blocks, response);

        // add 'Start' button
        const attachments: Array<any> = [
            {
                text: "Let's go fild some gold!",
                callback_id: "myCallback", //TODO: callbackId from Slack
                color: "#C2061E",
                attachment_type: "default",
                actions: [{
                    name: "move",
                    type: "button",
                    action_id: "start",
                    text: "Start",
                    value: "start"
                }]
            }
        ];
        response = Object.assign(attachments, response);
        return response;
    }

    private static decorateMove = ({ response, requestCtx }: any): any => {
        const { dungeon, room } = requestCtx;
        response = Object.assign({
            text: "MOVE decorator room description here???",//requestCtx.dungeon
        }, response);


        // add room description/image
        const blocks: Array<any> = [
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

            /*
                 {
                     "type": "context",
                     "elements": [
                         {
                             "type": "mrkdwn",
                             "text": "_Items up for grabs_"
                         }
                     ]
                 },
                 {
                     "type": "divider"
                 },
                 {
                     "type": "section",
                     "text": {
                         "type": "mrkdwn",
                         "text": ":moneybag: *_The Gem of Sorrows_ ($50)*\nA tiny, blue gemstone that sparkles with fire, casting a troubling blue glow out into the room."
                     },
                     "accessory": {
                         "type": "button",
                         "text": {
                             "type": "plain_text",
                             "emoji": true,
                             "text": "Pickup"
                         },
                         "value": "The Gem of Sorrows"
                     }
                 },
                 {
                     "type": "section",
                     "text": {
                         "type": "mrkdwn",
                         "text": ":moneybag: *_Mordua's Crown_ ($25) *\nA silver crown fashioned of delicate vines and leaves.  The legends say that Mordua's dying words were a spell that enchanted this crown to bring its owner luck."
                     },
                     "accessory": {
                         "type": "button",
                         "text": {
                             "type": "plain_text",
                             "emoji": true,
                             "text": "Pickup"
                         },
                         "value": "Mordua's Crown"
                     }
                 }
                 */
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
            blocks.push({ type: "divider" });

            for (let item of items) {
                blocks.push(
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `:moneybag: *_${item.itemName}_ ($${item.value})*\n${item.itemDesc}`
                        },
                        accessory: {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "Pickup"
                            },
                            "value": item.itemName
                        }
                    }
                );
            }

        }
        response = Object.assign(blocks, response);

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
                    name: direction,
                    type: "button",
                    action_id: direction,
                    text: DecoratorUtil.getNavigationLabel(direction), // 'w'
                    value: roomName
                })
            }
            attachments = Object.assign(actions, attachments);
            response = Object.assign(attachments, response);
        }

        return response;
        /*
        const attachmentsX: Array<any> = [
            {
                text: "*_Make your next move_*",
                callback_id: "myCallback", //TODO: callbackId from Slack
                color: "#3AA3E3",
                attachment_type: "default",
                actions: [{
                    name: "move",
                    type: "button",
                    action_id: "moveWest",
                    text: "W",
                    value: "west"
                },
                {
                    name: "move",
                    type: "button",
                    action_id: "moveNorth",
                    text: "N",
                    value: "north"
                },
                {
                    name: "move",
                    type: "button",
                    action_id: "moveSouth",
                    text: "S",
                    value: "south"
                },
                {
                    name: "move",
                    type: "button",
                    action_id: "moveEast",
                    text: "E",
                    value: "east"
                },
                {
                    name: "move",
                    type: "button",
                    action_id: "moveDown",
                    text: "D",
                    value: "down"
                },
                {
                    name: "move",
                    type: "button",
                    action_id: "moveUp",
                    text: "U",
                    value: "up"
                }]
            }
        ];

        response = Object.assign(attachmentsX, response);
        return response;
        */
    }

    private static decoratePickup = ({ response, requestCtx }: any): any => {
        const { foo } = response;
        return {};
    }

    private static decorateResume = ({ response, requestCtx }: any): any => {
        const { foo } = response;
        return {};
    }

    private static decorateInventory = ({ response, requestCtx }: any): any => {
        const { foo } = response;
        return {};
    }

    private static decorateDrop = ({ response, requestCtx }: any): any => {
        const { foo } = response;
        return {};
    }

}







/*



export type RequestContext = {
    ctx: any;
    type: RequestType;
    user: string;
    channel: string;
    team: string
    dungeon: string,
    room: string,
    timestamp: string;
    responseUrl: string
    challenge: string
    text: string
}




const navigation = {
            channel, //'UFGEC4XNX', // slack user ID for direct message
            as_user: true, // 'mudbot', // name of bot
            type: 'mrkdwn',
            callback_id: 'myCallback',
            text: room.roomDesc,
            ts: messageTimeStamp,
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*_The Goblin Cloak Room_*\nYou enter a small room lined on two sides with open closets full of empty hangers.  There is a drab brown cloak hanging all alone on a hanger in the middle of one closet."
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://cdn.conceptartempire.com/images/08/2592/07-mages-tale-dungeon.jpg",
                        "alt_text": "Dungeon"
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "_Items up for grabs_"
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":moneybag: *_The Gem of Sorrows_ ($50)*\nA tiny, blue gemstone that sparkles with fire, casting a troubling blue glow out into the room."
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Pickup"
                        },
                        "value": "The Gem of Sorrows"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":moneybag: *_Mordua's Crown_ ($25) *\nA silver crown fashioned of delicate vines and leaves.  The legends say that Mordua's dying words were a spell that enchanted this crown to bring its owner luck."
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Pickup"
                        },
                        "value": "Mordua's Crown"
                    }
                },

            ],
            attachments: [{
                text: '*_Make your next move_*',
                callback_id: 'myCallback', //TODO: callbackId from Slack
                color: '#3AA3E3',
                attachment_type: 'default',
                actions: [{
                    name: 'move',
                    type: 'button',
                    action_id: 'moveWest',
                    text: 'W',
                    value: 'west'
                },
                {
                    name: 'move',
                    type: 'button',
                    action_id: 'moveNorth',
                    text: 'N',
                    value: 'north'
                },
                {
                    name: 'move',
                    type: 'button',
                    action_id: 'moveSouth',
                    text: 'S',
                    value: 'south'
                },
                {
                    name: 'move',
                    type: 'button',
                    action_id: 'moveEast',
                    text: 'E',
                    value: 'east'
                },
                {
                    name: 'move',
                    type: 'button',
                    action_id: 'moveDown',
                    text: 'D',
                    value: 'down'
                },
                {
                    name: 'move',
                    type: 'button',
                    action_id: 'moveUp',
                    text: 'U',
                    value: 'up'
                }]
            }]
        };
const main-entrance = {
            channel, //'UFGEC4XNX', // slack user ID for direct message
            as_user: true, // 'mudbot', // name of bot
            type: "mrkdwn",
            callback_id: "myCallback",
            text: room.roomDesc,
            ts: messageTimeStamp,
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Tomb of the Forsaken Goblin* Find your way through catacombs below the ancient city of Glarven, the final resting place of the forsaken goblins."
                    }
                },
                {
                    "type": "image",
                    "title": {
                        "type": "plain_text",
                        "text": "Dungeon",
                        "emoji": true
                    },
                    "image_url": "https://cdn.conceptartempire.com/images/08/2592/20-desert-dungeon-entrance.jpg",
                    "alt_text": "Dungeon"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "➕ Navigate through the catacombs with cardinal directions, collecting ancient treasures along the way.  Commands are go [direction] or pickup [item].  The treasures you find will be worth gold.  Collect 100 gold and find the exit to escape."
                    }
                }
            ],
            attachments: [{
                text: "Let's go fild some gold!",
                callback_id: "myCallback", //TODO: callbackId from Slack
                color: "#C2061E",
                attachment_type: "default",
                actions: [{
                    name: "move",
                    type: "button",
                    action_id: "start",
                    text: "Start",
                    value: "start"
                }]
            }]
        };

    }
*/
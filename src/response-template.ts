const navigation_treasure = {
    channel: "UFGEC4XNX", // slack user ID for direct message
    as_user: true, // "mudbot", // name of bot
    type: "mrkdwn",
    callback_id: "myCallback",
    ts: "1234", //messageTimeStamp,
    text: "test 123",// room.roomDesc,
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
        }
    ],
    attachments: [{
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
    }]
};



const main_image = {
    channel: "UFGEC4XNX", // slack user ID for direct message
    as_user: true, // "mudbot", // name of bot
    type: "mrkdwn",
    callback_id: "myCallback",
    ts: "1234", // messageTimeStamp,
    text: "test 123", //room.roomDesc,
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




const inventory = {
    channel: "UFGEC4XNX", // slack user ID for direct message
    as_user: true, // "mudbot", // name of bot
    type: "mrkdwn",
    callback_id: "myCallback",
    ts: "1234", // messageTimeStamp,
    text: "test 123", //room.roomDesc,
    blocks: [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*_Current inventory_*"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ":moneybag: *_The Gem of Sorrows ($50)_*: A tiny, blue gemstone that sparkles with fire, casting a troubling blue glow out into the room."
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ":moneybag: *_Mordua's Crown ($25)_*: A silver crown fashioned of delicate vines and leaves.  The legends say that Mordua's dying words were a spell that enchanted this crown to bring its owner luck."
            }
        }
    ],
    attachments: [{
        text: "Let's continue playing!",
        callback_id: "myCallback", //TODO: callbackId from Slack
        color: "#C2061E",
        attachment_type: "default",
        actions: [{
            name: "move",
            type: "button",
            action_id: "resume",
            text: "Resume",
            value: "resume"
        }]
    }]
};

/*

"blocks": [
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
        text: "*_Make your next move_*",
        callback_id: "myCallback", //TODO: callbackId from Slack
        color: "#3AA3E3",
        attachment_type: "default",
        actions: [{
            name: "move",
            type: "button",
            action_id: "start",
            text: "W",
            value: "start"
        }]
    }]



*/
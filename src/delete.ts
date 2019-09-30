//https://pawelgrzybek.com/typescript-interface-vs-type/

import { SlackBroadcaster } from './broadcaster';
import { NavigationDecorator } from './decorator';
import {
  Decorator,
  NavigationAction,
  DecorateMetadata,
  Observer,
  Room,
  SlackAction,
  ActionType
} from './types'
import { MessageChannel } from 'worker_threads';


class SlackObserver implements Observer {
  public update(action: SlackAction): void {
    console.log("JUSt got notified", action)
  }
}


const observer = new SlackObserver();
const broadcaster = new SlackBroadcaster();
broadcaster.attach(observer);



broadcaster.notify(slackAction);


// interface Human {
//   getName(): string
// }

// class Person implements Human {
//   static getName(){

//   }
// }



//bare bones




const room: Room = {
  "roomName": "The Goblin Cloak Room",
  "roomDesc": "You enter a small room lined on two sides with open closets full of empty hangers.  There is a drab brown cloak hanging all alone on a hanger in the middle of one closet.",
  "north": "The Entrance Hall123",
  "south": "",
  "east": "The Tomb of the Unknown Goblin",
  "west": "The Entrance Hall",
  "up": "",
  "down": "",
  "items": [
    {
      "itemName": "The Tome Of Lowrasil",
      "itemDesc": "A giant book written in an unfamiliar language.",
      "itemValue": 10,
      "itemProperty": ""
    }]
}

const decorator = new NavigationDecorator();
const payload = decorator.decorate({ channel: '12345', as_user: 'slackbot', room });
console.log("XXX", JSON.stringify(payload))






export enum ActionType {
  Play = 'PLAY',
  Chat = 'CHAT',
  Move = 'MOVE',
  Grab = 'GRAB',
  Drop = 'DROP'
}

export enum DecoratorType {
  Plain = 'PLAIN',
  Navigation = 'NAVIGATION',
  Reward = 'REWARD'
}

export interface SlackUser {
  id: string
  slackId: string
  name: string
  screenName: string
}

export interface SlackAction {
  type: ActionType
  slackUserId: string
  channelId?: string
  text?: string
}

export interface moveAction extends SlackAction {
  direction: string
};

export interface grabAction extends SlackAction {
  itemName: string
};

export interface Observer {
  update(action: SlackAction): void
}

export interface Observable {
  attach(observer: Observer): string
  detach(id: string): boolean
  notify(action: SlackAction): void
}

export type CommonResponseBody = {
  channel: string;
  as_user: string;
  type?: string;
}

export type PlainResponseBody = {
  text: string;
} & CommonResponseBody;

export type NavigationResponseBody = {
  attachments: Array<NavAttachment>;
} & CommonResponseBody;

export type NavigationAction = {
  name: string // widget group name, 'move',
  type: string // 'button',
  text: string // '>',
  value: string // 'east',
  confirm?: {
    title: string // 'Are you sure?',
    text: string // 'Wouldn\'t you want to continue forward?',
    ok_text: string // 'Yes',
    dismiss_text: string // 'No'
  }
}

export type NavAttachment = {
  text?: string, // test above navigation widget, 'Choose your move',
  callback_id: string // 'myCallback',
  fallback?: string;
  color?: string, // left vertical bar color, '#3AA3E3'
  attachment_type?: string // 'default',
  actions: Array<NavigationAction>
}


export type DecorateMetadata = {
  channel: string  // slack user ID for direct message, 'UFGEC4XNX'
  as_user: string // bot name, 'mudbot', // name of bot
  room: Room
}

export interface Decorator {
  decorate(roomData: DecorateMetadata): any
}

export interface Room {
  roomName: string;
  roomDesc: string;
  north: string;
  south: string;
  east: string;
  west: string;
  up: string;
  down: string;
  items: Array<{
    itemName: string;
    itemDesc: string;
    itemValue: number;
    itemProperty: string;
  }>
};

// export interface DungeonJSON {
//     dungeonName: string;
//     dungeonDesc: string;
//     helpText: string;
//     rooms: Array<Room>
// }

// export type DungeonState = {
//     players: Player[];
//     deadPlayers: number[];
// } & DungeonJSON;


// export const makeFactory = <T extends UnionType>(kind: T['kind']) => (init: Partial<T>): T => ({
//     ...init,
//     kind
// } as T);

// export type CommonEvent = {
//     playerId: number;
// };

// export type Move = {
//     kind: 'move';
//     direction: Direction;
// } & CommonEvent;

// export const Move = makeFactory<Move>('move');

// export type PickUp = {
//     kind: 'pick-up';
//     itemId: number;
// } & CommonEvent;

// export const PickUp = makeFactory<PickUp>('pick-up');

// export type Stab = {
//     kind: 'stab';
// } & CommonEvent;

// export const Stab = makeFactory<Stab>('stab');

// export type DungeonEvent = Move | PickUp | Stab;



// export interface Player {
//     id: number;
//     gold: number;
//     room: string;
//     inventory: string[]
// };





// export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

// export interface NavDirection {
//     left: Direction
//     forward: Direction
//     back: Direction
//     right: Direction
// }

// export const DungeonState = (jsonObj: any): DungeonState => ({
//     dungeonName: jsonObj.dungeonName,
//     dungeonDesc: jsonObj.dungeonDesc,
//     helpText: jsonObj.helpText,
//     rooms: jsonObj.rooms.map((room: any) => ({
//         roomName: room.roomName,
//         roomDesc: room.roomDesc,
//         north: room.north,
//         south: room.south,
//         east: room.east,
//         west: room.west,
//         up: room.up,
//         down: room.down,
//         items: room.items.map((item: any) => ({
//             itemName: item.itemName,
//             itemDesc: item.itemDesc,
//             itemValue: parseInt(item.itemValue, 10),
//             itemProperty: item.itemProperty
//         }))
//     })),
//     players: [{
//         id: 1,
//         gold: 0,
//         room: 'The Entrance Hall',
//         inventory: []
//     }],
//     deadPlayers: []
// });

const foo = {
  "dungeonName": "Tomb of the Forsaken Goblin",
  "dungeonDesc": "Find your way through catacombs below the ancient city of Glarven, the final resting place of the forsaken goblins.",
  "helpText": "Navigate through the catacombs with cardinal directions, collecting ancient treasures along the way.  Commands are go [direction] or get [item].  The treasures you find will be worth gold.  Collect 100 gold and find the exit to escape.",
  "rooms": [
    {
      "roomName": "The Entrance Hall",
      "roomDesc": "You find yourself inside a large, musty room, unable to recall how you got here.  You appear to be underground, though you are not sure how far down.  There is a small torch on the far side of the room that barely provides sufficient illumination.",
      "north": "The Tomb of Mikki the Gobbo",
      "south": "",
      "east": "The Goblin Cloak Room",
      "west": "",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "The Tome Of Lowrasil",
          "itemDesc": "A giant book written in an unfamiliar language.",
          "itemValue": "10",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "The Goblin Cloak Room",
      "roomDesc": "You enter a small room lined on two sides with open closets full of empty hangers.  There is a drab brown cloak hanging all alone on a hanger in the middle of one closet.",
      "north": "",
      "south": "",
      "east": "The Tomb of the Unknown Goblin",
      "west": "The Entrance Hall",
      "up": "",
      "down": "",
      "items": []
    },
    {
      "roomName": "The Tomb of the Unknown Goblin",
      "roomDesc": "This room appears to be a small tomb, though there are no names or markings to be seen anywhere.",
      "north": "The Hall of Cursed Mirrors",
      "south": "",
      "east": "",
      "west": "The Goblin Cloak Room",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "The Gem of Sorrows",
          "itemDesc": "A tiny, blue gemstone that sparkles with fire, casting a troubling blue glow out into the room.",
          "itemValue": "25",
          "itemProperty": ""
        },
        {
          "itemName": "Mordua's Crown",
          "itemDesc": "A silver crown fashioned of delicate vines and leaves.  The legends say that Mordua's dying words were a spell that enchanted this crown to bring its owner luck.",
          "itemValue": "35",
          "itemProperty": ""
        }
      ]
    },
    {
      "roomName": "The Room of Halgar's Last Breath",
      "roomDesc": "You enter a room whose only remarkable feature is that it seems to be squeezing the very air from your lungs.",
      "north": "Anarius the Grand's Crypt",
      "south": "",
      "east": "The Tomb of Mikki the Gobbo",
      "west": "",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "The Orb of Silence",
          "itemDesc": "A shiny glass orb no bigger than a child's fist.  Whoever possesses this orb is unable to speak.",
          "itemValue": "9",
          "itemProperty": ""
        }
      ]
    },
    {
      "roomName": "The Tomb of Mikki the Gobbo",
      "roomDesc": "This is a modest room with a marble sarcophagus in its center.  Inscribed on the side is the name 'Mikki the Gobbo'.",
      "north": "",
      "south": "The Entrance Hall",
      "east": "",
      "west": "The Room of Halgar's Last Breath",
      "up": "",
      "down": "",
      "items": []
    },
    {
      "roomName": "The Hall of Cursed Mirrors",
      "roomDesc": "A brightly lit hallway with shattered mirrors lining the sides.  The lore of Glarven says that thieves shattered these mirrors while trying to escape from a banshee and their souls were cursed to remain in the shards for eternity.  Anyone who spies one of the thieves within is at risk of swapping places with them.",
      "north": "The Pit of Eternal Moaning",
      "south": "The Tomb of the Unknown Goblin",
      "east": "",
      "west": "",
      "up": "",
      "down": "",
      "items": []
    },
    {
      "roomName": "Anarius the Grand's Crypt",
      "roomDesc": "You enter a grand room with a floor that slopes gently toward the center of the western wall.  Against the wall stands a foreboding statue bearing a strange resemblance to your mother.  Behind the statue is a large marble cube with a plaque that reads 'Anarius the Grand'.",
      "north": "The Cavern of the Forest",
      "south": "The Room of Halgar's Last Breath",
      "east": "The Forbidden Lake",
      "west": "",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "The Fist of Anarius the Grand",
          "itemDesc": "The petrified right hand of the largest goblin who ever lived, eternally in the shape of a fist.",
          "itemValue": "13",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "The Forbidden Lake",
      "roomDesc": "Before you lies a calm lake that reflects the light of three moons, despite it being deep underground.",
      "north": "Wooden Hollow",
      "south": "",
      "east": "The Passage of Silence",
      "west": "Anarius the Grand's Crypt",
      "up": "",
      "down": "",
      "items": []
    },
    {
      "roomName": "The Passage of Silence",
      "roomDesc": "An eerily silent hallway stretches before you.  Your own footsteps do not make sounds in this room.  In fact you can no longer hear your breathing or the pounding of your heart.  The silence is all-consuming.",
      "north": "",
      "south": "",
      "east": "The Pit of Eternal Moaning",
      "west": "The Forbidden Lake",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "Fauntwilla's Enchanted Violin",
          "itemDesc": "This violin makes no sound when played.  Instead it bestows its musician with love so powerful it has been known to reduce the strongest man to tears.",
          "itemValue": "21",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "The Pit of Eternal Moaning",
      "roomDesc": "In the center of this room is a hole so deep that its bottom cannot be seen.  From this hole emanates a strange guttural moan that sends shivers down your spine.",
      "north": "The Vault of Inegal",
      "south": "The Hall of Cursed Mirrors",
      "east": "",
      "west": "The Passage of Silence",
      "up": "",
      "down": "",
      "items": []
    },
    {
      "roomName": "The Cavern of the Forest",
      "roomDesc": "You enter an area with a very low ceiling.  Dense roots hang from the dirt above, indicating you must be below the large forest outside of Glarven.",
      "north": "",
      "south": "Anarius the Grand's Crypt",
      "east": "Wooden Hollow",
      "west": "",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "The Mace of Respect",
          "itemDesc": "You need only to brandish this mace to gain the respect of any passerby.",
          "itemValue": "42",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "Wooden Hollow",
      "roomDesc": "You enter a place so thick with tree roots that you can barely get through.  When you manage to find a path you see that it is a room made of gnarled root walls and floors, and a low ceiling of still more roots.",
      "north": "The Restless Tomb",
      "south": "The Forbidden Lake",
      "east": "Abandoned Glory Mausoleum",
      "west": "The Cavern of the Forest",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "Necklace of the Void",
          "itemDesc": "A simple gold necklace with a stone so dark it chills your soul.",
          "itemValue": "18",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "Abandoned Glory Mausoleum",
      "roomDesc": "This room is lined with the graves of hundreds of goblins, except for two narrow hallways where the doors are.",
      "north": "The Room of the First",
      "south": "",
      "east": "",
      "west": "Wooden Hollow",
      "up": "",
      "down": "",
      "items": []
    },
    {
      "roomName": "The Vault of Inegal",
      "roomDesc": "",
      "north": "",
      "south": "The Pit of Eternal Moaning",
      "east": "",
      "west": "",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "The Hellstaff",
          "itemDesc": "Crafted from demonic darkness, this Hellstaff has the power to open portals.",
          "itemValue": "69",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "The Restless Tomb",
      "roomDesc": "You enter a small room with three tombs.  If you listen closely you can hear a faint knocking and scratching coming from the tombs.",
      "north": "The Obliterated Cavern",
      "south": "Wooden Hollow",
      "east": "The Room of the First",
      "west": "",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "Amulet of Horror",
          "itemDesc": "A simple leather cord with a blood red stone attached.  Wear at your own risk.",
          "itemValue": "6",
          "itemProperty": ""
        },
        {
          "itemName": "Chestplate of Injuring",
          "itemDesc": "The wearer of this chestplate will take more damage than if they were not wearing it.",
          "itemValue": "0",
          "itemProperty": ""
        }
      ]
    },
    {
      "roomName": "The Room of the First",
      "roomDesc": "You enter a room with a small tomb in the center and several cabinets along the walls.  A nearby plaque tells the story of Faldair, the first goblin in Glarven.",
      "north": "",
      "south": "The Abandoned Glory Mausoleum",
      "east": "",
      "west": "The Restless Tomb",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "Faldair's Iron Razor",
          "itemDesc": "A small knife with an intensely sharp edge.",
          "itemValue": "38",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "The Decayed Catacomb",
      "roomDesc": "You enter what looks like it was once a catacomb full of goblins but all that remains is a pile of rubble and bones on the floor.",
      "north": "The Tomb of the Occult",
      "south": "",
      "east": "The Obliterated Cavern",
      "west": "",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "The Scroll of the Starfire Storm",
          "itemDesc": "A scroll of parchment with a powerful spell scrawled across it.",
          "itemValue": "16",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "The Obliterated Cavern",
      "roomDesc": "You enter a cavern, or something that once was a cavern.  Giant stalagmites rise up from the ground, but most of the stalactites have fallen to the cave floor and broken into pieces.",
      "north": "",
      "south": "The Restless Tomb",
      "east": "The Tunnel of the Renegade Goblin",
      "west": "The Decayed Catacomb",
      "up": "",
      "down": "",
      "items": []
    },
    {
      "roomName": "The Tunnel of the Renegade Goblin",
      "roomDesc": "This room is reported to be the escape route of a goblin who was once buried alive within this dungeon.",
      "north": "EXIT",
      "south": "",
      "east": "",
      "west": "The Obliterated Cavern",
      "up": "",
      "down": "",
      "items": []
    },
    {
      "roomName": "The Tomb of the Occult",
      "roomDesc": "You enter a room with a stale smell and the distinct feeling of demonic energy.",
      "north": "",
      "south": "The Decayed Catacomb",
      "east": "",
      "west": "",
      "up": "",
      "down": "",
      "items": [
        {
          "itemName": "Elixir of Transcendence",
          "itemDesc": "A small vial of a pale green translucent fluid.",
          "itemValue": "72",
          "itemProperty": ""
        }]
    },
    {
      "roomName": "EXIT",
      "roomDesc": "You emerge from the tunnel into a small corridor with a stone staircase.  You climb the stairs, your body weary from the day's journey.  You have not been able to figure out how you came to be trapped inside the dungeon, but at least for now you once again have your freedom.",
      "north": "",
      "south": "",
      "east": "",
      "west": "",
      "up": "",
      "down": "",
      "items": []
    }
  ]
}



attachments: [
  {
    text: 'Choose a game to play',
    fallback: 'You are unable to choose a game',
    callback_id: 'myCallback',
    color: '#3AA3E3',
    attachment_type: 'default',
    actions: [
      {
        name: 'move',
        text: '<',
        type: 'button',
        value: 'LEFT',
        guid: 'daasdasdasdsad'
      },
      {
        name: 'move',
        text: '^',
        type: 'button',
        value: 'FORWARD'
      },
      {
        name: 'move',
        text: 'v',
        type: 'button',
        value: 'BACKWARD',
        confirm: {
          title: 'Are you sure?',
          text: 'Wouldn\'t you want to continue forward?',
          ok_text: 'Yes',
          dismiss_text: 'No'
        }
      },
      {
        name: 'move',
        text: '>',
        type: 'button',
        value: 'RIGHT'
      }
    ]
  },
]


{
  "type": "context",
    "elements": [

      {
        "type": "mrkdwn",
        "text": "*Want to grab some loot?*"
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
      "text": "*The Gem of Sorrows ($50) *\nA tiny, blue gemstone that sparkles with fire, casting a troubling blue glow out into the room."
  },
  "accessory": {
    "type": "button",
      "text": {
      "type": "plain_text",
        "emoji": true,
          "text": "Pickup"
    },
    "value": "click_me_123"
  }
},
{
  "type": "section",
    "text": {
    "type": "mrkdwn",
      "text": "*Mordua's Crown - $35*\nA silver crown fashioned of delicate vines and leaves.  The legends say that Mordua's dying words were a spell that enchanted this crown to bring its owner luck."
  },
  "accessory": {
    "type": "button",
      "text": {
      "type": "plain_text",
        "emoji": true,
          "text": "Pickup"
    },
    "value": "click_me_123"
  }
}


/*

import * as R from 'ramda';
import {
    Dungeon,
    DungeonRoomMetadata,
    DungeonRoom,
    DungeonRoomState,
    RoomDirectionState,
    RoomItem
} from './types'

// const room = getRoomStateByName(dungeon.rooms, 'The Tomb of the Unknown Goblin')
export const getRoomStateByName = (rooms: Array<DungeonRoom>, name: String): DungeonRoomState => {
    const dungeonRoom: DungeonRoom = R.filter(R.where({ roomName: R.equals(name) }))(rooms)[0];
    const roomMetadata: DungeonRoomMetadata = R.pickAll(['roomName', 'roomDesc', 'items'])(dungeonRoom);
    return R.merge({ directions: getRoomDirections(dungeonRoom) }, roomMetadata);
}

// e.g. const room: DungeonRoom = getRoomByName(dungeon.rooms, 'The Tomb of the Unknown Goblin');
export const getRoomByName = (rooms: Array<DungeonRoom>, room: String): DungeonRoom => {
    return R.filter(R.where({ roomName: R.equals(room) }))(rooms)[0];
}

// const roomMetadata: DungeonRoomMetadata = getRoomMetadataByName(dungeon.rooms, 'The Goblin Cloak Room')
export const getRoomMetadataByName = (rooms: Array<DungeonRoom>, room: String): DungeonRoomMetadata => {
    const rm: DungeonRoom = R.filter(R.where({ roomName: R.equals(room) }))(rooms)[0];
    return R.pickAll(['roomName', 'roomDesc', 'items'])(rm);
}

// const directions: RoomDirectionState = getRoomDirections(room);
export const getRoomDirections = (room: DungeonRoom): any => {
    const directions: RoomDirectionState = R.pickAll(['north', 'south', 'east', 'west', 'up', 'down'])(room);
    const dirs = R.reject((n: string) => R.isEmpty(n))(directions);
    return R.pipe(R.toPairs, R.map(R.apply(R.objOf)))(dirs);
}


// e.g. const roomItem: RoomItem = getRoomItemByName(room.items, 'The Gem of Sorrows');
export const getRoomItemByName = (items: Array<RoomItem>, item: String): RoomItem => {
    return R.filter(R.where({ itemName: R.equals(item) }))(items)[0];
}



export type Dungeon = {
    dungeonName: string;
    dungeonDesc: string;
    helpText: string;
    rooms: Array<DungeonRoom>
}

export type DungeonRoomMetadata = {
    roomName: string;
    roomDesc: string;
    items: Array<RoomItem>;
}
export type RoomDirection = {
    north: string;
    south: string;
    east: string;
    west: string;
    up: string;
    down: string;
}

export type DungeonRoom = DungeonRoomMetadata & RoomDirection;

export type RoomDirectionState = {
    north?: string;
    south?: string;
    east?: string;
    west?: string;
    up?: string;
    down?: string;
}

export type DungeonRoomState = DungeonRoomMetadata & RoomDirectionState;

export type RoomItem = {
    itemName: string;
    itemDesc: string;
    itemValue: string;
    itemProperty: string;
}



// StateUtil.getRoomStateByName()
{ directions:
   [ { north: 'The Hall of Cursed Mirrors' },
     { south: 'South room' },
     { west: 'The Goblin Cloak Room' } ],
  roomName: 'The Tomb of the Unknown Goblin',
  roomDesc:
   'This room appears to be a small tomb, though there are no names or markings to be seen anywhere.',
  roomImg:
   'https://cdn.conceptartempire.com/images/08/2592/08-iron-blade-dungeon.jpg',
  items:
   [ { itemName: 'The Gem of Sorrows',
       itemDesc:
        'A tiny, blue gemstone that sparkles with fire, casting a troubling blue glow out into the room.',
       itemValue: '25',
       itemProperty: '' 
     },
     { itemName: "Mordua's Crown",
       itemDesc:
        "A silver crown fashioned of delicate vines and leaves.  The legends say that Mordua's dying words were a spell that enchanted this crown to bring its owner luck.",
       itemValue: '35',
       itemProperty: '' } 
    ] 
}



*/
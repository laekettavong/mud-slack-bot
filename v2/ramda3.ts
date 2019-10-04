
import * as R from 'ramda';
//import * as forsakenGoblin from './dungeon.json';

import {
    Dungeon,
    RoomItem,
} from './types'



const forsakenGoblin: Dungeon =
{
    "dungeonName": "Tomb of the Forsaken Goblin",
    "dungeonDesc": "Find your way through catacombs below the ancient city of Glarven, the final resting place of the forsaken goblins.",
    "dungeonImg": "https://cdn.conceptartempire.com/images/08/2592/20-desert-dungeon-entrance.jpg",
    "helpText": "Navigate through the catacombs with cardinal directions, collecting ancient treasures along the way.  Commands are go [direction] or get [item].  The treasures you find will be worth gold.  Collect 100 gold and find the exit to escape.",
    "rooms": [
        {
            "roomName": "The Entrance Hall",
            "roomDesc": "You find yourself inside a large, musty room, unable to recall how you got here.  You appear to be underground, though you are not sure how far down.  There is a small torch on the far side of the room that barely provides sufficient illumination.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/06-dragon-age-dungeon.jpg",
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
                }
            ]
        },
        {
            "roomName": "The Goblin Cloak Room",
            "roomDesc": "You enter a small room lined on two sides with open closets full of empty hangers.  There is a drab brown cloak hanging all alone on a hanger in the middle of one closet.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/04-dungeon-scroller-art.jpg",
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
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/08-iron-blade-dungeon.jpg",
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
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/11-when-angels-die-dungeon.jpg",
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
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/13-old-prison.jpg",
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
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/14-gates-of-nowhere-dungeon.jpg",
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
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/17-dungeon-of-fire.jpg",
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
                }
            ]
        },
        {
            "roomName": "The Forbidden Lake",
            "roomDesc": "Before you lies a calm lake that reflects the light of three moons, despite it being deep underground.",
            "roomImg": "https://image.shutterstock.com/image-photo/scottish-underground-dungeon-cells-lit-260nw-1281940510.jpg",
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
            "roomImg": "https://image.shutterstock.com/image-photo/castle-dungeon-beam-light-260nw-655095802.jpg",
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
                }
            ]
        },
        {
            "roomName": "The Pit of Eternal Moaning",
            "roomDesc": "In the center of this room is a hole so deep that its bottom cannot be seen.  From this hole emanates a strange guttural moan that sends shivers down your spine.",
            "roomImg": "https://image.shutterstock.com/image-photo/ancient-dark-dungeon-fog-260nw-247547329.jpg",
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
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/06-dragon-age-dungeon.jpg",
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
                }
            ]
        },
        {
            "roomName": "Wooden Hollow",
            "roomDesc": "You enter a place so thick with tree roots that you can barely get through.  When you manage to find a path you see that it is a room made of gnarled root walls and floors, and a low ceiling of still more roots.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/04-dungeon-scroller-art.jpg",
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
                }
            ]
        },
        {
            "roomName": "Abandoned Glory Mausoleum",
            "roomDesc": "This room is lined with the graves of hundreds of goblins, except for two narrow hallways where the doors are.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/08-iron-blade-dungeon.jpg",
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
            "roomDesc": "his room is lined with the graves of hundreds of goblins, except for two narrow hallways where the doors are.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/11-when-angels-die-dungeon.jpg",
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
                }
            ]
        },
        {
            "roomName": "The Restless Tomb",
            "roomDesc": "You enter a small room with three tombs.  If you listen closely you can hear a faint knocking and scratching coming from the tombs.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/13-old-prison.jpg",
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
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/14-gates-of-nowhere-dungeon.jpg",
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
                }
            ]
        },
        {
            "roomName": "The Decayed Catacomb",
            "roomDesc": "You enter what looks like it was once a catacomb full of goblins but all that remains is a pile of rubble and bones on the floor.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/17-dungeon-of-fire.jpg",
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
                }
            ]
        },
        {
            "roomName": "The Obliterated Cavern",
            "roomDesc": "You enter a cavern, or something that once was a cavern.  Giant stalagmites rise up from the ground, but most of the stalactites have fallen to the cave floor and broken into pieces.",
            "roomImg": "https://image.shutterstock.com/image-photo/scottish-underground-dungeon-cells-lit-260nw-1281940510.jpg",
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
            "roomImg": "https://image.shutterstock.com/image-photo/castle-dungeon-beam-light-260nw-655095802.jpg",
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
            "roomImg": "https://image.shutterstock.com/image-photo/ancient-dark-dungeon-fog-260nw-247547329.jpg",
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
                }
            ]
        },
        {
            "roomName": "EXIT",
            "roomDesc": "You emerge from the tunnel into a small corridor with a stone staircase.  You climb the stairs, your body weary from the day's journey.  You have not been able to figure out how you came to be trapped inside the dungeon, but at least for now you once again have your freedom.",
            "roomImg": "https://cdn.conceptartempire.com/images/08/2592/18-journeys-reward-dungeon.jpg",
            "north": "",
            "south": "",
            "east": "",
            "west": "",
            "up": "",
            "down": "",
            "items": []
        }
    ],
    "players": []
};


/*
const getItemsFromAllRooms = (dungeon: Dungeon): Array<RoomItem> => {
    const { rooms } = dungeon;
    let allItems: Array<RoomItem> = [];
    for (let room of rooms) {
        allItems = R.concat(allItems, room.items);
    }
    return allItems;
}

const getInventoryItems = (dungeon: Dungeon, itemNames: Array<string>): Array<RoomItem> => {
    const allItems = getItemsFromAllRooms(dungeon);
    let inventoryItems: Array<RoomItem> = [];
    for (let item of allItems) {
        if (R.includes(item.itemName, itemNames)) inventoryItems.push(item);
    }
    return inventoryItems;
}

const inventory = ['The Tome Of Lowrasil', 'The Gem of Sorrows',]
const result = getInventoryItems(forsakenGoblin, inventory);
console.log(JSON.stringify(result));

*/

const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
};





export const AiLogger = (() => {

    enum Color {
        Red = '\x1b[31m%s\x1b[0m',
        Green = '\x1b[32m%s\x1b[0m',
        Yellow = '\x1b[33m%s\x1b[0m',
        Blue = '\x1b[34m%s\x1b[0m',
        Cyan = '\x1b[35m%s\x1b[0m',
        LightBlue = '\x1b[36m%s\x1b[0m',
        White = '\x1b[37m%s\x1b[0m'
    }

    let _toggle: boolean = true;

    const _endGroup = (): void => {
        console.groupEnd();
        console.log('\n');
    }

    const _blank = (): void => {
        console.log('\n');
    }


    class StaticLogger {
        public static toggle = () => {
            _toggle = !_toggle;
        }

        public static header = (header: string, isOn: boolean = true): void => {
            if (_toggle && isOn) console.group(`\n***[ ${header} ]******************`);
        }

        public static withHeader = (header: string, body: any, isOn: boolean = true): void => {
            if (_toggle && isOn) {
                StaticLogger.header(header);
                StaticLogger.stringnify(body);
                _endGroup();
            }
        }

        public static stringnify = (body: any, isOn: boolean = true): void => {
            if (_toggle && isOn) console.log(JSON.stringify(body));
        }

        public static tablize = (body: any, isOn: boolean = true): void => {
            if (_toggle && isOn) console.table(JSON.parse(JSON.stringify(body)));
        }

        public static trace = (...args: any[]): void => {
            if (_toggle) {
                StaticLogger.header('Tracing state');
                for (let arg of args) {
                    console.log(arg)
                }
                _endGroup();
            }
        }
    };

    type LoggerConstructor = {
        name: string;
        color: string;
    }

    type FunctionParams = {
        header?: string;
        color?: string;
        isOn?: boolean;
        body?: any;
    }

    class Logger {
        private name: string;
        private color: string;
        private flick: boolean = true;

        constructor({ name, color = Color.White }: LoggerConstructor) {
            this.name = name;
            this.color = color;
        }

        public toggle = (): void => {
            this.flick = !this.flick;
        }

        public header = ({ header, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) {
                color = color || this.color;
                console.group(color, `***[ ${header} ]******************`);
            }
        }

        public withHeader = ({ header, body, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) {
                color = color || this.color;
                this.header({ header, color, isOn });
                this.stringnify({ body, color, isOn });
            }
        }

        public stringnify = ({ body, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) {
                color = color || this.color;
                console.log(color, JSON.stringify(body));
                this.endGroup();
            }
        }

        public tablize = ({ body, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) {
                console.table(JSON.parse(JSON.stringify(body)));
                this.endGroup();
            }
        }

        public trace = (...args: any[]): void => {
            if (this.flick) {
                this.header({ header: 'Tracing state' });
                for (let arg of args) {
                    console.log(this.color, arg)
                }
                this.endGroup();
            }
        }

        private endGroup = (): void => {
            _endGroup();
        }

        private blank = (): void => {
            _blank();
        }
    }

    const instantiate = ({ name, color }: LoggerConstructor) => {
        return new Logger({ name, color });
    }

    return {
        _: StaticLogger,
        instantiate
    }
})();







const lae = { first: 'Lae', last: 'Kettavong', age: 45, greeting: 'This is only a test of the public broadcasting system' };
// AiLogger._.withHeader('Introduction', lae.first);
// AiLogger._.stringnify(lae);
// AiLogger._.trace(lae, "Hello", "World");
// AiLogger._.toggle();
// AiLogger._.tablize(lae);
const logger = AiLogger.instantiate({ name: 'Test', color: '\x1b[33m%s\x1b[0m' });

logger.withHeader({ header: 'Introduction 123', body: { first: 'Lae', last: 'Kettavong', age: 45, greeting: 'This is only a test of the public broadcasting system' }, color: '\x1b[35m%s\x1b[0m' });
logger.toggle();
logger.stringnify({ body: lae, color: '\x1b[31m%s\x1b[0m' });
logger.trace(lae, "Hello", "World");
// 
logger.tablize({ body: lae, color: '\x1b[34m%s\x1b[0m', isOn: true });

console.log("DDFFSHJKFDHDJ")


/*

export class Logger {
    private name: string;
    private flick: boolean = true;

    constructor(name: string) {
        this.name = name;
    }

    public toggle = (): void => {
        this.flick = !this.flick;
    }

    public header = (header: string, isOn: boolean = true): void => {
        if (this.flick && isOn) console.group(`\n***[ ${header} ]******************`);
    }

    public withHeader = (header: string, body: any, isOn: boolean = true): void => {
        if (this.flick && isOn) {
            this.header(header);
            this.stringnify(body);
            this.endGroup();
        }
    }

    public stringnify = (body: any, isOn: boolean = true): void => {
        if (this.flick && isOn) console.log(JSON.stringify(body));
    }

    public tablize = (body: any, isOn: boolean = true): void => {
        if (this.flick && isOn) console.table(JSON.parse(JSON.stringify(body)));
    }

    public trace = (...args: any[]): void => {
        if (this.flick) {
            this.header('Tracing state');
            for (let arg of args) {
                console.log(arg)
            }
            this.endGroup();
        }
    }

    private endGroup = (): void => {
        console.groupEnd();
        console.log('\n');
    }

    private blank = (): void => {
        console.log('\n');
    }
}


*/
import * as R from 'ramda';
import { stringify } from 'querystring';
const L = require('partial.lenses')
type Dungeon = {
    dungeonName: string;
    dungeonDesc: string;
    helpText: string;
    dungeonImg: string;
    rooms: Array<any>;
    players: Array<any>;
}


type RoomItem = {
    itemName: string;
    itemDesc: string;
    itemValue: string;
    itemProperty: string;
}

type Player = {
    id: string;
    gold: number;
    startRoom: string;
    currentRoom: string;
    inventory: Array<string>
}


let dungeon2 = {
    "dungeonName": "Tomb of the Forsaken Goblin",
    "dungeonDesc": "Find your way through catacombs below the ancient city of Glarven, the final resting place of the forsaken goblins.",
    "helpText": "Navigate through the catacombs with cardinal directions, collecting ancient treasures along the way.  Commands are go [direction] or get [item].  The treasures you find will be worth gold.  Collect 100 gold and find the exit to escape.",
    "dungeonImg": "http://asdadasd.com",
    "rooms": [
        {
            "roomName": "The Entrance Hall",
            "roomDesc": "You find yourself inside a large, musty room, unable to recall how you got here.  You appear to be underground, though you are not sure how far down.  There is a small torch on the far side of the room that barely provides sufficient illumination.",
            "roomImg": "http://asdadasd.com",
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
            "roomName": "The Tomb of the Unknown Goblin",
            "roomDesc": "This room appears to be a small tomb, though there are no names or markings to be seen anywhere.",
            "roomImg": "http://asdadasd.com",
            "north": "The Hall of Cursed Mirrors",
            "south": "South room",
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
        }
    ],
    players: [{}]

    //
}


////console.log(dungeon)
//dungeon = R.assoc('players', [{}], dungeon)

//dungeon = Object.assign(players, dungeon);

const playersLen = R.lensProp('players')
const player = { id: 'ABCDEF', gold: 0, room: 'The Tomb of the Unknown Goblin' };

const foo = {
    players: [{ id: 'ABC', gold: 0, room: 'ROom 1' }]
}

//dungeon = R.append(player, dungeon.players)
//R.set(playersLen, a => a, foo)

let dungeon: Dungeon = {
    dungeonName: "Tomb of the Forsaken Goblin",
    dungeonDesc: "Find your way through catacombs below the ancient city of Glarven, the final resting place of the forsaken goblins.",
    helpText: "Navigate through the catacombs with cardinal directions, collecting ancient treasures along the way.  Commands are go [direction] or get [item].  The treasures you find will be worth gold.  Collect 100 gold and find the exit to escape.",
    dungeonImg: "http://asdadasd.com",
    rooms: [
        {
            roomName: "The Tomb of the Unknown Goblin",
            items: [
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
            roomName: "The Entrance Hall",
            items: [
                {
                    "itemName": "The Tome Of Lowrasil",
                    "itemDesc": "A giant book written in an unfamiliar language.",
                    "itemValue": "100",
                    "itemProperty": ""
                }
            ]
        }
    ],
    players: [{}]
};



// "The Tomb of the Unknown Goblin"
//var pred = R.filter(R.where({ name: R.contains('blah') }));
var pred = R.filter(R.whereEq({ name: 'foo' }));
//R.dissoc(name, 'Lae', pred(obj.A.B.C)[0])
const cLens = R.lensProp('C')
//console.log(R.view(cLens, obj.A.B))
// obj.rooms.C = R.insert(1, { name: 'Fex', value: 'Bye' }, obj.rooms.C)
//R.over(cLens, R.assoc())
//console.log(R.insert(1, { name: 'Fex', value: 'Bye' }, obj.A.B.C));



const roomItems: Array<RoomItem> = R.filter(R.propEq('roomName', 'The Entrance Hall'))(dungeon.rooms)[0].items;
const getRoomItems = (dungeon: Dungeon, roomName: string) => R.filter(R.propEq('roomName', roomName))(dungeon.rooms)[0].items
const getItem = (roomItems: Array<RoomItem>, itmName: string): RoomItem => JSON.parse(JSON.stringify(R.filter(R.propEq('itemName', itmName))(roomItems)[0]));
//const getIndex = ()

// const rmItems = getRoomItems(dungeon, 'The Tomb of the Unknown Goblin')
// const itm = getItem(rmItems, 'The Gem of Sorrows')
// // console.log("XXXrmItems", rmItems)
// // console.log("\nXXXitm", itm);


const removeRoomItem = (dungeon: Dungeon, roomName: string, itemName: string): void => {
    let roomItems = getRoomItems(dungeon, roomName);
    for (let item of roomItems) {
        if (item.itemName === itemName) {
            roomItems = R.reject(R.propEq('itemName', itemName), roomItems);
            const indx = R.findIndex(R.propEq('roomName', roomName))(dungeon.rooms);
            dungeon.rooms[indx].items = roomItems;
            break;
        }
    }
}


const getPlayerState = (dungeon: Dungeon, playerId: string): Player => {
    const { players } = dungeon;
    let player: Player = null;
    for (let indx in players) {
        if (players[indx].id === playerId) {
            player = players[indx];
            break;
        }
    }
    return player;
}

const setPlayerState = (dungeon: Dungeon, currentRoom: string, playerId: string, itemName: string, gold: number): void => {
    const player: Player = getPlayerState(dungeon, playerId);
    if (player) {
        player.gold += gold;
        player.currentRoom = currentRoom;
        player.inventory.push(itemName);
    } else {
        dungeon.players.push({
            id: playerId,
            gold,
            startingRoom: currentRoom,
            currentRoom,
            inventory: [itemName]
        })
    }
}

const pickupItem = (dungeon: Dungeon, playerId: string, roomName: string, itmName: string) => {
    const roomItems = getRoomItems(dungeon, roomName);
    const { itemName, itemValue } = getItem(roomItems, itmName);
    //console.log("\nHERE", itemName, itemValue);
    setPlayerState(dungeon, roomName, playerId, itemName, +itemValue);
    removeRoomItem(dungeon, roomName, itemName);

}

pickupItem(dungeon, '100', 'The Tomb of the Unknown Goblin', 'The Gem of Sorrows');
pickupItem(dungeon, '101', 'The Entrance Hall', 'The Tome Of Lowrasil');
//console.log("\n\n dungeon", JSON.stringify(dungeon))



//R.find(R.propEq('rooms', 2))(dungeon)


type Foo = {
    itemName: string
}
let myArr: Array<Foo> = [{ itemName: 'foo' }, { itemName: 'bar' }, { itemName: 'fix' }]
// console.log(myArr)
// myArr = R.reject(R.propEq('itemName', 'foo'), myArr)
// console.log(myArr)


// const isItem = item:Foo => item.itemName === 'bar';
// R.filter(isItem)([myArr) // [2, 4]

// console.log(R.reject(isItem)(myArr))



console.log("FFFFF123", R.includes('Start', ['Play', 'Chat', 'Start']));


// console.log(JSON.stringify(dungeon))
// removeRoomItem(dungeon, 'The Tomb of the Unknown Goblin', 'The Gem of Sorrows')

// dungeon.players.push({ name: 'Lae', last: 'Kettavong' });
//R.insert(0, { name: 'Lae', last: 'Kettavong' }, dungeon.players)
//console.log('\n\n', JSON.stringify(dungeon))


//console.log('\n\n', getRoomItems("The Tomb of the Unknown Goblin"));
// for (let indx in roomItems) {
//     if (roomItems[indx].itemName === itemName) roomItems[indx] = null;
// }
// console.log("XXINDEX: ", R.findIndex(R.propEq('roomName', roomName))(dungeon.rooms));


const item = R.filter(R.propEq('itemName', 'bez'))(roomItems)[0];
roomItems.push({ itemName: 'lae', itemValue: "60", itemDesc: "123", itemProperty: "456" })
//console.log(item);
//roomItems[0] = null;
//console.log(roomItems);

//console.log(JSON.stringify(dungeon));


//console.log(R.filter(R.propEq('name', 'Two'))(obj.rooms.items));

  // console.log("HERE1", JSON.stringify(roomItems));
  //     for (let indx in roomItems) {
  //       if (roomItems[indx].itemName === itemName) {
  //         roomItems = R.take(+indx)(roomItems)
  //         console.log("\HERE3", JSON.stringify(dungeon));
  //         break;
  //       }
  //   }

/*
https://www.tutorialdocs.com/article/ramda-functions.html
https://gist.github.com/cezarneaga/e7377357d62a2b2909685c1fb94125bb

State Utility functions

const getRoomItems = (roomName: string) => R.filter(R.propEq('roomName', roomName))(dungeon.rooms)[0].items

const getItem = (itemName: string) => R.filter(R.propEq('itemName', 'bez'))(roomItems)[0];

const removeRoomItem = (roomName: string, itemName: string) => {
    const roomItems = getRoomItems(roomName);
    for (let indx in roomItems) {
        if (roomItems[indx].itemName === itemName) roomItems[indx] = null;
    }
}

*/
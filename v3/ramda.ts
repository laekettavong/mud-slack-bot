import * as R from 'ramda';
const L = require('partial.lenses')

const users = [
    { name: 'John', age: 25 },
    { name: 'Lenny', age: 51 },
    { name: 'Andrew', age: 43 },
    { name: 'Peter', age: 81 },
    { name: 'Anna', age: 43 },
    { name: 'Albert', age: 76 },
    { name: 'Adam', age: 47 },
    { name: 'Robert', age: 72 }
];

// console.log(R.pluck('age', users));
// console.table(R.pluck('name', users));


const ctx = { url: 'localhost', port: 4444 };
const token = '123122sdggreet2342';
let requestCtx = R.assoc('ctx', ctx, {});

// requestCtx = R.assoc('body', token, requestCtx);
// requestCtx = R.assoc('name', 'Lae', requestCtx);
// requestCtx = R.assoc('last', 'Kettavong', requestCtx);
console.table(requestCtx);


requestCtx = Object.assign({ body: token }, requestCtx)
console.log("\nXXXrequestCtx", requestCtx);

const users2 = [
    { name: 'John', city: 'London', born: '2001-04-01' },
    { name: 'Lenny', city: 'New York', born: '1997-12-11' },
    { name: 'Andrew', city: 'Boston', born: '1987-02-22' },
    { name: 'Peter', city: 'Prague', born: '1936-03-24' },
    { name: 'Anna', city: 'Bratislava', born: '1973-11-12' },
    { name: 'Albert', city: 'Bratislava', born: '1940-18-19' },
    { name: 'Adam', city: 'Trnava', born: '1983-12-01' },
    { name: 'Robert', city: 'Bratislava', born: '1935-05-15' },
    { name: 'Robert', city: 'Prague', born: '1998-03-14' }
];


// let res = R.reject(R.propEq('city', 'Bratislava'))(users);
// console.log("XXX1", res);

let res2 = R.filter(R.propEq('city', 'Bratislava'))(users);
//console.log("XXX2", res2);

let res3 = R.filter(R.where({
    city: R.equals('Bratislava'),
    name: R.startsWith('A')
}))(users2);

//console.log("XXX3", res3);


import {
    Dungeon,
    DungeonRoomMetadata,
    DungeonRoom,
    DungeonRoomState,
    RoomDirectionState,
    RoomItem
} from './types'
import { SlowBuffer } from 'buffer';


//const dungeon: Dungeon = {
const dungeon = {
    "dungeonName": "Tomb of the Forsaken Goblin",
    "dungeonDesc": "Find your way through catacombs below the ancient city of Glarven, the final resting place of the forsaken goblins.",
    "helpText": "Navigate through the catacombs with cardinal directions, collecting ancient treasures along the way.  Commands are go [direction] or get [item].  The treasures you find will be worth gold.  Collect 100 gold and find the exit to escape.",
    "dungeonImg": "https://cdn.conceptartempire.com/images/08/2592/20-desert-dungeon-entrance.jpg",
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
                }]
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
        }
    ]
}

// // const directions: RoomDirectionState = getRoomDirections(room);
// export const getRoomDirectionsXX = (room: DungeonRoom): any => {
//     const directions: RoomDirectionState = R.pickAll(['north', 'south', 'east', 'west', 'up', 'down'])(room);
//     const dirs = R.reject((n: string) => R.isEmpty(n))(directions);
//     return R.pipe(R.toPairs, R.map(R.apply(R.objOf)))(dirs);
// }

// export const getRoomDirectionsXX = (room: DungeonRoom): any => {
//     const directions: RoomDirectionState = R.pickAll(['north', 'south', 'east', 'west', 'up', 'down'])(room);
//     const dirs = R.reject((n: string) => R.isEmpty(n))(directions);
//     return R.pipe(R.toPairs, R.map(R.apply(R.objOf)))(dirs);
// }


// const dog1 = { name: 'Fido', age: 3, weight: 20 }
// const dogAge = R.lensProp('age');
// console.log(R.view(dogAge, dog1))
// const dog2 = R.set(dogAge, 7, dog1);
// console.log(dog1, dog2)

const rmLens = R.lensProp('rooms');
const rms = R.view(rmLens, dungeon)


const path = R.lensPath(['rooms', 'roomName'])
//console.assert(R.view(path, dungeon))


const data = {
    roomName: "The Tomb of the Unknown Goblin",
    roomDesc: "This room appears to be a small tomb, though there are no names or markings to be seen anywhere.",
    // north: "The Hall of Cursed Mirrors",
    // south: "South room",
    // east: "",
    // west: "The Goblin Cloak Room",
    // up: "",
    // down: "",
    items: [
        {
            itemName: "The Gem of Sorrows",
            itemDesc: "A tiny, blue gemstone that sparkles with fire, casting a troubling blue glow out into the room.",
            itemValue: "25",
            itemProperty: ""
        },
        {
            itemName: "Mordua's Crown",
            itemDesc: "A silver crown fashioned of delicate vines and leaves.  The legends say that Mordua's dying words were a spell that enchanted this crown to bring its owner luck.",
            itemValue: "35",
            itemProperty: ""
        }
    ]

}

const index = R.findIndex(R.propEq('itemName', 'The Gem of Sorrows'))(data.items)
const transformations = {
    roomName: R.identity,
    roomDesc: R.identity,
    items: R.remove(index, 1),
};


// console.log(R.evolve(transformations, data))
// console.log("\n\n", index, data)



/*
var matchPhrases = R.compose(
  R.objOf('must'),
  R.map(R.objOf('match_phrase'))
);
matchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}

*/











// get Room based on name
//const room = R.filter(R.where({ roomName: R.equals('The Tomb of the Unknown Goblin') }))(dungeon.rooms)[0];
//const item2 = R.filter(R.where({ itemName: R.equals('The Gem of Sorrows') }))(room.items);

// e.g. const room: DungeonRoom = getRoomByName(dungeon.rooms, 'The Tomb of the Unknown Goblin');
const getRoomByName = (rooms: Array<DungeonRoom>, room: String): DungeonRoom => {
    return R.filter(R.where({ roomName: R.equals(room) }))(rooms)[0];
}

// const roomMetadata: DungeonRoomMetadata = getRoomMetadataByName(dungeon.rooms, 'The Goblin Cloak Room')
const getRoomMetadataByName = (rooms: Array<DungeonRoom>, room: String): DungeonRoomMetadata => {
    const rm: DungeonRoom = R.filter(R.where({ roomName: R.equals(room) }))(rooms)[0];
    return R.pickAll(['roomName', 'roomDesc', 'items'])(rm);
}

// const directions: RoomDirectionState = getRoomDirections(room);
export const getRoomDirections = (room: DungeonRoom): any => {
    const directions: RoomDirectionState = R.pickAll(['north', 'south', 'east', 'west', 'up', 'down'])(room);
    const dirs = R.reject((n: string) => R.isEmpty(n))(directions);
    return R.pipe(R.toPairs, R.map(R.apply(R.objOf)))(dirs);
}

// const room = getRoomStateByName(dungeon.rooms, 'The Tomb of the Unknown Goblin')
const getRoomStateByName = (rooms: Array<DungeonRoom>, name: String): DungeonRoomState => {
    const dungeonRoom: DungeonRoom = R.filter(R.where({ roomName: R.equals(name) }))(rooms)[0];
    const roomMetadata: DungeonRoomMetadata = R.pickAll(['roomName', 'roomDesc', 'roomImg', 'items'])(dungeonRoom);
    return R.merge({ directions: getRoomDirections(dungeonRoom) }, roomMetadata);
}

// e.g. const roomItem: RoomItem = getRoomItemByName(room.items, 'The Gem of Sorrows');
const getRoomItemByName = (items: Array<RoomItem>, item: String): RoomItem => {
    return R.filter(R.where({ itemName: R.equals(item) }))(items)[0];
}



//const room: DungeonRoom = getRoomByName(dungeon.rooms, 'The Tomb of the Unknown Goblin');
const room: DungeonRoom = getRoomByName(dungeon.rooms, 'The Tomb of the Unknown Goblin');

const directions: Array<any> = getRoomDirections(room);

console.log("\n\nXXXDIRECTIONS", directions)
console.log("\nRoom State\n\n", getRoomStateByName(dungeon.rooms, 'The Tomb of the Unknown Goblin'))

console.log("\n\n*******************\n")

/*
const roomMetadata: DungeonRoomMetadata = getRoomMetadataByName(dungeon.rooms, 'The Goblin Cloak Room');
const roomItem: RoomItem = getRoomItemByName(room.items, 'The Gem of Sorrows');
const dir: RoomDirectionState = R.pickAll(['north', 'south', 'east', 'west', 'up', 'down'])(room)

const isDefined = (n: any) => R.isEmpty(n);
const rejs = R.reject((n: string) => R.isEmpty(n))(dir)
console.log("\nDirections", JSON.stringify(directions))
console.log("\nRoom State", getRoomStateByName(dungeon.rooms, 'The Tomb of the Unknown Goblin'))

*/

//const data: any = {
//     name: null,
//     email: null,
//     username: 'johndoo'
// }

// const getName = R.prop('name')
// const getEmail = R.prop('email')
// const getUsername = R.prop('username')

// const eitherList = R.reduce(R.either, R.isNil)

// const getDisplayName = eitherList(dir)

// console.log(getDisplayName(data))


/*
const circle = { type: 'circle', width: 10, height: 10}
const boldBorder = R.merge({ border: '5px' })
console.log(boldBorder(shapes[0]))

R.isNil()
*/




const dung = {
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
        }
    ]
}

//console.log(L.get(L.prop('titles'), sampleTitles))

console.log("XXX1",
    L.get(
        L.compose(
            L.prop('rooms'),
            L.index(0)
        ),
        dungeon)
)

console.log("\nXXX2",
    L.get(
        L.compose(
            L.prop('rooms'),
            L.index(0),
            L.prop('roomName')
        ),
        dungeon)
)

console.log("\nXXX3",
    L.get(
        L.compose(
            L.prop('rooms'),
            L.index(0),
            L.prop('items'),
            L.index(0),
            L.prop('itemName'),
        ),
        dungeon)
)

const sampleTitles = {
    titles: [
        { language: 'en', text: 'Title' },
        { language: 'sv', text: 'Rubrik' }
    ]
}

const textIn = (language: string) =>
    L.compose(
        L.prop('titles'),
        L.normalize(R.sortBy(L.get('language'))),
        L.find(R.whereEq({ language })),
        L.valueOr({ language, text: '' }),
        L.removable('text'),
        L.prop('text')
    )

// adding new entries
// console.log("\nXXX4", L.set(textIn('fi'), 'Otsikko', sampleTitles))
// // adding new entries
// console.log("\nXXX5", L.set(textIn('la'), 'Laotian', sampleTitles))
console.log("\nXXX6", sampleTitles)
// L.set(textIn('sv'), undefined, sampleTitles)
// console.log("\nXXX7", sampleTitles)


// R.find(R.propEq('rooms', 2))(dungeon)
// L.find(R.whereEq({ rooms }))(dungeon)

const roomsLens = R.lensProp('rooms')
const itemsLen = R.lensProp('items:')
console.log(R.view(roomsLens, dungeon))
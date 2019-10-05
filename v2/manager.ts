
import uniqid from 'uniqid';
import * as R from 'ramda';

import {
  Dungeon,
  DungeonRoomMetadata,
  RoomDirectionState,
  RoomItem
} from './types';

import { AiLogger } from './util';


// var SingletonFactory = (function () {
//   function SingletonClass() {
//     // ...
//   }
//   var instance;
//   return {
//     getInstance: function () {
//       // check if instance is available
//       if (!instance) {
//         instance = new SingletonClass();
//         delete instance.constructor; // or set it to null
//       }
//       return instance;
//     }
//   };
// })();

const StateManage = (() => {
  let instance: Dungeon;


})();

class Room {
  private id: string;
  private name: string;
  private description: string;
  private image: string;
  private directions: Map<string, string>;
  private items: Map<string, Item>;

  constructor(id: string, room: DungeonRoomMetadata) {
    const { roomName, roomDesc, roomImg } = room;
    this.id = id;
    this.name = room.roomName;
    this.description = room.roomDesc;
    this.image = room.roomImg;
    this.initDirections(room);
    this.initItems(room);
  }

  private initDirections(room: DungeonRoomMetadata): void {
    const directions: RoomDirectionState = R.pickAll(['north', 'south', 'east', 'west', 'up', 'down'])(room);
    const dirs = R.reject((n: string) => R.isEmpty(n))(directions);
    const dirArray = R.pipe(R.toPairs, R.map(R.apply(R.objOf)))(dirs);
    this.directions = new Map();

    //AiLogger.green().toggle();
    for (let dir of dirArray) {
      this.directions.set(Object.keys(dir)[0], Object.values(dir)[0])
      AiLogger.green().traceAll(Object.keys(dir)[0], Object.values(dir)[0]);
    }
    AiLogger.green().withHeader({ header: "Room#setDirections", body: { dirArray } });
  }

  private initItems(room: DungeonRoomMetadata): void {
    this.items = new Map();
    for (let item of room.items) {
      const { itemId } = item;
      this.items.set(itemId, new Item(item))
    }
  }

  public getDirections(): Map<string, string> {
    return this.directions;
  }

  public removeItem(itemId: string): boolean {
    return this.items.delete(itemId);
  }

  public addItem(itemId: string, item: Item): void {
    this.items.set(itemId, item);
  }

  public getItems(): Map<string, Item> {
    return this.items;
  }

  public stringify(): string {
    let directions: any = []
    this.directions.forEach((value, key) => {
      directions.push({ key, value });
    });
    return JSON.stringify(this);
  }
}

class Item {
  private id: string;
  private name: string;
  private description: string;
  private value: number;
  private property: string;

  constructor(item: RoomItem) {
    this.id = item.itemId;
    this.name = item.itemName;
    this.description = item.itemDesc;
    this.value = +item.itemValue;
    this.property = item.itemProperty;
  }

  public stringify(): string {
    return JSON.stringify(this);
  }
}

class UnderWorld {
  private id: string;
  private name: string;
  private description: string;
  private helpText: string;
  private image: string;
  private allRooms: Map<string, Room>;
  private allItems: Map<string, Item>;

  constructor(dungeon: Dungeon) {
    const { dungeonName, dungeonDesc, dungeonImg, helpText, rooms } = dungeon;
    this.id = uniqid();
    this.name = dungeonName;
    this.description = dungeonDesc;
    this.helpText = helpText;
    this.image = dungeonImg;
    this.initRooms(rooms);
  }

  private initRooms(rooms: Array<DungeonRoomMetadata>) {
    this.allRooms = new Map();
    for (let room of rooms) {
      const roomId = uniqid();
      this.allRooms.set(roomId, new Room(roomId, room));
    }
  }

  private initItems(room: DungeonRoomMetadata): void {
    this.allItems = new Map();
    for (let item of room.items) {
      const { itemId } = item;
      this.allItems.set(itemId, new Item(item))
    }
  }


}

const state = {
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
}

// const room = new Room(state);
// const foo = JSON.parse(room.stringify());
// AiLogger.cyan().trace({ msg: room.stringify() })
// AiLogger.red().trace({ msg: foo.id })




/*
"dungeonName": "Tomb of the Forsaken Goblin",
"dungeonDesc": "Find your way through catacombs below the ancient city of Glarven, the final resting place of the forsaken goblins.",
"dungeonImg": "https://cdn.conceptartempire.com/images/08/2592/20-desert-dungeon-entrance.jpg",
"helpText": "Navigate through the catacombs with cardinal directions, collecting ancient treasures along the way.  Commands are go [direction] or get [item].  The treasures you find will be worth gold.  Collect 100 gold and find the exit to escape.",
"rooms

"roomName": "The Entrance Hall",
"roomDesc": "You find yourself inside a large, musty room, unable to recall how you got here.  You appear to be underground, though you are not sure how far down.  There is a small torch on the far side of the room that barely provides sufficient illumination.",
"roomImg": "https://cdn.conceptartempire.com/images/08/2592/06-dragon-age-dungeon.jpg",
"north": "The Tomb of Mikki the Gobbo",
"south": "",
"east": "The Goblin Cloak Room",
"west": "",
"up": "",
"down": "",
"item

"itemName": "The Tome Of Lowrasil",
"itemDesc": "A giant book written in an unfamiliar language.",
"itemValue": "10",
"itemProperty": ""




*/

let counter = 0;
while (counter++ < 35) {
  console.log(`${counter}.`, uniqid('gold-'))
}
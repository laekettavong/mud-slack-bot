
import uniqid from 'uniqid';
import * as R from 'ramda';

import {
  Item,
  Room,
  Player,
  Underworld,
  UnderworldFactory
} from './model';

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

export const DungeonMaster = (() => {
  let _instance: MudGame;

  class MudGame {
    private underworld: Underworld;

    constructor(dungeon: Dungeon) {
      this.underworld = UnderworldFactory.getInstance(dungeon);
    }

    public findOrAddPlayer(playerId: string, playerName: string = 'None Given'): Player {
      return this.underworld.findOrAddPlayer(playerId, playerName);
    }

    public getCurrentRoom(player: Player): Room {
      return this.underworld.getRoom(player.getCurrentRoomId());
    }

    public getPlayer(playerId: string): Player {
      return this.underworld.getPlayer(playerId);
    }

    public getRoom(roomId: string): Room {
      return this.underworld.getRoom(roomId);
    }

    public getItem(itemId: string): Item {
      return this.underworld.getItem(itemId);
    }

    public pickupItemBy(room: Room, player: Player, item: Item): void {
      room.removeItem(item);
      player.pickupItem(item);
    }

    public dropItem(room: Room, player: Player, item: Item): void {
      room.addItem(item);
      player.dropItem(item);
    }
  }

  const getInstance = (dungeon: Dungeon): MudGame => {
    if (!_instance) {
      _instance = new MudGame(dungeon);
      delete _instance.constructor; // no more instances
    }
    return _instance;
  }

  return {
    getInstance
  }
})();




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


let counter = 0;
while (counter++ < 35) {
  console.log(`${counter}.`, uniqid('gold-'))
}

*/


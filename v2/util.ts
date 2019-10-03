import * as R from 'ramda';

import {
    DungeonRoom,
    DungeonRoomMetadata,
    DungeonRoomState,
    RoomDirectionState,
    NavDirection,
    Dungeon,
    RoomItem,
    Player
} from './types'

export class StateUtil {

    // const directions: RoomDirectionState = getRoomDirections(room);
    public static getRoomDirections = (room: DungeonRoom): any => {
        const directions: RoomDirectionState = R.pickAll(['north', 'south', 'east', 'west', 'up', 'down'])(room);
        const dirs = R.reject((n: string) => R.isEmpty(n))(directions);
        return R.pipe(R.toPairs, R.map(R.apply(R.objOf)))(dirs);
    }

    // const room = getRoomStateByName(dungeon.rooms, 'The Tomb of the Unknown Goblin')
    public static getRoomStateByName = (rooms: Array<DungeonRoom>, name: String): DungeonRoomState => {
        const dungeonRoom: DungeonRoom = R.filter(R.where({ roomName: R.equals(name) }))(rooms)[0];
        const roomMetadata: DungeonRoomMetadata = R.pickAll(['roomName', 'roomDesc', 'roomImg', 'items'])(dungeonRoom);
        return R.merge({ directions: StateUtil.getRoomDirections(dungeonRoom) }, roomMetadata);
    }

    public static getItemsFromAllRooms = (dungeon: Dungeon): Array<RoomItem> => {
        const { rooms } = dungeon;
        let allItems: Array<RoomItem> = [];
        for (let room of rooms) {
            allItems = R.concat(allItems, room.items);
        }
        return allItems;
    }

    public static getInventoryItems = (dungeon: Dungeon, itemNames: Array<string>): Array<RoomItem> => {
        const allItems = StateUtil.getItemsFromAllRooms(dungeon);
        let inventoryItems: Array<RoomItem> = [];
        for (let item of allItems) {
            if (R.includes(item.itemName, itemNames)) inventoryItems.push(item);
        }
        return inventoryItems;
    }

    public static getRoomItems = (dungeon: Dungeon, roomName: string) => {
        return R.filter(R.propEq('roomName', roomName))(dungeon.rooms)[0].items
    }

    public static getItem = (roomItems: Array<RoomItem>, itmName: string): RoomItem => {
        return JSON.parse(JSON.stringify(R.filter(R.propEq('itemName', itmName))(roomItems)[0]));
    }

    public static getRoomItem = (dungeon: Dungeon, roomName: string, itmName: string): RoomItem => {
        const roomItems = StateUtil.getRoomItems(dungeon, roomName);
        const item = R.filter(R.propEq('itemName', itmName))(roomItems);
        return JSON.parse(JSON.stringify(item))[0];
    }

    public static removeRoomItem = (dungeon: Dungeon, roomName: string, itemName: string): void => {
        let roomItems = StateUtil.getRoomItems(dungeon, roomName);
        for (let item of roomItems) {
            if (item.itemName === itemName) {
                roomItems = R.reject(R.propEq('itemName', itemName), roomItems);
                const indx = R.findIndex(R.propEq('roomName', roomName))(dungeon.rooms);
                dungeon.rooms[indx].items = roomItems;
                break;
            }
        }
    }

    public static getPlayerState = (dungeon: Dungeon, playerId: string): Player => {
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

    public static setPlayerState = (dungeon: Dungeon, currentRoom: string, playerId: string, roomItem: RoomItem): void => {
        const player: Player = StateUtil.getPlayerState(dungeon, playerId);
        if (player) {
            player.gold += +roomItem.itemValue;
            player.currentRoom = currentRoom;
            player.inventory.push(roomItem);
        } else {
            dungeon.players.push({
                id: playerId,
                gold: +roomItem.itemValue,
                startRoom: currentRoom,
                currentRoom,
                inventory: [roomItem]
            })
        }
    }

    public static pickupItem = (dungeon: Dungeon, playerId: string, roomName: string, itemName: string) => {
        const roomItems = StateUtil.getRoomItems(dungeon, roomName);
        const roomItem: RoomItem = StateUtil.getItem(roomItems, itemName);
        StateUtil.removeRoomItem(dungeon, roomName, itemName);
        StateUtil.setPlayerState(dungeon, roomName, playerId, roomItem);
        console.log("\nPlayer stats:", dungeon.players)
    }

export class Logger {
  public static stringify = (header, body) => {
    console.group(`\n***${header}***`);
    console.log(JSON.stringify(body));
  }
}


    /*

        public static setPlayerState = (dungeon: Dungeon, currentRoom: string, playerId: string, itemName: string, gold: string): void => {
        //const {itemValue} = StateUtil.getRoomItem(dungeon, currentRoom, itemName);
        const player: Player = StateUtil.getPlayerState(dungeon, playerId);
        if (player) {
            player.gold += +gold;
            player.currentRoom = currentRoom;
            player.inventory.push(itemName);
        } else {
            dungeon.players.push({
                id: playerId,
                gold: +gold,
                startRoom: currentRoom,
                currentRoom,
                inventory: [itemName]
            })
        }
    }

    public static pickupItem = (dungeon: Dungeon, playerId: string, roomName: string, itmName: string) => {
        const roomItems = StateUtil.getRoomItems(dungeon, roomName);
        const { itemName, itemValue, itemDesc, itemProperty } = StateUtil.getItem(roomItems, itmName);
        StateUtil.removeRoomItem(dungeon, roomName, itemName);
        StateUtil.setPlayerState(dungeon, roomName, playerId, itemName, itemValue);
        console.log("\nPlayer stats:", dungeon.players)
    }


       public static getInventoryItems = (dungeon: Dungeon, itemNames: Array<string>): Array<RoomItem> => {
        const allItems = StateUtil.getItemsFromAllRooms(dungeon);
        console.log("\n***getInventoryItems1:", JSON.stringify(allItems));
        let inventoryItems: Array<RoomItem> = [];
        for (let item of allItems) {
            if (R.includes(item.itemName, itemNames)) inventoryItems.push(item);
        }
        console.log("\n***getInventoryItems2:", JSON.stringify(inventoryItems));
        return inventoryItems;
    }
    
    */
}

export class DecoratorUtil {
    public static getNavigationLabel = (direction: string) => {
        switch (direction) {
            case NavDirection.North:
                return 'n';
            case NavDirection.South:
                return 's';
            case NavDirection.East:
                return 'e';
            case NavDirection.West:
                return 'w';
            case NavDirection.Up:
                return 'u';
            case NavDirection.Down:
                return 'd';
            default:
                return '-';
        }
    }
}
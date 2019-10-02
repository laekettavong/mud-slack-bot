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
        if (item.itemName === itemName)  {
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
      const { itemName, itemValue } = StateUtil.getItem(roomItems, itmName);
      StateUtil.removeRoomItem(dungeon, roomName, itemName);
      StateUtil.setPlayerState(dungeon, roomName, playerId, itemName, itemValue);
      console.log(dungeon.players)
    }
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
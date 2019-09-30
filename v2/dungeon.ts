import * as R from 'ramda';
import {
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
export const getRoomByName = (rooms: Array<DungeonRoom>, name: String): DungeonRoom => {
    return R.filter(R.where({ roomName: R.equals(name) }))(rooms)[0];
}

// const roomMetadata: DungeonRoomMetadata = getRoomMetadataByName(dungeon.rooms, 'The Goblin Cloak Room')
export const getRoomMetadataByName = (rooms: Array<DungeonRoom>, name: String): DungeonRoomMetadata => {
    const room: DungeonRoom = R.filter(R.where({ roomName: R.equals(name) }))(rooms)[0];
    return R.pickAll(['roomName', 'roomDesc', 'items'])(room);
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

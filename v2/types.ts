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

export type Player = {
    userId: string;
    room: string;
    gold: number;
    items: Array<RoomItem>;
}

// TODO: History
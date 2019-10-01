export type Dungeon = {
    dungeonName: string;
    dungeonDesc: string;
    helpText: string;
    dungeonImg: string;
    rooms: Array<any>; // Array<DungeonRoom>
    players: Array<Player>;  //Array<Player>;
}

export type DungeonRoomMetadata = {
    roomName: string;
    roomDesc: string;
    roomImg: string;
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
    id: string;
    gold: number;
    startRoom: string;
    currentRoom: string;
    inventory: Array<string>
}

export type RequestContext = {
    ctx: any;
    type: RequestType;
    user: string;
    channel: string;
    team: string
    dungeon: any,
    room: any,
    roomName: string;
    itemName: string;
    timestamp: string;
    responseUrl: string
    challenge: string
    text: string
}

export enum RequestType {
    Play = 'PLAY',
    Chat = 'CHAT',
    Move = 'MOVE',
    Pickup = 'PICKUP',
    Start = 'START',
    Resume = 'RESUME',
    Inventory = 'INVENTORY',
    Drop = 'DROP',
    Verify = 'VERIFY'
}

export enum NavDirection {
    North = 'north',
    South = 'south',
    East = 'east',
    West = 'west',
    Up = 'up',
    Down = 'down'
}

export interface Subscriber {
    respond(action: RequestContext): void;
}

export interface Subscribable {
    add(subscriber: Subscriber): string;
    remove(id: string): boolean;
    notify(action: RequestContext): void;
}


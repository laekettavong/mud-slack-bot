/***[ Types ]********/
export type Dungeon = {
    dungeonId?: string; //TODO..make quired
    dungeonName: string;
    dungeonDesc: string;
    helpText: string;
    dungeonImg: string;
    rooms: Array<DungeonRoomMetadata>; // Array<DungeonRoom>
    players: Array<Player>;  //Array<Player>;
}

export type DungeonRoomMetadata = {
    roomId?: string; //TODO..make quired
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
    itemId?: string; //TODO..make quired
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
    inventory: Array<RoomItem>
}

export type RequestContextOLD = {
    ctx: any;
    type: RequestType;
    user: string;
    channel: string;
    team: string
    dungeon: any,
    room: any,
    item: string;
    timestamp: string;
    responseUrl: string;
    challenge: string;
    text: string;
    inventory?: Array<RoomItem>;
}

export type RequestContext = {
    ctx: any;
    dungeonMaster: any;
    player?: Player;
    responseUrl?: string;
    timestamp?: string;
    challenge?: string;
    type?: RequestType;
    channel?: string;
    team?: string
    user?: string;
    roomId?: string;
    itemId?: string;
    text?: string;
    direction?: string; //TODO needit still? 
}

export type PlayerRoomParam = {
  playerId: string;
  roomId: string;
}

export type PlayerRoomItemParam = {
  playerId: string;
  roomId: string;
  itemId: string
}

/***[ Enums ]********/
export enum RequestType {
    Play = 'play',
    Chat = 'chat',
    Move = 'move',
    Pickup = 'pickup',
    Start = 'start',
    Resume = 'resume',
    Inventory = 'inventory',
    Drop = 'drop',
    Verify = 'verify',
    Ignore = 'ignore'
}

export enum NavDirection {
    North = 'north',
    South = 'south',
    East = 'east',
    West = 'west',
    Up = 'up',
    Down = 'down'
}

/***[ Interfaces ]********/
export interface Subscriber {
    respond(action: RequestContext): void;
}

export interface Subscribable {
    add(subscriber: Subscriber): string;
    remove(id: string): boolean;
    notify(action: RequestContext): void;
}


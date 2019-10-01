export enum ActionType {
    Play = 'PLAY',
    Chat = 'CHAT',
    Move = 'MOVE',
    Grab = 'GRAB',
    Drop = 'DROP'
}

export enum MessageType {
    Post = 'POST',
    Update = 'UPDATE',
}

export interface SlackUser {
    id: string;
    slackUserId: string;
    name: string;
    screenName: string;
}

export type SlackAction = {
    type: ActionType;
    slackUserId: string;
    channelId?: string;
    text?: string;
    messageType: MessageType;
    messageTimeStamp: string;
    responseUrl?: string;
}

export type moveAction = {
    direction: string;
} & SlackAction;

export type grabAction = {
    itemName: string;
} & SlackAction;

export interface Observer {
    update(action: SlackAction): void;
}

export interface Observable {
    attach(observer: Observer): string;
    detach(id: string): boolean;
    notify(action: SlackAction): void;
}

export type CommonResponseBody = {
    channel: string;
    as_user: boolean;
    type?: string;
}

export type PlainResponseBody = {
    text: string;
} & CommonResponseBody;

export type NavigationResponseBody = {
    attachments: Array<NavAttachment>;
} & CommonResponseBody;

export type NavigationAction = {
    name: string // widget group name, 'move',
    type: string // 'button',
    text: string // '>',
    value: string // 'east',
    confirm?: {
        title: string // 'Are you sure?',
        text: string // 'Wouldn\'t you want to continue forward?',
        ok_text: string // 'Yes',
        dismiss_text: string // 'No'
    }
}

export type NavAttachment = {
    text?: string, // test above navigation widget, 'Choose your move',
    callback_id: string // 'myCallback',
    fallback?: string;
    color?: string, // left vertical bar color, '#3AA3E3'
    attachment_type?: string // 'default',
    actions: Array<NavigationAction>
}

export type DecorateMetadata = {
    channel: string; // slack user ID for direct message, 'UFGEC4XNX'
    as_user: boolean;
    room: Room;
    messageTimeStamp: string;
}

export interface Decorator {
    decorate(roomData: DecorateMetadata): any;
}

// TODO: delete...duplicate, copied over
export interface Room {
    roomName: string;
    roomDesc: string;
    roomImg: string;
    north: string;
    south: string;
    east: string;
    west: string;
    up: string;
    down: string;
    items: Array<{
        itemName: string;
        itemDesc: string;
        itemValue: number;
        itemProperty: string;
    }>
};




/* Second Interation */
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

export type Player = {
    id: string;
    gold: number;
    startRoom: string;
    currentRoom: string;
    inventory: Array<string>
}

export type Dungeon = {
    // dungeonName: string;
    // dungeonDesc: string;
    // dungeonImg: string;
    // helpText: string;
    // rooms: Array<DungeonRoom>

    dungeonName: string;
    dungeonDesc: string;
    helpText: string;
    dungeonImg: string;
    rooms: Array<any>;
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

// export type Player = {
//     userId: string;
//     room: string;
//     gold: number;
//     items: Array<RoomItem>;
// }

// type Dungeon = {
//     dungeonName: string;
//     dungeonDesc: string;
//     helpText: string;
//     dungeonImg: string;
//     rooms: Array<any>;
//     players: Array<any>;
// }



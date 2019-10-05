import * as R from 'ramda';
import moment from 'moment'

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

export const AiLogger = (() => {

    type LoggerConstructor = {
        name: string;
        color: string;
    }

    type FunctionParams = {
        header?: string;
        color?: string;
        isOn?: boolean;
        body?: any;
    }

    enum Color {
        Red = '\x1b[31m%s\x1b[0m',
        Green = '\x1b[32m%s\x1b[0m',
        Yellow = '\x1b[33m%s\x1b[0m',
        Blue = '\x1b[34m%s\x1b[0m',
        Cyan = '\x1b[35m%s\x1b[0m',
        LightBlue = '\x1b[36m%s\x1b[0m',
        White = '\x1b[37m%s\x1b[0m'
    }

    let _toggle: boolean = true;
    let _color: Color = Color.White;

    const _header = (header: string, color: string): void => {
        console.group(color, `\n***[ ${header} ]******************[ ${moment().format('lll')} ]***`);
    }

    const _withHeader = (header: string, body: any, color: string): void => {
        _header(header, color);
        _stringify(body, color);
        _endGroup();
    }

    const _stringify = (body: any, color: string): void => {
        console.log(color, JSON.stringify(body));
        _endGroup();
    }

    const _tablize = (body: any): void => {
        console.table(JSON.parse(JSON.stringify(body)));
        _endGroup();
    }

    const _trace = (...args: any[]): void => {
        _header('Tracing state', _color);
        for (let indx in args) {
            console.log(_color, `(${+indx + 1}) ${args[indx]}`)
        }
        _endGroup();
    }

    const _endGroup = (): void => {
        console.groupEnd();
        console.log();
    }

    const _blank = (): void => {
        console.log();
    }

    class StaticLogger {
        public static toggle = () => {
            _toggle = !_toggle;
        }

        public static header = ({ header, color, isOn = true }: FunctionParams): void => {
            if (_toggle && isOn) {
                _header(header, color || _color);
            }
        }

        public static withHeader = ({ header, body, color, isOn = true }: FunctionParams): void => {
            if (_toggle && isOn) _withHeader(header, body, color || _color);
        }

        public static stringify = ({ body, color, isOn = true }: FunctionParams): void => {
            if (_toggle && isOn) _stringify(body, color || _color);
        }

        public static tablize = ({ body, isOn = true }: FunctionParams): void => {
            if (_toggle && isOn) _tablize(body);
        }

        public static trace = (...args: any[]): void => {
            if (_toggle) _trace(...args);
        }
    };

    class Logger {
        private name: string;
        private color: string;
        private flick: boolean = true;

        constructor({ name = "AiLogger", color = Color.White }: LoggerConstructor) {
            this.name = name;
            this.color = color;
        }

        public toggle = (): void => {
            this.flick = !this.flick;
        }

        public header = ({ header, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) _header(header, color || this.color);
        }

        public withHeader = ({ header, body, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) _withHeader(header, body, color || this.color);
        }

        public stringify = ({ body, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) _stringify(body, color || this.color);
        }

        public tablize = ({ body, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) _tablize(body);
        }

        public trace = (...args: any[]): void => {
            if (this.flick) {
                _header('Tracing state', this.color);
                for (let indx in args) {
                    console.log(this.color, `(${+indx + 1}) ${args[indx]}`)
                }
                _endGroup();
            }
        }

        private endGroup = (): void => {
            _endGroup();
        }

        private blank = (): void => {
            _blank();
        }
    }

    const instantiate = ({ name, color }: LoggerConstructor) => {
        return new Logger({ name, color });
    }

    return {
        Color,
        _: StaticLogger,
        red: () => { _color = Color.Red; return StaticLogger },
        green: () => { _color = Color.Green; return StaticLogger },
        yellow: () => { _color = Color.Yellow; return StaticLogger },
        blue: () => { _color = Color.Blue; return StaticLogger },
        cyan: () => { _color = Color.Cyan; return StaticLogger },
        lightblue: () => { _color = Color.LightBlue; return StaticLogger },
        white: () => { _color = Color.White; return StaticLogger },
        instantiate,
        makeRedLogger: (name?: string) => instantiate({ name, color: Color.Red }),
        makeGreenLogger: (name?: string) => instantiate({ name, color: Color.Green }),
        makeYellowLogger: (name?: string) => instantiate({ name, color: Color.Yellow }),
        makeBlueLogger: (name?: string) => instantiate({ name, color: Color.Blue }),
        makeCyanLogger: (name?: string) => instantiate({ name, color: Color.Cyan }),
        makeLightBlueLogger: (name?: string) => instantiate({ name, color: Color.LightBlue }),
        makeWhiteLogger: (name: string) => instantiate({ name, color: Color.White })
    }
})();




/*

const lae = { first: "Lae", last: "Kettavong", address: "1188 Louise Way", age: 45, title: "Software Engineer" }
AiLogger._.withHeader({ header: "SlackSubscriber.respond", color: AiLogger.Color.Red, body: { type, roomName, itemName } });
AiLogger.green().withHeader({ header: "SlackSubscriber.respond", body: { type, roomName, itemName } });
AiLogger.yellow().withHeader({ header: "SlackSubscriber.respond", body: { type, roomName, itemName } });
AiLogger.red().withHeader({ header: "SlackSubscriber.respond", body: { type, roomName, itemName } });
AiLogger.yellow().trace("one", "two", "three", "four");
AiLogger.cyan().trace("one", "two", "three", "four");
AiLogger.lightblue().stringify({ body: lae });
AiLogger.blue().tablize({ body: lae });

const logger = AiLogger.makeYellowLogger();
logger.withHeader({ header: "SlackSubscriber.respond", body: { type, roomName, itemName } });
logger.trace("one", "two", "three", "four");
logger.stringify({ body: lae });
logger.tablize({ body: lae });

 class Logger {
        private name: string;
        private color: string;
        private flick: boolean = true;

        constructor({ name, color = Color.White }: LoggerConstructor) {
            this.name = name;
            this.color = color;
        }

        public toggle = (): void => {
            this.flick = !this.flick;
        }

        public header = ({ header, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) {
                color = color || this.color;
                console.group(color, `***[ ${header} ]******************`);
            }
        }

        public withHeader = ({ header, body, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) {
                color = color || this.color;
                this.header({ header, color, isOn });
                this.stringnify({ body, color, isOn });
            }
        }

        public stringnify = ({ body, color, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) {
                color = color || this.color;
                console.log(color, JSON.stringify(body));
                this.endGroup();
            }
        }

        public tablize = ({ body, isOn = true }: FunctionParams): void => {
            if (this.flick && isOn) {
                console.table(JSON.parse(JSON.stringify(body)));
                this.endGroup();
            }
        }

        public trace = (...args: any[]): void => {
            if (this.flick) {
                this.header({ header: 'Tracing state' });
                for (let arg of args) {
                    console.log(this.color, arg)
                }
                this.endGroup();
            }
        }

        private endGroup = (): void => {
            _endGroup();
        }

        private blank = (): void => {
            _blank();
        }
    }


*/
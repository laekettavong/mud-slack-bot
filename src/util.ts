import * as R from 'ramda';

import {
    // Decorator,
    // ActionType,
    // NavigationAction,
    // DecorateMetadata,
    // PlainResponseBody,
    // Room,
    // RequestContext,
    // RequestType,
    DungeonRoom,
    DungeonRoomMetadata,
    DungeonRoomState,
    RoomDirectionState,
    NavDirection
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
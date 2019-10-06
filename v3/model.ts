import uniqid from 'uniqid';
import * as R from 'ramda';

import {
  Dungeon,
  DungeonRoomMetadata,
  RoomDirectionState,
  RoomItem
} from './types';

import { AiLogger } from './util';

export class Item {
  private id: string;
  private name: string;
  private description: string;
  private value: number;
  private property: string;

  constructor(item: RoomItem) {
    this.id = item.itemId;
    this.name = item.itemName;
    this.description = item.itemDesc;
    this.value = +item.itemValue;
    this.property = item.itemProperty;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getValue(): number {
    return this.value;
  }

  public stringify(): string {
    return JSON.stringify(this);
  }
}

export class Room {
  private id: string;
  private name: string;
  private description: string;
  private image: string;
  private directions: Map<string, string>;
  private items: Map<string, Item>;

  constructor(room: DungeonRoomMetadata) {
    const { roomId, roomName, roomDesc, roomImg } = room;
    this.id = roomId;
    this.name = room.roomName;
    this.description = room.roomDesc;
    this.image = room.roomImg;
    this.initDirections(room);
    this.initItems(room);
  }

  private initDirections(room: DungeonRoomMetadata): void {
    const directions: RoomDirectionState = R.pickAll(['north', 'south', 'east', 'west', 'up', 'down'])(room);
    const dirs = R.reject((n: string) => R.isEmpty(n))(directions);
    const dirArray = R.pipe(R.toPairs, R.map(R.apply(R.objOf)))(dirs);
    this.directions = new Map();

    //AiLogger.green().toggle();
    for (let dir of dirArray) {
      this.directions.set(Object.keys(dir)[0], Object.values(dir)[0])
      //AiLogger.green().traceAll(Object.keys(dir)[0], Object.values(dir)[0]);
    }
    //AiLogger.green().withHeader({ header: "Room#setDirections", body: { dirArray } });
  }

  private initItems(room: DungeonRoomMetadata): void {
    this.items = new Map();
    for (let item of room.items) {
      this.items.set(item.itemId, new Item(item))
    }
  }

  public getDirections(): Map<string, string> {
    return this.directions;
  }

  public removeItem(item: Item): boolean {
    return this.items.delete(item.getId());
  }

  public addItem(item: Item): void {
    this.items.set(item.getId(), item);
  }

  public getItems(): Map<string, Item> {
    return this.items;
  }

  public stringify(): string {
    let directions: any = []
    this.directions.forEach((value, key) => {
      directions.push({ key, value });
    });
    return JSON.stringify(this);
  }
}

export class Player {
  private id: string;
  private name: string;
  private startRoomId: string;
  private killCount: number;
  private currentRoomId: string;
  private inventory: Map<string, Item>;
  private history: Map<string, any>;

  constructor(id: string, name: string, startingRoomId: string) {
    this.id = id;
    this.name = name;
    this.startRoomId = startingRoomId;
    this.currentRoomId = startingRoomId;
    this.killCount = 0;
    this.inventory = new Map();
  }

  public getId(): string {
    return this.id;
  }

  public setCurrentRoom(roomId: string): void {
    this.currentRoomId = roomId;
  }

  public getCurrentRoomId(): string {
    return this.currentRoomId;
  }

  public pickupItem(item: Item): void {
    this.inventory.set(item.getId(), item);
  }

  public dropItem(item: Item): boolean {
    return this.inventory.delete(item.getId());
  }

  public stringify(): string {
    return JSON.stringify(this);
  }
}

export class Underworld {
  private id: string;
  private name: string;
  private description: string;
  private helpText: string;
  private image: string;
  private allRooms: Map<string, Room>;
  private allItems: Map<string, Item>;
  private allPlayers: Map<string, Player>;

  constructor(dungeon: Dungeon) {
    const { dungeonId, dungeonName, dungeonDesc, dungeonImg, helpText, rooms } = dungeon;
    this.id = dungeonId;
    this.name = dungeonName;
    this.description = dungeonDesc;
    this.helpText = helpText;
    this.image = dungeonImg;
    this.allPlayers = new Map();
    this.initRooms(rooms);
    this.initItems(rooms);
  }

  private initRooms(rooms: Array<DungeonRoomMetadata>) {
    this.allRooms = new Map();
    for (let room of rooms) {
      this.allRooms.set(room.roomId, new Room(room));
    }
  }

  private initItems(rooms: Array<DungeonRoomMetadata>): void {
    this.allItems = new Map();
    for (let room of rooms) {
      for (let item of room.items) {
        this.allItems.set(item.itemId, new Item(item))
      }
    }
  }

  public getAllRooms(): Map<string, Room> {
    return this.allRooms;
  }

  public getAllItems(): Map<string, Item> {
    return this.allItems;
  }

  public getAllPlayers(): Map<string, Player> {
    return this.allPlayers;
  }

  public getRoom(roomId: string): Room {
    return this.allRooms.get(roomId);
  }

  public getItem(itemId: string): Item {
    return this.allItems.get(itemId);
  }

  public addPlayer(player: Player): void {
    this.allPlayers.set(player.getId(), player);
  }

  public deletePlayer(playerId: string): boolean {
    return this.allPlayers.delete(playerId);
  }

  public getPlayer(playerId: string): Player {
    return this.allPlayers.get(playerId);
  }

  public findOrAddPlayer(playerId: string, playerName: string): Player {
    AiLogger.cyan().withHeader({ header: 'Underworld#findOrAddPlayer', body: { playerId, playerName, size: this.allPlayers.size } });

    if (!this.allPlayers.has(playerId)) {
      const indx = Math.floor(Math.random() * this.allRooms.size);
      const roomId = Array.from(this.allRooms.keys())[indx];
      const player = new Player(playerId, playerName, roomId)
      this.allPlayers.set(playerId, player);
      AiLogger.cyan().traceAll(indx, roomId, player.stringify(), JSON.stringify(player));
      return player;
    } else {
      AiLogger.cyan().trace({ msg: 'THERE1' });
      return this.allPlayers.get(playerId);
    }
  }
}

export const UnderworldFactory = (() => {
  let _instance: Underworld;

  const getInstance = (dungeon: Dungeon): Underworld => {
    if (!_instance) {
      _instance = new Underworld(dungeon);
      delete _instance.constructor; // no more instances
    }
    return _instance;
  }

  return {
    getInstance
  }
})();
import * as R from 'ramda';
import {
  Dungeon,
  RequestContext,
  RequestType
} from './types';

import { DungeonMaster } from './master';

import {
  Item,
  Player,
  Room
} from './model';

import { AiLogger as Console } from './util';



const caseHandleChallenge = (ctx: any, requestCtx: RequestContext): void => {
  // send back Slack 'challenge' token for endpoint verification
  const { challenge } = ctx.request.body;
  if (challenge) {
    Object.assign(requestCtx, { type: RequestType.Verify, challenge });
  }
}

const caseHandleComponent = (ctx: any, requestCtx: RequestContext): void => {
  const { event } = ctx.request.body;
  if (event && event.client_msg_id) {
    const { user, channel, text, event_ts, team, client_msg_id } = event;
    const tracer = { user, channel, text, event_ts, team, client_msg_id, event };
    Console.yellow().withHeader({ header: 'Context#handleUserMessage', body: tracer });
    const { dungeonMaster } = requestCtx;
    Console.yellow().log("handleUserMessage 1", JSON.stringify(requestCtx));
    let player: Player = null;
    try {
      Console.yellow().log("Here2")
      player = dungeonMaster.findOrAddPlayer(user);
      Console.yellow().log("Here3", JSON.stringify(player))
    } catch (error) {
      Console.yellow().log("ERROR 123", JSON.stringify(error))
    }

    Object.assign(requestCtx,
      {
        type: RequestType.Ignore,
        timestamp: event_ts,
        channel: user,
        user,
        team,
        text,
        player,
        roomName: player.getCurrentRoomId()
      });

    if (/play/i.test(text)) {
      // send user game intro interactive component (IC)
      Object.assign(requestCtx, { type: RequestType.Play });
    } else {
      // respond to user DM - i.e. '@mudbot ...'
      // respond with 'Do you want to play a game...'
      Object.assign(requestCtx, { type: RequestType.Chat });
    }
  }
}

const caseHandleUserMessage = (ctx: any, requestCtx: RequestContext): void => {
  const { event, payload } = ctx.request.body;
  if (!event && payload) {
    const { actions, channel, team, user, response_url, message } = JSON.parse(payload);
    const { name, value, text, action_ts } = actions[0];
    const tracer = { name, value, text, action_ts, channel, team, user, response_url, message, acitons: actions[0] };
    Console.yellow().withHeader({ header: 'Context#handleComponent', body: requestCtx })

    const { dungeonMaster } = requestCtx;
    const player: Player = dungeonMaster.getPlayer(user.id);

    Object.assign(requestCtx,
      {
        type: RequestType.Chat,
        channel: user.id,
        user: user.id,
        team,
        text,
        timestamp: action_ts,
        responseUrl: response_url,
        player,
        roomId: player.getCurrentRoomId()
      });

    if (/start/i.test(value)) {
      Object.assign(requestCtx, { type: RequestType.Start });
    }

    if (/resume/i.test(name)) {
      Object.assign(requestCtx, { type: RequestType.Move });
    }

    if (/inventory/i.test(name)) {
      Object.assign(requestCtx, { type: RequestType.Inventory });
    }

    if (/move/i.test(name)) {
      Object.assign(requestCtx,
        {
          type: RequestType.Move,
          direction: name, // chosen direction
          roomId: value, // chosen room name
        });
    }

    if (text && /pickup/i.test(text.text)) {
      Object.assign(requestCtx,
        {
          type: RequestType.Pickup,
          roomId: message.text, // player.getCurrentRoomId() 
          itemId: value  //chosen item name
        });
    }
    Console.yellow().stringify({ body: requestCtx });
  }
}



export const handleRequest = (ctx: any, dungeonMaster: any): RequestContext => {
  const { challenge } = ctx.request.body;
  let requestCtx: RequestContext = { ctx, dungeonMaster, type: RequestType.Ignore };
  caseHandleChallenge(ctx, requestCtx);
  caseHandleComponent(ctx, requestCtx);
  caseHandleUserMessage(ctx, requestCtx);

  ctx.status = 200;
  return requestCtx;
}



/*

export const handleRequestOLD = (ctx: any, forsakenGoblin: any): RequestContext => {
  const { body } = ctx.request;
  const { challenge, event, payload } = body;
  //console.log("Entrance", bot_id, client_msg_id, JSON.stringify(payload), '\n');
  //console.log("Entrance", JSON.stringify(ctx), '\n');


  let requestCtx: RequestContext = {
    ctx,
    type: undefined,
    user: '',
    channel: '',
    team: '',
    dungeon: forsakenGoblin,
    room: undefined,
    roomName: '',
    itemName: '',
    timestamp: '',
    responseUrl: '',
    challenge: '',
    text: ''
  };

  // send back Slack 'challenge' token for endpoint verification
  if (challenge) {
    Object.assign(requestCtx,
      {
        type: RequestType.Verify,
        challenge
      });
  }

  if (!event && payload) { // get user response from IC
    //AiConsole.withHeader('Get user response from IC')
    const { actions, channel, team, user, response_url, message } = JSON.parse(payload);
    const { name, value, text, action_ts } = actions[0];
    const lae = { user, name, value, text, action_ts, response_url, channel, team, actions: actions[0] };
    //console.log(lae);
    //console.log(JSON.stringify(JSON.parse(payload)));
    console.table(JSON.stringify(lae));

    Object.assign(requestCtx,
      {
        type: RequestType.Chat,
        user: user.id,
        channel,
        team,
        text,
        dungeon: forsakenGoblin,
        timestamp: action_ts,
        responseUrl: response_url
      });

    if (/start/i.test(value)) {
      Object.assign(requestCtx,
        {
          type: RequestType.Start,
          channel: user.id,
          user: user.id,
          roomName: "The Entrance Hall", // chosen room name
        });
    }

    if (/move/i.test(name)) {
      Object.assign(requestCtx,
        {
          type: RequestType.Move,
          channel: user.id,
          user: user.id,
          direction: name, // chosen direction
          roomName: value, // chosen room name
        });
    }

    if (/inventory/i.test(name)) {
      Object.assign(requestCtx,
        {
          type: RequestType.Inventory,
          channel: user.id,
          user: user.id,
        });
    }

    if (/resume/i.test(name)) {
      Object.assign(requestCtx,
        {
          type: RequestType.Move,
          channel: user.id,
          user: user.id,
        });
    }
    //console.log("LAE1", text, /pickup/i.test(text.text))
    if (text && /pickup/i.test(text.text)) {
      requestCtx = Object.assign(requestCtx,
        {
          type: RequestType.Pickup,
          roomName: message.text,
          itemName: value // chosen item name
        });
    }

  }

  if (event && event.client_msg_id) {
    console.group("**Reply only to client message");
    const { user, channel, text, event_ts, team, client_msg_id } = event;
    const lae = { user, channel, text, event_ts, team, client_msg_id, event };
    //console.log(JSON.stringify(lae));
    //console.table(lae);

    //console.log("\n\nXXX1 CHAT|PLAY ", user)

    Object.assign(requestCtx,
      {
        type: RequestType.Ignore,
        timestamp: event_ts,
        user,
        channel,
        team,
        text,
        dungeon: forsakenGoblin,
        roomName: "TODO",
      });

    // respond only to message from user
    if (/play/i.test(text)) {
      // send user game intro interactive component (IC)
      Object.assign(requestCtx, {
        type: RequestType.Play,
        channel: user,
        user,
        roomName: "The Entrance Hall" // TODO randomize
      });
    } else {

      // respond to user DM - i.e. '@mudbot ...'
      // respond with 'Do you want to play a game...'
      Object.assign(requestCtx, { type: RequestType.Chat });
    }
  }

  ctx.status = 200;
  return requestCtx;
}
*/

/*
export const RequestHandler = (() => {

  return Object.freeze(
    class RequestHandler {
      public static handleRequest = (ctx: any, forsakenGoblin: any) => {
        //const action =  name || value || text || text ||;

      }

    }
  );
})();
*/

/*

class Decorate {
    static one(msg){
        console.log(`This is decorateOne: ${msg}`);
        return 'This is one';
    }

    static two(msg){
        console.log(`This is decorateTwo: ${msg}`);
        return 'This is two';
    }

        static three(msg){
        console.log(`This is decorateThree: ${msg}`);
        return 'This is three';
    }
}

    const map = new Map();
    map.set('one', Decorate.one);
    map.set('two', Decorate.two);
    map.set('three', Decorate.three);

const decorate = (type, msg) => {
    const whichOne = map.get(type);
    return whichOne(msg)
}

const foo = decorate('two', 'Hi, I\'m Lae.')
console.log(foo)
*/
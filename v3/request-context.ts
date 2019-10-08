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
  if (event && event.client_msg_id) { //user triggered event (as opposed to Slack triggered)
    /*
     * In this context:
     *  'user' -> ID of (client) user that initiated the chat, at this time user name is not provided
     *  'channel' -> ID of channel from where chat was initated
     *  'text' -> user text message
     *  'event_ts' -> timestamp of when message was sent, but also used asmessage ID for bot to reply to
     *  'client_msg_id' -> message ID to signify the message was (client) user initiated and not Slack
     *  'team' -> some ID...maybe workspace ID?
     */
    const { user, channel, text, event_ts, team, client_msg_id } = event;
    const tracer = { user, channel, text, event_ts, team, client_msg_id, event };
    // Console.lightblue().log("AAA caseHandleComponent [1]", user, JSON.stringify(user), JSON.stringify(tracer));

    const { dungeonMaster } = requestCtx;
    // at this point, user name is unknown...not given
    // game context provides current player and room state
    const gameCtx = dungeonMaster.getGameContext(user);
    const { player, room } = gameCtx;
    // Console.lightblue().log("AAA caseHandleComponent [2]", JSON.stringify(gameCtx));

    Object.assign(requestCtx,
      {
        type: RequestType.Ignore,
        timestamp: event_ts,
        channel: user,
        user,
        team,
        text,
        player,
        room
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
    /*
     * In this context:
     *  'actions' -> encapsulation of the action triggered by user interaction
     *  'name' -> (developer defined in corresponding interactive compoenent) name of button pressed...not user's name
     *  'value' -> (again, defined by developer) value of button pressed
     *  'user' -> holds (client) user 'id' and 'name'
     *  'channel' -> channel ID
     *  'action_ts' -> timestamp of when action was triggered, used as component ID in conjuction with 'esponse_url'
     *  'response_url' -> URL bound to the interactive component from where the action was triggered, it is used for "refreshing"
     *                    the component - i.e. on button click, refresh/rerender component to include more/less text/widgets, etc
     */
    const { actions, channel, team, user, response_url, message } = JSON.parse(payload);

    // some components use 'name' to refer to the name of button pressed...not user's name
    // while others use 'value' as the name of action triggered
    const { name, value, text, action_ts } = actions[0];

    const tracer = { name, value, text, action_ts, channel, team, user, response_url, message, acitons: actions[0] };
    Console.yellow().log("BBB caseHandleUserMessage [1]", JSON.stringify(user), name, text, value, JSON.stringify(tracer));

    const { dungeonMaster } = requestCtx;
    // in this context, 'user' contains 'id' and 'name' of (client) user
    const { player, room } = dungeonMaster.getGameContext(user.id, user.name);
    // Console.yellow().log("BBB handleUserMessage [2]", JSON.stringify({ player, room }));

    const playerId = user.id;
    const roomId = room.id
    const itemId = value;

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
        room
      });

    if (/start/i.test(value)) {
      const { player, room } = dungeonMaster.getGameContext(user.id, user.name);
      Console.yellow().log("BBB handleUserMessage [START]", JSON.stringify({ player, room }));
      Object.assign(requestCtx, { type: RequestType.Start });
    }

    if (/resume/i.test(name)) {
      const { player, room } = dungeonMaster.getGameContext(user.id, user.name);
      Console.yellow().log("BBB handleUserMessage [RESUME]", JSON.stringify({ player, room }));
      Object.assign(requestCtx, { type: RequestType.Move });
    }

    if (/inventory/i.test(name)) {
      const { player, room } = dungeonMaster.getGameContext(user.id, user.name);
      Console.yellow().log("BBB handleUserMessage [INVENTORY]", JSON.stringify({ player, room }));
      Object.assign(requestCtx, { type: RequestType.Inventory });
    }

    if (/move/i.test(name)) {
      const { player, room } = dungeonMaster.getGameContext(user.id, user.name);
      Console.yellow().log("BBB handleUserMessage [MOVE]", JSON.stringify({ player, room }));
      Object.assign(requestCtx,
        {
          type: RequestType.Move,
          direction: name, // chosen direction
          roomId: value, // chosen room name
        });
    }

    if (text && /pickup/i.test(text.text)) {
      dungeonMaster.pickupItem({ playerId, roomId, itemId });
      const { player, room } = dungeonMaster.getGameContext(user.id, user.name);
      Console.yellow().log("BBB handleUserMessage [PICKUP]", JSON.stringify({ player, room }));
      Object.assign(requestCtx,
        {
          type: RequestType.Pickup,
          roomId: message.text, // player.getCurrentRoomId() 
          itemId: value, //chosen item name,
          player,
          room
        });
    }
    //Console.yellow().stringify({ body: requestCtx });
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

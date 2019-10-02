import * as R from 'ramda';
import {
  Dungeon,
  RequestContext,
  RequestType
} from './types';

//   console.log("\nXXX")
export const handleRequest = (ctx: any, forsakenGoblin: any): RequestContext => {
  const { body } = ctx.request;
  const { challenge, event, payload } = body;
  console.log("\nXXX0")

  ctx.status = 200;
  let requestCtx: RequestContext = {
    ctx,
    type: undefined,
    user: '',
    channel: '',
    team: '',
    dungeon: undefined,
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
  else if (event) {
    const { user, channel, text, event_ts, team, client_msg_id } = event;
    console.log("\n\nXXX1 CHAT|PLAY ")


    Object.assign(requestCtx,
      {
        timestamp: event_ts,
        user,
        channel,
        team,
        text,
        dungeon: forsakenGoblin,
        roomName: "TODO",
      });

    // respond only to message from user
    if (client_msg_id) {
      if (/play/gi.test(text)) {
        // send user game intro interactive component (IC)
        Object.assign(requestCtx, {
          type: RequestType.Play,
          roomName: "The Entrance Hall" // TODO randomize
        });
      } else {
        console.log("\nYO3")
        // respond to user DM - i.e. '@mudbot ...'
        // respond with 'Do you want to play a game...'
        Object.assign(requestCtx, { type: RequestType.Chat });
      }
    }
  }
  else if (!event && payload) { // get user response from IC
    console.log("\nXXX2 START|MOVE|PICKUP")
    const { actions, channel, team, user, response_url } = JSON.parse(payload);
    const { name, value, text, action_ts } = actions[0];
    Object.assign(requestCtx,
      {
        type: RequestType.Chat,
        user,
        channel,
        team,
        text,
        dungeon: forsakenGoblin,
        timestamp: action_ts,
        responseUrl: response_url
      });

    if (/start/gi.test(value)) {
      Object.assign(requestCtx,
        {
          type: RequestType.Start,
          channel: user.id,
          user: user.id,
          roomName: "The Entrance Hall", // chosen room name
        });
    }

    if (/move/gi.test(name)) {
      Object.assign(requestCtx,
        {
          type: RequestType.Move,
          channel: user.id,
          user: user.id,
          direction: name, // chosen direction
          roomName: value, // chosen room name
        });
    }

    if (text && /pickup/gi.test(text.text)) {
      requestCtx = Object.assign(requestCtx,
        {
          type: RequestType.Pickup,
          itemName: value // chosen item name
        });
    }

  }
  // console.group("*****RequestContext*****");
  // console.group(requestCtx)
  return requestCtx;
}
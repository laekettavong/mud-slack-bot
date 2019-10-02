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
  //console.log("Entrance", bot_id, client_msg_id, JSON.stringify(payload), '\n');
  //console.log("Entrance", JSON.stringify(ctx), '\n');

  // (1) when user click on 'Start' button, event is undefined

  /*

 

  */

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

  if (!event && payload) { // get user response from IC
    console.group("**Get user response from IC");
    const { actions, channel, team, user, response_url, message } = JSON.parse(payload);
    const { name, value, text, action_ts } = actions[0];
    const lae = { user, name, value, text, action_ts, response_url, channel, team, actions: actions[0]};
    //console.log(lae);
    //console.log(JSON.stringify(JSON.parse(payload)));
    //console.table(lae);

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
    const lae = { user, channel, text, event_ts, team, client_msg_id, event};
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
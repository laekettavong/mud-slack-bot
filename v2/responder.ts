import * as R from 'ramda';
import { StateUtil } from './util';
import { ComponentDecorator } from './decorator'

import {
    RequestContext,
    Subscriber,
    RequestType
} from './types'


export class SlackSubscriber implements Subscriber {
    private httpHandler: any;

    constructor(httpHandler: any) {
        this.httpHandler = httpHandler;
    }

    public respond(requestCtx: RequestContext): void {
      const { ctx, type, challenge, dungeon, itemName, roomName } = requestCtx
      //console.log("XXX-IC:", type, itemName, roomName)
      switch(requestCtx.type) {
        case RequestType.Move:
        case RequestType.Play:
        case RequestType.Start:
          this.handleInteractiveComponent(requestCtx);
          break;
        case RequestType.Pickup:
          this.handlePickup(requestCtx);
          break;
        case RequestType.Chat:
          this.handleChat(requestCtx);
          break;
        case RequestType.Verify:
        default: // Slack bot endpoint verification, just send back 'challenge token
          this.handleChallenge(requestCtx);
        }
      
    }

    private handleChallenge = (requestCtx: RequestContext): void => {
      const { ctx, challenge } = requestCtx;
      ctx.status = 200;
      ctx.body = { challenge };
    }

    private handleChat = (requestCtx: RequestContext): any => {
      let response = this.getCommonResponse(requestCtx);
      response = ComponentDecorator.decorate({ response, requestCtx });
      this.sendReponse({ response, requestCtx });
    }

    private handleInteractiveComponent = (requestCtx: RequestContext): void => {
      const { dungeon, roomName, user, itemName } = requestCtx;
      const room = StateUtil.getRoomStateByName(dungeon.rooms, roomName);
      Object.assign(requestCtx, { room });
      let response = this.getCommonResponse(requestCtx);
      response = ComponentDecorator.decorate({ response, requestCtx });

      //StateUtil.setPlayerState(dungeon, currentRoom: string, playerId: string, itemName: string, gold: number)

      this.sendReponse({ response, requestCtx });
    }

    private handlePickup = (requestCtx: RequestContext): any => {
      const { dungeon, roomName, itemName, user } = requestCtx;
      //console.group("**Handle pickup item");
      //  const item = StateUtil.getRoomItem(dungeon, roomName, itemName);
      // const lae = {roomName, itemName, item, user};
      // console.log(JSON.stringify(lae))
      StateUtil.pickupItem(dungeon, user, roomName, itemName);
      this.handleInteractiveComponent(requestCtx);
    }

    private getCommonResponse = (requestCtx: RequestContext): any => {
      const { user, timestamp } = requestCtx;
      return {
          channel: user, //using user for direct messaging
          as_user: true,
          callback_id: "myCallback",
          ts: timestamp
      }
    }

    private handleStart = (requestCtx: RequestContext): any => {
      let response = this.getCommonResponse(requestCtx);
      response = ComponentDecorator.decorate({ response, requestCtx });
      return this.sendReponse({ response, requestCtx });
    }


    private handleDrop = (requestCtx: RequestContext): any => { }
    private handleInventory = (requestCtx: RequestContext): any => { }
    private handleResume = (requestCtx: RequestContext): any => { }

    private sendReponse = async ({ response, requestCtx }: any) => {
      const postActions = [RequestType.Chat, RequestType.Move, RequestType.Play, RequestType.Resume, RequestType.Start];
      const url = R.includes(requestCtx.type, postActions) ? 'https://slack.com/api/chat.postMessage' : requestCtx.responseUrl;
      console.log("Slack POST URL2:", url, JSON.stringify(response));
      //console.log("Slack POST URL2:", url);
      // const res = await this.httpHandler({
      //     method: 'POST',
      //     url,
      //     headers: {
      //         'Authorization': `Bearer ${process.env.SLACK_BOT_USER_OAUTH_TOKEN}`,
      //         'Content-type': 'application/json; charset=utf-8'
      //     },
      //     json: true,
      //     body: response

      // });

      const res = (async() => {
        return await this.httpHandler({
          method: 'POST',
          url,
          headers: {
              'Authorization': `Bearer ${process.env.SLACK_BOT_USER_OAUTH_TOKEN}`,
              'Content-type': 'application/json; charset=utf-8'
          },
          json: true,
          body: response
        });
      })();

    console.log("isOK?", JSON.stringify(res));
    // if (res && res.ok) {
    //   requestCtx.ctx.status = 200;
    // }
  }
}

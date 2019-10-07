import * as R from 'ramda';
import {
    StateUtil,
    AiLogger as Console
} from './util';
import { ComponentDecorator, Decorator } from './decorator'

import {
    //Player,
    RequestContext,
    RoomItem,
    RequestType,
    Subscriber,
} from './types';

import { Player } from './model';
import { createNoSubstitutionTemplateLiteral } from 'typescript';


export class SlackSubscriber implements Subscriber {
    private httpHandler: any;
    private handlerMap: Map<string, Function>;

    constructor(httpHandler: any) {
        this.httpHandler = httpHandler;
        // Console.green().log('HTTP handler!!', this.httpHandler, httpHandler);
        this.mapHandlers();
    }

    private mapHandlers() {
        this.handlerMap = new Map();
        this.handlerMap.set(RequestType.Move, this.handleInteractiveComponent);
        this.handlerMap.set(RequestType.Play, this.handleInteractiveComponent);
        this.handlerMap.set(RequestType.Start, this.handleInteractiveComponent);
        // this.handlerMap.set(RequestType.Pickup, this.handlePickup);
        // this.handlerMap.set(RequestType.Inventory, this.handleInventory);
        this.handlerMap.set(RequestType.Chat, this.handleChat);
        this.handlerMap.set(RequestType.Verify, this.handleChallenge);
        this.handlerMap.set(RequestType.Ignore, () => 'No action');
    }


    public respond(requestCtx: RequestContext): void {
        const { type } = requestCtx;
        Console.red().withHeader({ header: 'Handler#respond', body: type })
        if (type !== RequestType.Ignore) this.handlerMap.get(type)(requestCtx);
    }

    private getCommonResponse = (requestCtx: RequestContext): any => {
        const { timestamp, player } = requestCtx;
        return {
            channel: player.id, //using user for direct messaging, else use channel id from requestCtx
            as_user: true,
            callback_id: "myCallback",
            ts: timestamp
        }
    }

    private handleInteractiveComponent = (requestCtx: RequestContext): void => {
        const { player } = requestCtx;
        Console.green().log('handleInteractiveComponent', requestCtx.type)
        // {"id":"UFGEC4XNX","startRoomId":"chamber-4pvk1dtqyk7","currentRoomId":"chamber-4pvk1dtqyk7","killCount":0,"inventory":{}}
        let response = this.getCommonResponse(requestCtx);
        response = Decorator.decorate({ response, requestCtx });
        //response = ComponentDecorator.decorate({ response, requestCtx });
        Console.green().log('Response', response)
        this.sendReponse({ response, requestCtx });
    }

    private handleChallenge = (requestCtx: RequestContext): void => {
        const { ctx, challenge } = requestCtx;
        ctx.status = 200;
        ctx.body = { challenge };
    }

    private handleChat = (requestCtx: RequestContext): any => {
        Console.green().log('Handlechat1')
        let response = this.getCommonResponse(requestCtx);
        response = Decorator.decorate({ response, requestCtx });
        Console.green().log('Handlechat2', response)
        this.sendReponse({ response, requestCtx });
    }



    private handleStart = (requestCtx: RequestContext): any => {
        let response = this.getCommonResponse(requestCtx);
        response = ComponentDecorator.decorate({ response, requestCtx });
        return this.sendReponse({ response, requestCtx });
    }




    /*
  private handlePickup = (requestCtx: RequestContext): any => {
      const { dungeon, roomName, itemName, user } = requestCtx;
      StateUtil.pickupItem(dungeon, user, roomName, itemName);
      this.handleInteractiveComponent(requestCtx);
  }

  private handleInventory = (requestCtx: RequestContext): any => {
      const { dungeon, user } = requestCtx;
      const { inventory } = StateUtil.getPlayerState(dungeon, user);
      //console.log("***handleInventory:", user, JSON.stringify(inventory));
      Object.assign(requestCtx, { inventory });
      let response = this.getCommonResponse(requestCtx);
      response = ComponentDecorator.decorate({ response, requestCtx });
      this.sendReponse({ response, requestCtx });
  }

  private handleDrop = (requestCtx: RequestContext): any => { }
  private handleResume = (requestCtx: RequestContext): any => { }

  */
    private sendReponse = ({ response, requestCtx }: any) => {
        Console.green().log('Send response1');
        const postActions = [RequestType.Chat, RequestType.Move, RequestType.Play, RequestType.Resume, RequestType.Start];
        Console.green().log('Send response2');
        const url = R.includes(requestCtx.type, postActions) ? 'https://slack.com/api/chat.postMessage' : requestCtx.responseUrl;
        Console.green().log('Send response3');
        //console.log("Slack POST URL2:", url, JSON.stringify(response));
        Console.green().log('Slack POST URL123 909', url, JSON.stringify(response), this.httpHandler);
        const res = (async () => {
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
        //console.log("isOK?", JSON.stringify(res));
    }
}

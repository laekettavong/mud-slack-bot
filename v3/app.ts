import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import rp from 'request-promise';
import { SlackPublisher } from './broadcaster';
import { SlackSubscriber } from './responder';
import { handleRequest } from './request-context';
import * as forsakenGoblin from './dungeon.json';
import { DungeonMaster } from './master'
require('dotenv').config()

import {
  Item,
  Player,
  Room
} from './model';

const app = new Koa();
const router = new Router();
router.prefix('/slack');
app.use(bodyParser());


const slackPublisher = new SlackPublisher();
slackPublisher.add(new SlackSubscriber(rp))
const mudGame = DungeonMaster.getInstance(forsakenGoblin);

router.get('/bot', async (ctx, next) => {

  if (1) {
    const player: Player = mudGame.findOrAddPlayer("UFGEC4XNX", "Lae");
    const room: Room = mudGame.getCurrentById("chamber-4pvk1dtqyk6");
    const item1: Item = mudGame.getItemById("gold-4wtk1dtw2n8");
    const item2: Item = mudGame.getItemById("gold-4wtk1dtw2n9");
    mudGame.pickupItem(room, player, item1);
    mudGame.pickupItem(room, player, item2);
    // mudGame.getPlayerJson("UFGEC4XNX");
    // mudGame.getRoomJson("chamber-4pvk1dtqyk6")
  }

  ctx.body = mudGame.getGameContext("UFGEC4XNX", "Lae")
});

router.post('/bot', async (ctx, next) => {
  ctx.status = 200;
  ctx.body = '';
  //slackPublisher.notify(handleRequest(ctx, forsakenGoblin))
  //slackPublisher.notify(handleRequest(ctx, DungeonMaster.getInstance(forsakenGoblin)))
  slackPublisher.notify(handleRequest(ctx, mudGame));
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(5555);



// https://api.slack.com/apps/ANN6W2UET/interactive-messages?

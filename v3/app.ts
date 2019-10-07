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
  MudGame,
  Player
} from './model';

const app = new Koa();
const router = new Router();
router.prefix('/slack');
app.use(bodyParser());


const slackPublisher = new SlackPublisher();
slackPublisher.add(new SlackSubscriber(rp))
const mudGame = DungeonMaster.getInstance(forsakenGoblin);

router.get('/bot', async (ctx, next) => {
  const player: Player = mudGame.getPlayer("UFGEC4XNX");
  //console.log("XXXX Mudegame", JSON.stringify(mudGame))
  //console.log("XXXX player", JSON.stringify(player))

  mudGame.getDirections2("chamber-4pvk1dtqyk0");
  ctx.body = 'Hello world';//JSON.stringify(player);
});

router.post('/bot', async (ctx, next) => {
  ctx.status = 200;
  ctx.body = '';
  //slackPublisher.notify(handleRequest(ctx, forsakenGoblin))
  //slackPublisher.notify(handleRequest(ctx, DungeonMaster.getInstance(forsakenGoblin)))
  console.log("XXXX2", JSON.stringify(mudGame))
  slackPublisher.notify(handleRequest(ctx, mudGame));
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(5555);



// https://api.slack.com/apps/ANN6W2UET/interactive-messages?

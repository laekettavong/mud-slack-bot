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

const app = new Koa();
const router = new Router();
router.prefix('/slack');
app.use(bodyParser());


const slackPublisher = new SlackPublisher();
slackPublisher.add(new SlackSubscriber(rp))

router.get('/bot', async (ctx, next) => {
  ctx.body = 'Hello world!'
});

router.post('/bot', async (ctx, next) => {
  ctx.status = 200;
  ctx.body = '';
  //slackPublisher.notify(handleRequest(ctx, forsakenGoblin))
  slackPublisher.notify(handleRequest(ctx, DungeonMaster.getInstance(forsakenGoblin)))
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(5555);



// https://api.slack.com/apps/ANN6W2UET/interactive-messages?

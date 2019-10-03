import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import rp from 'request-promise';
import { SlackPublisher } from './broadcaster';
import { SlackSubscriber } from './responder';
import { handleRequest } from './request-context';
import * as forsakenGoblin from './dungeon.json';
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
    slackPublisher.notify(handleRequest(ctx, forsakenGoblin))
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(5555);



// https://api.slack.com/apps/ANN6W2UET/interactive-messages?

/*
(1) **Reply only to client message - 'Hi'
  Values { user: 'UFGEC4XNX',
    channel: 'DNNH6UTDL',
    text: 'hi',
    event_ts: '1570027054.009500',
    team: 'TFFV44FCH',
    client_msg_id: 'dd23d2e2-0dbb-4e8a-b0ff-cd5f7fb0d0b0',
    event:
     { client_msg_id: 'dd23d2e2-0dbb-4e8a-b0ff-cd5f7fb0d0b0',
       type: 'message',
       text: 'hi',
       user: 'UFGEC4XNX',
       ts: '1570027054.009500',
       team: 'TFFV44FCH',
       channel: 'DNNH6UTDL',
       event_ts: '1570027054.009500',
       channel_type: 'im'
     }
  }

(2) **Reply only to client message - 'Play'
  Values { user: 'UFGEC4XNX',
    channel: 'DNNH6UTDL',
    text: 'play',
    event_ts: '1570027131.009800',
    team: 'TFFV44FCH',
    client_msg_id: 'fac2119f-e53f-42f1-bb7b-a56e4a0d5154',
    event:
     { client_msg_id: 'fac2119f-e53f-42f1-bb7b-a56e4a0d5154',
       type: 'message',
       text: 'play',
       user: 'UFGEC4XNX',
       ts: '1570027131.009800',
       team: 'TFFV44FCH',
       channel: 'DNNH6UTDL',
       event_ts: '1570027131.009800',
       channel_type: 'im'
     }
  }

(3) **Get user response from IC - 'Start' button
  Values { user: { id: 'UFGEC4XNX', name: 'laekettavong' },
    name: 'start',
    value: 'start',
    text: undefined,
    action_ts: undefined,
    response_url:
     'https://hooks.slack.com/actions/TFFV44FCH/768386365346/864itWZqAGj95lMbY1wSQNcT',
    channel: { id: 'DNNH6UTDL', name: 'directmessage' },
    team: { id: 'TFFV44FCH', domain: 'laekettavong' },
    actions: { name: 'start', type: 'button', value: 'start' }
  }

(4) **Get user response from IC - Navigation button ()
{
  "user": {
    "id": "UFGEC4XNX",
    "name": "laekettavong"
  },
  "name": "move",
  "value": "The Goblin Cloak Room",
  "response_url": "https://hooks.slack.com/actions/TFFV44FCH/774738720913/UasQHI7orJFXGtR13TinChnD",
  "channel": {
    "id": "DNNH6UTDL",
    "name": "directmessage"
  },
  "team": {
    "id": "TFFV44FCH",
    "domain": "laekettavong"
  },
  "actions": {
    "name": "move",
    "type": "button",
    "value": "The Goblin Cloak Room"
  }
}

(4) **Get user response from IC - Navigation button ()
{
  "user": {
    "id": "UFGEC4XNX",
    "name": "laekettavong"
  },
  "name": "move",
  "value": "The Entrance Hall",
  "response_url": "https://hooks.slack.com/actions/TFFV44FCH/769693818691/YGNtU7PhtxSqsrBQShE8n1Mk",
  "channel": {
    "id": "DNNH6UTDL",
    "name": "directmessage"
  },
  "team": {
    "id": "TFFV44FCH",
    "domain": "laekettavong"
  },
  "actions": {
    "name": "move",
    "type": "button",
    "value": "The Entrance Hall"
  }
}
(5)
{
  "user": {
    "id": "UFGEC4XNX",
    "name": "laekettavong"
  },
  "name": "move",
  "value": "The Goblin Cloak Room",
  "response_url": "https://hooks.slack.com/actions/TFFV44FCH/780713459876/CQ3Kse6eU2doqrrd0xagSxwd",
  "channel": {
    "id": "DNNH6UTDL",
    "name": "directmessage"
  },
  "team": {
    "id": "TFFV44FCH",
    "domain": "laekettavong"
  },
  "actions": {
    "name": "move",
    "type": "button",
    "value": "The Goblin Cloak Room"
  }
}

*/
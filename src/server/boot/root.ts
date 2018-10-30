import { createMessageAdapter } from '@slack/interactive-messages';
import bparser from 'body-parser';
import { Request, Response, Router } from 'express';
import controllers from '../controllers';

const root = async app => {
  const router: Router = app.loopback.Router();
  router.get('/', (req: Request, res: Response) => res.redirect('/healthy'));
  router.get('/healthy', app.loopback.status());
  router.get('/proton/dql', controllers.dql.render);
  router.post('/proton/dql', bparser.json(), controllers.dql.execute);
  app.use(router);

  if (process.env.SLACK_SIGNING_SECRET) {
    const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);
    slackInteractions.action({ type: 'dialog_submission' }, controllers.slack.submission);
    app.use('/slack/actions', slackInteractions.expressMiddleware());

    const rawBodyBuffer = (req, res, buf, encoding) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
      }
    };
    app.post(
      '/slack/command',
      bparser.urlencoded({ verify: rawBodyBuffer, extended: true }),
      controllers.slack.command,
    );
  }
};

export default root;

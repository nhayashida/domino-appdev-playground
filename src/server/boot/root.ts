import bparser from 'body-parser';
import { Request, Response, Router } from 'express';
import session from 'express-session';
import uuidv1 from 'uuid/v1';
import controllers from '../controllers';

const root = async app => {
  app.use(
    session({
      secret: process.env.DOMINO_IAM_CLIENT_ID || uuidv1(),
      saveUninitialized: false,
      resave: false,
    }),
  );

  const router: Router = app.loopback.Router();
  router.get('/', (req: Request, res: Response) => res.redirect('/playground'));
  router.get('/playground', controllers.playground.render);
  router.post('/domino/api', bparser.json(), controllers.domino.api);
  router.get('/iam/auth/url', controllers.iam.authUrl);
  router.get('/iam/callback', controllers.iam.callback);
  app.use(router);
};

export default root;

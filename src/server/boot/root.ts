import bparser from 'body-parser';
import { Request, Response, Router } from 'express';
import controllers from '../controllers';

const root = async app => {
  const router: Router = app.loopback.Router();
  router.get('/', (req: Request, res: Response) => res.redirect('/healthy'));
  router.get('/healthy', app.loopback.status());
  router.get('/dql', controllers.dql.render);
  router.post('/dql', bparser.json(), controllers.dql.execute);
  app.use(router);
};

export default root;

import { Request, Response } from 'express';
import { renderToNodeStream } from 'react-dom/server';
import iam from '../../../src/server/services/iam';
import controller from '../../../src/server/controllers/playground';

jest.mock('react-dom/server');
jest.mock('../../../src/server/services/iam');

describe('playground', () => {
  it('Render the main page', async done => {
    const email = 'TEST_EMAIL';
    const errorMessage = 'TEST_ERROR_MESSAGE';
    iam.getTokenSet = jest.fn().mockResolvedValue({ email, active: true });

    const req = ({ session: { errorMessage } } as unknown) as Request;

    const res = {} as Response;

    (renderToNodeStream as any).mockImplementation(elem => {
      expect(elem.props.initState).toEqual(JSON.stringify({ errorMessage, email }));

      return {
        pipe: dest => {
          expect(dest).toEqual(res);
          done();
        },
      };
    });
    await controller.render(req, res);
  });
});

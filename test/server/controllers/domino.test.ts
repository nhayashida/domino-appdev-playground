import { Request, Response } from 'express';
import rp from 'request-promise';
import iam from '../../../src/server/services/iam';
import controller from '../../../src/server/controllers/domino';
import service from '../../../src/server/services/domino';

jest.mock('request-promise');
jest.mock('../../../src/server/services/domino');

describe('api', () => {
  it('Execute domino query language', async done => {
    const dominoResponse = {
      response: {
        documents: [
          {
            '@unid': '39D1DD4D365DC57485258289006446F1',
            Id: 'CN=Wanda Parsons/O=renovations',
            City: 'Little Rock',
          },
        ],
      },
      explain: 'TEST_EXPLAIN',
    };

    const req = {
      body: {
        method: 'bulkReadDocuments',
        options: { query: "LastName = 'Parsons'", itemNames: ['Id', 'City'] },
      },
    } as Request;

    const res = {
      send: body => {
        expect(body).toEqual(dominoResponse);
        done();
      },
    } as Response;

    service.query = jest.fn().mockResolvedValue(dominoResponse);

    await controller.api(req, res, () => {});
  });

  it('Execute domino access services if uri is given', async done => {
    const accessToken = 'TEST_ACCESS_TOKEN';
    iam.getTokenSet = jest.fn().mockReturnValue({ access_token: accessToken });

    const events = { events: [{ summary: 'TEST_SUMMARY', location: 'TEST_LOCATION' }] };

    const req = {
      body: {
        method: 'POST',
        options: {
          uri: 'http://localhost/mail/duser01.nsf/api/calendar/events',
          body: JSON.stringify(events),
        },
      },
    } as Request;

    const res = {
      send: body => {
        expect(body).toEqual({ response: events });
        done();
      },
    } as Response;

    (rp as any).mockImplementation(options => {
      expect(options.method).toEqual(req.body.method);
      expect(options.uri).toEqual(req.body.options.uri);
      expect(options.body).toEqual(req.body.options.body);
      expect(options.headers.Authorization).toEqual(`Bearer ${accessToken}`);
      expect(options.json).toEqual(true);
      expect(options.rejectUnauthorized).toEqual(false);

      return events;
    });
    await controller.api(req, res, () => {});
  });
});

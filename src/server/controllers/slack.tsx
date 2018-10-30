import { Request, Response } from 'express';
import rp from 'request-promise';
import domino from '../services/domino';
import { DQL_PROPERTIES } from '../../common/utils/constants';
import logger from '../../common/utils/logger';

const SLACK_API_ENDPOINT = 'https://slack.com/api';

/**
 * Called when a slash command is executed
 *
 * @param req
 * @param res
 */
const command = async (req: Request, res: Response) => {
  logger.debug(req.body);

  const { command, text, trigger_id } = req.body;

  try {
    const method = command.slice(1, command.length); // Remove slash
    const props = DQL_PROPERTIES.find(o => o.method.toLowerCase() === method);
    if (!props) {
      throw new Error('No properties found');
    }

    const elements = Object.keys(props.options).map(key => {
      const option = props.options[key];
      return {
        name: key,
        label: key,
        type: 'text',
        value: key === 'query' ? text : '',
        hint: option.placeholder,
        optional: option.optional,
      };
    });
    const qs = {
      trigger_id,
      token: process.env.SLACK_ACCESS_TOKEN,
      dialog: JSON.stringify({
        elements,
        title: method,
        callback_id: method,
        submit_label: 'Execute',
      }),
    };

    await rp({
      qs,
      uri: `${SLACK_API_ENDPOINT}/dialog.open`,
    });
    res.status(200);
  } catch (err) {
    logger.error(err);
    res.status(500);
  }
};

/**
 * Called when a form is submitted
 *
 * @param payload
 * @param respond
 */
const submission = async (
  payload: { callback_id: string; submission: { query: string } },
  respond: (object) => void,
) => {
  logger.debug(payload);

  const { callback_id, submission } = payload;

  try {
    const method = callback_id;
    const props = DQL_PROPERTIES.find(o => o.method.toLowerCase() === callback_id);
    if (!props) {
      throw new Error('No properties found');
    }

    const query = Object.keys(submission)
      .map(key => {
        const option = props.options[key];
        const value = (submission[key] || '').replace(/‘|’/g, "'");
        return {
          [key]:
            value && (option.type === 'object' || option.type === 'array')
              ? JSON.parse(value)
              : value,
        };
      })
      .reduce((acc, curr) => Object.assign(acc, curr));
    const result = await domino.query(method, query);

    respond({ text: JSON.stringify(result.bulkResponse, null, '  ') });
  } catch (err) {
    logger.error(err);
    respond({ text: err.message });
  }
};

export default { command, submission };

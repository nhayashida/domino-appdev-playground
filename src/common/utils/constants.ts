export const DOMINO_API_PROPERTIES = [
  {
    api: 'bulkReadDocuments',
    options: [
      {
        id: 'query',
        placeholder: "LastName = 'Parsons'",
      },
      {
        id: 'itemNames',
        placeholder: '["Id", "City", "State"]',
        optional: true,
      },
    ],
    group: 'domino-db',
  },
  {
    api: 'bulkDeleteDocuments',
    options: [
      {
        id: 'query',
        placeholder: "LastName = 'Parsons'",
      },
    ],
    group: 'domino-db',
  },
  {
    api: 'bulkReplaceItems',
    options: [
      {
        id: 'query',
        placeholder: "LastName = 'Parsons'",
      },
      {
        id: 'replaceItems',
        placeholder: '{ "City": "Chelmsford", "State": "MA" }',
      },
    ],
    group: 'domino-db',
  },
  {
    api: 'bulkDeleteItems',
    options: [
      {
        id: 'query',
        placeholder: "LastName = 'Parsons'",
      },
      {
        id: 'itemNames',
        placeholder: '["EMail", "Phone"]',
      },
    ],
    group: 'domino-db',
  },
  {
    api: 'GET',
    options: [
      {
        id: 'uri',
        placeholder: 'http://localhost/{database}/api/calendar/events',
      },
    ],
    group: 'das',
  },
  {
    api: 'POST',
    options: [
      {
        id: 'uri',
        placeholder: 'http://localhost/{database}/api/calendar/events',
      },
      {
        id: 'body',
        placeholder: '',
      },
    ],
    group: 'das',
  },
];

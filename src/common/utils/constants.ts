export const DOMINO_API_PROPERTIES = [
  {
    api: 'bulkReadDocuments',
    options: {
      query: {
        placeholder: "LastName = 'Parsons'",
      },
      itemNames: {
        placeholder: '["Id", "City", "State"]',
      },
    },
    group: 'domino-db',
  },
  {
    api: 'bulkDeleteDocuments',
    options: {
      query: {
        placeholder: "LastName = 'Parsons'",
      },
    },
    group: 'domino-db',
  },
  {
    api: 'bulkReplaceItems',
    options: {
      query: {
        placeholder: "LastName = 'Parsons'",
      },
      replaceItems: {
        placeholder: '{ "City": "Chelmsford", "State": "MA" }',
      },
    },
    group: 'domino-db',
  },
  {
    api: 'bulkDeleteItems',
    options: {
      query: {
        placeholder: "LastName = 'Parsons'",
      },
      itemNames: {
        placeholder: '["EMail", "Phone"]',
      },
    },
    group: 'domino-db',
  },
  {
    api: 'GET',
    options: {
      uri: {
        placeholder: 'http://localhost/{database}/api/calendar/events',
      },
    },
    group: 'das',
  },
  {
    api: 'POST',
    options: {
      uri: {
        placeholder: 'http://localhost/{database}/api/calendar/events',
      },
      body: {
        placeholder: '',
      },
    },
    group: 'das',
  },
];

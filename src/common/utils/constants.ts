export const DAS = 'domino access services';

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
    api: DAS,
    options: {
      uri: {
        placeholder: 'http://localhost/api/freebusy',
      },
    },
  },
];

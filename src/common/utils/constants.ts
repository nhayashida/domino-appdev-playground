export const DQL_PROPERTIES = [
  {
    method: 'bulkReadDocuments',
    options: {
      query: {
        type: 'string',
        placeholder: "LastName = 'Parsons'",
      },
      itemNames: {
        type: 'array',
        placeholder: '["Id", "City", "State"]',
        optional: true,
      },
    },
  },
  {
    method: 'bulkDeleteDocuments',
    options: {
      query: {
        type: 'string',
        placeholder: "LastName = 'Parsons'",
      },
    },
  },
  {
    method: 'bulkReplaceItems',
    options: {
      query: {
        type: 'string',
        placeholder: "LastName = 'Parsons'",
      },
      replaceItems: {
        type: 'object',
        placeholder: '{ "City": "Chelmsford", "State": "MA" }',
      },
    },
  },
  {
    method: 'bulkDeleteItems',
    options: {
      query: {
        type: 'string',
        placeholder: "LastName = 'Parsons'",
      },
      itemNames: {
        type: 'object',
        placeholder: '["EMail", "Phone"]',
      },
    },
  },
];

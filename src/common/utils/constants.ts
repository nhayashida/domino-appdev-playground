export const DQL_PROPERTIES = [
  {
    method: 'bulkReadDocuments',
    options: {
      query: {
        placeholder: "LastName = 'Parsons'",
      },
      itemNames: {
        placeholder: '["Id", "City", "State"]',
        optional: true,
      },
    },
  },
  {
    method: 'bulkDeleteDocuments',
    options: {
      query: {
        placeholder: "LastName = 'Parsons'",
      },
    },
  },
  {
    method: 'bulkReplaceItems',
    options: {
      query: {
        placeholder: "LastName = 'Parsons'",
      },
      replaceItems: {
        placeholder: '{ "City": "Chelmsford", "State": "MA" }',
      },
    },
  },
  {
    method: 'bulkDeleteItems',
    options: {
      query: {
        placeholder: "LastName = 'Parsons'",
      },
      itemNames: {
        placeholder: '["EMail", "Phone"]',
      },
    },
  },
];

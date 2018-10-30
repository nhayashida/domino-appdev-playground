export const DQL_PROPERTIES = [
  {
    method: 'bulkReadDocuments',
    options: {
      query: {
        type: 'string',
        placeholder: "Form = 'Contact' and LastName = 'Parsons'",
      },
      itemNames: {
        type: 'array',
        placeholder: '["FirstName", "LastName"]',
        optional: true,
      },
    },
  },
  {
    method: 'bulkDeleteDocuments',
    options: {
      query: {
        type: 'string',
        placeholder: "Form = 'Contact' and LastName = 'Parsons'",
      },
    },
  },
  {
    method: 'bulkReplaceItems',
    options: {
      query: {
        type: 'string',
        placeholder: "Form = 'Contact' and LastName = 'Parsons'",
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
        placeholder: "Form = 'Contact' and LastName = 'Parsons'",
      },
      itemNames: {
        type: 'object',
        placeholder: '["EMail", "Phone"]',
      },
    },
  },
];

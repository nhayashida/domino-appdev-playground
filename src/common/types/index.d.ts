declare type DqlQuery = {
  query: string;
  itemNames?: string[];
  replaceItems?: { [key: string]: string };
};

declare type DqlResponse = {
  bulkResponse: object;
  explain: string;
};

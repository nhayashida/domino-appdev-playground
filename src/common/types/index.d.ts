declare type DominoResponse = {
  response: object;
  explain?: string;
};

declare type DQLQuery = {
  query: string;
  itemNames?: string[];
  replaceItems?: { [key: string]: string };
};

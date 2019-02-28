declare type DominoResponse = {
  response: object;
  explain?: string;
};

declare type DQLQuery = {
  query: string;
  itemNames?: string[];
  replaceItems?: { [key: string]: string };
};

declare type TokenSet = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  sid: string;
  email: string;
  active: boolean;
};

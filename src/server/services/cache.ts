import app from '../server';

export namespace Token {
  type CacheProps = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    email: string;
  };

  const defaultProps: CacheProps = {
    access_token: '',
    refresh_token: '',
    expires_at: 0,
    email: '',
  };

  /**
   * Set token set for a session
   *
   * @param sid
   * @param props
   */
  export const set = async (sid: string, props: CacheProps) => {
    await (app.models as any).Token.set(sid, props);
  };

  /**
   * Get token set for a session
   *
   * @param sid
   * @returns props
   */
  export const get = async (sid: string): Promise<CacheProps> => {
    const props = await (app.models as any).Token.get(sid);
    return Object.assign({}, defaultProps, props);
  };
}

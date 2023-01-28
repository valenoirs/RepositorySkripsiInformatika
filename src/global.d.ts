declare namespace Express {
  // interface CustomSessionFields {
  //   valenoirs: any;
  // }

  export interface Request {
    session: Session & Partial<SessionData> & CustomSessionFields
  }
}

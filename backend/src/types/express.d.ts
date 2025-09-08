// Add user property to Express Request interface
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      name?: string;
      email?: string;
      [key: string]: any;
    };
  }
}

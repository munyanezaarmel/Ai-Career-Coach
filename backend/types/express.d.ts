// src/types/express.d.ts

import * as express from 'express';
interface User{
    name: string
    
}
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with the appropriate user type if known
    }
  }
}

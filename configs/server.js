import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/redext';
export const JWT_SECRET = process.env.JWT_SECRET || 'SECRET';

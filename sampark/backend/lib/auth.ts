import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashed) => bcrypt.compare(password, hashed);

const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

// Simple token verification function (for direct use)
const verifyTokenSimple = (token) => jwt.verify(token, JWT_SECRET);
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth.js';
// import {
//   saveFormData,
//   getFormData,
//   clearFormData,
//   cacheUserGrievances,
//   getCachedUserGrievances,
//   invalidateUserGrievancesCache
// } from '../../../lib/redis.js';

const router = express.Router();
const prisma = new PrismaClient();

// Generate unique tracking ID
function generateTrackingId() {
  const prefix = "SMPK";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomNum}${timestamp}`;
}
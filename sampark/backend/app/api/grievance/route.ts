import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth.js';
import {
  clearFormData,
  invalidateUserGrievancesCache
} from '../../../lib/redis.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Generates a unique tracking ID: SMPK + 5 random digits + last 4 of timestamp
 */
function generateTrackingId() {
  const prefix = "SMPK";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomNum}${timestamp}`;
}

// POST: Submit a new grievance
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { title, description, category, location, latitude, longitude, images, priority } = req.body;
    
    // 1. Authorization Guard
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User session not found" });
    }
    const userId = req.user.id;

    // 2. Input Validation
    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: "Missing required fields: title, description, category, and location are mandatory." });
    }

    // 3. Unique Tracking ID Collision Handling
    let trackingId;
    let isUnique = false;
    while (!isUnique) {
      trackingId = generateTrackingId();
      const existing = await prisma.grievance.findUnique({ where: { trackingId } });
      if (!existing) isUnique = true;
    }

    // 4. Database Transaction
    const grievance = await prisma.grievance.create({
      data: {
        trackingId,
        title,
        description,
        category: category.toUpperCase(),
        location,
        // Ensure coordinates are valid numbers or null
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images: Array.isArray(images) ? images : [],
        priority: priority || "MEDIUM",
        userId,
        statuses: {
          create: {
            status: "SUBMITTED",
            comment: "Grievance submitted successfully"
          }
        }
      },
      include: {
        statuses: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    // 5. Cache Management
    // Wrapped in try/catch or checked to prevent the whole request failing if Redis is down
    try {
      if (typeof clearFormData === 'function') await clearFormData(userId);
      if (typeof invalidateUserGrievancesCache === 'function') await invalidateUserGrievancesCache(userId);
    } catch (cacheError) {
      console.warn("Redis Cache Invalidation Failed:", cacheError.message);
      // We don't return an error to the user here because the DB write was successful
    }

    // 6. Success Response
    res.status(201).json({
      success: true,
      message: "Grievance submitted successfully",
      trackingId: grievance.trackingId,
      data: grievance
    });

  } catch (error) {
    console.error("Critical Error submitting grievance:", error);
    res.status(500).json({ error: "An internal server error occurred while processing your request." });
  }
});

export default router;
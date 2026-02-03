import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  // Add retry configuration for better error handling
  retry: {
    retries: 2,
    backoff: (retryCount) => Math.exp(retryCount) * 50,
  },
});

// Helper function to check if Redis is configured
export const isRedisConfigured = () => {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
};

// Cache keys
export const CACHE_KEYS = {
  FORM_DATA: (userId: string) => `form:grievance:${userId}`,
  USER_GRIEVANCES: (userId: string) => `grievances:user:${userId}`,
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  FORM_DATA: 24 * 60 * 60, // 24 hours
  USER_GRIEVANCES: 24 * 60 * 60, // 24 hours
};

// Form data operations
export async function saveFormData(userId: string, formData: Record<string, unknown>) {
  if (!isRedisConfigured()) {
    console.warn('Redis not configured, skipping cache');
    return null;
  }
  
  try {
    await redis.setex(
      CACHE_KEYS.FORM_DATA(userId),
      CACHE_TTL.FORM_DATA,
      JSON.stringify(formData)
    );
    console.log(`✅ Form data cached for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error saving form data to cache:', error);
    return null;
  }
}

export async function getFormData(userId: string) {
  if (!isRedisConfigured()) {
    return null;
  }
  
  try {
    const data = await redis.get(CACHE_KEYS.FORM_DATA(userId));
    if (data) {
      console.log(`✅ Form data retrieved from cache for user: ${userId}`);
      return typeof data === 'string' ? JSON.parse(data) : data;
    }
    return null;
  } catch (error) {
    console.error('Error getting form data from cache:', error);
    return null;
  }
}

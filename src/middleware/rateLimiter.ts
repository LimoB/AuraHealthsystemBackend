import { RateLimiterMemory } from "rate-limiter-flexible"; //named export
import { NextFunction, Request, Response } from "express";

//define options/value for rate limiter 
const rateLimiter = new RateLimiterMemory({
    points: 10, // Number of requests
    duration: 60 //per second
})

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try{ 
        await rateLimiter.consume(req.ip || 'unknown'); // Consume a point for the request
        console.log(`Rate Liit check passed for IP: ${req.ip}`);
        next();
    }catch (error) {
        res.status(429).json({error:"To many reguests, please try again later."})
    }
}

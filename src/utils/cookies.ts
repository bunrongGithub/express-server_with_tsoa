import {Response, CookieOptions } from "express";
export function setCookies(res: Response, name: string, value: string, options: CookieOptions = {}) {
    const defaultOption: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production only
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 3600 * 1000,  // 1 hour expiration
        ...options,
    }
    res.cookie(name,value,defaultOption);
}
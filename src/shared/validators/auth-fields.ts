import { z } from "zod";

/** Matches the backend's username rule: 3-30 chars, lowercase/digits/underscore. */
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be at most 30 characters.")
  .regex(
    /^[a-z0-9_]+$/,
    "Username can only contain lowercase letters, numbers, and underscores.",
  );

export const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Must be a valid email address.");

/** Matches the backend's password rule: 8-128 characters. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be at most 128 characters.");
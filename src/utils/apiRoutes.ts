/**
 * The landing page route: only allowed for non-authenticated users
 * @type {string}
 */
export const landingPageRoute = "/landing";

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/home", "/price"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /account/profile
 * @type {string[]}
 */
export const authRoutes = ["/login", "/register", "/error"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/activity";

/**
 * The default redirect path if user is not logged in
 * @type {string}
 */
export const DEFAULT_REDIRECT = "/login";

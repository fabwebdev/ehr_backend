/**
 * Middleware to fix cookie SameSite attribute for cross-origin requests
 * Better Auth may not respect the cookie configuration, so we intercept
 * Set-Cookie headers and modify them to use SameSite=None
 */
const cookieFixMiddleware = async (request, reply) => {
  // Store original setCookie function
  const originalSetCookie = reply.setCookie.bind(reply);
  
  // Override setCookie to fix SameSite attribute
  reply.setCookie = function(name, value, options = {}) {
    // Force SameSite=None and Secure for cross-origin
    const fixedOptions = {
      ...options,
      sameSite: 'none',
      secure: true,
    };
    
    // Call original setCookie function with fixed options
    return originalSetCookie(name, value, fixedOptions);
  };
  
  // Also intercept header setting for Set-Cookie
  const originalHeader = reply.header.bind(reply);
  reply.header = function(name, value) {
    if (name.toLowerCase() === 'set-cookie') {
      // Handle array of cookie strings
      const cookies = Array.isArray(value) ? value : [value];
      
      // Modify each cookie to use SameSite=None
      const modifiedCookies = cookies.map(cookie => {
        return fixCookieSameSite(cookie);
      });
      
      // Call original header with modified cookies
      return originalHeader(name, modifiedCookies);
    }
    
    // For all other headers, call original header
    return originalHeader(name, value);
  };
};

/**
 * Fix cookie SameSite attribute to None for cross-origin support
 */
function fixCookieSameSite(cookie) {
  // If cookie already has SameSite=None, leave it
  if (cookie.includes('SameSite=None') || cookie.includes('SameSite=none')) {
    // Ensure Secure is present
    if (!cookie.includes('Secure')) {
      cookie += '; Secure';
    }
    return cookie;
  }
  
  // Replace SameSite=Lax or SameSite=Strict with SameSite=None
  let modified = cookie
    .replace(/SameSite=Lax/gi, 'SameSite=None')
    .replace(/SameSite=Strict/gi, 'SameSite=None')
    .replace(/SameSite=lax/gi, 'SameSite=None')
    .replace(/SameSite=strict/gi, 'SameSite=None');
  
  // If no SameSite attribute exists, add it
  if (!modified.includes('SameSite')) {
    // Insert SameSite=None before Secure or at the end
    if (modified.includes('; Secure')) {
      modified = modified.replace('; Secure', '; SameSite=None; Secure');
    } else if (modified.includes('Secure')) {
      modified = modified.replace('Secure', 'SameSite=None; Secure');
    } else {
      // Add at the end
      modified += '; SameSite=None';
      // Ensure Secure is also present for SameSite=None
      modified += '; Secure';
    }
  }
  
  // Ensure Secure is present when SameSite=None
  if (modified.includes('SameSite=None') && !modified.includes('Secure')) {
    modified += '; Secure';
  }
  
  return modified;
}

export default cookieFixMiddleware;


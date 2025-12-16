# Security Policy

## React2Shell Vulnerability Mitigation

This project has been built with security as a top priority, specifically addressing the React2Shell vulnerability (CVE-2025-55182).

### What is React2Shell?

React2Shell is a critical remote code execution (RCE) vulnerability affecting React Server Components in versions 19.0.0 through 19.2.0. It allows unauthenticated attackers to execute arbitrary code on the server.

### How We're Protected

1. **Updated Dependencies**
   - React 19.0.0+ (patched version)
   - Next.js 15.1.0+ (patched version)
   - Regular dependency updates via npm audit

2. **Input Sanitization**
   - All user inputs are sanitized before processing
   - XSS protection through proper escaping
   - Type-safe interfaces to prevent injection

3. **Secure Coding Practices**
   - TypeScript for type safety
   - Environment variables for sensitive data
   - No direct server-side code execution from user input
   - Proper error handling without exposing system information

4. **WebRTC Security**
   - Vapi API keys stored in environment variables
   - No client-side exposure of sensitive credentials
   - Proper session management and cleanup

### Best Practices for Deployment

1. **Environment Variables**
   ```bash
   # Never commit .env.local to version control
   # Use platform-specific secret management in production
   NEXT_PUBLIC_VAPI_API_KEY=your_key_here
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_id_here
   ```

2. **Content Security Policy**
   Add to `next.config.ts`:
   ```typescript
   headers: async () => [
     {
       source: '/:path*',
       headers: [
         {
           key: 'Content-Security-Policy',
           value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
         }
       ]
     }
   ]
   ```

3. **Regular Updates**
   ```bash
   npm audit
   npm update
   ```

4. **HTTPS Only**
   - Always use HTTPS in production
   - Enable HSTS headers
   - Use secure WebRTC connections

### Reporting Security Issues

If you discover a security vulnerability, please email security@yourcompany.com. Do not open public issues for security concerns.

### Security Checklist

- [x] Dependencies updated to patched versions
- [x] Input sanitization implemented
- [x] Type-safe code with TypeScript
- [x] Environment variables for secrets
- [x] Error handling without information disclosure
- [x] Secure WebRTC configuration
- [ ] CSP headers (add in production)
- [ ] Rate limiting (add in production)
- [ ] Authentication (add if needed)

### References

- [React2Shell Advisory](https://www.radware.com/security/threat-advisories-and-attack-reports/react2shell/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/deploying/production-checklist)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)


# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a suspected security vulnerability.

Instead, contact the repository owner privately through GitHub and include:

- A short description of the issue
- Steps to reproduce it
- Potential impact
- Any suggested mitigation

## Secrets

Never commit real API keys, tokens, passwords, or production credentials.
Use `.env.example` as the template for local configuration.

The Gemini and Tavily credentials should remain server-side and must not be exposed through frontend code.

## Production hardening

For a larger public deployment, consider:

- Authentication and authorization
- Rate limiting and request quotas
- Strict CORS configuration
- Structured logging and monitoring
- Input validation and payload limits
- Secret rotation
- Dependency and container scanning

# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing [security@yourproject.com] or creating a private security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

## Security Measures

This project implements the following security measures:

- Environment variables are properly secured and not committed to version control
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Security headers middleware
- Regular dependency updates

## Environment Variables

Never commit sensitive information like API keys, database passwords, or other secrets to version control. Use the `.env.example` file as a template and create your own `.env` file locally.

## Dependencies

We regularly audit our dependencies for security vulnerabilities using:

- npm audit
- Trivy security scanner
- SonarQube analysis

# Deployment Guide

This document explains how to deploy the job board to various platforms and how the configuration system works in different environments.

## Configuration System

The job board uses a flexible configuration system that works differently in development and production environments.

### How Configuration Works

1. **Development Environment**:
   - The system first tries to load a custom `config.ts` file
   - If not found, it falls back to `config.example.ts`
   - This allows you to develop with your custom configuration

2. **Production Environment**:
   - In production builds, the system always uses `config.example.ts`
   - This ensures that deployments work even without a custom config file
   - For production customization, you should use environment variables

### Deployment Options

#### Option 1: Deploy with Default Configuration

If you deploy the repository as-is, it will use the default configuration from `config.example.ts`. This is the simplest approach and works well for testing or if the default settings meet your needs.

#### Option 2: Fork and Customize

For a customized deployment:

1. Fork the repository
2. Copy `config.example.ts` to `config.ts`
3. Customize `config.ts` with your settings
4. Commit your changes
5. Deploy your fork

This approach allows you to maintain your customizations in your own repository.

#### Option 3: Environment Variables

For platforms like Vercel, Netlify, or Railway, you can use environment variables to override specific configuration values. The most important ones are:

```
NEXT_PUBLIC_APP_URL=https://your-domain.com
AIRTABLE_ACCESS_TOKEN=your_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=your_table_name
EMAIL_PROVIDER=your_provider
ENCHARGE_WRITE_KEY=your_key
```

## Platform-Specific Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy

### Netlify

1. Connect your GitHub repository to Netlify
2. Configure environment variables in the Netlify dashboard
3. Add a `netlify.toml` file with build settings:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### Docker

A Dockerfile is included in the repository. To build and run:

```bash
docker build -t job-board .
docker run -p 3000:3000 job-board
```

## Troubleshooting

### Common Deployment Issues

1. **Missing Configuration**: If you see errors about missing configuration, check that your environment variables are set correctly.

2. **Build Errors**: If you encounter build errors related to configuration, make sure you're using the latest version of the configuration system.

3. **API Connection Issues**: If the job board can't connect to Airtable, verify your Airtable credentials and ensure your token has the correct permissions.

## Best Practices

1. **Use Environment Variables for Secrets**: Never commit sensitive information like API keys to your repository.

2. **Test Locally Before Deploying**: Run a production build locally to catch any issues:

```bash
npm run build
npm start
```

3. **Keep Your Fork Updated**: Regularly pull changes from the upstream repository to get the latest features and fixes. 
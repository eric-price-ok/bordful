# Encharge.io Integration for Job Alerts

This document explains how to set up the Encharge.io integration for the job alerts subscription feature.

## Overview

The job alerts subscription feature allows users to sign up to receive notifications about new job postings. We use [Encharge.io](https://encharge.io) to manage subscribers and deliver emails.

## Prerequisites

1. An Encharge.io account
2. Write key from Encharge.io (obtained from Settings > API in your Encharge dashboard)

## Configuration Options

You have two options for configuring the Encharge integration:

### Option 1: Environment Variables (Recommended for Production)

1. Copy `.env.example` to `.env.local` (for development) or set environment variables in your hosting platform
2. Set the following variables:
   ```
   EMAIL_PROVIDER=encharge
   ENCHARGE_WRITE_KEY=your_encharge_write_key_here
   ```

### Option 2: Configuration File (For Advanced Customization)

1. Copy `config/config.example.ts` to `config/config.ts`
2. Customize the email provider settings:
   ```typescript
   email: {
     provider: "encharge",
     encharge: {
       writeKey: "your_encharge_write_key_here", // Or use process.env.ENCHARGE_WRITE_KEY
       defaultTags: "job-alerts-subscriber, custom-tag, bordful-user",
       eventName: "Job Alert Subscription",
     }
   },
   ```

## Encharge Account Setup

1. **Create Custom Fields** - In your Encharge account, create the following custom fields:
   - `subscriptionDate` (Date type)
   - `subscriptionTimestamp` (Number type)
   - `referer` (Text type)
   - `origin` (Text type)
   - `userAgent` (Text type)
   - `ip` (Text type)
   - `hasName` (Boolean type)

2. **Create Tags** - Create the following tags to automatically label subscribers:
   - `job-alerts-subscriber` - Main tag for all job alert subscribers
   - `website-form` - Indicates the subscription came from the website form
   - `api-route` - Indicates the subscription was processed through the API route
   - `bordful-user` - Identifies users from your Bordful job board

3. **Set Up Automation Flow** - Create a flow that triggers when the `job-alerts-subscriber` tag is added to a person. This flow should:
   - Send a welcome email confirming their subscription
   - Set up a regular schedule for sending job alerts (e.g., weekly digest)

### Email Templates

Create at least two email templates in Encharge:
1. **Subscription Confirmation** - Sent immediately after someone subscribes
2. **Job Alerts Digest** - Sent on a regular schedule with new job listings

## How It Works

The integration uses a secure server-side API route to communicate with Encharge:

1. User submits the subscription form on your website
2. The form data is sent to the `/api/subscribe` endpoint
3. The server validates the email address and processes the data
4. The server securely communicates with Encharge using URL parameter authentication
5. Encharge creates or updates the subscriber with rich metadata:
   - Email and name (if provided)
   - IP address (for geolocation)
   - Referrer URL (for tracking where subscribers came from)
   - User agent (browser/device information)
   - Timestamp and formatted date
   - Custom tags for segmentation

## Enhanced Data Collection

The integration automatically collects and sends the following data to Encharge:

- **User Information**:
  - Email address (required)
  - Name (optional)
  - IP address (for geolocation)
  
- **Technical Data**:
  - User agent (browser and device information)
  - Referrer URL (where the user came from)
  - Origin URL (your website)
  
- **Timestamps**:
  - Subscription timestamp (Unix timestamp)
  - Formatted subscription date
  
- **Segmentation**:
  - Whether the user provided a name
  - Tags for categorizing subscribers

This rich data enables advanced segmentation and personalization in your email campaigns.

## Development Mode

In development mode:
- The system works even without an Encharge write key (simulated mode)
- You can test the subscription form without affecting your production data

## Troubleshooting

If the integration is not working:

1. Verify the `ENCHARGE_WRITE_KEY` is correctly set in your environment or config file
2. Ensure the person has been created in your Encharge account by searching for their email
3. Verify that the tags have been applied to the person
4. Check that the API route is correctly configured to use URL parameter authentication

## Customization

To customize the integration:

1. Edit `lib/email/providers/encharge.ts` to modify the provider implementation
2. Edit `app/api/subscribe/route.ts` to change the API route behavior
3. Edit `config/config.ts` to update the configuration options
4. Add additional tags or fields in the Encharge API calls as needed

## Security Considerations

The integration uses a secure server-side approach:

- API keys are never exposed to the client
- All API calls are made server-side
- User data is validated before being sent to Encharge
- IP addresses are collected securely from request headers

## Unsubscribe Management

Encharge automatically handles unsubscribe links in emails. When a user unsubscribes, they will be flagged in Encharge and will no longer receive emails.

For GDPR compliance, you may want to implement a specific endpoint for users to request complete removal of their data. 
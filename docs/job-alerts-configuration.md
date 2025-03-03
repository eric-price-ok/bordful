# Job Alerts Configuration

## Overview

This document describes how to configure the job alerts feature in the Bordful application. The job alerts feature allows users to subscribe to email notifications for new job postings. This feature can be enabled or disabled based on your requirements.

## Configuration Options

The job alerts feature is configured in the `config/config.ts` file. Here are the available configuration options:

```typescript
// Job Alerts Configuration
jobAlerts: {
  // Enable or disable the job alerts feature
  enabled: true,

  // Show job alerts link in navigation
  showInNavigation: true,

  // Show job alerts link in footer resources
  showInFooter: true,

  // Navigation label
  navigationLabel: "Job Alerts",

  // The email provider to use (must match a provider in the email section)
  provider: "encharge",
},
```

### Options Explained

- **enabled**: Set to `true` to enable the job alerts feature, or `false` to disable it completely.
- **showInNavigation**: Controls whether the job alerts link appears in the main navigation.
- **showInFooter**: Controls whether the job alerts link appears in the footer resources section.
- **navigationLabel**: The text label used for the job alerts link in navigation and footer.
- **provider**: The email provider to use for job alert subscriptions (must match a provider in the email configuration section).

## Implementation Details

When the job alerts feature is disabled:

1. The job alerts page (`/job-alerts`) will redirect to the home page.
2. The job alerts API endpoint (`/api/subscribe`) will return a 404 error.
3. The job alerts link will not appear in the navigation or footer.

## Email Provider Configuration

The job alerts feature requires an email provider to be configured. The provider specified in the `jobAlerts.provider` setting must match a provider configured in the `email` section:

```typescript
// Email Provider Configuration
email: {
  // The email provider to use for subscriptions
  provider: process.env.EMAIL_PROVIDER || "encharge",

  // Encharge configuration
  encharge: {
    // Your Encharge write key (from Encharge dashboard)
    writeKey: process.env.ENCHARGE_WRITE_KEY,

    // Default tags to apply to subscribers
    defaultTags: "job-alerts-subscriber",

    // Event name for subscriptions
    eventName: "Job Alert Subscription",
  },
},
```

For more details on email provider configuration, see the [Email Providers Documentation](./email-providers.md).

## Deployment Without Email Provider

If you want to deploy the job board without configuring an email provider, you can simply disable the job alerts feature by setting `jobAlerts.enabled` to `false` in your configuration.

## Testing

To test the job alerts feature:

1. Ensure the feature is enabled in your configuration.
2. Configure an email provider (see [Email Providers Documentation](./email-providers.md)).
3. Visit the `/job-alerts` page and submit the subscription form.
4. Check that the subscription is processed correctly by the email provider.

To test with the feature disabled:

1. Set `jobAlerts.enabled` to `false` in your configuration.
2. Verify that the `/job-alerts` page redirects to the home page.
3. Verify that the job alerts link does not appear in the navigation or footer. 
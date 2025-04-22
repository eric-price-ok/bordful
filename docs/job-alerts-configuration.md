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
  
  // Hero section configuration
  hero: {
    // Badge text in hero section
    badge: "Job Alerts",
    
    // Main title in hero section
    title: "Get Jobs Right to Your Inbox",
    
    // Description text in hero section
    description: "Subscribe to job alerts and get notified when new opportunities are posted."
  },
  
  // Hero image configuration (overrides global setting)
  heroImage: {
    enabled: false, // Disable hero image on the job alerts page
    src: "", // Optional custom image path
    alt: "", // Optional custom alt text
  },
  
  // Form text configuration
  form: {
    // Heading text for the form section
    heading: "Subscribe for Updates",
    
    // Description text under the heading
    description: "Get notified when new jobs are posted. We'll also subscribe you to Bordful newsletter.",
    
    // Form fields configuration
    fields: {
      // Name field labels and errors
      name: {
        label: "Name *",
        placeholder: "Your name",
        required: "Name is required"
      },
      // Email field labels and errors
      email: {
        label: "Email *",
        placeholder: "your@email.com",
        required: "Email is required",
        invalid: "Please enter a valid email address"
      }
    },
    
    // Button text for the subscribe form
    buttonText: "Subscribe to Job Alerts",
    
    // Loading text when form is being submitted
    loadingText: "Subscribing...",
    
    // Success message heading after successful subscription
    successHeading: "Subscription Confirmed!",
    
    // Success message description after successful subscription
    successDescription: "Thank you for subscribing to job alerts. You'll receive emails when jobs matching your interests are posted.",
    
    // Text for the button to subscribe with another email after success
    resetButtonText: "Subscribe with another email",
    
    // Toast notification messages
    toast: {
      success: {
        title: "Subscription successful!",
        description: "You'll now receive job alerts in your inbox."
      },
      rateLimit: {
        title: "Rate limit exceeded",
        description: "Too many requests. Please try again later."
      },
      error: {
        title: "Something went wrong",
        description: "Failed to subscribe to job alerts. Please try again."
      }
    }
  },

  // The email provider to use (must match a provider in the email section)
  provider: "encharge",
},
```

### Options Explained

- **enabled**: Set to `true` to enable the job alerts feature, or `false` to disable it completely.
- **showInNavigation**: Controls whether the job alerts link appears in the main navigation.
- **showInFooter**: Controls whether the job alerts link appears in the footer resources section.
- **navigationLabel**: The text label used for the job alerts link in navigation and footer.
- **hero**: Configuration for the hero section text content.
  - **badge**: The badge text displayed in the hero section.
  - **title**: The main title displayed in the hero section.
  - **description**: The description text displayed in the hero section.
- **heroImage**: Configuration for the hero image specific to the job alerts page.
  - **enabled**: Whether to display a hero image on this page.
  - **src**: The path to the image file.
  - **alt**: The alt text for the image.
- **form**: Customization options for the job alerts subscription form text.
  - **heading**: The main heading text shown above the subscription form.
  - **description**: The description text shown below the heading, explaining the subscription.
  - **fields**: Configuration for form input fields.
    - **name**: Configuration for the name field.
      - **label**: The label for the name field.
      - **placeholder**: The placeholder text for the name field.
      - **required**: The validation error message when the name is not provided.
    - **email**: Configuration for the email field.
      - **label**: The label for the email field.
      - **placeholder**: The placeholder text for the email field.
      - **required**: The validation error message when the email is not provided.
      - **invalid**: The validation error message when the email format is invalid.
  - **buttonText**: The text shown on the submit button of the form.
  - **loadingText**: The text shown when the form is being submitted.
  - **successHeading**: The heading text shown after a successful subscription.
  - **successDescription**: The description text shown after a successful subscription.
  - **resetButtonText**: The text for the button that allows subscribing with another email.
  - **toast**: Configuration for toast notification messages.
    - **success**: Success notification when subscription is successful.
    - **rateLimit**: Rate limit notification when too many requests are made.
    - **error**: Error notification when subscription fails.
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
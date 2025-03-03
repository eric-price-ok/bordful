# Email Provider Configuration

This job board supports multiple email providers for handling job alert subscriptions. Currently, Encharge is fully implemented, with support for other providers planned for the future.

## Setting Up Encharge

### Option 1: Environment Variables (Recommended for Production)

1. Copy `.env.example` to `.env.local` (for development) or set environment variables in your hosting platform
2. Set the following variables:
   ```
   EMAIL_PROVIDER=encharge
   ENCHARGE_WRITE_KEY=your_encharge_write_key_here
   ```
3. Get your Encharge write key from the [Encharge dashboard](https://app.encharge.io/account/info)

### Option 2: Configuration File (For Advanced Customization)

1. Copy `config/config.example.ts` to `config/config.ts`
2. Customize the email provider settings:
   ```typescript
   email: {
     provider: "encharge",
     encharge: {
       writeKey: "your_encharge_write_key_here", // Or use process.env.ENCHARGE_WRITE_KEY
       defaultTags: "job-alerts-subscriber, custom-tag",
       eventName: "Job Alert Subscription",
     }
   },
   ```

## How It Works

When a user subscribes to job alerts:

1. The form data is sent to the `/api/subscribe` endpoint
2. The server validates the email address
3. The configured email provider (Encharge) processes the subscription
4. The user is added to your Encharge account with the specified tags
5. You can then set up automated workflows in Encharge to send job alerts

## Development Mode

In development mode, the system works even without an Encharge write key by simulating a successful subscription. This allows you to test the form functionality without setting up an actual Encharge account.

## Adding Other Providers

Support for additional email providers (Mailchimp, ConvertKit, SendGrid) is planned for future releases. The system is designed to be easily extensible with new providers. 
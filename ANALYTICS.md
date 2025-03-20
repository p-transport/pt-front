# Google Analytics 4 Implementation

This document outlines how Google Analytics 4 is implemented in the PublicTransport.is application.

## Setup

The application uses Google Analytics 4 for tracking user interactions. The implementation is done through a custom Nuxt plugin that provides a global `$gtag` method for event tracking.

### Configuration

The Google Analytics Measurement ID is configured in the `nuxt.config.ts` file under the `runtimeConfig.public` section:

```js
runtimeConfig: {
  public: {
    apiBaseUrl: 'https://wp.publictransport.is/wp-json',
    googleAnalyticsMeasurementId: process.env.GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX'
  }
}
```

For local development, you can set the `GOOGLE_ANALYTICS_ID` environment variable. For production, you should set this environment variable in your deployment environment.

### Plugin Implementation

The Google Analytics plugin is implemented in `plugins/google-analytics.client.js`. It:

1. Loads the Google Analytics script dynamically
2. Initializes the gtag with your Measurement ID
3. Provides a `$gtag` method for tracking events throughout the application

## Tracked Events

The application tracks the following events:

### 1. Marker Clicks

When a user clicks on a map marker, an event is tracked with:
- Event name: `marker_click`
- Action: `click`
- Parameters:
  - `marker_title`: The title of the marker
  - `marker_id`: The ID of the marker
  - `marker_slug`: The slug of the marker
  - `location`: The latitude and longitude of the marker

### 2. Sales Link Clicks

When a user clicks on any sales link within the marker modal, an event is tracked with:
- Event name: `sales_click`
- Action: The type of sales link (e.g., 'Route name', 'Book now', 'Main sales link')
- Parameters:
  - `label`: A descriptor for the link (route number, marker title, etc.)
  - `url`: The URL the user is navigating to
  - `marker_title`: The title of the marker
  - `marker_id`: The ID of the marker

## Adding New Events

To track new events in your components, use the `$gtag` method from the Nuxt app:

```js
const { $gtag } = useNuxtApp()

// Track an event
$gtag('event_name', 'action', {
  // Additional parameters
  param1: 'value1',
  param2: 'value2'
})
```

## Viewing Analytics Data

You can view your analytics data in the Google Analytics 4 dashboard:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Log in with the account associated with your Measurement ID
3. Navigate to the "Reports" section to view event data

## Testing

When testing locally, you should see console logs for tracked events. Look for messages like "Tracking event:" followed by the event details in your browser's developer console. 
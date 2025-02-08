# MyJDownloader API Client

A Node.js client for interacting with the MyJDownloader API. This library provides a simple and typed interface to manage your JDownloader instance remotely.

## Features

- Full TypeScript support
- Implements all major namespaces of the MyJDownloader API
- Easy-to-use methods for common operations
- Configurable options for fine-grained control

## Installation

To install the MyJDownloader API client, run the following command in your project directory:

```bash
npm install myjdownloader
```

## Usage

Here's a basic example of how to use the JDownloader client:

```typescript
import JDownloader from 'myjdownloader';

async function main() {
  // Initialize the client with your MyJDownloader credentials
  const client = new JDownloader('your-email@example.com', 'your-password');

  try {
    // Connect to the API
    await client.connect();

    // List all available devices
    const devices = await client.listDevices();
    console.log('Available devices:', devices);
    const deviceId = devices[0];
    // Get downloads list
    const downloads = await client.downloadsV2.queryLinks(deviceId);
    console.log('Current downloads:', downloads);

    // Add new download
    await client.linkgrabberV2.addLinks(deviceId, {
      links: 'http://example.com/file.zip',
      autostart: true
    });

    // Disconnect when done
    await client.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

# Facebook Pixel API Setup

This guide will walk you through setting up Facebook Pixel API for conversion tracking and event management.

## Step 1: Create Pixel API Conversion

Create a Pixel API conversion and name it based on your domain + GEO for convenience.

![Create Pixel API Conversion](/img/2.8/image1.webp)

After creation, go to the Event Manager.

> **📝 Note:** If you do not use Business Manager, you can go directly to Event Manager, create a pixel and configure it according to the instructions.

![Event Manager Access](/img/2.8/image2.webp)

![Event Manager Interface](/img/2.8/image3.webp)

![Pixel Configuration](/img/2.8/image4.webp)

![Event Setup](/img/2.8/image5.webp)

## Step 2: Configure Events

Select two main events for tracking:

- **Completed Registration**
- **Purchase**

![Event Selection](/img/2.8/image6.webp)

### Completed Registration Event Configuration

For the "Completed Registration" event:

- **Event Data Parameters:** Select Event ID
- **Customer Data Parameters:** Select All Events

![Completed Registration Setup](/img/2.8/image7.webp)

### Purchase Event Configuration

For the "Purchase" event:

- **Event Data Parameters:** Select Event ID
- **Customer Data Parameters:** Select All Events

![Purchase Event Setup](/img/2.8/image8.webp)

## Step 3: Token Generation

1. After creating the pixel, go to its settings
2. Scroll down and click **Generate Token**
3. Save the generated token in your notes
4. Add the token to your PWA settings or share it with your manager

### Important Notes:

- Keep your access token secure and never share it publicly
- Test your pixel implementation before going live
- Monitor event tracking in Facebook Events Manager
- Ensure compliance with data privacy regulations

# Creating and Configuring a New Flow

Follow these steps to create and configure your new flow:

### Step 1. Create a Flow

Navigate to the `Flows` section in the left-side menu of ZM apps.
![image](/img/5.5/image1.png)

Click `Create` to begin setting up your new flow.
![image](/img/5.5/image2.png)

### Step 2. Select an App

Choose the flow type `ZM apps link` and select `PWA` as the app type.
![image](/img/5.5/image3.png)

**How to create your PWA?**
Check out our guide for detailed instructions.

Click `Select` to confirm your choice.
![image](/img/5.5/image4.png)

### Step 3. Set Up a Pixel

You can:
* Select an existing pixel from the list.
* Create a new pixel directly while setting up the flow.
* Continue without a pixel — in this case, events will not be sent to the source.

![image](/img/5.5/image5.png)

> **info**
> Learn more about creating and editing pixels in our guide.

#### Dynamic Pixel

When creating a flow, the selected pixel is automatically added to the final link’s parameters.
If you need to manually add an extra Facebook or Tiktok pixel, follow these steps:

* Make sure the needed pixel is saved in the `My Pixels` section.
* Add this parameter to the final link: `&pixel_fb=ID of the required pixel`

Example:
```
https://example.com/?sub1={sub1}&pixel_fb=12344321234
```

### Step 4. Configure GEO and Whitepage Settings

If GEO cloaking is not required, select `Without Cloaking` and proceed to the next step.
![image](/img/5.5/image6.png)

To enable GEO cloaking, select `GEO Cloaking`. In the dropdown list, select the regions where your ad will be available. Users from other GEOs will see a white page.
![image](/img/5.5/image7.png)

To use your own whitepage instead of the default one from ZM apps, enter the URL in the `Whitepage Source` field.
![image](/img/5.5/image8.png)

If necessary, add a comment to the flow.
![image](/img/5.5/image9.png)

### Step 5. Set Up a Prelanding Page

If a prelanding page is not needed, click `Continue Without Prelanding`.
![image](/img/5.5/image10.png)

To add an existing prelanding page, click `Select Prelanding`.
![image](/img/5.5/image11.png)

### Step 6. Link to Your Offer/Tracker

Paste the offer or tracker link in the `URL` field.
![image](/img/5.5/image12.png)

> **info**
> Ensure the link is correct. For more details, check our Tracker Integration Guide.

### Step 7. Complete the Setup

Review the details in the `Information Check` section and click `Finish`.
![image](/img/5.5/image13.png)

After completing the setup, you will receive the final link for traffic redirection. Copy it for further use.

> **info**
> If you are working with TikTok traffic and using TikTok Pixel, make sure to add `?ttclid=__CLICKID__` as the first parameter in the final URL.
>
> Without it, events will not be properly tracked by the pixel.
>
> Example: `https://example708.info?ttclid=__CLICKID__`

All set! Your flow is now ready and will appear in the `My Flows` section.
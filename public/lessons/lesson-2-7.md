# Facebook Meta Pixel Integration

The Facebook Meta Pixel is a piece of JavaScript code on your website that can help you better understand the effectiveness of your advertising and the actions people take on your site, like visiting a page or adding a product to their cart.

You'll also be able to see when customers took an action after seeing your ad on Facebook and Instagram, which can help you with retargeting. This code is used for local landing pages loaded into the tracker. If there is no access to the code (offer redirect), you can use the Conversions API setting. See [Facebook integration](https://docs.keitaro.io/en/third-party-integrations/facebook.html).

## Dynamic FB Pixel Keitaro

This method is more suitable for classic traffic launches, mainly in the **Nutra**, **Dating**, and **Crypto** verticals.

### Step 1: Create Traffic Source

1. Create [traffic source](https://docs.keitaro.io/en/traffic-sources/passing-traffic-source-parameters.html) in the tracker using a ready-made Facebook template and add the source to the campaign and the campaign parameters will be filled in automatically, including the pixel parameter:

![Traffic Source Configuration](/img/2.7/image1.webp)

2. Open the landing page in the [Editor](https://docs.keitaro.io/en/landing-pages-and-offers/landing-page-editor.html) and go to `index.html` (or `index.php`).

### Step 2: Add Pixel Script to Head Section

Add between `<head>` and `</head>` the following code:

```javascript
<script>
var date = new Date();
date.setTime(date.getTime() + (5 * 24 * 60 * 60 * 1000));
if (!'{pixel}'.match('{')) {
  document.cookie = "pixel={pixel}; " + "expires=" + date.toUTCString() + "";
}
</script>
```

> **⚠️ WARNING**  
> If another parameter in the campaign is used to transfer the pixel, for example, `px`, you need to replace it in the script: from `document.cookie = "pixel={pixel}` to `document.cookie = "pixel={px}`

![Head Section Code](/img/2.7/image2.webp)

### Step 3: Add Hidden Input Fields

Search the code to find the "input" section and add:

```html
<input type="hidden" name="sub1" value="{subid}">
<input type="hidden" name="sub4" value="YOU_ID" />
<input type="hidden" name="pixel" value="<?= $_GET['pixel'] ?>" />
```

![Input Fields](/img/2.7/image3.webp)

Paste the code as shown in the screenshot above.

### Step 4: Add Pixel Firing Code

Open the file or page where you want to install the pixel, for example, a thank you page, and add the following code after the `<body>` tag:

```javascript
<script>
(function () {
    let match = document.cookie.match(/pixel=([^;]+)/);
    let pixel = match ? match[1] : null;

    if (!pixel) return;

    const img = document.createElement('img')
    img.setAttribute('height', '1')
    img.setAttribute('width', '1')
    img.setAttribute('src', 'https://www.facebook.com/tr?id=' + pixel + '&ev=Lead&noscript=1')
    if (document.body) {
        document.body.appendChild(img);
    } else {
        window.onload = () => document.body.appendChild(img);
    }
})();
</script>
```

## How to Check Pixel Operation?

To check the functionality of the pixel, use the Google Chrome extension — [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc). 

When you visit a page with the pixel, a small number will appear on the Facebook Pixel Helper icon, indicating the number of pixel events. Clicking on the icon will expand the panel, showing an overview of the page's pixels, including warnings and errors.

![Meta Pixel Helper](/img/2.7/image4.webp)

---

### Key Benefits:
- **Conversion Tracking**: Monitor user actions after clicking your ads
- **Retargeting**: Create custom audiences based on website visitors
- **Optimization**: Improve ad delivery to people likely to take action
- **Analytics**: Better understand your audience behavior

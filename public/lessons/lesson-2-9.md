# Mastering Keitaro for Traffic Arbitrage
<div class="mb-8" style="aspect-ratio: 16/9;">
  <iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/g-xubmOJaxA?si=RCMunajYc0tECzN2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Navigating the Keitaro Interface

Upon your first login, tailor the platform to your needs:

* **Language Settings**: Adjust the interface language in your user profile.  
* **Time Zone**: Set your preferred time zone to ensure accurate reporting and stats alignment.  
* **User-Specific Settings**: Changes apply only to your account, so each team member can personalize their view.

This setup ensures a smooth start tailored to your workflow.

The dashboard offers a snapshot of your campaign health:

* **Performance Overview**: Quick glance at how campaigns are performing.  
* **Core Metrics**: Track clicks, conversions, and other key indicators.  
* **Activity Log**: Stay updated on recent actions.

Use it for a fast check-in, but rely on detailed reports for in-depth analysis.

![Keitaro Dashboard Interface](/img/2.9/image1.webp)


## Setting Up Your First Campaign

Campaigns are the heart of Keitaro, enabling you to manage traffic, set redirects, and analyze outcomes. Here’s how to get started:

### Creating a Campaign

Navigate to **Campaigns → Create Campaign** to begin.

![Create Campaign Interface](/img/2.9/image2.webp)

### Configuration Options

* **Domains**: Assign one or multiple domains for flexible tracking.  
* **Custom IDs**: Use unique identifiers to keep tracking URLs clean and organized.  
* **Group**: Categorize related campaigns for easier management.  
* **Source**: Link to your traffic origin, such as an affiliate network.

### Traffic Rotation Strategies

* **Position-Based**: Distributes traffic sequentially (e.g., 1st offer → 2nd offer).  
* **Weight-Based**: Splits traffic by percentage (e.g., 70/30 split for A/B testing).  
  * **Tip**: Weight-based is ideal for testing offers, while position-based works well with filters.

**Uniqueness Period**

Set how long a user is treated as unique (default: 1 year or \~8000 hours). This helps avoid duplicate tracking and improves data accuracy.


## Managing Traffic Flows

**Flow Types**

* **Forced Flow**: Processes all users at the outset, perfect for initial filtering.  
* **Regular Flow**: The default path for standard traffic handling.  
* **Default Flow**: Acts as a fallback when other conditions fail.

![Flow Types](/img/2.9/image3.webp)

**Automated Actions**

Enhance traffic management with these options:

* **404 Error**: Block unwanted traffic (e.g., bots) effectively.  
* **Send to Campaign**: Redirect traffic to another campaign while retaining click data.

**Flow Filters**

Keitaro’s filtering capabilities let you refine traffic based on:

* **Geography (GEO)**: Route users from specific countries to targeted offers.  
* **Operating System**: Segment traffic by device type (iOS, Android, etc.).  
* **Provider**: Exclude traffic from certain IP ranges.  
* **Sub IDs**: Refine based on source-specific parameters.

**Example Setup**:

* Filter 1: GEO \= Brazil → Offer A.  
* Filter 2: GEO \= Thailand → Offer B.  
* Default: 404 (no match).

![Example Setup](/img/2.9/image4.webp)


## Creating Landing Pages

Upload and manage custom landing pages directly in Keitaro. Whether you design them yourself or collaborate with developers, this feature integrates them seamlessly into your ad strategies.

![Landing Page Upload Interface](/img/2.9/image5.webp)

**Pro Tip**: Use cloaked landing pages to pass Facebook moderation while directing users to your real offers.

---

## Integrating Affiliate Networks

Add your affiliate programs and advertisers here to monitor traffic distribution and financials:

* Track sent traffic volume.  
* Confirm conversions and unpaid amounts.  
* Forecast expected payments.  
* Compare offers across networks for better deals.

![Affiliate Network Dashboard](/img/2.9/image6.webp)

---

**Adding Offers**

Link offers from affiliate networks, supporting multiple regions (e.g., 1Win for Egypt, Brazil, Russia). Assign offers to specific networks for streamlined data tracking and automated settings.

**Configuring Traffic Sources**

Set up traffic sources like app rental services to automate:

* Postback setup.  
* Parameter insertion for accurate data flow.

**Generating Reports**

Leverage the Reports section for detailed analytics:

* Filter by campaign, country, or SubID (e.g., Brazil traffic analysis).  
* Save reports and access them via links for daily insights.

**Clicks Report**

Analyze all click data, filter by parameters, and trace individual click paths to optimize performance.

**Conversions Report**

Review key events like registrations and deposits. Some networks provide extra details (e.g., deposit counts, amounts) to assess traffic quality and plan scaling.

**Managing Domains**

Add and oversee domains in this section. Note: The postback URL ties to the domain you use to access the interface. Select a primary domain and stick with it to prevent data transmission issues.

## Installing Keitaro on Hosting

Follow these step-by-step instructions to install Keitaro on your hosting provider:

![Step 1: Initial Setup](/img/2.9/instructions1.webp)

![Step 2: Server Configuration](/img/2.9/instructions2.webp)

![Step 3: Database Setup](/img/2.9/instructions3.webp)

![Step 4: Domain Configuration](/img/2.9/instructions4.webp)

![Step 5: SSL Certificate Installation](/img/2.9/instructions5.webp)

![Step 6: Final Configuration](/img/2.9/instructions6.webp)

![Step 7: Testing and Verification](/img/2.9/instructions7.webp)

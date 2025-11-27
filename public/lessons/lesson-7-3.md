# Setup for Nutra vertical

## Objective

To launch and optimize advertising campaigns for Nutra offers (CPA, CPL, COD models) on Facebook, bypassing moderation using cloaking via Keitaro and pre-landing pages with storytelling, leveraging trusted accounts from Fan Agency.

## Prerequisites

* **Accounts**: Trusted Facebook accounts from Fan Agency \- TG @funagency (no farming or King Account linking required).  
* **Proxies**: Mobile proxies \- TG @adm\_proxy.   
* **Anti-Detect Browser**: Dolphin or other.  
* **Tracker/Cloaker**: Keitaro for link cloaking and traffic analytics.  
* **Spy Tools**: tyver.io for competitor analysis and creative inspiration.  
* **Pre-Landing Pages**: Storytelling-based pre-landings (e.g., success stories, testimonials).  
* **Landing Pages**: Nutra offer-specific landings optimized for conversions.  
* **Creative Assets**: Localized, unique creatives (images, videos, text) tailored to target GEO.

## Step-by-Step Process

### 1. Offer Selection

* **Action**: Analyze Nutra offers (CPA, CPL, COD) via affiliate networks.  
* **Criteria**:  
  * High payout rates and conversion potential.  
  * Target GEOs with demand for health products (e.g., Tier-2/3 countries).  
* **Tool**: Use tyver.io to spy on competitors’ Nutra campaigns for trending offers.  
* **Output**: Select 1-2 offers with proven performance.  
* Set up affiliate network postback with Keitaro tracker

### 2. Account Setup

**Action**:

* [FB](https://docs.google.com/document/d/10CZOB6re_Ge7QSr3tsemCTCdQNhLxKiGtg5aZWs7uNI/edit?usp=sharing) 

* Obtain a trusted Fan Agency account (pre-verified, no farming needed).  
* **Note**: Fan Agency accounts are replaceable in case of bans, reducing setup time.  
* Access the profile through an anti-detection browser and proxy  
* **Tool**: Agency gives a profile with an ad account to an anti-detection browser \- AdsPower  
* **Fan page:** We create a fan page and customize it for our offer. Add an avatar, a header, a description with a location in the city we will target, add 1-2 posts with an image and a link to our offer.

### 3. Creative Preparation

* **Action**:  
  * Develop localized creatives (images, videos \<20MB, text) focusing on health benefits, Shock, testimonials, or emotional storytelling.  
  * Uniqueize description using tools like fsymbols.com for text and video2edit.com for compression.  
  * Remove metadata from creatives (online-metadata.com).  
  * Spy tools: tyver.io \- analyze competitors' ads in the desired geo, download variants of creatives that are shown for a certain period of time, uniqueize or use as a reference  
  * [Examples](https://drive.google.com/drive/folders/1AO5jBL_JO9dl3Iz441wnq2eq9yyGAl_2?usp=sharing)

    **Output**: 3-6 unique creative variations per offers.

### 4. Pre-Landing and Landing Page Setup

* **Action**:  
  * Create a storytelling pre-landing page (e.g., a blog post or testimonial) to engage users.  
  * Develop a conversion-optimized landing page for the Nutra offer.  
* **Tool**: Download competitor landings using SiteSucker or saveweb2zip.com for inspiration.  
* **Output**: 1 pre-landing and 1 landing page per offer or collect leads right on the landing page.

  [Examples](https://drive.google.com/drive/folders/1AO5jBL_JO9dl3Iz441wnq2eq9yyGAl_2?usp=sharing)

  White page: Enter the Telegram bot, where you can generate a White page @zuckereye\_bot

### 5. Cloaking Setup in Keitaro

* **Action**:  
  * [Tracking](https://drive.google.com/drive/folders/1ovTSejjYiLCECNnfKJQ53ZPrEWB5P04T)  
    [Cloaking](https://drive.google.com/drive/folders/13zBzs0fhaRMC-_BwrCxhwmIQ5iV5Gipj)

  * Configure Keitaro to redirect bots/moderators to a white page (e.g., health blog) and real users to the pre-landing/landing page.  
  * Use a bot IP database (\~30k IPs) and user agent filters to identify moderators.  
  * Add an id pixel to your campaign link in keitaro  
* **Settings**:  
  * White Page: Compliant, non-promotional content.  
  * Offer Link: Pre-landing → Landing page.  
  * Postback: Configure with affiliate network for conversion tracking.  
  * Traffic Source: Facebook  
  * Domains  
  *  We create a campaign for the right offer  
* **Tool**: Keitaro admin panel (keitaro.io).  
* **Output**: Fully configured Keitaro campaign.

  Create a campaign for the offer, copy the link, add it to the FB campaign

### 6. Pixel and Tracking Setup

* **Action**:  
  * Create a Facebook Pixel in Event Manager.

    [Dynamic Pixel FB](https://docs.google.com/document/d/1sKILa-KpETI6eDAI9yqR_JOgG-2asnHbz2n0tVFjLYM/edit?usp=sharing)

  * Set events: Completed Registration, Purchase.  
  * Add the pixel code to the desired web page.  
* **Output**: Pixel tracking active for campaign analytics.

### 7. Campaign Launch (Direct launch)

* **Action**:  
  * Create your first ad campaign in Ads Manager  
  * At first, you should learn how to work with ABO \- Adset budget optimization.  
  * Strategy: 1 campaign, 3 ad sets, 1 ad (1:3:1) or 1 campaign, 6 ad sets 1 ad.  
  * Schedule launch at 00:00 (account time zone) next day.  
  * The secret of the trick: In the targeting settings, you need to set the location you need, as well as “Antarctica”, which helps to pass better FB moderation.  
  * Target mobile devices (Android/iOS based on offer).  
  * the first ad launch should be for a white product (any product), spend $2-5  
* **Settings**:  
  * Objective: Purchases  
  * Budget: Start with $4-25/day per ad set (Depends on geo and CPM)  
  * Audience: Men/Women 25+, GEO.  
* **Output**: Campaign live, pending moderation.

OR

Campaign Launch (Catalog)

* **Action**:  
  * Create a campaign in Business Manager using a Fan Agency account.

  * [Promotion through the catalog](https://drive.google.com/file/d/114wIz3UXYg53i_swReRuemGX1qVfEFWb/view?usp=sharing)

### 8. Moderation and Ban Handling

* **Action**:  
  * Monitor for ZRD (Advertising Activity Ban) via Account Quality.  
  * Replace banned account via Fan Agency if needed.  
* **Tool**: https://fbacc.io/ plugin  
* **Output**: Campaign passes moderation or account replaced.

### 9. Analysis and Optimization

* **Action**:  
  * Analyze Keitaro (СPL, CR, ROI).  
  * Pause underperforming ad sets (e.g., CTR \<1%, CR \<5%).  
  * **Important\!** In Facebook advertising, there is such a thing as \- Catch the spark \- We need to run many ad sets of ads and monitor them to see which ones will win auctions and reach the right audience. If you duplicate an ad set and launch two sets, one of them may differ significantly in results, although the settings are identical.  
  * Test new creatives and audience segments.  
  * Test new types of funnels, pre-landing pages  
* **Tool**: Keitaro analytics dashboard.  
* **Output**: Optimized campaign with improved ROI.

### 10. Scaling

* **Action**:  
  * Increase budget for high-performing ad sets (in order not to lose the spark in recruitment, you need to increase the budget by no more than 15% of the existing one).  
  * Scale the number of ad sets, campaigns, and ad accounts.  
  * Create auto-rules in FB.  
* **Output**: Scaled campaign with higher profit margins.


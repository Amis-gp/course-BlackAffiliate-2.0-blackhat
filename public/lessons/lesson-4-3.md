# MECHANICS \- algorithms, bids and auctions

<div class="mb-8" style="aspect-ratio: 16/9;">
  <iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/a4VZhEzAgtI?si=rmkY-eCbd8_2dmuN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

The mechanics of FB is the foundation on which all our future work will be built.

Understanding the mechanics of work is like knowing the rules of the game. Without knowing them, it is impossible to play, let alone win.

![image](/img/4.3/image1.jpg)

This lesson is theoretical, boring, complicated, BUT one of the most necessary (if not the most).

Without the knowledge from this lesson you won't understand how to get bids from FB cheaply and what to do if the results are too expensive.

## Auction

Traffic on any advertising platform, be it Vkontakte, Tik-Tok, Google Ads or Facebook, is sold on the principle of auction.

If you imagine an auction site, in the case of FB, their participants (advertisers) will fight for the right to show ads to a particular user. 

There are millions of auctions going on every day. If you lose an auction for the right to show ads to a person, it doesn't mean that you won't be able to show them ads at all, just that your ad post won't be shown in the person's feed first. There is an auction for each ad slot in the feed. And you can still show your advertisement to the target audience, even if your bid at the auction does not have much weight.

## Audience

The audience is formed according to the principle of a funnel. At each stage of the funnel, a part of people are eliminated, see:

First stage. FB finds those whom you have chosen in targeting. That is, people who fit the one you chose: age, gender, geo, interests and so on.

Second stage. From the previous audience are selected those who are online at the time the ads are shown. That is, users who can physically watch it in a given period of time.

Third stage. From the previous audience are selected those who, in FB's opinion, with the highest probability of making the action you need.

**Schematically, it looks like this:**

![image](/img/4.3/image2.jpg)

After FB has identified a stratum of target audience in the 3rd stage, the struggle begins among advertisers who want to show them their ads .

This is where the auction begins. A lot in the auction is the right to occupy an advertising slot (show the user an advertisement). Whoever offers the highest bid, the advertisement of that person will be shown.

## Bid

A bid in an advertising auction is not any amount of money. Nor can the bid be calculated.

The bid is a combination of factors that reflect the overall value of the ad to the user to whom it will be shown, according to Facebook.

The bid you'll be auctioning off is calculated using the formula:

\[Advertiser Bid\] x \[Approximate Action Frequency\] \+ \[Value to User\] \= Total Value (Final Bid).

Again, it is calculated conditionally, you can't get some final number or see your bid somewhere. Your task is to make 2 and 3 variables from the formula have high values, then you won't have to pay a lot for advertising.

       **Let's go through each variable of the formula:**

##  Advertiser's bid

This is the only variable that can be set in numeric format manually.  
In FB, when creating an ad campaign, you can select several bid strategies:

## 1\. Minimum bid

This strategy used to be called auto-bid, but now it has been renamed, although the essence remains the same.

And its essence is that, as you remember, the bid is made up of several indicators that affect your "weight" in the auction. With a "minimum bid" bidding strategy, the "advertiser bid" formula variable will be floating and will increase if necessary to compensate for other lagging formula variables so you can show the ad.

Conventionally speaking, if you have a low frequency of targeted actions and low value to users, FB will inflate the "Advertiser Bid" so you can win the auction.

## 2\. Marginal Bid

With this type of bid, our variable "advertiser bid" will be fixed. Hence all our variables become fixed FB cannot help us by artificially inflating one of the variables as it does with the minimum bid.

We start to lose the opportunity to show ads in a number of auctions, where our target traffic may also be.

Because of this, the ads may not spin up because we can't win the right number of auctions with our bid.

For example, in this situation, out of a $20 budget for the day, we may only spend $5 with a cap bid that is too low.

## 3\. Target price.

I've never used this bidding strategy, but the gist of it is that it's sort of a mix of "minimum price" and "limit bid".

In "minimum price" FB can toss our variable "advertiser bid" quite a bit, and in "cap bid" it doesn't touch it at all. In the case of the target price, FB will have the ability to increase the advertiser bid, but not much relative to the price you set manually.

This is to ensure that the result price ends up being around the value you set. But in this case, as in the previous one, there may also be a situation where the budget is not fully spent.


  **What to use?**

At the initial stage, we will use the "minimum price" strategy, so our main task will be to influence the other two variables in the formula, this is done by working with creative, lendings, pre-lendings, audiences, etc.

The goal is to raise the approximate frequency of action high and carry a high value to the user. This will allow us to charge less.

Approximate Action Frequency.

This variable is highly dependent on the optimization model. Because the ACTION whose frequency is determined will depend on the optimization goal.

Approximate Action Frequency is a metric that demonstrates the likelihood that showing an ad to a person will result in the desired outcome for the advertiser.

Since we work mainly with conversions and, at the very least, traffic, we are interested in such metrics as leads (conversions) and clicks. The eCTR and eCVR metrics are responsible for them.

eCTR \- predicted clickability; eCVR \- predicted conversion rate.

These indicators are built on the basis of data on the actions of previous

users who FB believes are part of our target audience and to whom our ads have been shown. 

Thus, the greater the number of actions on our optimization for a smaller number of impressions we receive, the greater our weight in the auction.  
 

## Value to the user.

This indicator is called "Quality of advertising" in another way. This name looks more understandable.

Ad quality is an indicator that reflects the amount of positive and negative feedback about the ad from users to whom it was shown.

The positive ones include: likes, clicks, reposts, comments, percentage of video views, time spent on the site, etc.

Negative: Hiding ads from the feed and complaints about the content, also if FB's artificial intelligence calculates any attempts to tamper with statistics, such as requests in the advertising text "like this post", tampering with likes or comments through services, then the quality of your ads will be reduced.

But scrolling comments has a certain meaning.

This also includes such a metric as "post click". Post click is the behavior of users on the site, where they go after clicking on your ads. If the page takes a long time to load and people leave without waiting for it to load, the value will decrease.

## How do you increase your auction weight?

To do this, we need to look at and try to raise or lower key metrics. For us, these are:  
CTR \- Clickability of the ad (the percentage of users who viewed the ad going to the site).  
CR \- Conversion from those who clicked on the ad to those who bought on the site.  
CPM \- Price per thousand impressions. Usually, the higher it is, the more expensive stratum of audience you got into, and the more competition there is.  
   
RS \- Relevance Score is rated from 1 to 10\. RS is an old metric, it was replaced by the ad quality score or value to users, which I wrote about above. But the essence remains the same  
You need to think about how you can use creative to increase some of the metrics.  
Using CTR as an example:  
CTR is responsible for clickability, how can you make people click more often?  
\- For example, there was a funny case: the Chinese launched targeting, placement chose insta-stories and drew a hair on the screen, users tried to brush it off and, as it turns out, they clicked \- CTR increased a lot.  
It looked like this:  

![image](/img/4.3/image3.jpg)

## Optimization.

This is a bit different from the optimization discussed above.

That optimization choice is about choosing an action that FB will target and look for an audience for it. 

But here, we're talking about the fact that as you run the ad, FB collects data about the people who interacted with it and took targeted actions. Based on this data, FB optimizes impressions \- it looks for audiences that are more similar to those who have already taken action and shows ads to them.

The more information FB has about the audience, the better the results of the advertising campaign will be.

FB collects information about users as part of the learning phase.

This is a phase in which Facebook can test different layers of the audience in search of the one that will be most effective. This period lasts until you get 50 conversions (targeted actions).

Within this period, results can "jump". Today the cost per lead may be $1, and tomorrow it may be $5. So we need to look at the cost of results over the entire distance to understand the average price per result.

Many people have a wrong judgment, when they got the first conversions (got them expensive) \- they think that they need to spin further and the price per result will fall.

But this is not quite true, the price per result will be about the same as that which is the average over the entire spinning distance. You don't need to expect that FB will "pour" you free leads over time.

**A couple more points regarding FB mechanics:**

 ## 1.Narrowing the targeting.

Never select interests and do not reduce the age when creating an RC if you are working with commodity or other arbitrage vertical (unless it is explicitly stated in the rules of the offer).

All the products we work with from gray to gembla are products that, in fact, everyone can be interested in. Yes, there are certain audience segments that don't need it, but we won't exclude them from the show, and there are two reasons for that:

The first reason. Narrowing the targeting leads to an increase in CPM (price per 1000 views), therefore, our traffic becomes more expensive, but in 99% of cases such indicator as CR does not improve, and thus, narrowing the targeting, we do ourselves a bearish favor.

The second reason: FB tests age, geo, gender, placements and different audience segments when showing ads. If FB sees that by showing ads to 100 people from stratum "1" we got 1 conversion, and by showing ads to 100 people from stratum "2" we got 10 conversions, FB will simply stop showing our ads to the audience segment that doesn't convert.

So, when setting up targeting, we choose only geo and gender. Well, and you can slightly reduce the age, for example, instead of the standard 18-65+ put 25-52. It is desirable that the age range should not be less than 20 years between the upper and lower boundaries.

 ## 2.Seasonal Offers and Holidays.

A lot of people want to get on FB and sell trending items for the holidays.

But I'll give you one case study that happened a couple years ago:

I think a lot of people have heard of a product called "rose bears." This product has long been in all PP, and my friends worked with it, leads were expensive, but all the same in the plus. And then the holidays began, and CPM, instead of the usual 150-200 rubles, became 600r.

This happened because a lot of people entered the auction, which began to fight for the same audience, in response to which FB increased the price of traffic (as the demand for it increased), and with the remaining in place site conversion rate (CR) most arbitrators merged into the minus.

 ## 3.What is the best time to launch an advertising campaign.

There is such an opinion that the best time to launch an advertising campaign is 00:00. Since many people do not pour at night, the competition is lower and traffic is cheaper. 

I tested this, but I did not notice any clear pattern between the launch time and the number of leads, everything is plus or minus the same. Yes, maybe when launching in 00 the results are a bit better, but it's not significant.

It is better not to start spinning ads if they received the status of "Active" after 18:00 on the time of the advertising account.

Why: In FB, the advertising budget is allocated per calendar day, that is, the less time left until the end of the day, the faster it will be spent. Due to the fact that FB needs to realize the maximum of the given budget (and there is little time left), it can enter less targeted auctions and the price for the result may be higher.

The entire budget, he certainly will not spend, but not infrequently there were cases when 50-60% of the daily budget was twisted and the results if there were, they were very expensive.

So do not do this, it is better to launch in the morning. If the ad was moderated late \- pause it and run it in the morning.

The time in FB is counted by the time of the advertising account, which you usually set when you first run ads, not by the time of the country of the social account 

If you don't remember what you set there, you can go to "billing", scroll down, click change:

![image](/img/4.3/image4.jpg)

And you'll see the time zone of the ad acct:

![image](/img/4.3/image5.jpg)

 ## 4.  Is it okay to stop advertising?

This question arises because some people have heard that by stopping an ad campaign, FB can "lose" the audience that was bringing results.

But that's not entirely true. Losing audience \= resetting the learning phase. But according to FB's official brief, the learning phase is only reset if "significant changes" are made. 

Significant changes are:

\- Any change in targeting.

\- Any change in ad creative (text, link, image itself, video).

\- Any change to an optimization event (pixel event).

\- Adding a new ad to an ad group.

\- Suspending the display of an ad group for 7 days or more. In this case, the learning phase will start over when you resume the display.

\- Changing the bid assignment strategy.

\- Also, a significant change can be a change in budget. BUT it will depend on the size of the budget change. If you increase it by $1 or even 2x, the learning phase won't reset.

The answer to the question: You can stop advertising, but if you don't want the training to fail, don't stop it for more than 7 days.

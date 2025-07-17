export interface Lesson {
  id: string;
  title: string;
  type: 'lesson' | 'homework' | 'questions';
  content?: string;
  videoUrl?: string;
  files?: string[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const courseData: Section[] = [
  {
    id: 'section-1',
    title: 'Introduction, Theory and Basics',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Welcome to the exciting world of Affiliate Marketing!',
        type: 'lesson',
        content: `If you're here, you probably already know that Affiliate Marketing is not just a way to make money online. It's a strategic approach where every step matters, and every decision can be the "key" to success. And if you want to master this field, be prepared for challenges and constant change.

Affiliate Marketing is not just about advertising products or services. It's about "bypassing the system," leveraging its full potential. And let's be clear: sometimes you will have to overcome obstacles, break some rules (but always within reason!), and work with high risks, all while focusing on the outcome. This field is not for those seeking easy paths, but if you're ready for serious work, success will follow.

During this training, you'll come across terms and phrases that might not translate directly into English. They'll likely sound like jargon or slang of the industry, but don't worry – this is a common practice in the traffic arbitrage world, where we all know how to work around the system. If something isn't entirely clear – feel free to ask, we're here to help.

With the flexibility in ad settings and limitless geo-targeting opportunities, traffic arbitrage is very popular today, especially in the CIS markets. But don't think it's going to be easy – you'll always need to stay on top of things and find the best strategies for each niche. Ready to get started?`
      },
      {
        id: 'lesson-1-2',
        title: 'The Art of Traffic Arbitrage: A Deep Dive',
        type: 'lesson',
        content: `Alright, now that you're excited to jump into the world of affiliate marketing, let's take a moment to really understand the core of traffic arbitrage. This is where the magic happens — where the game is played, and the strategies come into play.

## What is Traffic Arbitrage?

At its core, traffic arbitrage is all about buying traffic at a lower cost and directing it to offers that will pay you more. Essentially, you're buying cheap traffic (usually from platforms like Facebook, Google, or other ad networks) and then redirecting it to affiliate offers that convert well, making a profit on the difference.

It sounds simple, right? But don't be fooled — this is a delicate balance of targeting, creativity, and risk management. You have to be able to choose the right traffic sources, find profitable offers, and optimize your ads to ensure that every dollar spent is getting you the most out of your ad budget. And with all of that, you'll need to be ready to deal with the inevitable bans (Facebook, we're looking at you), shifting algorithms, and account suspensions. But hey, that's the fun part!

## Verticals: Where to Focus Your Efforts

Now let's talk about verticals — they're the bread and butter of affiliate marketing. In other words, they're the categories or niches that you're going to be working with. Choosing the right vertical is one of the most important steps in affiliate marketing. This can make or break your profitability.

The main verticals in traffic arbitrage are:

**Nutra (Nutrition & Health)**
This one's a massive, evergreen niche. Diet pills, supplements, and health-related products are always in demand. But here's the catch — they come with tight restrictions. Different platforms have different rules about what you can and can't advertise, so be sure to read the fine print and use right methods to avoid account bans.

**Gambling**
A high-risk, high-reward vertical. If you've got betting, poker, or online casino offers, you can rake in big profits. The caveat here? You need to be extra careful with your targeting and comply with the legal restrictions in various countries. Facebook? They're very strict when it comes to gambling ads, so expect some turbulence along the way.

**Adult**
The adult industry is another lucrative niche, but it's the most heavily restricted across the board. If you're not cautious, your ads will get banned faster than you can say "adult content." But if you can navigate through these challenges, this niche can yield some serious returns.

**Finance**
Think loans, insurance, credit cards, and investment offers. This vertical tends to have a higher payout per lead, and there's a lot of room for scaling. However, the competition is fierce, and the regulatory landscape is tricky. Be ready to constantly adapt.

**E-commerce and Consumer Goods**
Products like electronics, fashion, gadgets, and beauty items are always in demand. This vertical is less risky compared to others but requires constant testing of offers and optimizing your funnel to make sure you're converting leads into sales effectively.

## Partner Networks: The Backbone of Your Campaigns

In affiliate marketing, partner networks are the middlemen that connect you with the offers you'll be promoting. These networks provide you with access to a range of offers, track your performance, and handle the payouts. Some networks work on a CPL (Cost Per Lead) basis, while others offer CPA (Cost Per Action) or CPS (Cost Per Sale).

There are big players in the industry, like ClickBank, MaxBounty, and PeerFly, which have thousands of offers across different verticals. Choosing the right network is key to your success, and you'll want to partner with networks that have a solid reputation, reliable tracking, and on-time payments. Here are a few things to look for when choosing a network:

1. **Reputation**: Are they known for paying on time? Do affiliates speak positively about them?
2. **Offer Variety**: Do they offer enough options for different verticals? Is there room to scale?
3. **Tracking & Analytics**: Do they provide solid tracking and detailed reports? The more data you have, the better you can optimize your campaigns.
4. **Support**: Can you get help when you need it? Affiliate marketing isn't a 9-to-5 job, so you need access to 24/7 support.

Once you've picked your network, it's time to dive into the offers. You need to be able to filter out the best opportunities and focus on what works.`
      },
      {
        id: 'lesson-1-3',
        title: 'How much traffic is there?',
        type: 'lesson',
        content: 'Understanding traffic volumes, sources, and potential in the affiliate marketing ecosystem.',
        videoUrl: '/video/1/1.3.mp4'
      },
      {
        id: 'lesson-1-4',
        title: 'Main terms',
        type: 'lesson',
        content: 'Essential terminology and concepts you need to master in affiliate marketing.'
      },
      {
        id: 'lesson-1-5',
        title: 'Security on the Internet',
        type: 'lesson',
        content: 'Best practices for maintaining security and privacy while working in affiliate marketing.'
      },
      {
        id: 'lesson-1-6',
        title: 'Cloaking',
        type: 'lesson',
        content: 'Understanding cloaking techniques and their application in affiliate marketing campaigns.'
      },
      {
        id: 'lesson-1-7',
        title: 'Tracking',
        type: 'lesson',
        content: 'Master the art of tracking conversions, clicks, and campaign performance.'
      },
      {
        id: 'lesson-1-8',
        title: "What's the Facebook Structure and How Does It Work",
        type: 'lesson',
        content: 'Deep dive into Facebook\'s advertising ecosystem and platform structure.'
      },
      {
        id: 'lesson-1-9',
        title: 'Accounts FB',
        type: 'lesson',
        content: 'Everything you need to know about Facebook accounts for affiliate marketing.'
      },
      {
        id: 'lesson-1-10',
        title: 'Working with team',
        type: 'lesson',
        content: 'Building and managing effective affiliate marketing teams.'
      },
      {
        id: 'lesson-1-11',
        title: 'Proven sellers, contacts',
        type: 'lesson',
        content: 'Building relationships with reliable sellers and maintaining valuable contacts.'
      },
      {
        id: 'homework-1-1',
        title: 'Practical Homework',
        type: 'homework',
        content: 'Apply the concepts learned in this section with practical exercises.'
      },
      {
        id: 'questions-1-1',
        title: 'Questions on the general part',
        type: 'questions',
        content: 'Test your understanding with these comprehensive questions.'
      },
      {
        id: 'lesson-1-12',
        title: 'Choosing the Right Offer',
        type: 'lesson',
        content: 'Strategic approach to selecting profitable offers for your campaigns.'
      }
    ]
  },
  {
    id: 'section-2',
    title: 'Preparing the infrastructure',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Spreadsheet tracker of FB accounts and script for statistics',
        type: 'lesson',
        content: 'Set up comprehensive tracking systems for your Facebook accounts and campaign statistics.'
      },
      {
        id: 'lesson-2-2',
        title: 'Types of bans on Facebook',
        type: 'lesson',
        content: 'Understanding different types of Facebook bans and how to avoid them.'
      },
      {
        id: 'lesson-2-3',
        title: 'What is an antidetect browser?',
        type: 'lesson',
        content: 'Learn about antidetect browsers and their role in affiliate marketing.'
      },
      {
        id: 'lesson-2-4',
        title: 'What is a proxy server, why is it needed?',
        type: 'lesson',
        content: 'Understanding proxy servers and their importance in maintaining account security.'
      },
      {
        id: 'lesson-2-5',
        title: 'Adding a proxy to the anti-detection browser.',
        type: 'lesson',
        content: 'Step-by-step guide to configuring proxies in antidetect browsers.'
      },
      {
        id: 'lesson-2-6',
        title: 'Preparation of FB accounts',
        type: 'lesson',
        content: 'Comprehensive guide to preparing Facebook accounts for affiliate marketing.'
      },
      {
        id: 'lesson-2-7',
        title: 'Farming FB Account',
        type: 'lesson',
        content: 'Techniques for warming up and maintaining Facebook accounts.'
      },
      {
        id: 'lesson-2-8',
        title: 'Downloading any landings/sites',
        type: 'lesson',
        content: 'Methods for acquiring and setting up landing pages for your campaigns.'
      },
      {
        id: 'lesson-2-9',
        title: 'Setting up a Keitaro',
        type: 'lesson',
        content: 'Complete guide to setting up and configuring Keitaro tracker.'
      },
      {
        id: 'lesson-2-10',
        title: 'Cloaking FB',
        type: 'lesson',
        content: 'Advanced cloaking techniques specifically for Facebook campaigns.'
      },
      {
        id: 'lesson-2-11',
        title: 'Pre-landing',
        type: 'lesson',
        content: 'Creating effective pre-landing pages to improve conversion rates.'
      },
      {
        id: 'homework-2-1',
        title: 'Homework - Work with accounts and browser anti-detection',
        type: 'homework',
        content: 'Practical exercises for account management and antidetect browser setup.'
      },
      {
        id: 'homework-2-2',
        title: 'Homework - Cloaking',
        type: 'homework',
        content: 'Hands-on practice with cloaking techniques and implementation.'
      }
    ]
  },
  {
    id: 'section-3',
    title: 'System Setup',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Where to get payment methods',
        type: 'lesson',
        content: 'Sources and strategies for obtaining reliable payment methods for your campaigns.'
      },
      {
        id: 'lesson-3-2',
        title: 'Facebook Traffic Launch Checklist',
        type: 'lesson',
        content: 'Complete checklist to ensure successful Facebook traffic campaign launches.'
      },
      {
        id: 'lesson-3-3',
        title: 'Passing the Advertising Activity Ban (ZRD)',
        type: 'lesson',
        content: 'Strategies for overcoming and avoiding advertising activity restrictions.'
      },
      {
        id: 'lesson-3-4',
        title: 'Basics of working with the affiliate network',
        type: 'lesson',
        content: 'Fundamental principles of working effectively with affiliate networks.'
      },
      {
        id: 'lesson-3-5',
        title: 'Setting up postback with Affiliate networks',
        type: 'lesson',
        content: 'Technical guide to configuring postback systems for accurate tracking.'
      },
      {
        id: 'lesson-3-6',
        title: 'Pixel FB',
        type: 'lesson',
        content: 'Complete guide to Facebook Pixel implementation and optimization.'
      },
      {
        id: 'lesson-3-7',
        title: 'SPY servis ADHeart',
        type: 'lesson',
        content: 'Using ADHeart spy service for competitive intelligence and campaign research.'
      },
      {
        id: 'lesson-3-8',
        title: 'Types of creatives',
        type: 'lesson',
        content: 'Understanding different creative formats and their optimal use cases.'
      },
      {
        id: 'lesson-3-9',
        title: 'Ideal customer profile - Prompt',
        type: 'lesson',
        content: 'Creating detailed customer profiles for targeted marketing campaigns.'
      },
      {
        id: 'lesson-3-10',
        title: 'SOP: Connecting an ad account to the BM',
        type: 'lesson',
        content: 'Standard operating procedure for connecting ad accounts to Business Manager.'
      },
      {
        id: 'homework-3-1',
        title: 'Homework',
        type: 'homework',
        content: 'Comprehensive exercises covering all system setup concepts.'
      }
    ]
  }
];
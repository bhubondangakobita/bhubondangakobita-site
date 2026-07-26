ভুবনডাঙ্গার কবিতা — Stable Shell 50 v9

১. ZIP extract করুন।
২. ZIP-এর ভেতরের fileগুলো GitHub repository root-এ upload/replace করুন।
৩. ZIP file নিজে GitHub-এ upload করবেন না।
৪. supabase-setup.sql GitHub Pages চালায় না; Supabase SQL Editor-এ প্রয়োজন অনুযায়ী একবার run করতে হবে।
৫. supabase-config.js, supabase-auth.js এবং role-guard.js exact filename-এ repository root-এ রাখুন।

এই release-এ:
- Desktop-এ explicit three-column layout ও sticky দুই sidebar।
- 960–1180px desktop mode-এও center feed নিজের column-এ থাকবে।
- Mobile/tablet-এ এক জোড়া slim › ‹ handle এবং কার্যকর drawer।
- মধ্যরাতের প্রলাপ Light/Middle-এ light common shell, Dark-এ dark shell।
- Profile category/tab bar header-এর নিচে sticky।
- Feed-এর শেষে একক “আরও দেখুন”; প্রতিটি post-এ নয়।
- Composer/comment popup নয়, document flow-এর মধ্যে।
- Bengali abuse warning non-blocking review flow।
- Browser right-click context menu বন্ধ।

Physical iPhone/Samsung test করা হয়নি; code/static/render validation করা হয়েছে।

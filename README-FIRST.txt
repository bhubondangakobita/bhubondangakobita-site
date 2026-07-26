ভুবনডাঙ্গার কবিতা — Emergency Master 50 v5

এই release-এ v4-এর inline composer/comment/iOS fixes অপরিবর্তিত রেখে শুধুমাত্র ভুল universal sidebar architecture সংশোধন করা হয়েছে।

GitHub:
1. ZIP Extract করুন।
2. ভেতরের files repository root-এ upload/replace করুন।
3. ZIP file নিজে GitHub-এ upload করবেন না।

Supabase:
- supabase-config.js, supabase-auth.js, role-guard.js root-এ থাকবে।
- supabase-setup.sql GitHub-এ রাখা যেতে পারে, কিন্তু database setup-এর জন্য Supabase SQL Editor-এ একবার Run করতে হবে।

Sidebar:
- বাম: account/personal actions/themes/contact
- ডান: real active writers with green lights/support/saved posts
- কোনো category navigation duplicate নেই।

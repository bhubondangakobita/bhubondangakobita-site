ভুবনডাঙ্গার কবিতা — Emergency Master 50 v4

এই ZIP-এ:
- ঠিক ৫০টি complete HTML file
- ৩টি Supabase browser JS file
- ১টি complete Supabase SQL setup
- CNAME ও প্রয়োজনীয় ৩টি image asset
- কোনো পুরোনো HTML backup, previous ZIP, demo folder বা duplicate today-* file নেই

GitHub:
1. ZIP extract করুন।
2. ভেতরের file-গুলো repository root-এ upload/replace করুন।
3. ZIP file নিজে GitHub-এ upload করবেন না।
4. index.html root-এ থাকতে হবে।
5. CNAME-এ bhubondangakobita.com থাকবে।

Supabase:
1. supabase-config.js-এ বর্তমান Project URL এবং publishable key আছে। service_role key নেই।
2. Supabase Dashboard → SQL Editor → New query → supabase-setup.sql পুরোটা Run করুন।
3. Authentication → URL Configuration:
   Site URL: https://bhubondangakobita.com
   Redirect URLs: https://bhubondangakobita.com/** এবং https://www.bhubondangakobita.com/**
4. Founder UUID জানা থাকলে supabase-setup.sql-এর শেষের নির্দেশনা অনুযায়ী একবার founder role দিন।

গুরুত্বপূর্ণ:
- GitHub upload নিজে database table তৈরি করতে পারে না; SQL Editor-এ setup file একবার Run করতেই হবে।
- physical iPhone/Samsung test এই package তৈরির সময় করা হয়নি।
- composer popup বাদ; composer document flow-এর card-এর ভেতরে।
- comment input inline; bottom navigation বাদ; iOS keyboard focus-এর জন্য 16px input এবং body-lock cleanup আছে।

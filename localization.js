/* Bhubondanga Deep Cultural Localization v1 */
(function (W, D) {
  'use strict';
  if (W.BDLocalization) return;

  const CULTURES = {
    'bn-BD': { lang:'bn', dir:'ltr', locale:'bn-BD', country:'BD', currency:'BDT', address:'আপনি', tone:'warm-literary', weekStart:6,
      giftHelp:'লেখকের লেখা যদি ভালো লাগে তাহলে আপনি তাকে গিফট পাঠাতে পারেন।', giftTitle:'লেখককে গিফট পাঠান', giftAnonymous:'আপনার পরিচয় লেখকের কাছে গোপন থাকবে।',
      diary:'পার্সোনাল লাইফস্টাইল ডায়েরি', diarySupport:'অ্যালগরিদম সাপোর্টে পাঠান (পার্সোনাল লাইফ)', diaryDraft:'ড্রাফট হিসেবে ব্যক্তিগতভাবে রাখুন',
      emergency:'জরুরি সতর্কতা', humanitarian:'মানবিক সহায়তা সতর্কতা' },
    'bn-IN': { lang:'bn', dir:'ltr', locale:'bn-IN', country:'IN', currency:'INR', address:'আপনি', tone:'warm-literary', weekStart:0,
      giftHelp:'লেখকের লেখা ভালো লাগলে তাঁকে একটি গিফট পাঠাতে পারেন।', giftTitle:'লেখককে গিফট পাঠান', giftAnonymous:'আপনার পরিচয় লেখকের কাছে গোপন থাকবে।',
      diary:'পার্সোনাল লাইফস্টাইল ডায়েরি', diarySupport:'পার্সোনাল লাইফ সাপোর্টে পাঠান', diaryDraft:'ড্রাফট হিসেবে ব্যক্তিগতভাবে রাখুন', emergency:'জরুরি সতর্কতা', humanitarian:'মানবিক সহায়তা সতর্কতা' },
    'en-GB': { lang:'en', dir:'ltr', locale:'en-GB', country:'GB', currency:'GBP', address:'you', tone:'polite-natural', weekStart:1,
      giftHelp:"If a writer's work speaks to you, you can send them a gift.", giftTitle:'Send the writer a gift', giftAnonymous:'Your identity is not shown to the writer.',
      diary:'Personal Lifestyle Diary', diarySupport:'Submit for Algorithm Support (Personal Life)', diaryDraft:'Save as Draft', emergency:'Emergency alerts', humanitarian:'Humanitarian alerts' },
    'en-US': { lang:'en', dir:'ltr', locale:'en-US', country:'US', currency:'USD', address:'you', tone:'friendly-direct', weekStart:0,
      giftHelp:"Enjoyed this writer's work? You can send them a gift.", giftTitle:'Send a gift', giftAnonymous:'The writer will not see who sent it.',
      diary:'Personal Lifestyle Diary', diarySupport:'Submit for Algorithm Support (Personal Life)', diaryDraft:'Save as Draft', emergency:'Emergency alerts', humanitarian:'Humanitarian alerts' },
    'ar-AE': { lang:'ar', dir:'rtl', locale:'ar-AE', country:'AE', currency:'AED', address:'حضرتك', tone:'respectful-warm', weekStart:6,
      giftHelp:'إذا أعجبك ما كتبه المؤلف، يمكنك إرسال هدية له.', giftTitle:'أرسل هدية للكاتب', giftAnonymous:'لن تظهر هويتك للكاتب.', diary:'اليوميات الشخصية', diarySupport:'إرسال لدعم الخوارزمية (الحياة الشخصية)', diaryDraft:'حفظ كمسودة خاصة', emergency:'تنبيهات الطوارئ', humanitarian:'تنبيهات المساعدة الإنسانية' },
    'ar-SA': { lang:'ar', dir:'rtl', locale:'ar-SA', country:'SA', currency:'SAR', address:'أنت', tone:'respectful-warm', weekStart:0,
      giftHelp:'إذا أعجبك محتوى الكاتب، يمكنك إرسال هدية له.', giftTitle:'إرسال هدية للكاتب', giftAnonymous:'هويتك لا تظهر للكاتب.', diary:'اليوميات الشخصية', diarySupport:'إرسال لدعم الخوارزمية (الحياة الشخصية)', diaryDraft:'حفظ كمسودة خاصة', emergency:'تنبيهات الطوارئ', humanitarian:'تنبيهات المساعدة الإنسانية' },
    'hi-IN': { lang:'hi', dir:'ltr', locale:'hi-IN', country:'IN', currency:'INR', address:'आप', tone:'respectful-friendly', weekStart:0,
      giftHelp:'अगर लेखक की रचना आपको पसंद आए, तो आप उन्हें एक गिफ्ट भेज सकते हैं।', giftTitle:'लेखक को गिफ्ट भेजें', giftAnonymous:'लेखक को आपकी पहचान दिखाई नहीं जाएगी।', diary:'पर्सनल लाइफस्टाइल डायरी', diarySupport:'एल्गोरिदम सपोर्ट के लिए भेजें (पर्सनल लाइफ)', diaryDraft:'ड्राफ्ट के रूप में निजी रखें', emergency:'आपातकालीन अलर्ट', humanitarian:'मानवीय सहायता अलर्ट' },
    'ur-PK': { lang:'ur', dir:'rtl', locale:'ur-PK', country:'PK', currency:'PKR', address:'آپ', tone:'respectful-warm', weekStart:1,
      giftHelp:'اگر لکھاری کی تحریر آپ کو پسند آئے تو آپ انہیں ایک تحفہ بھیج سکتے ہیں۔', giftTitle:'لکھاری کو تحفہ بھیجیں', giftAnonymous:'لکھاری کو آپ کی شناخت نہیں دکھائی جائے گی۔', diary:'ذاتی لائف اسٹائل ڈائری', diarySupport:'الگورتھم سپورٹ کے لیے بھیجیں (ذاتی زندگی)', diaryDraft:'نجی ڈرافٹ کے طور پر محفوظ کریں', emergency:'ہنگامی انتباہات', humanitarian:'انسانی امداد کے انتباہات' },
    'nl-NL': { lang:'nl', dir:'ltr', locale:'nl-NL', country:'NL', currency:'EUR', address:'je', tone:'clear-friendly', weekStart:1,
      giftHelp:'Vind je het werk van deze schrijver mooi? Dan kun je een cadeau sturen.', giftTitle:'Stuur de schrijver een cadeau', giftAnonymous:'De schrijver krijgt jouw identiteit niet te zien.', diary:'Persoonlijk lifestyle-dagboek', diarySupport:'Verstuur voor algoritmische ondersteuning (persoonlijk leven)', diaryDraft:'Opslaan als privéconcept', emergency:'Noodmeldingen', humanitarian:'Humanitaire meldingen' },
    'de-DE': { lang:'de', dir:'ltr', locale:'de-DE', country:'DE', currency:'EUR', address:'du', tone:'clear-respectful', weekStart:1,
      giftHelp:'Wenn dir der Text gefällt, kannst du der Autorin oder dem Autor ein Geschenk senden.', giftTitle:'Geschenk senden', giftAnonymous:'Deine Identität wird der empfangenden Person nicht angezeigt.', diary:'Persönliches Lifestyle-Tagebuch', diarySupport:'Für algorithmische Unterstützung senden (Privatleben)', diaryDraft:'Als privaten Entwurf speichern', emergency:'Notfallwarnungen', humanitarian:'Humanitäre Warnungen' },
    'fr-FR': { lang:'fr', dir:'ltr', locale:'fr-FR', country:'FR', currency:'EUR', address:'vous', tone:'polite-warm', weekStart:1,
      giftHelp:"Si le texte de cet auteur vous plaît, vous pouvez lui envoyer un cadeau.", giftTitle:'Envoyer un cadeau', giftAnonymous:"Votre identité n'est pas affichée à l'auteur.", diary:'Journal personnel', diarySupport:'Envoyer au soutien algorithmique (vie personnelle)', diaryDraft:'Enregistrer comme brouillon privé', emergency:"Alertes d'urgence", humanitarian:'Alertes humanitaires' },
    'es-ES': { lang:'es', dir:'ltr', locale:'es-ES', country:'ES', currency:'EUR', address:'tú', tone:'warm-natural', weekStart:1,
      giftHelp:'Si te gusta lo que escribe esta persona, puedes enviarle un regalo.', giftTitle:'Enviar un regalo', giftAnonymous:'Tu identidad no se muestra a quien recibe el regalo.', diary:'Diario personal de estilo de vida', diarySupport:'Enviar para apoyo algorítmico (vida personal)', diaryDraft:'Guardar como borrador privado', emergency:'Alertas de emergencia', humanitarian:'Alertas humanitarias' },
    'it-IT': { lang:'it', dir:'ltr', locale:'it-IT', country:'IT', currency:'EUR', address:'tu', tone:'warm-natural', weekStart:1,
      giftHelp:"Se ti piace ciò che scrive l'autore, puoi inviargli un regalo.", giftTitle:'Invia un regalo', giftAnonymous:"La tua identità non viene mostrata all'autore.", diary:'Diario personale', diarySupport:'Invia al supporto algoritmico (vita personale)', diaryDraft:'Salva come bozza privata', emergency:'Avvisi di emergenza', humanitarian:'Avvisi umanitari' },
    'tr-TR': { lang:'tr', dir:'ltr', locale:'tr-TR', country:'TR', currency:'TRY', address:'siz', tone:'respectful-friendly', weekStart:1,
      giftHelp:'Yazarın yazısını beğendiyseniz kendisine bir hediye gönderebilirsiniz.', giftTitle:'Yazara hediye gönder', giftAnonymous:'Kimliğiniz yazara gösterilmez.', diary:'Kişisel Yaşam Günlüğü', diarySupport:'Algoritma Desteğine Gönder (Kişisel Yaşam)', diaryDraft:'Özel Taslak Olarak Kaydet', emergency:'Acil durum uyarıları', humanitarian:'İnsani yardım uyarıları' }
  };

  const COUNTRY_DEFAULT = { BD:'bn-BD', IN:'hi-IN', GB:'en-GB', US:'en-US', AE:'ar-AE', SA:'ar-SA', PK:'ur-PK', NL:'nl-NL', DE:'de-DE', FR:'fr-FR', ES:'es-ES', IT:'it-IT', TR:'tr-TR' };
  const LANGUAGE_DEFAULT = { bn:'bn-BD', en:'en-GB', ar:'ar-AE', hi:'hi-IN', ur:'ur-PK', nl:'nl-NL', de:'de-DE', fr:'fr-FR', es:'es-ES', it:'it-IT', tr:'tr-TR' };

  const BASE = {
    'settings.gift':'Gift Box', 'settings.privateProfile':'Private profile', 'settings.messages':'Who can message you',
    'settings.follow':'Who can follow you', 'settings.timelineBirthday':'Who can post birthday wishes on your timeline',
    'settings.poke':'Who can poke you', 'settings.feedLanguage':'Newsfeed language', 'settings.tickerCountry':'Date ticker country',
    'common.everyone':'Everyone', 'common.followers':'Followers', 'common.following':'People you follow', 'common.friends':'Friends', 'common.nobody':'Nobody',
    'common.save':'Save', 'common.cancel':'Cancel', 'common.close':'Close', 'common.offline':'Offline', 'common.syncing':'Syncing', 'common.synced':'Synced'
  };

  function normaliseLocale(v) {
    v = String(v || '').trim().replace('_','-');
    if (CULTURES[v]) return v;
    const lang = v.split('-')[0].toLowerCase();
    return LANGUAGE_DEFAULT[lang] || 'en-GB';
  }

  function storedLocale() {
    const explicit = localStorage.getItem('bd-locale-v1');
    if (explicit) return normaliseLocale(explicit);
    const lang = localStorage.getItem('bd-newsfeed-language-v1') || localStorage.getItem('bd-ui-language-v2') || D.documentElement.lang;
    const country = (localStorage.getItem('bd-ticker-country-v1') || '').toUpperCase();
    if (country && COUNTRY_DEFAULT[country]) {
      const c = CULTURES[COUNTRY_DEFAULT[country]];
      if (!lang || c.lang === String(lang).toLowerCase().split('-')[0]) return c.locale;
    }
    return normaliseLocale(lang || navigator.language || 'en-GB');
  }

  let activeLocale = storedLocale();
  function culture() { return CULTURES[activeLocale] || CULTURES['en-GB']; }

  function interpolate(text, vars) {
    return String(text).replace(/\{(\w+)\}/g, (_, k) => vars?.[k] == null ? `{${k}}` : String(vars[k]));
  }

  function t(key, vars, context) {
    const c = culture();
    let value = c[key];
    if (value == null && key.startsWith('culture.')) value = c[key.slice(8)];
    if (value == null) value = BASE[key];
    if (value == null) value = key;
    if (typeof value === 'function') value = value({ ...context, culture:c, vars });
    return interpolate(value, vars);
  }

  function applyRoot() {
    const c = culture();
    D.documentElement.lang = c.lang;
    D.documentElement.dir = c.dir;
    D.documentElement.dataset.bdLocale = c.locale;
    D.documentElement.dataset.bdTone = c.tone;
  }

  function apply(root = D) {
    applyRoot();
    root.querySelectorAll?.('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (!key) return;
      const value = t(key);
      if (el.matches('input,textarea')) el.placeholder = value; else el.textContent = value;
    });
    root.querySelectorAll?.('[data-i18n-title]').forEach(el => el.title = t(el.dataset.i18nTitle));
    root.querySelectorAll?.('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  }

  function setLocale(locale, opts = {}) {
    activeLocale = normaliseLocale(locale);
    if (opts.persist !== false) localStorage.setItem('bd-locale-v1', activeLocale);
    apply(D);
    W.dispatchEvent(new CustomEvent('bd:languagechange', { detail:{ locale:activeLocale, culture:culture() } }));
    return culture();
  }

  function setLanguage(lang) {
    const country = (localStorage.getItem('bd-ticker-country-v1') || '').toUpperCase();
    const l = String(lang || '').toLowerCase().split('-')[0];
    let locale = Object.keys(CULTURES).find(k => CULTURES[k].lang === l && (!country || CULTURES[k].country === country));
    locale ||= LANGUAGE_DEFAULT[l] || 'en-GB';
    localStorage.setItem('bd-newsfeed-language-v1', l);
    localStorage.setItem('bd-ui-language-v2', l);
    return setLocale(locale);
  }

  function setRegion(country) {
    country = String(country || '').toUpperCase();
    localStorage.setItem('bd-ticker-country-v1', country);
    const currentLang = culture().lang;
    const sameLang = Object.keys(CULTURES).find(k => CULTURES[k].country === country && CULTURES[k].lang === currentLang);
    return setLocale(sameLang || activeLocale);
  }

  function formatDate(value, options = {}) {
    const d = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat(culture().locale, options).format(d);
  }
  function formatNumber(value, options = {}) { return new Intl.NumberFormat(culture().locale, options).format(value); }
  function formatCurrency(value, currency = culture().currency, options = {}) {
    return new Intl.NumberFormat(culture().locale, { style:'currency', currency, ...options }).format(value);
  }
  function formatRelative(value, base = new Date()) {
    const d = value instanceof Date ? value : new Date(value), diff = d - base;
    const abs = Math.abs(diff);
    let unit='second', div=1000;
    if (abs >= 86400000) { unit='day'; div=86400000; }
    else if (abs >= 3600000) { unit='hour'; div=3600000; }
    else if (abs >= 60000) { unit='minute'; div=60000; }
    return new Intl.RelativeTimeFormat(culture().locale,{numeric:'auto'}).format(Math.round(diff/div),unit);
  }
  function greeting(date = new Date()) {
    const h = date.getHours(), l = culture().lang;
    const map = {
      bn: h<12?'সুপ্রভাত':h<17?'শুভ অপরাহ্ন':h<21?'শুভ সন্ধ্যা':'শুভ রাত্রি',
      en: h<12?'Good morning':h<17?'Good afternoon':h<21?'Good evening':'Good night',
      ar: h<12?'صباح الخير':h<18?'مساء الخير':'مساء الخير', hi:h<12?'सुप्रभात':h<17?'नमस्कार':'शुभ संध्या',
      ur:h<12?'صبح بخیر':'خوش آمدید', nl:h<12?'Goedemorgen':h<18?'Goedemiddag':'Goedenavond', de:h<12?'Guten Morgen':h<18?'Guten Tag':'Guten Abend',
      fr:h<12?'Bonjour':h<18?'Bonjour':'Bonsoir', es:h<12?'Buenos días':h<20?'Buenas tardes':'Buenas noches', it:h<12?'Buongiorno':h<18?'Buon pomeriggio':'Buonasera', tr:h<12?'Günaydın':h<18?'İyi günler':'İyi akşamlar'
    };
    return map[l] || map.en;
  }

  W.BDLocalization = Object.freeze({ CULTURES, culture, t, apply, setLocale, setLanguage, setRegion, formatDate, formatNumber, formatCurrency, formatRelative, greeting, get locale(){return activeLocale;} });
  applyRoot();
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', () => apply(D), { once:true }); else apply(D);
})(window, document);

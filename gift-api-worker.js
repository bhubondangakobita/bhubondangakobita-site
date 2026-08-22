/**
 * Bhubondanga Anonymous Gift Box Payment Worker v1 (Cloudflare Workers)
 * Required secrets/bindings:
 * SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
 * STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, APP_ORIGIN
 * Routes: POST /api/gifts/create, POST /api/gifts/webhook
 */
const ALLOWED_AMOUNTS={BDT:[20000,50000,100000,200000],INR:[10000,25000,50000,100000],PKR:[50000,100000,200000,500000],AED:[500,1000,2500,5000],SAR:[500,1000,2500,5000],TRY:[5000,10000,20000,50000],EUR:[200,500,1000,2000],GBP:[200,500,1000,2000],USD:[200,500,1000,2000]};
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=utf-8',...headers}});
const cors=env=>({'access-control-allow-origin':env.APP_ORIGIN||'*','access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'authorization,content-type','vary':'origin'});
const safeOrigin=(url,env)=>{try{const u=new URL(url);const allowed=new URL(env.APP_ORIGIN);return u.origin===allowed.origin?u.href:`${allowed.origin}/index.html`}catch(_){return `${env.APP_ORIGIN}/index.html`}};

async function supaUser(req,env){
 const auth=req.headers.get('authorization')||'';if(!auth.startsWith('Bearer '))return null;
 const r=await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{authorization:auth,apikey:env.SUPABASE_ANON_KEY}});if(!r.ok)return null;return r.json();
}
async function rest(env,path,init={}){
 const headers={'apikey':env.SUPABASE_SERVICE_ROLE_KEY,'authorization':`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'content-type':'application/json','prefer':'return=representation',...(init.headers||{})};
 return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`,{...init,headers});
}
async function receiverEnabled(env,id){
 const r=await rest(env,`profile_preferences?user_id=eq.${encodeURIComponent(id)}&select=gift_box_enabled,gift_box_public&limit=1`,{method:'GET'});if(!r.ok)return false;const rows=await r.json();if(!rows.length)return true;return rows[0].gift_box_enabled!==false&&rows[0].gift_box_public!==false;
}
function form(data){const p=new URLSearchParams();for(const [k,v] of Object.entries(data))if(v!==undefined&&v!==null)p.append(k,String(v));return p}
async function stripeCreate(env,payload){
 const r=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,'content-type':'application/x-www-form-urlencoded'},body:form(payload)});const out=await r.json();if(!r.ok)throw new Error(out?.error?.message||'Stripe checkout failed');return out;
}
async function createGift(req,env){
 const user=await supaUser(req,env);if(!user?.id)return json({error:'Authentication required'},401,cors(env));
 const body=await req.json().catch(()=>null);if(!body)return json({error:'Invalid JSON'},400,cors(env));
 const receiver=String(body.receiver_id||'').trim(),currency=String(body.currency||'').toUpperCase(),amount=Number(body.amount_minor);
 if(!/^[0-9a-f-]{36}$/i.test(receiver)||receiver===user.id)return json({error:'Invalid receiver'},400,cors(env));
 if(!ALLOWED_AMOUNTS[currency]?.includes(amount))return json({error:'Unsupported gift amount'},400,cors(env));
 if(!await receiverEnabled(env,receiver))return json({error:'This author is not accepting public gifts'},403,cors(env));
 const giftId=crypto.randomUUID();
 const insert=await rest(env,'gift_transactions',{method:'POST',body:JSON.stringify({id:giftId,sender_id:user.id,receiver_id:receiver,amount_minor:amount,currency,status:'created',provider:'stripe',metadata:{source:'gift_box_v1'}})});
 if(!insert.ok)return json({error:'Could not create gift transaction'},500,cors(env));
 try{
  const returnUrl=safeOrigin(body.return_url||env.APP_ORIGIN,env),cancelUrl=new URL(returnUrl);cancelUrl.searchParams.set('gift','cancelled');const successUrl=new URL(returnUrl);successUrl.searchParams.set('gift','success');successUrl.searchParams.set('session_id','{CHECKOUT_SESSION_ID}');
  const s=await stripeCreate(env,{
   mode:'payment',success_url:successUrl.href,cancel_url:cancelUrl.href,'line_items[0][quantity]':1,
   'line_items[0][price_data][currency]':currency.toLowerCase(),'line_items[0][price_data][unit_amount]':amount,
   'line_items[0][price_data][product_data][name]':'Anonymous Gift','line_items[0][price_data][product_data][description]':'A private gift to a Bhubondanga writer',
   'metadata[gift_id]':giftId,'payment_intent_data[metadata][gift_id]':giftId
  });
  await rest(env,`gift_transactions?id=eq.${giftId}`,{method:'PATCH',body:JSON.stringify({provider_checkout_id:s.id,status:'pending'})});
  return json({url:s.url,id:giftId},200,cors(env));
 }catch(err){await rest(env,`gift_transactions?id=eq.${giftId}`,{method:'PATCH',body:JSON.stringify({status:'failed'})});return json({error:String(err.message||err)},502,cors(env))}
}
function hex(bytes){return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function equalHex(a,b){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
async function verifyStripe(raw,header,secret){
 const parts=Object.fromEntries(String(header||'').split(',').map(x=>x.split('=').map(s=>s.trim())).filter(x=>x.length===2));const t=parts.t,v1=parts.v1;if(!t||!v1)return false;
 if(Math.abs(Date.now()/1000-Number(t))>300)return false;const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sig=hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${t}.${raw}`)));return equalHex(sig,v1);
}
async function stripeWebhook(req,env){
 const raw=await req.text();if(!await verifyStripe(raw,req.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET))return new Response('Bad signature',{status:400});
 const event=JSON.parse(raw),obj=event.data?.object||{};
 if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){
  const giftId=obj.metadata?.gift_id;if(giftId)await rest(env,`gift_transactions?id=eq.${encodeURIComponent(giftId)}`,{method:'PATCH',body:JSON.stringify({status:'paid',provider_checkout_id:obj.id,provider_payment_id:obj.payment_intent||null,paid_at:new Date((obj.created||Math.floor(Date.now()/1000))*1000).toISOString()})});
 }else if(event.type==='checkout.session.expired'){
  const giftId=obj.metadata?.gift_id;if(giftId)await rest(env,`gift_transactions?id=eq.${encodeURIComponent(giftId)}&status=neq.paid`,{method:'PATCH',body:JSON.stringify({status:'cancelled'})});
 }else if(event.type==='charge.refunded'){
  const pi=obj.payment_intent;if(pi)await rest(env,`gift_transactions?provider_payment_id=eq.${encodeURIComponent(pi)}`,{method:'PATCH',body:JSON.stringify({status:'refunded'})});
 }else if(event.type==='payment_intent.payment_failed'){
  const giftId=obj.metadata?.gift_id;if(giftId)await rest(env,`gift_transactions?id=eq.${encodeURIComponent(giftId)}&status=neq.paid`,{method:'PATCH',body:JSON.stringify({status:'failed',provider_payment_id:obj.id})});
 }
 return new Response('ok',{status:200});
}
export default {async fetch(req,env){
 const u=new URL(req.url);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(env)});
 if(u.pathname==='/api/gifts/create'&&req.method==='POST')return createGift(req,env);
 if(u.pathname==='/api/gifts/webhook'&&req.method==='POST')return stripeWebhook(req,env);
 return json({error:'Not found'},404,cors(env));
}};

#!/usr/bin/env node
// Read-only preflight for Paddle domain review.
// Usage: node scripts/paddle-preflight.mjs https://your-confirmed-software-domain
const origin=process.argv[2]||process.env.PADDLE_SITE_URL||"";
if (!/^https:\/\/[^/]+$/i.test(origin)) {
 console.error("FAIL: supply a confirmed HTTPS origin (no trailing path).");
 process.exit(2);
}
const required=[
 ["/",["MONARDAS","HVAC"]],
 ["/pricing",["Founding HVAC pilot","Not on sale"]],
 ["/terms",["Individual Entrepreneur Iurii Shalygin","312796356"]],
 ["/privacy",["Privacy policy","Resend"]],
 ["/refund-policy",["Refund and cancellation policy","No paid SaaS"]],
 ["/contact",["MONARDAS","email"]],
];
let failed=false;
for(const [path,terms] of required){
 const url=origin+path;
 try{
  const response=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(15000)});
  const html=await response.text();
  const misses=terms.filter(x=>!html.toLowerCase().includes(x.toLowerCase()));
  const legacy=/prestashop|red spotted amanita|ivan tea 2 lb/i.test(html);
  const bad=response.status!==200||!response.url.startsWith(origin)||misses.length>0||legacy;
  console.log((bad?"FAIL":"PASS")+" "+path+" status="+response.status+
   (misses.length?" missing="+misses.join("|"):"")+(legacy?" LEGACY_STORE_DETECTED":"")+
   (response.url!==url?" redirect="+response.url:""));
  failed ||=bad;
 }catch(error){failed=true;console.log("FAIL "+path+" "+String(error));}
}
if(failed){console.error("PADDLE_DOMAIN_PREFLIGHT_HOLD — do not submit to Paddle.");process.exit(1);}
console.log("PADDLE_DOMAIN_STATIC_PREFLIGHT_PASS — verify real pricing, product functionality, Paddle catalog and identity separately.");

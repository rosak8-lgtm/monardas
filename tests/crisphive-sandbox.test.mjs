import test from "node:test";
import assert from "node:assert/strict";
import { createCrisphiveSandboxReader } from "../src/lib/crisphive-sandbox.mjs";
const id = "11111111-1111-4111-8111-111111111111";
const key = "chsk_test_fixture";
const good = {ok:true,json:async()=>({error_code:0,data:{example:true}})};
test("production keys rejected",()=>assert.throws(()=>createCrisphiveSandboxReader({key:"chsk_live_fixture"}),/CONFIG_INVALID/));
test("invalid job ID rejected before network",async()=>{
  const c=createCrisphiveSandboxReader({key,transport:()=>{throw Error("called")}});
  await assert.rejects(c.readJob("../customers"),/JOB_ID_INVALID/);
});
test("GET only, fixed origin, redirect error, UTC",async()=>{
  const calls=[];const c=createCrisphiveSandboxReader({key,transport:async(...args)=>{calls.push(args);return good}});
  await c.listJobTypes();await c.bookingWindows({from:"2026-12-01",to:"2026-12-14",jobTypeId:id});await c.readJob(id);
  assert.equal(calls.length,3);
  for(const [url,opt] of calls){assert.ok(url.startsWith("https://api.crisphive.com/v1/"));assert.equal(opt.method,"GET");assert.equal(opt.redirect,"error");assert.equal(opt.headers["X-Timezone"],"UTC");assert.equal(opt.headers.Authorization,"Bearer "+key)}
  assert.ok(calls[1][0].includes("job_type_id="+id+"&emergency=false"));
  assert.equal(c.createJob,undefined);
});
test("invalid dates and long ranges rejected",async()=>{
  const c=createCrisphiveSandboxReader({key,transport:()=>{throw Error("called")}});
  for(const [from,to] of [["2026-02-30","2026-03-02"],["2026-12-01","2026-12-30"],["2026-12-02","2026-12-01"]])await assert.rejects(c.bookingWindows({from,to,jobTypeId:id}),/WINDOW_INPUT_INVALID/);
});
test("failed envelope is not success",async()=>{
  const c=createCrisphiveSandboxReader({key,transport:async()=>({ok:true,json:async()=>({error_code:"DENIED",data:{}})})});
  await assert.rejects(c.listJobTypes(),/ENVELOPE_ERROR/);
});
test("transport errors do not leak secret",async()=>{
  const c=createCrisphiveSandboxReader({key,transport:async()=>{throw Error(key)}});
  await assert.rejects(c.listJobTypes(),e=>e.message==="CRISPHIVE_TRANSPORT_ERROR"&&!e.message.includes(key));
});
test("HTTP and JSON errors are separate",async()=>{
  for(const [r,code] of [[{ok:false},/HTTP_ERROR/],[{ok:true,json:async()=>{throw Error(key)}},/INVALID_JSON/]]){
    const c=createCrisphiveSandboxReader({key,transport:async()=>r});await assert.rejects(c.listJobTypes(),code);
  }
});

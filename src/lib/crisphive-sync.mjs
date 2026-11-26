// Sandbox-only change reader; no database mutations, dispatch, or client-side use.
export function createSandboxFeed({key, customerId, transport = globalThis.fetch} = {}) {
  if (typeof window !== 'undefined' || typeof key !== 'string' || !/^chsk_test_[A-Za-z0-9_-]+$/.test(key) || typeof transport !== 'function' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(customerId ?? '')) throw Error('INVALID_CONFIG');
  const cursor = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));
  return async function read({since, limit=15} = {}) {
    if ((since !== undefined && !cursor(since)) || !Number.isInteger(limit) || limit<1 || limit>100) throw Error('INVALID_CURSOR_OR_LIMIT');
    const query = new URLSearchParams({customer_id:customerId,limit:String(limit)});
    if (since !== undefined) query.set('since',since);
    let response;
    try { response = await transport('https://api.crisphive.com/v1/job-requests/changes?'+query, {method:'GET',redirect:'error',cache:'no-store',headers:{Authorization:'Bearer '+key,Accept:'application/json'},signal:AbortSignal.timeout(15000)}); }
    catch { throw Error('TRANSPORT_ERROR'); }
    if (!response.ok) throw Error('HTTP_ERROR');
    let body;
    try { body=await response.json(); } catch { throw Error('INVALID_JSON'); }
    const d=body?.data;
    if (body?.error_code!==0 || !Array.isArray(d?.items) || typeof d.has_more!=='boolean' || !cursor(d.next_since)) throw Error('INVALID_FEED');
    if (d.has_more && (d.items.length===0 || d.next_since===since)) throw Error('CURSOR_STALLED');
    return {items:d.items,next_since:d.next_since,has_more:d.has_more};
  };
}

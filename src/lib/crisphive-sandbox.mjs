// Internal sandbox adapter. Never import into a browser/client component.
export function createCrisphiveSandboxReader({ key, transport = globalThis.fetch } = {}) {
  if (typeof key !== "string" || !/^chsk_test_[A-Za-z0-9_-]+$/.test(key) || typeof transport !== "function") {
    throw new Error("CRISPHIVE_SANDBOX_CONFIG_INVALID");
  }
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const date = /^\d{4}-\d{2}-\d{2}$/;
  function validDate(value) {
    if (typeof value !== "string" || !date.test(value)) return false;
    const d = new Date(value + "T00:00:00Z");
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
  }
  async function get(path) {
    let response;
    try {
      response = await transport("https://api.crisphive.com/v1" + path, {
        method: "GET", redirect: "error", cache: "no-store",
        headers: { Authorization: "Bearer " + key, Accept: "application/json", "X-Timezone": "UTC" },
        signal: AbortSignal.timeout(15000),
      });
    } catch { throw new Error("CRISPHIVE_TRANSPORT_ERROR"); }
    if (!response.ok) throw new Error("CRISPHIVE_HTTP_ERROR");
    let body;
    try { body = await response.json(); } catch { throw new Error("CRISPHIVE_INVALID_JSON"); }
    if (!body || body.error_code !== 0 || !body.data || typeof body.data !== "object") {
      throw new Error("CRISPHIVE_ENVELOPE_ERROR");
    }
    return body.data;
  }
  return Object.freeze({
    async listJobTypes() {
      return get("/job-types");
    },
    async bookingWindows({ from, to, jobTypeId }) {
      if (!validDate(from) || !validDate(to) || from > to ||
          (Date.parse(to) - Date.parse(from)) / 86400000 > 13 ||
          typeof jobTypeId !== "string" || !uuid.test(jobTypeId)) {
        throw new Error("CRISPHIVE_WINDOW_INPUT_INVALID");
      }
      return get("/job-requests/booking-windows?from=" + from + "&to=" + to + "&job_type_id=" + jobTypeId + "&emergency=false");
    },
    async readJob(id) {
      if (typeof id !== "string" || !uuid.test(id)) throw new Error("CRISPHIVE_JOB_ID_INVALID");
      return get("/job-requests/" + id);
    },
  });
}

import cogoToast from "cogo-toast";

export async function execute(config: any) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",

      // 🚫 Disable browser cache validation
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };

    // Optional: allow custom headers from config
    if (config.headers) {
      Object.assign(headers, config.headers);
    }

    const options: RequestInit = {
      method: config.method,
      headers,
    };

    // Attach body only for non-GET
    if (config.method !== "GET" && config.body) {
      options.body =
        typeof config.body === "string"
          ? config.body
          : JSON.stringify(config.body);
    }

    const response = await fetch(config.url, options);

    let data: any = null;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    cogoToast.success(`${config.name} executed successfully`);

    return {
      ok: response.ok,
      status: response.status,
      data,
      etag: response.headers.get("etag"),
    };
  } catch (error: any) {
    cogoToast.error(`${config.name} failed to execute`);
    return {
      ok: false,
      status: 0,
      error: error.message || "Network error",
    };
  }
}

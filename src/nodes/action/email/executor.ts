export async function execute(config: any) {
  try {
    // Simulated delay
    await new Promise((r) => setTimeout(r, 500));

    return {
      ok: true,
      message: config.message,
      sentAt: Date.now(),
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || "Failed to send email",
    };
  }
}

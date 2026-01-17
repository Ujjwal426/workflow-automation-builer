// nodes/action/delay/executor.ts
export async function execute(config: any) {
  const durationMs = config.duration * 1000;

  await new Promise((resolve) => setTimeout(resolve, durationMs));

  return {
    ok: true,
    waited: config.duration,
    finishedAt: Date.now(),
  };
}

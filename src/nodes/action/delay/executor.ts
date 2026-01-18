import cogoToast from "cogo-toast";

export async function execute(config: any) {
  const durationMs = config.duration * 1000;

  cogoToast.info(`Waiting for ${config.duration} seconds...`);

  await new Promise((resolve) => setTimeout(resolve, durationMs));

  cogoToast.success(`Waited ${config.duration} seconds`);

  return {
    ok: true,
    waited: config.duration,
    finishedAt: Date.now(),
  };
}

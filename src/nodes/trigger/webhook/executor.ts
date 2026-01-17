export async function execute(config: any) {
  return {
    type: "webhook-trigger",
    firedAt: Date.now(),
    name: config.name,
  };
}

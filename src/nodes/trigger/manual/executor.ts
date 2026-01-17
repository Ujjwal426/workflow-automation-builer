export async function execute(config: any) {
  return {
    type: "manual-trigger",
    firedAt: Date.now(),
    name: config.name,
  };
}

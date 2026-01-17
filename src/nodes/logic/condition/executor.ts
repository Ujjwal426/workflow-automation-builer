export async function execute(config: any, context: any) {
  const { results, sourceNodeId } = context;

  if (!sourceNodeId || !results[sourceNodeId]) {
    return false;
  }

  const lastResult = results[sourceNodeId];

  const leftValue = lastResult[config.field];
  const rightValue = config.value;

  switch (config.operator) {
    case "eq":
      return leftValue === rightValue;
    case "neq":
      return leftValue !== rightValue;
    default:
      return false;
  }
}

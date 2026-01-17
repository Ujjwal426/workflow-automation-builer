import TriggerManualNode from "./trigger/manual/Node.vue";
import TriggerManualForm from "./trigger/manual/ConfigForm.vue";
import { manualTriggerSchema } from "./trigger/manual/schema";
import { execute as triggerExec } from "./trigger/manual/executor";
import { triggerManualDefaults } from "./trigger/manual/defaults";

import TriggerWebhookNode from "./trigger/webhook/Node.vue";
import TriggerWebhookForm from "./trigger/webhook/ConfigForm.vue";
import { webhookTriggerSchema } from "./trigger/webhook/schema";
import { execute as webhookExec } from "./trigger/webhook/executor";
import { triggerWebhookDefaults } from "./trigger/webhook/defaults";

import HttpNode from "./action/http/Node.vue";
import HttpNodeForm from "./action/http/ConfigForm.vue";
import { httpSchema } from "./action/http/schema";
import { execute as httpExec } from "./action/http/executor";
import { httpDefaults } from "./action/http/defaults";

import EmailNode from "./action/email/Node.vue";
import EmailNodeForm from "./action/email/ConfigForm.vue";
import { emailSchema } from "./action/email/schema";
import { emailDefaults } from "./action/email/defaults";
import { execute as emailExec } from "./action/email/executor";

import DelayNode from "./action/delay/Node.vue";
import DelayNodeForm from "./action/delay/ConfigForm.vue";
import { delaySchema } from "./action/delay/schema";
import { delayDefaults } from "./action/delay/defaults";
import { execute as delayExec } from "./action/delay/executor";

import ConditionManualNode from "./logic/condition/Node.vue";
import ConditionHttpNodeForm from "./logic/condition/ConfigForm.vue";
import { conditionSchema } from "./logic/condition/schema";
import { execute as conditionExec } from "./logic/condition/executor";
import { conditionDefaults } from "./logic/condition/defaults";

export const nodeRegistry: Record<string, any> = {
  "Trigger.Manual": {
    label: "Trigger",
    component: TriggerManualNode,
    schema: manualTriggerSchema,
    executor: triggerExec,
    configForm: TriggerManualForm,
    defaults: triggerManualDefaults,
  },
  "Trigger.Webhook": {
    label: "Webhook",
    component: TriggerWebhookNode,
    schema: webhookTriggerSchema,
    executor: webhookExec,
    configForm: TriggerWebhookForm,
    defaults: triggerWebhookDefaults,
  },
  "Action.Http": {
    label: "HTTP Request",
    component: HttpNode,
    schema: httpSchema,
    executor: httpExec,
    configForm: HttpNodeForm,
    defaults: httpDefaults,
  },

  "Action.Email": {
    label: "Send Email",
    component: EmailNode,
    schema: emailSchema,
    executor: emailExec,
    configForm: EmailNodeForm,
    defaults: emailDefaults,
  },

  "Action.Delay": {
    label: "Delay",
    component: DelayNode,
    schema: delaySchema,
    executor: delayExec,
    configForm: DelayNodeForm,
    defaults: delayDefaults,
  },

  "Logic.Condition": {
    label: "Condition",
    component: ConditionManualNode,
    schema: conditionSchema,
    executor: conditionExec,
    configForm: ConditionHttpNodeForm,
    defaults: conditionDefaults,
  },
};

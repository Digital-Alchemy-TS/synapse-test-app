import { TServiceParams } from "@digital-alchemy/core";

export function BaseEntities({ synapse, context }: TServiceParams) {
  synapse.button({
    context,
    name: "Debug",
    press() {
      console.log(synapse.discovery.APP_METADATA());
    },
  });
}

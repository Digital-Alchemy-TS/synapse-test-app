import { TServiceParams } from "@digital-alchemy/core";

export function FlipFlop({ synapse, context }: TServiceParams) {
  const device = synapse.device.register(synapse.device.id("example-flip-flop-app"), {
    name: "Flip Flop",
    sw_version: "1.2.3",
  });
  synapse.lock({
    context,
    device_id: device,
    name: "Some lock",
  });
}

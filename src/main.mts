import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

import { BaseEntities } from "./base.mts";
import { FlipFlop } from "./flip-flop.mts";
import { TimerApp } from "./timer.mts";

const TEST_APP = CreateApplication({
  configuration: {},
  libraries: [LIB_HASS, LIB_SYNAPSE],
  name: "synapse_test_app",
  services: {
    base: BaseEntities,
    flip_flop: FlipFlop,
    timer: TimerApp,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    synapse_test_app: typeof TEST_APP;
  }
}

await TEST_APP.bootstrap({
  configuration: {
    boilerplate: {
      LOG_LEVEL: "debug",
    },
    hass: {
      BASE_URL: "http://localhost:8123",
    },
    synapse: {
      METADATA_TITLE: "Synapse Test App",
    },
  },
});

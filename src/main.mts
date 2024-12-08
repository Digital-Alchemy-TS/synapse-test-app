import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

import { TimerApp } from "./timer.mts";

const TEST_APP = CreateApplication({
  configuration: {},
  libraries: [LIB_HASS, LIB_SYNAPSE],
  name: "synapse_test_app",
  services: {
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
    hass: {
      BASE_URL: "http://localhost:8123",
    },
    synapse: {
      METADATA_TITLE: "Synapse Test App",
    },
  },
});

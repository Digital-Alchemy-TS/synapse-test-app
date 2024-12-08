import { CronExpression, sleep, TServiceParams } from "@digital-alchemy/core";
import dayjs from "dayjs";

type ControlSensor = { targetTime: string };

export function TimerApp({ synapse, context }: TServiceParams) {
  const device = synapse.device.register(synapse.device.id("example-timer-app"), {
    name: "Timer App",
    sw_version: "4.2.0",
  });

  const timeLeft = synapse.sensor<{ locals: ControlSensor; state: string }>({
    context,
    device_id: device,
    disabled: ({ locals }) => !locals.targetTime,
    icon: ({ locals }) => (locals.targetTime ? "mdi:cookie-clock" : "mdi:cookie-alert-outline"),
    locals: { targetTime: undefined },
    name: "Countdown timer",
    state: {
      current({ locals }) {
        const target = locals.targetTime;
        if (!target) {
          return "no timer";
        }
        const now = dayjs();
        const diff = dayjs(target).diff(now, "second");
        const value = Math.max(0, diff).toString();
        return `${value}s`;
      },
      schedule: CronExpression.EVERY_SECOND,
    },
  });

  const timer = synapse.number({
    context,
    device_class: "duration",
    device_id: device,
    name: "Timer",
    native_max_value: 60 * 5,
    native_min_value: 0,
    native_value: 5,
    step: 0.5,
    unit_of_measurement: "min",
  });

  let active: ReturnType<typeof sleep>;

  synapse.button({
    context,
    device_id: device,
    name: "Run timer",
    async press() {
      if (active) {
        active.kill("stop");
      }
      const target = dayjs().add(timer.native_value, "second");
      timeLeft.locals.targetTime = target.toISOString();
      active = sleep(target.toDate());
      await active;
      timeLeft.locals.targetTime = undefined;
    },
  });
}

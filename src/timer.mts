import { CronExpression, sleep, TServiceParams } from "@digital-alchemy/core";
import dayjs from "dayjs";

type ControlSensor = { targetTime: string };

export function TimerApp({ synapse, context }: TServiceParams) {
  const timeLeft = synapse.sensor<{ locals: ControlSensor; state: string }>({
    context,
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

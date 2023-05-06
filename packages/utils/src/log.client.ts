const isTemplateString = (label: unknown): label is TemplateStringsArray =>
  Array.isArray(label) && label.hasOwnProperty("raw");

type PrintFn =
  | typeof console.debug
  | typeof console.info
  | typeof console.warn
  | typeof console.error;
const printBy =
  (fn: PrintFn) =>
  (msg: unknown, ...args: unknown[]) => {
    if (isTemplateString(msg)) {
      return fn(...msg.raw, ...args);
    }
    if (Array.isArray(msg)) {
      return fn(...msg, ...args);
    }
    return fn(msg, ...args);
  };

export const debug = printBy(console.debug);
export const info = printBy(console.info);
export const warn = printBy(console.warn);
export const error = printBy(console.error);

type GroupFn = typeof console.group | typeof console.groupCollapsed;
type LogFn = typeof info | typeof warn | typeof debug | typeof error;
type LogArgs = Parameters<LogFn>;
const groupBy =
  (groupFn: GroupFn) =>
  (fn: LogFn) =>
  (...label: unknown[]) =>
  (...msg: LogArgs) => {
    groupFn(...label);
    fn(...msg);
    console.groupEnd();
  };

export const group = groupBy(printBy(console.group));
export const groupCollapsed = groupBy(printBy(console.groupCollapsed));

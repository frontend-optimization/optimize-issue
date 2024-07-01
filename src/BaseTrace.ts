import { BreadcrumbTypes } from "./type";

export const TraceDataTypes = {
  LOG: "LOG",
};

export interface TraceDataLog {
  name: string;
  type: string;
  level: string;
  message: string;
  time: string;
  dataId?: string;
  category?: string;
  tag?: string;
}

export type TraceBreadcrumbs = BreadcrumbTypes[];

export const TraceDataSeverity = {
  Info: "Info",
  Warning: "Warning",
  Error: "Error",
};

export interface BaseTraceInterface {}

function dataTypes2BreadcrumbsType(type: string) {
  return "log";
}

function dataCategory2BreadcrumbsCategory(type: string) {
  return "log";
}

function getTimestamp() {
  return new Date().toISOString();
}

function hashCode(str: string) {
  let hash = 0;
  if (str.length === 0) {
    return hash.toString();
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString();
}

export class BaseLog implements BaseTraceInterface {
  public breadcrumb: TraceDataLog[] = [];
  public maxBreadcrumb = 100;

  protected send(log: TraceDataLog) {
    // if (CC_LOG)
    // if (JS_BRIDE)
    // if (IS_NATIVE)
    // if (IS_ELECTRON)
    if (document) {
      console.log(log);
    }
  }

  protected saveBreadcrumb(data: TraceDataLog) {
    this.breadcrumb.push(data);
    if (this.breadcrumb.length > this.maxBreadcrumb) {
      this.breadcrumb.shift();
    }
  }

  public log(log: TraceDataLog) {
    this.saveBreadcrumb({
      name: "customer-log",
      level: log.level,
      type: dataTypes2BreadcrumbsType(log.type),
      category: dataCategory2BreadcrumbsCategory(log.type),
      message: log.message,
      time: getTimestamp(),
    });
    this.send(log);
  }

  public info(message: string, tag?: string) {
    this.log({
      name: "customer-log",
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Info,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ""}`),
      tag,
    });
  }

  public warn(message: string, tag?: string) {
    this.log({
      name: "customer-log",
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Warning,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ""}`),
      tag,
    });
  }
  public error(message: string, tag?: string) {
    this.log({
      name: "customer-error",
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Error,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ""}`),
      tag,
    });
  }
}

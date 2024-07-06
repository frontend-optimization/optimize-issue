import { BreadcrumbTypes } from "./type";
// import log4js from "log4js";
import * as log4js from "log4js";
import * as path from "path";

class Logger {
  _logger: log4js.Logger | null;
  logPathName: string;
  config: {
    type: string;
    filename: any;
    encoding: string;
    layout: { type: string; pattern: string };
    //split by day
    pattern: string;
    // ends as '.log'
    keepFileExt: boolean;
    //insert the date at the tail of name
    alwaysIncludePattern: boolean;
  };
  constructor() {
    this._logger = null;
    this.logPathName = "logs";
    this.config = {
      type: "dateFile",
      filename: path.resolve(this.logPathName + "/info.log"),
      encoding: "utf-8",
      layout: {
        type: "pattern",
        pattern: "%d %p %h %m",
      },
      //split by day
      pattern: "yyyy-MM-dd",
      // ends as '.log'
      keepFileExt: true,
      //insert the date at the tail of name
      alwaysIncludePattern: true,
    };
  }

  init() {
    //define and configure logger
    log4js.configure({
      appenders: {
        default: this.config,
        //debug appender
        debugAppender: {
          ...this.config,
          filename: path.resolve(this.logPathName + "/debug.log"),
        },
        //debug filter
        debugFilter: {
          type: "logLevelFilter",
          appender: "debugAppender", // assign a specific appender
          level: "debug", // lowest log level to catch
          maxLevel: "debug", //highest log level to catch
        },
        //info filter
        infoFilter: {
          type: "logLevelFilter",
          appender: "default",
          level: "info",
          maxLevel: "info",
        },
        //warn filter
        warnFilter: {
          type: "logLevelFilter",
          appender: "default",
          level: "warn",
          maxLevel: "warn",
        },
        errorAppender: {
          ...this.config,
          filename: path.resolve(this.logPathName + "/error.log"),
        },
        //error filter
        errorFilter: {
          type: "logLevelFilter",
          appender: "errorAppender",
          level: "error",
          maxLevel: "fatal",
        },
      },

      categories: {
        default: {
          //default is a must
          appenders: ["infoFilter", "warnFilter", "errorFilter", "debugFilter"],
          level: "debuug",
        },
      },
    });

    //get logger，无category传参，进入default配置中
    this._logger = log4js.getLogger();
    this._logger.level = "debug";
  }
}

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
    console.log(log);
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

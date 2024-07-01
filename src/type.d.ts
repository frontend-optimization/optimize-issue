// ./typing.d.ts

export declare enum TraceTypes {
  // PVUV
  PAGE_VIEW = "PageView",
  // Event
  EVENT = "EVENT",
  // 性能
  PERF = "Perf",
  // 资源
  RESOURCE = "Resource",
  // 动作、行为类型
  ACTION = "Action",
  // 请求类型
  FETCH = "Fetch",
  // 代码错误
  CODE_ERROR = "CodeError",
  // 日志
  CONSOLE = "Console",
  // 其它
  CUSTOMER = "Customer",
}

// 全链路日志基类
type BaseTrace = {
  // 唯一ID，用户侧生成
  traceId: string;
  // 日志类型
  type: TraceTypes;
  // 日志产生时间
  createdAt: string;
  // 日志最后更新时间
  updatedAt: string;
};

export declare enum BreadcrumbsCategories {
  Http = "http",
  User = "user",
  Debug = "debug",
  Exception = "exception",
  Lifecycle = "lifecycle",
}

export declare enum BreadcrumbTypes {
  ROUTE = "Route",
  CLICK = "UI.Click",
  CONSOLE = "Console",
  FETCH = "Fetch",
  UNHANDLEDREJECTION = "Unhandledrejection",
  RESOURCE = "Resource",
  CODE_ERROR = "Code Error",
  CUSTOMER = "Customer",
}

export type DashboardProp = {
  eui: string;
  isLive?: boolean;
  timeRange: Date[];
};

export type TelemetryCardProps = {
  isLive?: boolean;
  modalSize: string;
  eui: string;
  timeRange: Date[];
};

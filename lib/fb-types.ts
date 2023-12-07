export interface MetricsResponse {
  data: Metric[];
}

export interface Metric {
  name: string;
  values: MetricValue[];
  period: string;
  description: string;
  title: string;
  id: string;
}

export interface MetricValue {
  value: number;
  end_time?: string;
}

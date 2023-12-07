export interface MetricsResponse {
  data: Metric[];
}

export interface Metric {
  name: string;
  values: MetricValue[] | MetricValues[];
  period: string;
  description: string;
  title: string;
  id: string;
}

export interface MetricValue {
  value: number;
}

export interface MetricValues {
  value: number;
  end_time: string;
}

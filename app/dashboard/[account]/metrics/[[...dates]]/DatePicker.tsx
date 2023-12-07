"use client";
import { DateRangePicker, DateRangePickerValue } from "@tremor/react";
import { enUS } from "date-fns/locale";
import { formatISO, parseISO } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function MetricsDateRangePicker({
  account,
  dates,
}: {
  account: string;
  dates: string[];
}) {
  const router = useRouter();
  const [value, setValue] = useState<DateRangePickerValue>({
    from: dates?.at(0) ? parseISO(dates[0]) : new Date(),
    to: dates?.at(1) ? parseISO(dates[1]) : new Date(),
  });

  function handleDataRangePickerChange(newRange: DateRangePickerValue) {
    setValue(newRange);
    if (!newRange.from || !newRange.to) return;

    const from = formatISO(newRange.from, {
      representation: "date",
    });
    const to = formatISO(newRange.to, {
      representation: "date",
    });

    router.push(`/dashboard/${account}/metrics/${from}/${to}`);
  }

  return (
    <DateRangePicker
      value={value}
      onValueChange={handleDataRangePickerChange}
      locale={enUS}
      selectPlaceholder="Select range"
      color="rose"
    ></DateRangePicker>
  );
}

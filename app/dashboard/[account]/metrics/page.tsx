import Image from "next/image";
import { getMetrics } from "./actions";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AreaChart,
  BadgeDelta,
  Callout,
  Card,
  SparkAreaChart,
  Text,
  Title,
} from "@tremor/react";
import { MetricsDateRangePicker } from "./DatePicker";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function Page({
  params,
  searchParams,
}: {
  params: { account: string };
  searchParams: any;
}) {
  let dates: string[] = [];
  if (searchParams.from && searchParams.to)
    dates = [searchParams.from, searchParams.to];

  const { profile, metrics, error } = await getMetrics(params.account, dates);

  return (
    <div className="relative h-full ">
      <div className="relative pt-6 pb-16 ">
        {profile && (
          <div className="mx-auto max-w-[700px] p-2 flex flex-col items-center">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
              <Image
                src={profile?.profile_picture_url}
                alt={"Account profile picture"}
                width={200}
                height={200}
                className="h-full object-cover"
              />
            </div>
            <h1 className="mt-4 text-center text-lg">{params.account}</h1>
            <div className="flex flex-col gap-4 w-full mt-12">
              <div className="flex items-center justify-between">
                <h2 className="text-zinc-600 text-lg">Metrics</h2>
                <MetricsDateRangePicker
                  account={params.account}
                  dates={dates}
                />
              </div>
              {error && (
                <div>
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.error.message}</AlertDescription>
                  </Alert>
                </div>
              )}
              {metrics &&
                metrics.map((m) => {
                  const delta =
                    (m.metrics?.at(-1)?.metric ?? 0) -
                    (m.metrics?.at(0)?.metric ?? 0);
                  return (
                    <Accordion key={m.name}>
                      <AccordionHeader className="px-4 py-3.5">
                        <div className="w-full flex items-center justify-between mx-auto">
                          <div className="flex items-center space-x-2.5">
                            <Title>{m.title}</Title>
                          </div>
                          {m.metrics && (
                            <SparkAreaChart
                              data={m.metrics}
                              categories={[m.name]}
                              index={"date"}
                              colors={[m.color as any]}
                              className="h-10 w-36"
                            />
                          )}
                        </div>

                        <div className="flex items-center space-x-2.5 ml-4">
                          <BadgeDelta
                            deltaType={delta > 0 ? "increase" : "decrease"}
                          >
                            {`${delta}`}
                          </BadgeDelta>
                        </div>
                      </AccordionHeader>
                      <AccordionBody>
                        {m.metrics && (
                          <AreaChart
                            className="h-72 mt-8"
                            data={m.metrics}
                            index="date"
                            categories={[m.name]}
                            colors={[m.color as any]}
                            showLegend={false}
                            //   valueFormatter={valueFormatter}
                          />
                        )}
                      </AccordionBody>
                    </Accordion>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import Image from "next/image";
import { getMetrics } from "./actions";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AreaChart,
  Card,
  SparkAreaChart,
  Text,
  Title,
} from "@tremor/react";
import { MetricsDateRangePicker } from "./DatePicker";

export default async function Page({
  params,
}: {
  params: { account: string; dates: string[] };
}) {
  const { profile, metrics, error } = await getMetrics(params.account);

  return (
    <div className="relative h-full ">
      <div className="relative pt-6 pb-16 ">
        {profile && (
          <div className="mx-auto max-w-[700px] p-2 flex flex-col items-center">
            <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
              <Image
                src={profile?.profile_picture_url}
                alt={"Account profile picture"}
                width={400}
                height={400}
                className=" h-[309px] object-cover"
              />
            </div>
            <h1 className="mt-4 text-center text-lg">{params.account}</h1>
            <div className="flex flex-col gap-4 w-full mt-12">
              <div className="flex items-center justify-between">
                <h2 className="text-zinc-600 text-lg">Metrics</h2>
                <MetricsDateRangePicker
                  account={params.account}
                  dates={params.dates}
                />
              </div>
              {metrics &&
                metrics.map((m) => (
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
                        <span className="font-medium rounded text-gray-700">
                          {m.metrics?.at(-1)?.metric}
                        </span>
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
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

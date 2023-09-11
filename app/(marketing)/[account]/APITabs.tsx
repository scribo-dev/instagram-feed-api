"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";

const APITabs = ({ account }: { account: string }) => (
  <Tabs.Root
    className="flex flex-col bg-slate-200 rounded-md mt-12 overflow-hidden"
    defaultValue="tab1"
  >
    <div className="bg-slate-100">
      <Tabs.List
        className="shrink-0 flex border-b w-[200px]"
        aria-label="api access options"
      >
        <Tabs.Trigger
          className="p-3  flex-1 flex items-center justify-center text-sm leading-none select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:font-bold data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-slate-300 data-[state=active]:focus:relative  data-[state=active]:focus:shadow-slate-400 outline-none cursor-default"
          value="tab1"
        >
          url
        </Tabs.Trigger>
        <Tabs.Trigger
          className="p-3  flex-1 flex items-center justify-center text-sm leading-none select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:font-bold data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-slate-300 data-[state=active]:focus:relative  data-[state=active]:focus:shadow-slate-400 outline-none cursor-default"
          value="tab2"
        >
          curl
        </Tabs.Trigger>
      </Tabs.List>
    </div>
    <Tabs.Content
      className="grow p-5  rounded-b-md outline-none text-sm text-gray-700 leading-3"
      value="tab1"
    >
      https://instagram-api.scribo.dev/api/{account}
    </Tabs.Content>
    <Tabs.Content
      className="grow p-5  rounded-b-md outline-none text-sm text-gray-700 leading-3"
      value="tab2"
    >
      curl -i https://instagram-api.scribo.dev/api/{account}
    </Tabs.Content>
  </Tabs.Root>
);

export default APITabs;

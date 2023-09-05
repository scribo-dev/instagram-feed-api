"use client";
import dynamic from "next/dynamic";
//@ts-ignore
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

import "swagger-ui-react/swagger-ui.css";

type Props = {
  spec: Record<string, any>;
};

function ReactSwagger({ spec }: Props) {
  //@ts-ignore
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;

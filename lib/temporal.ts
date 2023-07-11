import {
  Connection,
  ConnectionOptions,
  WorkflowClient,
} from "@temporalio/client";

import Long from "long";
import protobufjs from "protobufjs";

protobufjs.util.Long = Long;
protobufjs.configure();

export async function getConnection() {
  let connectionParams: ConnectionOptions = {
    address: process.env.TEMPORAL_URL,
  };
  // if (process.env.NODE_ENV === "production")
  connectionParams = { ...connectionParams, tls: {} };

  console.log(connectionParams);

  return Connection.connect(connectionParams);
}

export async function getWorkflowClient() {
  let connection = await getConnection();

  return new WorkflowClient({
    connection,
  });
}

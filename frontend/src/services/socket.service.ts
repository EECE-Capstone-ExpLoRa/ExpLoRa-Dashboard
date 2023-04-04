import { io } from "socket.io-client";

export const TEST_DEVICE_EUI = "00-80-00-00-04-05-b6-b1";

const socket = io("http://localhost:8080/socket/timestream", {
  transports: ["websocket", "polling"],
  forceNew: true,
});

const CONNECTION_EVENT = "connect_to_device";

export const getSocket = () => {
  return socket;
};

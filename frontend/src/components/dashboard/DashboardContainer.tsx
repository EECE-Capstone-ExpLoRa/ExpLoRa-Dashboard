import { useState } from "react";
import Dashboard from "./Dashboard";
import DashboardFooter from "./DashboardFooter";
import { getSocket } from "../../services/socket.service";

const DashboardContainer = () => {
  const [currentEui, setCurrentEui] = useState("");

  const setAndRegisterDevice = (deviceEui: string) => {
    const socket = getSocket();
    setCurrentEui(deviceEui);
    socket.emit("register_device", { deviceEui });
  };

  return (
    <>
      <Dashboard eui={currentEui} />
      <DashboardFooter onDeviceEuiChange={setAndRegisterDevice} />
    </>
  );
};

export default DashboardContainer;

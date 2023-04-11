import { useState } from "react";
import Dashboard from "./Dashboard";
import DashboardFooter from "./DashboardFooter";
import { getSocket } from "../../services/socket.service";
import { getRocketTestingDateTimes } from "../../utils/utils";

const DashboardContainer = () => {
  const [currentEui, setCurrentEui] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [value, onChange] = useState(getRocketTestingDateTimes());

  const setAndRegisterDevice = (deviceEui: string) => {
    const socket = getSocket();
    setCurrentEui(deviceEui);
    socket.emit("register_device", { deviceEui });
  };

  const toggleLiveDashboard = (newLiveValue: boolean) => {
    setIsLive(newLiveValue);
  };

  return (
    <>
      <Dashboard eui={currentEui} isLive={isLive} timeRange={value} />
      <DashboardFooter
        onDeviceEuiChange={setAndRegisterDevice}
        onToggleLive={toggleLiveDashboard}
        isLive={isLive}
        onDatePickerChange={onChange}
        datePickerValue={value}
      />
    </>
  );
};

export default DashboardContainer;

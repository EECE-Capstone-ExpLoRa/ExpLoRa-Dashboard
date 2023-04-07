import { useState } from "react";
import Dashboard from "./Dashboard"
import DashboardFooter from "./DashboardFooter"

const DashboardContainer = () => {
    const [currentEui, setCurrentEui] = useState('');
    return (
        <>
        <Dashboard eui={currentEui}/>
        <DashboardFooter onDeviceEuiChange={setCurrentEui}/>
        </>
    )
};

export default DashboardContainer;

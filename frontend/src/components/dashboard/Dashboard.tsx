import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import PressureChart from "../charts/PressureChart";
import AccelerationCard from "../charts/AccelerationCard";
import TemperatureCard from "../charts/TemperatureCard";
import Map from "../charts/Map";
import AirQualityCard from "../charts/AirQualityCard";
import AircraftMotionCard from "../charts/AircraftMotionChart";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, fetchUserDevices } from "../../services/user.service";
import { useEffect } from "react";
import { DashboardProp } from "../../utils/dashboardProps";

const Dashboard = ({eui}: DashboardProp) => {
  const navigate = useNavigate();  
  const user = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false
  });

  const devices = useQuery({
    queryKey: ['userDevices'],
    queryFn: fetchUserDevices
});

  useEffect(() => {
    const goToHomePage = () =>{
      navigate('/signin');
    };
    if (!user.data && user.isError) {
      goToHomePage();
    }
  });

  if (devices.isError) {
    return <span>An Error Occurred</span>
  }

  if (user.isLoading || devices.isLoading) {
    return <span>Loading...</span>
  }

  if (devices.data.length === 0) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <Heading>No devices registered yet, consider adding a device below</Heading>
      </Box>
    );
  };

  return (
    <Box backgroundColor="gray.100">
      <Grid
        templateRows="repeat(3, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={4}
        height="100vh"
        paddingX={4}
        paddingY={4}
      >
        <GridItem rowSpan={1} colSpan={1}>
          <AirQualityCard modalSize="xl" eui={eui} />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Map eui={eui} />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <AccelerationCard modalSize="full" eui={eui} />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <PressureChart modalSize="full" eui={eui} />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <TemperatureCard modalSize="full" eui={eui} />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <AircraftMotionCard modalSize="full" eui={eui}  />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;

import { Box, Grid, GridItem } from "@chakra-ui/react";
import PressureChart from "../charts/PressureChart";
import AccelerationCard from "../charts/AccelerationChart"
import TemperatureChart from "../charts/TemperatureChart";
import Map from "../charts/Map";
import AirQualityCard from "../charts/AirQualityChart";
import DashboardFooter from "./DashboardFooter";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../../services/user.service";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();  
  const user = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false
  });

  useEffect(() => {
    const goToHomePage = () =>{
      navigate('/signin');
    };
    if (user.isError) {
      goToHomePage();
    }
  });

  if (user.isLoading) {
    return <span>Loading...</span>
  }

  return (
      <Box backgroundColor="gray.100">
        <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(3, 1fr)" gap={4} height="100vh" paddingX={4} paddingY={4} >
          <GridItem rowSpan={1} colSpan={1}>
            <AirQualityCard />
          </GridItem>
          <GridItem rowSpan={2} colSpan={1}>
            <Map />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <AccelerationCard />
          </GridItem>
          <GridItem rowSpan={2} colSpan={1}>
            <PressureChart />
          </GridItem>
          <GridItem rowSpan={2} colSpan={1}>
            <TemperatureChart />
          </GridItem>
        </Grid>
        <DashboardFooter />
      </Box>
  );
}

export default Dashboard
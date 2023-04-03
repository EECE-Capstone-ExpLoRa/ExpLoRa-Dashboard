import { Box, Grid, GridItem } from "@chakra-ui/react";
import PressureChart from "../charts/PressureChart";
import AccelerationCard from "../charts/AccelerationCard"
import TemperatureCard from "../charts/TemperatureCard";
import Map from "../charts/Map";
import AirQualityCard from "../charts/AirQualityCard";
import AircraftMotionCard from "../charts/AircraftMotionChart";

const Dashboard = () => {
  return (
      <Box backgroundColor="gray.100">
        <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(3, 1fr)" gap={4} height="100vh" paddingX={4} paddingY={4} >
          <GridItem rowSpan={1} colSpan={1}>
            <AirQualityCard />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <Map />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <AccelerationCard />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <PressureChart />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <TemperatureCard />
          </GridItem>
          <GridItem rowSpan={1} colSpan={1}>
            <AircraftMotionCard />
          </GridItem>
        </Grid>
      </Box>
  );
}

export default Dashboard
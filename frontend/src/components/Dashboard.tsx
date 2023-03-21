import { Box, Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import AirQualityChart from "./charts/AirQualityChart";
import PressureChart from "./charts/PressureChart";
import AccelerationCard from "./charts/AccelerationChart"
import TemperatureChart from "./charts/TemperatureChart";
import Map from "./charts/Map";
import NavBar from "./NavBar";


const Dashboard = () => {
  return (
    <div>
      <NavBar />
      <Box backgroundColor="gray.100">
        <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(3, 1fr)" gap={4} height="100vh" paddingX={4} paddingY={4} >
          <GridItem rowSpan={1} colSpan={1}>
            <AirQualityChart />
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
      </Box>
    </div>

  );
}


export default Dashboard
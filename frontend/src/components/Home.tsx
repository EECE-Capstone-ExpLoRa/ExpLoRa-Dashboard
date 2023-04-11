import { Box, Flex, Image } from "@chakra-ui/react";
import React from "react";
// importing Link from react-router-dom to navigate to
// different end points.

// const Home = () => {
//   return (
//     <Flex
//       direction="column"
//       align="center"
//       justify="flex-start"
//       backgroundColor="gray.100"
//       h="100vh"
//       textColor="brand.500"
//     >
//       <Flex margin='14px 0px' padding='0px 8px'>
//         <Image src="/Explora-Name.svg" height='16' />
//       </Flex>
//     </Flex>
//   );
// };

const Home = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
      backgroundColor="gray.100"
      h="100vh"
      textColor="brand.500"
    >
      <Flex margin='14px 0px' padding='0px 8px'>
        <Image src="/Explora-Name.svg" height='48' />
      </Flex>
      <Box maxWidth="800px" fontSize="xl" padding="8px" textAlign="center">
        ExpLoRa is a telemetry system based on LoRaWAN technology designed for high speed objects such as model rockets and race cars.
      </Box>
      <Box maxWidth="800px" fontSize="xl" padding="8px" textAlign="center">
        With ExpLoRa, you can easily track the location, altitude, acceleration, and more of your vehicles in real time. Our system is easy to use, affordable, and reliable, making it the perfect solution for hobbyists and professionals alike. Make an account and add your devices to get started!
      </Box>
      <Flex margin='14px 0px' padding='0px 8px'>
        <Image src="/homepage_rocket.svg" height='48' />
      </Flex>
      
    </Flex>
  );
};

export default Home;

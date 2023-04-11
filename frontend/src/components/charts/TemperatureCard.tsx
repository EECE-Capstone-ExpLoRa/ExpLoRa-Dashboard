import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import { ReactElement, useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getSocket } from "../../services/socket.service";
import { TimestreamSocketResponse } from "../../utils/types";
import { getEventName, getRecentData } from "../../utils/utils";
import { TelemetryCardProps } from "../../utils/dashboardProps";

const TemperatureCard = ({
  modalSize,
  eui,
}: TelemetryCardProps): ReactElement => {
  const [open, setOpen] = useState(true);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const expandableContent = () => {
    return (
      <Box
        width="full"
        height="250px"
        padding={4}
        backgroundColor="white"
        shadow={"md"}
        borderTop={2}
      >
        <TemperatureChart deviceEui={eui} />
      </Box>
    );
  };

  const renderToggleButton = () => {
    if (open) {
      return (
        <Image
          onClick={() => setOpen(!open)}
          width={4}
          height={4}
          src="/minimize.png"
        />
      );
    }
    return (
      <Image
        onClick={() => setOpen(!open)}
        width={4}
        height={4}
        src="/maximize.png"
      />
    );
  };

  const renderModalOpenButton = () => {
    return (
      <Image
        onClick={onModalOpen}
        marginLeft={5}
        width={5}
        height={5}
        src="/popout.png"
      />
    );
  };

  return (
    <>
      <Box border={2} rounded="md">
        <Flex
          cursor="pointer"
          roundedTop="md"
          width="full"
          padding={4}
          shadow="sm"
          backgroundColor="white"
          justify="space-between"
        >
          <HStack>
            {renderToggleButton()}
            <Text fontSize="sm">Temperature</Text>
          </HStack>
          <HStack>{renderModalOpenButton()}</HStack>
        </Flex>
        {open && expandableContent()}
      </Box>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Temperature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box height="600px">
              <TemperatureChart deviceEui={eui} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const TemperatureChart = ({
  deviceEui,
}: {
  deviceEui: string;
}): ReactElement => {
  const [temperatureData, setTemperatureData] =
    useState<TimestreamSocketResponse>([]);

  useEffect(() => {
    const socket = getSocket();
    socket.on(getEventName(deviceEui, "temperature"), (res) => {
      setTemperatureData((oldData) => {
        let allData = [...oldData, res.datapoint];

        return getRecentData(allData);
      });
    });
  }, [deviceEui]);

  return (
    <ResponsiveContainer height={"100%"}>
      <AreaChart
        data={temperatureData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          height={50}
          dataKey="timestamp"
          domain={["auto", "auto"]}
          name="Time"
          tickFormatter={(unixTime) => moment(unixTime).format("HH:mm:ss Do")}
          type="number"
        />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#25386A" fill="#25386A" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TemperatureCard;

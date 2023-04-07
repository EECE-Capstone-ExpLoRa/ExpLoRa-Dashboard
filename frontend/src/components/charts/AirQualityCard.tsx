import { ReactElement, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import {
  Box,
  Select,
  Image,
  Text,
  useDisclosure,
  Flex,
  HStack,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { AirQuality, TimestreamSocketResponse } from "../../utils/types";
import { getSocket } from "../../services/socket.service";
import { getEventName, getRecentData } from "../../utils/utils";
import { TelemetryCardProps } from "../../utils/dashboardProps";

const AirQualityCard = ({modalSize, eui}: TelemetryCardProps) => {
  const [open, setOpen] = useState(true);
  const [airQualityType, setAirQualityType] = useState<string>(
    AirQuality.PM_1P0
  );
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
        <AirQualityChart airQualityType={airQualityType} />
      </Box>
    );
  };

  const renderDirectionSelect = (size: string) => {
    return (
      <Select
        value={airQualityType}
        size={size}
        onChange={(e) => setAirQualityType(e.target.value)}
      >
        <option value={AirQuality.PM_1P0}>PM 1.0</option>
        <option value={AirQuality.PM_2P5}>PM 2.5</option>
        <option value={AirQuality.PM_4P0}>PM 4.0</option>
        <option value={AirQuality.PM_10P0}>PM 10.0</option>
        <option value={AirQuality.Humidity}>Ambient Humidity</option>
        <option value={AirQuality.Temperature}>Ambient Temperature</option>
        <option value={AirQuality.VOC}>VOC Index</option>
        <option value={eui}>{eui}</option>

      </Select>
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
      <Image onClick={onModalOpen} width={5} height={5} src="/popout.png" />
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
            <Text fontSize="sm">Air Quality</Text>
          </HStack>
          <HStack>
            {renderDirectionSelect("xs")}
            {renderModalOpenButton()}
          </HStack>
        </Flex>
        {open && expandableContent()}
      </Box>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Air Quality</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box height="500px">
              <AirQualityChart airQualityType={airQualityType} />
            </Box>
            {renderDirectionSelect("sm")}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const AirQualityChart = ({
  airQualityType,
}: {
  airQualityType: string;
}): ReactElement => {
  const [pm1p0Data, setPm1p0Data] = useState<TimestreamSocketResponse>([]);
  const [pm2p5Data, setPm2p5Data] = useState<TimestreamSocketResponse>([]);
  const [pm4p0Data, setPm4p0Data] = useState<TimestreamSocketResponse>([]);
  const [pm10p0Data, setPm10p0Data] = useState<TimestreamSocketResponse>([]);
  const [humidityData, setHumidityData] = useState<TimestreamSocketResponse>(
    []
  );
  const [temperatureData, setTemperatureData] =
    useState<TimestreamSocketResponse>([]);
  const [vocData, setVocData] = useState<TimestreamSocketResponse>([]);

  useEffect(() => {
    const socket = getSocket();
    socket.on(getEventName(AirQuality.PM_1P0), (res) => {
      setPm1p0Data((oldData) => {
        const allData = [...oldData, res.datapoint];

        return getRecentData(allData);
      });
    });

    socket.on(getEventName(AirQuality.PM_2P5), (res) => {
      setPm2p5Data((oldData) => {
        const allData = [...oldData, res.datapoint];

        return getRecentData(allData);
      });
    });

    socket.on(getEventName(AirQuality.PM_4P0), (res) => {
      setPm4p0Data((oldData) => {
        const allData = [...oldData, res.datapoint];

        return getRecentData(allData);
      });
    });

    socket.on(getEventName(AirQuality.PM_10P0), (res) => {
      setPm10p0Data((oldData) => {
        const allData = [...oldData, res.datapoint];

        return getRecentData(allData);
      });
    });

    socket.on(getEventName(AirQuality.Humidity), (res) => {
      setHumidityData((oldData) => {
        const allData = [...oldData, res.datapoint];

        return getRecentData(allData);
      });
    });

    socket.on(getEventName(AirQuality.Temperature), (res) => {
      setTemperatureData((oldData) => {
        const allData = [...oldData, res.datapoint];

        return getRecentData(allData);
      });
    });

    socket.on(getEventName(AirQuality.VOC), (res) => {
      setVocData((oldData) => {
        const allData = [...oldData, res.datapoint];

        return getRecentData(allData);
      });
    });
  }, []);

  const getAirQualityData = () => {
    switch (airQualityType) {
      case AirQuality.PM_1P0:
        return pm1p0Data;

      case AirQuality.PM_2P5:
        return pm2p5Data;

      case AirQuality.PM_4P0:
        return pm4p0Data;

      case AirQuality.PM_10P0:
        return pm10p0Data;

      case AirQuality.Humidity:
        return humidityData;

      case AirQuality.Temperature:
        return temperatureData;

      case AirQuality.VOC:
        return vocData;

      default:
        return [];
    }
  };

  return (
    <ResponsiveContainer width={"99%"} height={"100%"}>
      <LineChart
        data={getAirQualityData()}
        margin={{
          top: 5,
          right: 20,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          domain={["auto", "auto"]}
          name="Time"
          tickFormatter={(unixTime) => moment(unixTime).format("HH:mm Do")}
          type="number"
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#25386A"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AirQualityCard;

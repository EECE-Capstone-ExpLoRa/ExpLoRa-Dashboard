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
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import moment from "moment";
import {
  AccelerationDirection,
  TimestreamSocketResponse,
} from "../../utils/types";
import { getSocket } from "../../services/socket.service";
import { getEventName, getRecentData } from "../../utils/utils";
import { TelemetryCardProps } from "../../utils/dashboardProps";
import { getData } from "../../services/timestream.service";

const AccelerationCard = ({
  modalSize,
  eui,
  isLive,
  timeRange,
}: TelemetryCardProps) => {
  const [open, setOpen] = useState(true);
  const [accelerationDir, setAccelerationDir] = useState<string>(
    AccelerationDirection.X
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
        <AccelerationChart
          deviceEui={eui}
          accelerationDir={accelerationDir}
          timeRange={timeRange}
          isLive={isLive}
        />
      </Box>
    );
  };

  const renderDirectionSelect = (size: string) => {
    return (
      <Select
        value={accelerationDir}
        size={size}
        onChange={(e) => setAccelerationDir(e.target.value)}
      >
        <option value={AccelerationDirection.X}>X</option>
        <option value={AccelerationDirection.Y}>Y</option>
        <option value={AccelerationDirection.Z}>Z</option>
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
            <Text fontSize="sm">Acceleration</Text>
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
          <ModalHeader>Acceleration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box height="600px">
              <AccelerationChart
                isLive={isLive}
                deviceEui={eui}
                accelerationDir={accelerationDir}
                timeRange={timeRange}
              />
            </Box>
            {renderDirectionSelect("sm")}
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

export const AccelerationChart = ({
  accelerationDir,
  timeRange,
  deviceEui,
  isLive,
}: {
  accelerationDir: string;
  timeRange: Date[];
  deviceEui: string;
  isLive?: boolean;
}) => {
  const [accelerationXData, setAccelerationXData] =
    useState<TimestreamSocketResponse>([]);
  const [accelerationYData, setAccelerationYData] =
    useState<TimestreamSocketResponse>([]);
  const [accelerationZData, setAccelerationZData] =
    useState<TimestreamSocketResponse>([]);

  const [accelerationXHistory, setAccelerationXHistory] = useState([]);
  const [accelerationYHistory, setAccelerationYHistory] = useState([]);
  const [accelerationZHistory, setAccelerationZHistory] = useState([]);

  const [minTimeQueryParam, maxTimeQueryParam] = timeRange;

  useEffect(() => {
    if (isLive) {
      const socket = getSocket();

      socket.on(
        getEventName(deviceEui, AccelerationDirection.X),
        (res: any) => {
          setAccelerationXData((oldData) => {
            let allData = [...oldData, res.datapoint];

            return getRecentData(allData);
          });
        }
      );

      socket.on(
        getEventName(deviceEui, AccelerationDirection.Y),
        (res: any) => {
          setAccelerationYData((oldData) => {
            let allData = [...oldData, res.datapoint];

            return getRecentData(allData);
          });
        }
      );

      socket.on(getEventName(deviceEui, AccelerationDirection.Z), (res) => {
        setAccelerationZData((oldData) => {
          let allData = [...oldData, res.datapoint];

          return getRecentData(allData);
        });
      });
    } else {
      getData(
        deviceEui,
        AccelerationDirection.X,
        minTimeQueryParam.getTime(),
        maxTimeQueryParam.getTime()
      ).then((res) => {
        setAccelerationXHistory(res);
      });
      getData(
        deviceEui,
        AccelerationDirection.Y,
        minTimeQueryParam.getTime(),
        maxTimeQueryParam.getTime()
      ).then((res) => {
        setAccelerationYHistory(res);
      });
      getData(
        deviceEui,
        AccelerationDirection.Z,
        minTimeQueryParam.getTime(),
        maxTimeQueryParam.getTime()
      ).then((res) => {
        setAccelerationZHistory(res);
      });
    }
  }, [deviceEui, isLive, minTimeQueryParam, maxTimeQueryParam]);

  const getAccelerationData = () => {
    if (isLive) {
      switch (accelerationDir) {
        case AccelerationDirection.X:
          return accelerationXData;

        case AccelerationDirection.Y:
          return accelerationYData;

        case AccelerationDirection.Z:
          return accelerationZData;

        default:
          return [];
      }
    } else {
      switch (accelerationDir) {
        case AccelerationDirection.X:
          return accelerationXHistory;

        case AccelerationDirection.Y:
          return accelerationYHistory;

        case AccelerationDirection.Z:
          return accelerationZHistory;

        default:
          return [];
      }
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={getAccelerationData()}
        margin={{
          top: 5,
          right: 20,
          left: 5,
          bottom: 5,
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
        <YAxis height={50} />
        <Tooltip />
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

export default AccelerationCard;

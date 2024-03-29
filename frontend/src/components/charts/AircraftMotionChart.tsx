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
import moment from "moment";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AircraftAxis, TimestreamSocketResponse } from "../../utils/types";
import { getEventName, getRecentData } from "../../utils/utils";
import { getSocket } from "../../services/socket.service";
import { TelemetryCardProps } from "../../utils/dashboardProps";
import { getData } from "../../services/timestream.service";

const AircraftMotionCard = ({
  modalSize,
  eui,
  isLive,
  timeRange,
}: TelemetryCardProps) => {
  const [open, setOpen] = useState(true);
  const [axis, setAxis] = useState<string>(AircraftAxis.Yaw);

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const expandableContent = () => {
    return (
      <Box
        width="full"
        height="245px"
        padding={4}
        backgroundColor="white"
        shadow={"md"}
        borderTop={2}
      >
        <AircraftMotionChart
          deviceEui={eui}
          axis={axis}
          isLive={isLive}
          timeRange={timeRange}
        />
      </Box>
    );
  };

  const renderAxisSelect = (size: string) => {
    return (
      <Select
        value={axis}
        size={size}
        onChange={(e) => setAxis(e.target.value)}
      >
        <option value={AircraftAxis.Yaw}>Yaw</option>
        <option value={AircraftAxis.Pitch}>Pitch</option>
        <option value={AircraftAxis.Roll}>Roll</option>
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
            <Text fontSize="sm">Aircraft Motion</Text>
          </HStack>
          <HStack>
            {renderAxisSelect("xs")}
            {renderModalOpenButton()}
          </HStack>
        </Flex>
        {open && expandableContent()}
      </Box>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Aircraft Motion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box height="600px">
              <AircraftMotionChart
                deviceEui={eui}
                axis={axis}
                isLive={isLive}
                timeRange={timeRange}
              />
            </Box>
            {renderAxisSelect("sm")}
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

export const AircraftMotionChart = ({
  axis,
  deviceEui,
  isLive,
  timeRange,
}: {
  axis: string;
  deviceEui: string;
  isLive?: boolean;
  timeRange: Date[];
}) => {
  const [yawData, setYawData] = useState<TimestreamSocketResponse>([]);
  const [pitchData, setPitchData] = useState<TimestreamSocketResponse>([]);
  const [rollData, setRollData] = useState<TimestreamSocketResponse>([]);
  const [yawHistory, setYawHistory] = useState<TimestreamSocketResponse>([]);
  const [pitchHistory, setPitchHistory] = useState<TimestreamSocketResponse>(
    []
  );
  const [rollHistory, setRollHistory] = useState<TimestreamSocketResponse>([]);
  const [minTimeQueryParam, maxTimeQueryParam] = timeRange;

  useEffect(() => {
    if (isLive) {
      const socket = getSocket();

      socket.on(getEventName(deviceEui, AircraftAxis.Yaw), (res) => {
        setYawData((oldData) => {
          const allData = [...oldData, res.datapoint];

          return getRecentData(allData);
        });
      });

      socket.on(getEventName(deviceEui, AircraftAxis.Pitch), (res) => {
        setPitchData((oldData) => {
          const allData = [...oldData, res.datapoint];

          return getRecentData(allData);
        });
      });

      socket.on(getEventName(deviceEui, AircraftAxis.Roll), (res) => {
        setRollData((oldData) => {
          const allData = [...oldData, res.datapoint];

          return getRecentData(allData);
        });
      });
    } else {
      getData(
        deviceEui,
        AircraftAxis.Yaw,
        minTimeQueryParam.getTime(),
        maxTimeQueryParam.getTime()
      ).then((res) => {
        setYawHistory(res);
      });
      getData(
        deviceEui,
        AircraftAxis.Pitch,
        minTimeQueryParam.getTime(),
        maxTimeQueryParam.getTime()
      ).then((res) => {
        setPitchHistory(res);
      });
      getData(
        deviceEui,
        AircraftAxis.Roll,
        minTimeQueryParam.getTime(),
        maxTimeQueryParam.getTime()
      ).then((res) => {
        setRollHistory(res);
      });
    }
  }, [deviceEui, isLive]);

  const getYawPitchRollData = () => {
    if (isLive) {
      switch (axis) {
        case AircraftAxis.Yaw:
          return yawData;

        case AircraftAxis.Pitch:
          return pitchData;

        case AircraftAxis.Roll:
          return rollData;

        default:
          return [];
      }
    } else {
      switch (axis) {
        case AircraftAxis.Yaw:
          return yawHistory;

        case AircraftAxis.Pitch:
          return pitchHistory;

        case AircraftAxis.Roll:
          return rollHistory;

        default:
          return [];
      }
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={getYawPitchRollData()}
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

export default AircraftMotionCard;

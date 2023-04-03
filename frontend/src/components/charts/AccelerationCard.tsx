import { Box, Button, Flex, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Select, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import moment from 'moment'
// @ts-ignore
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'
import { TimeIcon } from '@chakra-ui/icons'
import { AccelerationDirection, TimestreamAccelerationsResponse, TimestreamSocketResponse } from '../../utils/types';
import { registerAccelerationSocket } from '../../services/socket.service';


const AccelerationCard = ({modalSize="full"}: any) => {
  const [open, setOpen] = useState(true)
  const [accelerationDir, setAccelerationDir] = useState<string>(AccelerationDirection.X)
  const now = new Date()
  const [value, onChange] = useState([new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14), now])
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose} = useDisclosure() 

  const expandableContent = () => {
    return (
      <Box width="full" height="250px" padding={4} backgroundColor="white" shadow={"md"} borderTop={2}>
        <AccelerationChart accelerationDir={accelerationDir} timeRange={value} />
      </Box>
    );
  }

  const renderDirectionSelect = (size: string) => {
    return (
      <Select value={accelerationDir} size={size} onChange={(e) => setAccelerationDir(e.target.value)}>
        <option value={AccelerationDirection.X}>X</option>
        <option value={AccelerationDirection.Y}>Y</option>
        <option value={AccelerationDirection.Z}>Z</option>
        <option value={AccelerationDirection.All}>All</option>
      </Select>
    );
  }

  const renderDateTimeRangeSelector = () => {
    return (
      <Popover placement='bottom-start'>
        <PopoverTrigger>
          <TimeIcon />
        </PopoverTrigger>
        <PopoverContent width="425px">
        <PopoverCloseButton />
        <PopoverBody>
          <DateTimeRangePicker onChange={onChange} value={value} closeWidgets={false} clearIcon={null} calendarIcon={null} />
        </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }

  const renderToggleButton = () => {
    if (open) {
      return (
        <Image onClick={() => setOpen(!open)} width={4} height={4} src="/minimize.png" />
      );
    }
    return (
      <Image onClick={() => setOpen(!open)} width={4} height={4} src="/maximize.png" />
    );
  }

  const renderModalOpenButton = () => {
    return (
      <Image onClick={onModalOpen} marginLeft={5} width={5} height={5} src="/popout.png" />
    );
  }

  return (
    <>
      <Box border={2} rounded="md">
        <Flex cursor="pointer" roundedTop="md" width="full" padding={4} shadow="sm" backgroundColor="white" justify="space-between">
          <HStack>
            {renderToggleButton()}
            <Text fontSize="sm">Acceleration</Text>
          </HStack>
          <HStack>
            {renderDirectionSelect("xs")}
            {renderDateTimeRangeSelector()}
            {renderModalOpenButton()}
          </HStack>
        </Flex>
        {open && expandableContent()}
      </Box>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size={modalSize}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Acceleration</ModalHeader> 
          <ModalCloseButton />
          <ModalBody>
            <Box height="600px">
              <AccelerationChart accelerationDir={accelerationDir} timeRange={value} />
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
}

export const AccelerationChart = ({accelerationDir, timeRange}: {accelerationDir: string, timeRange: Date[]}) => {
  const [accelerationXData, setAccelerationXData] = useState<TimestreamSocketResponse>([])
  const [accelerationYData, setAccelerationYData] = useState<TimestreamSocketResponse>([])
  const [accelerationZData, setAccelerationZData] = useState<TimestreamSocketResponse>([])
  const [accelerationData, setAccelerationData] = useState<TimestreamAccelerationsResponse>([])
  const [minTimeQueryParam, maxTimeQueryParam] = timeRange

  useEffect(() => {
    const socket = registerAccelerationSocket()
    
    socket.on(AccelerationDirection.All, (accelerations) => {
      setAccelerationData(oldData => {
        let allData = [...oldData, ...accelerations.values]
        allData = allData.slice(-250)
    
        return allData;
      })
    });

    socket.on(AccelerationDirection.X, (accelerations) => {
      setAccelerationXData(oldData => {
        let allData = [...oldData, ...accelerations.values]
      
        allData = allData.slice(-250)
        
        return allData;
      })
    })

    socket.on(AccelerationDirection.Y, (accelerations) => {
      setAccelerationYData(oldData => {
        let allData = [...oldData, ...accelerations.values]
        allData = allData.slice(-250)

        return allData;
      })
    })

    socket.on(AccelerationDirection.Z, (accelerations) => {
      setAccelerationZData(oldData => {
        let allData = [...oldData, ...accelerations.values]
        allData = allData.slice(-20)
        return allData;
      })
    })
  }, [minTimeQueryParam, maxTimeQueryParam])  

  const getAccelerationData = () => {
    switch(accelerationDir) {
      case AccelerationDirection.X: 
        return accelerationXData;

      case AccelerationDirection.Y:
        return accelerationYData;

      case AccelerationDirection.Z:
        return accelerationZData;

      case AccelerationDirection.All:
        return accelerationData;

      default: 
        return [];
    }
  }

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
        <XAxis height={50} dataKey="timestamp" domain={['auto', 'auto']} name="Time" tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm:ss Do')} type="number" />
        <YAxis height={50} />
        <Tooltip />
        {
          accelerationDir === AccelerationDirection.All && 
          <Legend />
        }
        { accelerationDir !== AccelerationDirection.All &&
          <Line type="monotone" dataKey="value" stroke="#25386A" activeDot={{ r: 8 }} />
        }
        <Line type="monotone" dataKey="AccelerationX" stroke="#25386A" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="AccelerationY" stroke="#70A8B7" />
        <Line type="monotone" dataKey="AccelerationZ" stroke="#25386A" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default AccelerationCard;

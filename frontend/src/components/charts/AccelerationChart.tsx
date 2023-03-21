import { Box, Button, Flex, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure } from '@chakra-ui/react';
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
import { getAccelerationX} from '../../services/timestream.service';


const chartData = [
  { value: 15, value2: 12, value3: 2, time: 1503616882654 },
  { value: -30, value2: 10, value3: 11, time: 1503616962277 },
  { value: 700, value2: 30, value3: 7, time: 1503613184594 },
  { value: 14, value2: 20, value3: 9, time: 1503617297689 },
  { value: 15, value2: 40, value3: 50, time: 1503611308914 },
]

const AccelerationCard = ({isOpen, title, modalSize="xl"}: any) => {
  const [open, setOpen] = useState(isOpen)
  const [accelerationDir, setAccelerationDir] = useState('x')
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose} = useDisclosure() 

  const expandableContent = () => {
    return (
      <Box width="full" padding={4} backgroundColor="white" shadow={"md"} borderTop={2}>
        <AccelerationChart accelerationDir={accelerationDir} />
      </Box>
    );
  }

  const renderDirectionSelect = (size: string) => {
    return (
      <Select size={size} onChange={(e) => setAccelerationDir(e.target.value)}>
        <option value='x'>X</option>
        <option value='y'>Y</option>
        <option value='z'>Z</option>
        <option value="all">All</option>
      </Select>
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
      <Image onClick={onModalOpen} width={5} height={5} src="/popout.png" />
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
            <AccelerationChart accelerationDir={accelerationDir} />
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

export const AccelerationChart = ({accelerationDir}: {accelerationDir: string}) => {
  const [accelerationXData, setAccelerationXData] = useState([])

  useEffect(() => {
    getAccelerationX("00-80-00-00-04-05-b6-b1").then((res) => {      
      const points = res.map((tup: any) => {
        const dt = new Date(tup.timestamp)

        return {
          time: Math.floor(dt.getTime() / 1000),
          value: tup.value
        }
      })


      setAccelerationXData(points)
    })
  }, [])

  console.log(accelerationXData)

  return (
      <ResponsiveContainer width="100%" height={225}>
        <LineChart
          data={accelerationXData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis height={50} dataKey="time" domain={['auto', 'auto']} name="Time" tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do')} type="number" />
          <YAxis height={50} />
          <Tooltip />
          <Legend />
          {
         // renderDataLines()
          }
          <Line type="monotone" dataKey="value" stroke="#25386A" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="value2" stroke="#70A8B7" />
          <Line type="monotone" dataKey="value3" stroke="#25386A" />
        </LineChart>
      </ResponsiveContainer>
    );
        
}

export default AccelerationCard;
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
  { timestamp: 1578930642, value: 14 },
  { timestamp: 1578930648, value: 14 },
  { timestamp: 1578930655, value: 13 },
  { timestamp: 1578930662, value: 5 },
  { timestamp: 1578930668, value: 12 },
  { timestamp: 1578930674, value: 16 },
  { timestamp: 1578930681, value: 15 },
  { timestamp: 1578930687, value: 12 },
  { timestamp: 1578930694, value: 15 },
  { timestamp: 1578930701, value: 16 },
  { timestamp: 1578930707, value: 17 },
  { timestamp: 1578930713, value: 11 },
  { timestamp: 1578930720, value: 9 },
  { timestamp: 1578930727, value: 20 },
  { timestamp: 1578930734, value: 19 },
  { timestamp: 1578930741, value: 18 },
  { timestamp: 1578930747, value: 4 },
  { timestamp: 1578930753, value: 12 },
  { timestamp: 1578930760, value: 16 },
  { timestamp: 1578930766, value: 13 },
  { timestamp: 1578930773, value: 17 },
  { timestamp: 1578930780, value: 15 },
  { timestamp: 1578930786, value: 12 },
  { timestamp: 1578930792, value: 16 },
  { timestamp: 1578930799, value: 8 },
  { timestamp: 1578930805, value: 13 },
  { timestamp: 1578930812, value: 19 },
  { timestamp: 1578930819, value: 11 },
  { timestamp: 1578930825, value: 16 },
  { timestamp: 1578930831, value: 32 },
  { timestamp: 1678924389, value: -24 },
  { timestamp: 1678924395, value: -32 },
  { timestamp: 1678924401, value: -18 }
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
      setAccelerationXData(res)
    })
  }, [])

  console.log(accelerationXData)

  return (
      <ResponsiveContainer width="100%" height={225}>
        <LineChart
          data={chartData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis height={50} dataKey="timestamp" domain={['auto', 'auto']} name="Time" tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do')} type="number" />
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
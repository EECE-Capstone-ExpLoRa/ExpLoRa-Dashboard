import { Box, Button, Flex, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import moment from 'moment';
import { ReactElement, useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { registerPressureSocket } from '../../services/socket.service';
import { TimestreamSocketResponse } from '../../utils/types';
import { getRecentData } from '../../utils/utils';
import ExpandableCard from '../ExpandableCard';

const data = [
  {
    name: 'Data A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Data B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Data C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Data D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Data E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Data F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Data G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];


const PressureCard = ({modalSize="full"}): ReactElement => {
  const [open, setOpen] = useState(true)
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose} = useDisclosure() 

  const expandableContent = () => {
    return (
      <Box width="full" height="250px" padding={4} backgroundColor="white" shadow={"md"} borderTop={2}>
        <PressureChart />
      </Box>
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
            <Text fontSize="sm">Pressure</Text>
          </HStack>
          <HStack>
            {renderModalOpenButton()}
          </HStack>
        </Flex>
        {open && expandableContent()}
      </Box>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size={modalSize}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Pressure</ModalHeader> 
          <ModalCloseButton />
          <ModalBody>
            <Box height="600px">
              <PressureChart />
            </Box>
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

const PressureChart = (): ReactElement => {
  const [pressureData, setPressureData] = useState<TimestreamSocketResponse>([])

  useEffect(() => {
    const socket = registerPressureSocket()
    socket.on('pressure', (pressure) => {
      setPressureData(oldData => {
        let allData = [...oldData, ...pressure.values]

        return getRecentData(allData)
      })
    })
  }, [])

  return (
    <ResponsiveContainer height={"100%"}>
      <AreaChart
        data={pressureData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis height={50} dataKey="timestamp" domain={['auto', 'auto']} name="Time" tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm:ss Do')} type="number" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#25386A" fill="#25386A" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default PressureCard
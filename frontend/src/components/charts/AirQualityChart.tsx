import { ReactElement, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment'
import { Box, Select, Image, Text, useDisclosure, Flex, HStack, Modal, ModalHeader, ModalOverlay, ModalBody, ModalContent, ModalCloseButton, ModalFooter, Button } from '@chakra-ui/react';

const chartData = [
  { ax: 14, ay: 20, az: 9, time: 1503617297689 },
  { ax: 15, ay: 10, az: 11, time: 1503616962277 },
  { ax: 15, ay: 12, az: 2, time: 1503616882654 },
  { ax: 20, ay: 30, az: 7, time: 1503613184594 },
  { ax: 15, ay: 40, az: 50, time: 1503611308914 },
]

const AirQualityCard = ({isOpen, modalSize="xl"}: any) => {
  const [open, setOpen] = useState(true)
  const [qualityType, setQualityType] = useState('x')
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose} = useDisclosure() 

  const expandableContent = () => {
    return (
      <Box width="full" height="250px" padding={4} backgroundColor="white" shadow={"md"} borderTop={2}>
        <AirQualityChart qualityType={qualityType} />
      </Box>
    );
  }

  const renderDirectionSelect = (size: string) => {
    return (
      <Select value={qualityType} size={size} onChange={(e) => setQualityType(e.target.value)}>
        <option value='pm'>Particulate matter</option>
        <option value='voc'>VOC index</option>
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
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Air Quality</ModalHeader> 
          <ModalCloseButton />
          <ModalBody>
            <Box height="500px">
              <AirQualityChart qualityType={qualityType} />
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

const AirQualityChart = ({qualityType}: {qualityType: string}): ReactElement => {
  return (
    <ResponsiveContainer width={'99%'} height={"100%"}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" domain={['auto', 'auto']} name="Time" tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do')} type="number" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ax" stroke="#25386A" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="ay" stroke="#70A8B7" />
        <Line type="monotone" dataKey="az" stroke="#25386A" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default AirQualityCard
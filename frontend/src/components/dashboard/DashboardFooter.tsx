import { AddIcon, CheckIcon, DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, 
    FormLabel, HStack, IconButton, Input, 
    Modal, ModalBody, ModalCloseButton, 
    ModalContent, ModalFooter, ModalHeader, 
    ModalOverlay, Select, Tooltip, useDisclosure, 
    useToast, VStack } from "@chakra-ui/react"
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../..";
import { deleteDeviceFromUser, fetchUserDevices, registerNewDevice, updateUserDevices } from "../../services/user.service";
import './dashboard.css';

type updateDeviceType = {
    nickname?: string,
    type?: string
}; 

const DashboardFooter = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [deviceEui, setDeviceEui] = useState('');
    const [deviceChanges, setdeviceChanges] = useState<Map<string, updateDeviceType>>(new Map<string, updateDeviceType>());
    const [doesInputHaveText, setDoesInputHaveText] = useState<number[]>([]); //1 = filled, 0 = empty, -1 = whitespace
    const addDevicesModal = useDisclosure();
    const editDevicesModal = useDisclosure();
    const toast = useToast();
    const devices = useQuery({
        queryKey: ['userDevices'],
        queryFn: fetchUserDevices
    });
    const registerDeviceMutation = useMutation({
        mutationFn: registerNewDevice,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['userDevices']});
            toast({
                title: 'Device Registered',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
        },
        onError: () => {
            toast({
              title: 'Device already registered with this account',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
    });
    const deleteDeviceMutation = useMutation({
        mutationFn: deleteDeviceFromUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['userDevices']});
            toast({
              title: 'Device sucessfully deleted',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
        },
        onError: () => {
            toast({
              title: 'Could not delete device',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
    });
    const updateDevicesMutation = useMutation({
        mutationFn: updateUserDevices,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['userDevices']});
            toast({
                title: 'Devices updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
        },
        onError: () => {
            toast({
              title: 'Error updating devices',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          },
    });

    const handleInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newArr = [...doesInputHaveText];
        if (value.trim().length > 0) {
            newArr[index] = 1;
        }
        else if (value.length > 0 && value.trim().length === 0) {
            newArr[index] = -1;
        }
        else {
            newArr[index] = 0;
        }
        setDoesInputHaveText(newArr);
    }
    
    const handleDeviceEuiChange = (e: React.FormEvent<HTMLInputElement>) => {
        setDeviceEui(e.currentTarget.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (deviceEui.trim() !== "") {
            registerDeviceMutation.mutate(deviceEui)
        }
        setDeviceEui('');
    };

    const handleDeviceUpdates = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateDevicesMutation.mutate(deviceChanges);
    };

    const handleDeviceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, deviceEui: string) => {
        const newValue = e.target.value;
        if (deviceChanges.has(deviceEui)) {
            deviceChanges.set(deviceEui, {...deviceChanges.get(deviceEui), type: newValue});
        }
        else {
            deviceChanges.set(deviceEui, {type: newValue});
        }
    };

    const handleDeviceNameChange = (e: React.ChangeEvent<HTMLInputElement>, deviceEui: string) => {
        const newValue = e.target.value;
        if (deviceChanges.has(deviceEui)) {
            deviceChanges.set(deviceEui, {...deviceChanges.get(deviceEui), nickname: newValue});
        }
        else {
            deviceChanges.set(deviceEui, {nickname: newValue});
        }
    };

    const handleClassNameChange = (index: number):string => {
        if (!doesInputHaveText) {
            return "";
        }
        if (doesInputHaveText[index] === 1) {
            return "filled";
        }
        else if (doesInputHaveText[index] === -1) {
            return "white-space";
        }
        else {
            return "";
        }
    }
    
    if (devices.isLoading) {
        return (<span>Loading...</span>)
    }
    
    if (devices.isError) {
        return (<span> An error occured </span>);
    }
    
    const deviceButtons = devices.data.map((device, index) => {
        return (
        <Button 
        key={device.device_eui} 
        _active={{
            borderBottom:`4px solid #3545a4`
        }}
        isActive={selectedIndex === index}
        onClick={() => {
            setSelectedIndex(index);
        }}>
            {device.nickname? device.nickname: device.device_eui} 
        </Button>
        );
    });

    const editableDevices = devices.data.map((device, index) => {
        const placeHolder = (device.nickname && device.nickname.trim() !== "")? device.nickname: device.device_eui;
        return (
            <HStack key={device.device_eui}>
                <Select 
                placeholder="Device Type" 
                icon={<HamburgerIcon />} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    handleDeviceTypeChange(e, device.device_eui);
                }}
                >
                    <option value='rocket'>Rocket</option>
                    <option value='drone'>Drone</option>
                    <option value='car'>Car</option>
                    <option value='other'>Other</option>
                </Select>

                <Input 
                type='text'
                placeholder={placeHolder} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleDeviceNameChange(e, device.device_eui);
                    handleInputFieldChange(e, index);
                }}
                className={handleClassNameChange(index)}
                />
                
                <Tooltip hasArrow label='Delete device' aria-label="Tooltip to delete device">
                    <IconButton 
                    aria-label="Delete device" 
                    icon={<DeleteIcon />} 
                    colorScheme='red' 
                    onClick={() => {
                        deleteDeviceMutation.mutate(device.device_eui);
                    }} />
                </Tooltip>
            </HStack>
        )
    });

    const addDeviceModal = (
        <Modal isOpen={addDevicesModal.isOpen} onClose={addDevicesModal.onClose} motionPreset='slideInBottom' >
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent>
                    <ModalHeader>Register a Device</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form
                        id="register-device-form"
                        onSubmit={handleSubmit}
                        >
                            <FormControl>
                                <FormLabel>Device EUI</FormLabel>
                                <Input type='text' onChange={handleDeviceEuiChange}/>
                            </FormControl>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={addDevicesModal.onClose} type='submit' form='register-device-form' colorScheme='green' >Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    );

    const editDeviceModal = (
        <Modal isOpen={editDevicesModal.isOpen} onClose={() => {
            setdeviceChanges(new Map<string, {[key: string]: string}>());
            setDoesInputHaveText([]);
            editDevicesModal.onClose();
            }} motionPreset='slideInBottom' >
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent>
                    <ModalHeader>Edit Devices</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <VStack>
                                {editableDevices}
                            </VStack>
                        </Box>
                    </ModalBody>
                    <ModalFooter justifyContent='center'>
                        <Button leftIcon={<CheckIcon />} colorScheme="green" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            handleDeviceUpdates(e);
                            editDevicesModal.onClose();
                        }} 
                        > Update Devices </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    );
    
    return (
        <Flex position='fixed' bottom='0' width='100%' margin='12px' >
            {deviceButtons}
            <Button leftIcon={<AddIcon/>} onClick={addDevicesModal.onOpen}>Add device</Button>
            {addDeviceModal}
            <Button leftIcon={<EditIcon/>} onClick={editDevicesModal.onOpen} >Edit Devices</Button>
            {editDeviceModal}
        </Flex>
    );
};

export default DashboardFooter;

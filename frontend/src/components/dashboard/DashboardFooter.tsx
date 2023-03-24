import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../..";
import { fetchUserDevices, registerNewDevice } from "../../services/user.service";

const DashboardFooter = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [deviceEui, setDeviceEui] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const devices = useQuery({
        queryKey: ['userDevices'],
        queryFn: fetchUserDevices
    });
    const handleDeviceEuiChange = (e: React.FormEvent<HTMLInputElement>) => {
        setDeviceEui(e.currentTarget.value)
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(deviceEui);
        if (deviceEui.trim() !== "") {
            registerDeviceMutation.mutate(deviceEui)
        }
        setDeviceEui('');
    };
    const registerDeviceMutation = useMutation({
        mutationFn: registerNewDevice,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['userDevices']});
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

    const addDeviceModal = (
        <Modal isOpen={isOpen} onClose={onClose}>
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
                        <Button onClick={onClose} type='submit' form='register-device-form'>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    );
    
    if (devices.isLoading) {
        return (<span>Loading...</span>)
    }
    
    if (devices.isError) {
        //53, 69, 164
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
            console.log('Button is selected');
            console.log(selectedIndex, index);
            setSelectedIndex(index);
        }}>
            {device.nickname? device.nickname: device.device_eui} 
        </Button>
        );
    });
    return (
        <Flex position='fixed' bottom='0' width='100%' margin='12px'>
            {deviceButtons}
            <Button leftIcon={<AddIcon/>} onClick={onOpen}>Add device</Button>
            {addDeviceModal}
        </Flex>
    )
};

export default DashboardFooter;

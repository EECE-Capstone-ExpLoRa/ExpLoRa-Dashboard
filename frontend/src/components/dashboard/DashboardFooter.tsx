import {
  AddIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverBody,
  Select,
  Switch,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
// @ts-ignore
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryClient } from "../..";
import {
  deleteDeviceFromUser,
  fetchUserDevices,
  registerNewDevice,
  updateUserDevices,
} from "../../services/user.service";

type updateDeviceType = {
  nickname?: string;
  type?: string;
};

const DashboardFooter = ({
  onDeviceEuiChange,
  onToggleLive,
  isLive,
  onDatePickerChange,
  datePickerValue,
}: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceEui, setDeviceEui] = useState("");
  const [deviceChanges, setdeviceChanges] = useState<
    Map<string, updateDeviceType>
  >(new Map<string, updateDeviceType>());
  const [doesInputHaveText, setDoesInputHaveText] = useState<number[]>([]);

  const addDevicesModal = useDisclosure();
  const editDevicesModal = useDisclosure();

  const toast = useToast();
  const devices = useQuery({
    queryKey: ["userDevices"],
    queryFn: fetchUserDevices,
  });

  useEffect(() => {
    if (devices.data && devices.data.length > 0) {
      onDeviceEuiChange(devices.data[selectedIndex].device_eui);
    }
  });

  // Hanndles toast error or success notification depending on Mutation callback
  const handleMutationCallback = (title: string, isSuccess: boolean) => {
    const toastStatus = isSuccess ? "success" : "error";
    toast({
      title: title,
      status: toastStatus,
      duration: 1000,
      isClosable: true,
    });
    if (isSuccess) queryClient.invalidateQueries({ queryKey: ["userDevices"] });
  };

  // Mutates userDevices array whenever a new device is registered
  const registerDeviceMutation = useMutation({
    mutationFn: registerNewDevice,
    onSuccess: () => {
      handleMutationCallback("Device registered", true);
    },
    onError: () => {
      handleMutationCallback(
        "Device already registered with this account",
        false
      );
    },
  });

  // Mutates userDevices array whenever a device is deleted
  const deleteDeviceMutation = useMutation({
    mutationFn: deleteDeviceFromUser,
    onSuccess: () => {
      handleMutationCallback("Device sucessfully deleted", true);
    },
    onError: () => {
      handleMutationCallback("Could not delete device", false);
    },
  });

  // Mutates userDevices array whenever a new devices nickname is update or device type is changed
  const updateDevicesMutation = useMutation({
    mutationFn: updateUserDevices,
    onSuccess: () => {
      handleMutationCallback("Devices updated", true);
    },
    onError: () => {
      handleMutationCallback("Error updating devices", false);
    },
  });

  // Handles whether an input field should be highlighted green (if text), red (if just whitespace), or if nothing entered
  const handleInputFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const newArr = [...doesInputHaveText];
    if (value.trim().length > 0) {
      newArr[index] = 1;
    } else if (value.length > 0 && value.trim().length === 0) {
      newArr[index] = -1;
    } else {
      newArr[index] = 0;
    }
    setDoesInputHaveText(newArr);
  };

  // Changes the internal deviceEui state to match what is being typed when registering new device
  const handleDeviceEuiChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDeviceEui(e.currentTarget.value);
  };

  // Registers device in backend and clears form data
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (deviceEui.trim() !== "") {
      registerDeviceMutation.mutate(deviceEui);
    }
    setDeviceEui("");
  };

  // Calls update mutation when save button is pressed
  const handleDeviceUpdates = () => {
    updateDevicesMutation.mutate(deviceChanges);
  };

  // Changes the internal deviceEui type to match what is being selected when editing device type
  const handleDeviceTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    deviceEui: string
  ) => {
    const newValue = e.target.value;
    if (deviceChanges.has(deviceEui)) {
      deviceChanges.set(deviceEui, {
        ...deviceChanges.get(deviceEui),
        type: newValue,
      });
    } else {
      deviceChanges.set(deviceEui, { type: newValue });
    }
  };

  // Changes the internal deviceEui state to match what is being typed when editing device nickname
  const handleDeviceNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    deviceEui: string
  ) => {
    const newValue = e.target.value;
    if (deviceChanges.has(deviceEui)) {
      deviceChanges.set(deviceEui, {
        ...deviceChanges.get(deviceEui),
        nickname: newValue,
      });
    } else {
      deviceChanges.set(deviceEui, { nickname: newValue });
    }
  };

  // Changes class name to highlight text red (whitespace) or green (text)
  const handleClassNameChange = (index: number): string => {
    let newClassName: string = "";
    if (!doesInputHaveText) {
      newClassName = "";
    } else if (doesInputHaveText[index] === 1) {
      newClassName = "filled";
    } else if (doesInputHaveText[index] === -1) {
      newClassName = "white-space";
    } else {
      newClassName = "";
    }
    return newClassName;
  };

  // resets all the states when the modal closes
  const resetAllStates = () => {
    setdeviceChanges(new Map<string, { [key: string]: string }>());
    setDoesInputHaveText([]);
    editDevicesModal.onClose();
  };

  if (devices.isLoading) {
    return <span>Loading...</span>;
  }

  if (devices.isError) {
    return <span> An error occured </span>;
  }

  // Buttons/Tabs visible from the bottom of dashboard that coincide with the devices registered with user
  const deviceButtons = devices.data.map((device, index) => {
    return (
      <Button
        key={device.device_eui}
        _active={{
          borderBottom: `4px solid #2A0B42`,
        }}
        isActive={selectedIndex === index}
        onClick={() => {
          setSelectedIndex(index);
          // onDeviceEuiChange(device.device_eui);
        }}
      >
        {device.nickname ? device.nickname : device.device_eui}
      </Button>
    );
  });

  // List of devices that show up within the edit devices modal
  const editableDevices = devices.data.map((device, index) => {
    const placeHolder =
      device.nickname && device.nickname.trim() !== ""
        ? device.nickname
        : device.device_eui;
    return (
      <HStack key={device.device_eui}>
        <Select
          placeholder="Device Type"
          icon={<HamburgerIcon />}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            handleDeviceTypeChange(e, device.device_eui);
          }}
        >
          <option value="rocket">Rocket</option>
          <option value="drone">Drone</option>
          <option value="car">Car</option>
          <option value="other">Other</option>
        </Select>

        <Input
          type="text"
          placeholder={placeHolder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleDeviceNameChange(e, device.device_eui);
            handleInputFieldChange(e, index);
          }}
          className={handleClassNameChange(index)}
        />

        <Tooltip
          hasArrow
          label="Delete device"
          aria-label="Tooltip to delete device"
        >
          <IconButton
            aria-label="Delete device"
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={() => {
              deleteDeviceMutation.mutate(device.device_eui);
            }}
          />
        </Tooltip>
      </HStack>
    );
  });

  // modal to register a new device to track
  const addDeviceModal = (
    <Modal
      isOpen={addDevicesModal.isOpen}
      onClose={addDevicesModal.onClose}
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Register a Device</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="register-device-form" onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Device EUI</FormLabel>
              <Input type="text" onChange={handleDeviceEuiChange} />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={addDevicesModal.onClose}
            type="submit"
            form="register-device-form"
            colorScheme="green"
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  // modal to edit existing devices
  const editDeviceModal = (
    <Modal
      isOpen={editDevicesModal.isOpen}
      onClose={resetAllStates}
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Edit Devices</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <VStack>{editableDevices}</VStack>
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            leftIcon={<CheckIcon />}
            colorScheme="green"
            onClick={() => {
              handleDeviceUpdates();
              editDevicesModal.onClose();
            }}
          >
            {" "}
            Update Devices{" "}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  // Dashboard footer being returned
  return (
    <Flex
      position="fixed"
      bottom="0"
      width="100%"
      margin="12px"
      justifyContent="space-between"
    >
      <Box>
        {deviceButtons}
        <Button leftIcon={<AddIcon />} onClick={addDevicesModal.onOpen}>
          Add device
        </Button>
        {addDeviceModal}
        <Button leftIcon={<EditIcon />} onClick={editDevicesModal.onOpen}>
          Edit Devices
        </Button>
        {editDeviceModal}
      </Box>
      <Box>
        {!isLive && (
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <TimeIcon />
            </PopoverTrigger>
            <PopoverContent width="425px">
              <PopoverCloseButton />
              <PopoverBody>
                <DateTimeRangePicker
                  onChange={onDatePickerChange}
                  value={datePickerValue}
                  closeWidgets={false}
                  clearIcon={null}
                  calendarIcon={null}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
        <Switch
          onChange={() => {
            onToggleLive(!isLive);
          }}
          defaultChecked={isLive}
          textColor={"brand.500"}
          fontWeight={600}
          alignSelf="center"
          colorScheme="brand"
          paddingRight="100px"
          paddingLeft="10px"
        >
          Live Data
        </Switch>
      </Box>
    </Flex>
  );
};

export default DashboardFooter;

import { CalendarIcon, CheckIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({onDatePickerChange}: any) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleButtonClick = () => {
        onDatePickerChange([startDate, endDate]);
    };

    return (
    <Flex alignItems='center'>
        <Flex alignItems='center'>
            <CalendarIcon marginRight='5px' />
            <DatePicker
            selected={startDate}
            onChange={(date) => {
                if (date) setStartDate(date);
            }}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
            />
        </Flex>

        <Flex alignItems='center'>
          <CalendarIcon marginRight='5px' />
          <DatePicker
          selected={endDate}
          onChange={(date) => {
            if (date) setEndDate(date);
          }}
          timeInputLabel="Time:"
          dateFormat="MM/dd/yyyy h:mm aa"
          showTimeInput
          />
        </Flex>
        
        <IconButton aria-label='Search database' icon={<CheckIcon />}  size='xs' colorScheme='green' isRound onClick={handleButtonClick} />
    </Flex>


    );
};

export default DateRangePicker;

import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { useField } from "formik"

export const FormInputField = ({label, required, ...props}: any) => {
    const [field, meta] = useField(props);
    return (
        <FormControl isRequired={required} isInvalid={meta.error !== undefined && meta.touched}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input
            variant='filled'
            {...field}
            {...props}
            />
            <FormErrorMessage>{meta.error}</FormErrorMessage>
        </FormControl>
    )
}
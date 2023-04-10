import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom"

const SignInOutButton = (props: {linkTo: string, buttonText: string}) => {
    return (
        <Link to={props.linkTo}>
            <Button variant='outline' border='2px' borderColor='brand.100' borderRadius='lg' marginRight='12px'>
                {props.buttonText}
            </Button>
        </Link>
    );
};

export default SignInOutButton;

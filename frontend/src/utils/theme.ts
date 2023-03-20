import { extendTheme } from "@chakra-ui/react";

const Theme = extendTheme({
    colors: {
        brand: {
            100: '#25386A',
            500: '#EAD788',
        },
        beach: {
            100: '#DC4933',
            500: '#F8CD51',
        },
        test: {
            100: '#B2D1D6',
            500: '#F8CD51'
        },
        test2: {
            100: '#70A8B7',
            500: '#F8CD51'
        },
        backgroundColor: '#25386A', //dark blue
        semiLightBlue: '#70A8B7', //some companys blue color
        lightestBlue: '#B2D1D6', //baby teal blue
        anOrange: '#F8CD51', //like a yellow but desturated
        anotherOne: '#F9E8A5', //creamy beigy yellow
        lastOne: '#D5DF67', //like a neon green/yellow?
        lastTwo: '#EAD788', //rotten mayo (like light yellow)
        lastThree: '#DC4933' //Reddish orange
    }
});

export default Theme;

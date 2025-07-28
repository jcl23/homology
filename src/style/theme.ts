import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        button: {
            selected: {
                background: 'darkorange',     // Background color for selected state
                foreground: 'white',     // Foreground color for selected state
            },
            unselected: {
                background: 'white',     // Background color for unselected state
                foreground: 'black',     // Foreground color for unselected state
            },
        },
    } as any,
    // components: {
    //     MuiButton: {
    //         styleOverrides: {
    //             root: {
    //                 transition: 'none', // Disable animations
    //                 '&:hover': {
    //                     backgroundColor: '#155a9e', // Custom hover color for primary button
    //                 },
    //                 '&.MuiButton-containedSecondary:hover': {
    //                     backgroundColor: '#a12727', // Custom hover color for secondary button
    //                 },
    //             },
    //         },
    //     },
    // },
});
export default theme;  
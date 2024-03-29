import { createTheme } from "@mui/material"

const theme = createTheme({ 
    palette: {  primary: {main: '#f2f2f2' },
                secondary: {main: '#FDE89D', contrastText: '#000000'},
                yellow: {main: '#FBD542', secondary: '#FDE89D', contrastText: '#ffffff'}, 
                grey: {main: '#252f3f'},
                brown: {main: '#420D0D'},
                blue: {main: '#020D28'},
                black: {main: '#06040A', contrastText: '#ffffff'}},
    typography: {
        button: {
          textTransform: 'none',
          flexDirection: "column"
        }
      }
})

export default theme
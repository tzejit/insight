import { createTheme } from "@mui/material"

const theme = createTheme({ 
    palette: {  primary: {main: '#f2f2f2' },
                secondary: {main: '#FCFBFA', contrastText: '#000000'},
                yellow: {main: '#1E1E1E', secondary: '#FCFBFA', contrastText: '#000000', light: '#ECECEC'}, 
                grey: {main: '#D9D9D9'},
                brown: {main: '#420D0D'},
                blue: {main: '#020D28'},
                black: {main: '#06040A', contrastText: '#ffffff'},
                chartpos: {main: '#5FA2E0'},
                chartneg: {main: '#020D28'},
                chartneu: {main: '#A7A5A5'}},
    typography: {
        button: {
          textTransform: 'none',
          flexDirection: "column"
        }
      },
})

export default theme
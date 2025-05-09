import { createTheme } from '@mui/material/styles';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

const theme = createTheme({
    typography: {
        fontFamily: `'Poppins', sans-serif`,
        h1: { fontFamily: `'Poppins', sans-serif` },
        h2: { fontFamily: `'Poppins', sans-serif` },
        h3: { fontFamily: `'Poppins', sans-serif` },
        h4: { fontFamily: `'Poppins', sans-serif` },
        h5: { fontFamily: `'Poppins', sans-serif` },
        h6: { fontFamily: `'Poppins', sans-serif` },
        button: { fontFamily: `'Poppins', sans-serif` },
    },
});

export default theme;

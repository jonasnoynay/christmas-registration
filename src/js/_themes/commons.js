import { createMuiTheme } from '@material-ui/core/styles';
import { pink, amber } from '@material-ui/core/colors';

export default createMuiTheme({
    palette: {
        primary: {
            main: pink['A200']
        },
        secondary: {
            main: '#ffffff'
        },
        options: {
            sidebarFilter: '#696969'
        }
    },
    typography: {
        fontFamily: ['Venera, sans-seriff'],
        htmlFontSize: 16
    },
    overrides: {
        MuiInputLabel: {
            root: {
                fontWeight: 800,
                color: '#000000',
            }
        },
        MuiInput: {
            root: {
                padding: '8px 5px'
            }
        },
        MuiFormControl: {
            root: {
                marginBottom: '10px'
            }
        },
        MuiSvgIcon: {
            root: {
                color: '#cccccc'
            }
        }
    },
    gradientPrimaryButton: {
        background: `linear-gradient(45deg, ${amber['400']} 30%, ${pink['A200']} 90%);`,
        color: '#ffffff',
        borderRadius: '20px'
    },
    gradientPrimary: {
        background: `linear-gradient(45deg, ${amber['400']} 30%, ${pink['A200']} 90%);`,
        color: '#ffffff'
    }
});
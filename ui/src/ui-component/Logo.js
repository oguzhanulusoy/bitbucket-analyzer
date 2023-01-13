// material-ui
import { useTheme } from '@mui/material/styles';
import IMG from "../assets/images/orion_logo.png"
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();

    return (

        <img src={IMG} alt="Orion Innovation" width="120" />
       
    );
};

export default Logo;

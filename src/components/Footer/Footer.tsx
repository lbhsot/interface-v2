import React from 'react';
import { Box } from '@material-ui/core';
import 'components/styles/Footer.scss';

const Footer: React.FC = () => {
  const copyrightYear = new Date().getFullYear();

  return (
    <Box className='footer'>
      <p>© {copyrightYear} ZKDex.</p>
    </Box>
  );
};

export default Footer;

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import OverviewFlow from './OverviewFlow';

const customTheme = {
  fonts: {
    body: 'Roboto, system-ui, sans-serif',
    heading: 'Roboto, system-ui, sans-serif',
    mono: 'Menlo, monospace',
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
  },
  radii: {
    sm: '5px',
    md: '8px',
  },
  colors: {
    gray: {
      300: '#e1e1e6',
      600: '#29292e',
      700: '#202024',
      800: '#121214',
    },
  },
};

const theme = extendTheme(customTheme);

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <OverviewFlow />
    </ChakraProvider>
  );
};

export default App;

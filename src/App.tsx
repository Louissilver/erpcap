import { HashRouter } from 'react-router-dom';
import './shared/forms/TraducoesYup';
import { AppRoutes } from './routes';
import { MenuLateral } from './shared/components';
import { DrawerProvider } from './shared/contexts';
import { AppThemeProvider } from './shared/contexts/ThemeContext';

export const App = () => {
  return (
    <AppThemeProvider>
      <DrawerProvider>
        <HashRouter>
          <MenuLateral>
            <AppRoutes />
          </MenuLateral>
        </HashRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
};

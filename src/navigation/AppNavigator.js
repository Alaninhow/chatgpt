import { NavigationContainer, DarkTheme } from '@react-navigation/native';
// (adicione isso lá em cima do arquivo)
// opcional, mas ajuda em alguns ambientes:
import 'react-native-gesture-handler';

// ...

const navTheme = {
  ...DarkTheme, // mantém fontes, espaçamentos etc.
  colors: {
    ...DarkTheme.colors,
    background: theme.colors.bg,
    primary: theme.colors.primary,
    card: theme.colors.bg,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.primary,
  },
};

// ...

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      {/* resto igual */}
    </NavigationContainer>
  );
}

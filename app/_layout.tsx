import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: scheme === "dark" ? "#000" : "#fff" },
          headerTitleStyle: { fontWeight: "700", fontSize: 22 },
          headerTintColor: scheme === "dark" ? "#fff" : "#000",
          animation: "fade",
        }}
      />
    </ThemeProvider>
  );
}

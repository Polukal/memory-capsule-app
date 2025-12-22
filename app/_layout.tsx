import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "white" },
          headerTitleStyle: { fontWeight: "600", fontSize: 20 },
          contentStyle: { backgroundColor: "white" },
        }}
      />
    </>
  );
}

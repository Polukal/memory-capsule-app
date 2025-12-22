import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function Gallery() {

  const scheme = useColorScheme();

  return (
    <View style={[styles.container, scheme === "dark" && styles.dark]}>
      <Text style={[styles.text, scheme === "dark" && styles.darkText]}>
        Gallery UI Placeholder 📸  
        (real data later)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  dark: { backgroundColor: "#000" },

  text: { fontSize: 22, color: "#000" },
  darkText: { color: "#fff" },

});

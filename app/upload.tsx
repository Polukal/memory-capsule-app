import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

export default function Upload() {
  const scheme = useColorScheme();

  const [localImage, setLocalImage] = useState(null);

  async function pick() {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) setLocalImage(result.assets[0]);
  }

  return (
    <View style={[styles.container, scheme === "dark" && styles.dark]}>
      <Text style={[styles.title, scheme === "dark" && styles.darkText]}>
        Upload Photo
      </Text>

      <TouchableOpacity onPress={pick} style={styles.button}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      {localImage && (
        <Image
          source={{ uri: localImage.uri }}
          style={{ width: "100%", height: 380, borderRadius: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  dark: { backgroundColor: "#000" },
  darkText: { color: "#fff" },
  title: { fontSize: 26, marginBottom: 20, fontWeight: "700" },
  button: {
    backgroundColor: "#246bfd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  buttonText: { fontSize: 18, textAlign: "center", color: "white", fontWeight: "600" },
});

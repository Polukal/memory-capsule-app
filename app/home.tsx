import { Link, router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function Home() {

  const scheme = useColorScheme();

  return (
    <View style={[styles.container, scheme === "dark" && styles.dark]}>

      <View style={styles.profileSection}>
        <Image
          style={styles.avatar}
          source={{ uri: "https://i.pravatar.cc/150" }}
        />
        <Text style={[styles.name, scheme === "dark" && styles.darkText]}>
          Welcome, John Doe 👋
        </Text>
      </View>

      <Link href="/gallery" style={styles.button}>
        <Text style={styles.buttonText}>Open Gallery</Text>
      </Link>

      <Link href="/upload" style={styles.button}>
        <Text style={styles.buttonText}>Upload Photo</Text>
      </Link>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace("/login")}>
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: "center" },
  dark: { backgroundColor: "#000" },

  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
    marginBottom: 10,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },

  darkText: { color: "#fff" },

  button: {
    backgroundColor: "#246bfd",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
  },

  buttonText: { color: "#fff", fontSize: 18, textAlign: "center" },

  logoutBtn: {
    marginTop: 80,
    padding: 15,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 14,
  },

  logoutTxt: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});

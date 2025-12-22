import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

export default function Login() {

  const scheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    router.replace("/home");
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, scheme === "dark" && styles.dark]}>

        <Text style={[styles.title, scheme === "dark" && styles.darkText]}>Login</Text>

        <TextInput
          placeholder="Email"
          style={[styles.input, scheme === "dark" && styles.inputDark]}
          placeholderTextColor={scheme === "dark" ? "#888" : "#777"}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[styles.input, scheme === "dark" && styles.inputDark]}
          placeholderTextColor={scheme === "dark" ? "#888" : "#777"}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Link href="/signup" style={styles.link}>
          <Text style={[styles.linkText, scheme === "dark" && styles.darkText]}>
            Create new account
          </Text>
        </Link>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, padding: 30, justifyContent: "center" },
  dark: { backgroundColor: "#000" },
  darkText: { color: "#fff" },

  title: { fontSize: 32, marginBottom: 30, fontWeight: "700", textAlign: "center" },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 18,
    fontSize: 18,
    color: "#000",
  },

  inputDark: { backgroundColor: "#222", color: "#fff", borderColor: "#444" },

  button: {
    backgroundColor: "#246bfd",
    padding: 18,
    borderRadius: 12,
    marginBottom: 25,
  },

  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },

  link: { alignSelf: "center" },
  linkText: { fontSize: 18, color: "#246bfd", marginTop: 15 },
});

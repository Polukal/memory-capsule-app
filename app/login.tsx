import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Login() {
  const scheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    // Validate input
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Validation Error", "Please enter your password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Successfully logged in
        router.replace("/home");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // User-friendly error messages
      let errorMessage = "Failed to login. Please try again.";

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please verify your email address before logging in.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
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
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[styles.input, scheme === "dark" && styles.inputDark]}
          placeholderTextColor={scheme === "dark" ? "#888" : "#777"}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={login}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
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

  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },

  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },

  link: { alignSelf: "center" },
  linkText: { fontSize: 18, color: "#246bfd", marginTop: 15 },
});

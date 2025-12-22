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

export default function Signup() {
  const scheme = useColorScheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signup() {
    // Validate input
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your full name");
      return;
    }

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

    // Password length validation
    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          // User already exists
          Alert.alert(
            "Account Exists",
            "An account with this email already exists. Please login instead.",
            [
              {
                text: "Go to Login",
                onPress: () => router.replace("/login"),
              },
            ]
          );
        } else if (data.user.confirmation_sent_at) {
          // Email confirmation sent
          Alert.alert(
            "Check Your Email",
            "We've sent you a confirmation email. Please verify your email address before logging in.",
            [
              {
                text: "OK",
                onPress: () => router.replace("/login"),
              },
            ]
          );
        } else {
          // Successfully signed up (auto-confirmed)
          Alert.alert(
            "Success!",
            "Your account has been created successfully.",
            [
              {
                text: "Continue",
                onPress: () => router.replace("/home"),
              },
            ]
          );
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      // User-friendly error messages
      let errorMessage = "Failed to create account. Please try again.";

      if (error.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please login instead.";
      } else if (error.message?.includes("Password should be at least")) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, scheme === "dark" && styles.dark]}>
        <Text style={[styles.title, scheme === "dark" && styles.darkText]}>
          Create Account
        </Text>

        <TextInput
          placeholder="Full Name"
          style={[styles.input, scheme === "dark" && styles.inputDark]}
          placeholderTextColor={scheme === "dark" ? "#888" : "#777"}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!loading}
        />

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
          onPress={signup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <Link href="/login" style={styles.link}>
          <Text style={[styles.linkText, scheme === "dark" && styles.darkText]}>
            Already have an account?
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

  title: { fontSize: 32, fontWeight: "700", marginBottom: 30, textAlign: "center" },

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

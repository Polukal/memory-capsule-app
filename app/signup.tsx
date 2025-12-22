import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function signup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    else router.replace("/login");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 12, padding: 6 }}
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <Text>Password</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 12, padding: 6 }}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Signup" onPress={signup} />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}

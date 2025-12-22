import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return Alert.alert(error.message);

    router.replace("/home");
  }

  return (
    <View style={{ flex:1, padding:20 }}>
      <Text style={{ fontSize:24, marginBottom:12 }}>Login</Text>

      <TextInput
        placeholder="email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        style={{ borderWidth:1, padding:12, marginBottom:12 }}
      />

      <TextInput
        placeholder="password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={{ borderWidth:1, padding:12, marginBottom:12 }}
      />

      <Button title="Login" onPress={login} />

      <Button title="No account? Sign up" onPress={() => router.push("/signup")} />
    </View>
  );
}

import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return Alert.alert(error.message);

    router.replace("/home");
  }

  return (
    <View style={{ flex:1, padding:20 }}>
      <Text style={{ fontSize:24, marginBottom:12 }}>Sign Up</Text>

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

      <Button title="Create Account" onPress={signup} />
    </View>
  );
}

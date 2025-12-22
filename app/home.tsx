import { router } from "expo-router";
import { Button, Text, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Home() {

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Text style={{ fontSize:20 }}>Welcome to Memory Capsule!</Text>

      <Button title="Upload Photo" onPress={() => router.push("/upload")} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/login");
      else setUser(data.user);
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Memory Capsule!</Text>

      <Button title="Upload Photo" onPress={() => router.push("/upload")} />

      <Button
        title="Logout"
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace("/login");
        }}
      />
    </View>
  );
}

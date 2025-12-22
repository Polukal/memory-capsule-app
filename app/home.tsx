import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Home() {

  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setEmail(data.session.user.email);
    });
  }, []);

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Text style={{ fontSize:22, marginBottom:18 }}>
        Welcome {email} 👋
      </Text>

      <Button
        title="Upload Photo"
        onPress={() => router.push("/upload")}
      />

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

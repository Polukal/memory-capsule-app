import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Home() {
  const scheme = useColorScheme();

  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        // Not authenticated, redirect to login
        router.replace("/login");
        return;
      }

      // Set user name from metadata or email
      const fullName = user.user_metadata?.full_name;
      if (fullName) {
        setUserName(fullName);
      } else if (user.email) {
        setUserName(user.email.split("@")[0]);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);

              const { error } = await supabase.auth.signOut();

              if (error) {
                throw error;
              }

              // Navigate to login
              router.replace("/login");
            } catch (error: any) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, scheme === "dark" && styles.dark]}>
        <ActivityIndicator size="large" color="#246bfd" />
      </View>
    );
  }

  return (
    <View style={[styles.container, scheme === "dark" && styles.dark]}>
      <View style={styles.profileSection}>
        <Image
          style={styles.avatar}
          source={{ uri: "https://i.pravatar.cc/150" }}
        />
        <Text style={[styles.name, scheme === "dark" && styles.darkText]}>
          Welcome, {userName} 👋
        </Text>
      </View>

      <Link href="/gallery" style={styles.button}>
        <Text style={styles.buttonText}>Open Gallery</Text>
      </Link>

      <Link href="/upload" style={styles.button}>
        <Text style={styles.buttonText}>Upload Photo</Text>
      </Link>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="red" size="small" />
        ) : (
          <Text style={styles.logoutTxt}>Logout</Text>
        )}
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

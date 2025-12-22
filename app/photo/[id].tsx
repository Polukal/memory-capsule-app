import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../src/lib/supabase";

interface Photo {
  id: string;
  user_id: string;
  file_path: string;
  created_at: string;
  album_id: string | null;
}

const { width } = Dimensions.get("window");

export default function PhotoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPhoto();
    }
  }, [id]);

  async function loadPhoto() {
    try {
      setLoading(true);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Not authenticated");
      }

      // Fetch photo details
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Photo not found");
      }

      setPhoto(data);

      // Get signed URL for full-size image
      const { data: urlData } = await supabase.storage
        .from("user-uploads")
        .createSignedUrl(data.file_path, 3600);

      if (urlData?.signedUrl) {
        setImageUrl(urlData.signedUrl);
      }

    } catch (error: any) {
      console.error("Error loading photo:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to load photo",
        [
          {
            text: "Go Back",
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <View style={[styles.container, scheme === "dark" && styles.dark]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#246bfd" />
          <Text style={[styles.loadingText, scheme === "dark" && styles.darkText]}>
            Loading photo...
          </Text>
        </View>
      </View>
    );
  }

  if (!photo || !imageUrl) {
    return (
      <View style={[styles.container, scheme === "dark" && styles.dark]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, scheme === "dark" && styles.darkText]}>
            Photo not found
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, scheme === "dark" && styles.dark]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, scheme === "dark" && styles.backBtnDark]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backBtnText, scheme === "dark" && styles.darkText]}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: imageUrl }}
        style={styles.fullImage}
        resizeMode="contain"
      />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, scheme === "dark" && styles.darkSubtext]}>
            Created
          </Text>
          <Text style={[styles.value, scheme === "dark" && styles.darkText]}>
            {formatDate(photo.created_at)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={[styles.label, scheme === "dark" && styles.darkSubtext]}>
            Photo ID
          </Text>
          <Text
            style={[styles.value, styles.idText, scheme === "dark" && styles.darkText]}
            numberOfLines={1}
          >
            {photo.id}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dark: {
    backgroundColor: "#000",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 16,
    paddingTop: 10,
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  backBtnDark: {
    backgroundColor: "#1f2937",
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  darkSubtext: {
    color: "#9ca3af",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#246bfd",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fullImage: {
    width: width,
    height: width,
    backgroundColor: "#f3f4f6",
  },
  infoContainer: {
    padding: 20,
    marginTop: 10,
  },
  infoRow: {
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  idText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },
});

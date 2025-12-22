import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Upload() {
  const scheme = useColorScheme();

  const [localImage, setLocalImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function pick() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0]);
      setProgress(0);
    }
  }

  async function uploadPhoto() {
    if (!localImage) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    try {
      setUploading(true);
      setProgress(10);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Not authenticated");
      }

      setProgress(25);

      const fileExt =
        localImage.uri.split(".").pop()?.toLowerCase() || "jpg";

      const mimeType =
        localImage.mimeType ?? `image/${fileExt}`;

      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      setProgress(40);

      // ✅ Read file as base64
      const base64 = await FileSystem.readAsStringAsync(localImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setProgress(60);

      // ✅ Convert base64 to ArrayBuffer using native methods
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const { data, error: uploadError } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, bytes.buffer, {
          contentType: mimeType,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(80);

      const { error: insertError } = await supabase
        .from("photos")
        .insert({
          user_id: user.id,
          file_path: data.path,
        });

      if (insertError) {
        await supabase.storage
          .from("user-uploads")
          .remove([filePath]);
        throw insertError;
      }

      setProgress(100);

      Alert.alert("Success", "Photo uploaded!", [
        {
          text: "Upload Another",
          onPress: () => {
            setLocalImage(null);
            setProgress(0);
          },
        },
        {
          text: "View Gallery",
          onPress: () => router.push("/gallery"),
        },
      ]);
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload Failed",
        error?.message ?? "Something went wrong"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <ScrollView
      style={[styles.container, scheme === "dark" && styles.dark]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, scheme === "dark" && styles.darkText]}>
        Upload Photo
      </Text>

      <TouchableOpacity
        onPress={pick}
        style={styles.button}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      {localImage ? (
        <>
          <Image
            source={{ uri: localImage.uri }}
            style={styles.imagePreview}
          />

          <TouchableOpacity
            onPress={uploadPhoto}
            style={[
              styles.uploadButton,
              uploading && styles.uploadButtonDisabled,
            ]}
            disabled={uploading}
          >
            {uploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.buttonText}>
                  {" "}
                  Uploading… {progress}%
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Upload to Gallery</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.placeholder}>
          <Text
            style={[
              styles.placeholderText,
              scheme === "dark" && styles.darkText,
            ]}
          >
            No image selected
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  dark: { backgroundColor: "#000" },
  darkText: { color: "#fff" },

  title: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: "700",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#246bfd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },

  uploadButton: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  uploadButtonDisabled: {
    backgroundColor: "#9ca3af",
  },

  buttonText: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },

  imagePreview: {
    width: "100%",
    height: 380,
    borderRadius: 12,
    backgroundColor: "#111",
  },

  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholder: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    fontSize: 16,
    color: "#6b7280",
  },
});
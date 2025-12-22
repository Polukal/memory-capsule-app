import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { supabase } from "../src/lib/supabase";

type Photo = {
  id: string;
  file_path: string;
};

export default function Gallery() {
  const scheme = useColorScheme();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("photos")
      .select("id, file_path")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={[styles.center, scheme === "dark" && styles.dark]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, scheme === "dark" && styles.dark]}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <PhotoCard item={item} />}
        ListEmptyComponent={
          <Text style={[styles.empty, scheme === "dark" && styles.darkText]}>
            No photos yet
          </Text>
        }
      />
    </View>
  );
}

/* ✅ EXTRACTED COMPONENT */
function PhotoCard({ item }: { item: Photo }) {
  const scheme = useColorScheme();
  const [imageError, setImageError] = useState(false);

  const { data } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(item.file_path);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // future: open detail / animate
      }}
    >
      {!imageError ? (
        <Image
          source={{ uri: data.publicUrl }}
          style={styles.image}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.errorBox}>
          <Text style={[styles.errorText, scheme === "dark" && styles.darkText]}>
            Image failed
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dark: { backgroundColor: "#000" },
  darkText: { color: "#fff" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  grid: {
    padding: 10,
  },

  card: {
    flex: 1,
    margin: 6,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  errorBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },

  errorText: {
    color: "#aaa",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },
});

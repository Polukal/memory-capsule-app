import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Button, Image, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Upload() {

  const [image, setImage] = useState<any>(null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.canceled) setImage(result.assets[0]);
  }

  async function upload() {

    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    if (!user) return;

    const form = new FormData();

    form.append("album_id", user.id);
    form.append("user_id", user.id);
    form.append("file", {
      uri: image.uri,
      name: "upload.jpg",
      type: "image/jpeg",
    } as any);

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/uploadPhoto`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${session.data.session.access_token}` },
        body: form,
      }
    );

    const json = await res.json();

    if (!json.success) return Alert.alert("Upload failed");

    Alert.alert("Uploaded!", `photo_id: ${json.photo.id}`);
  }

  return (
    <View style={{ flex:1, padding:20 }}>
      <Button title="Pick Photo" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image.uri }} style={{ width:"100%", height:300, marginTop:20 }} />
      )}
      <Button title="Upload" onPress={upload} />
    </View>
  );
}

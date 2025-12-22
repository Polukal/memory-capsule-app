import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { useState } from "react";
import { Button, Image, View } from "react-native";
import { supabase } from '../src/lib/supabase';

export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function pick() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!res.canceled) {
      setImage(res.assets[0]);
    }
  }

  async function upload() {
    if (!image) return;

    setUploading(true);

    const fileExt = image.uri.split(".").pop();
    const filePath = `${Date.now()}.${fileExt}`;

    const file = await fetch(image.uri);
    const blob = await file.blob();

    let { error } = await supabase
      .storage
      .from("user-uploads")
      .upload(filePath, blob);

    if (error) {
      setUploading(false);
      alert(error.message);
      return;
    }

    // insert into DB
    const { data: row, error: insertErr } = await supabase
      .from("photos")
      .insert({
        album_id: null,
        file_path: filePath,
        status: "uploaded",
      })
      .select()
      .single();

    await fetch(
      `${EXPO_PUBLIC_SUPABASE_URL}/functions/v1/animatePhoto`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          photo_id: row.id,
          model: "v1.6"
        })
      }
    );

    setUploading(false);
    router.push("/home");
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Pick Image" onPress={pick}/>
      {image && <Image source={{ uri: image.uri }} style={{ width: 300, height: 300 }}/>}
      <Button title="Upload + Animate" disabled={!image || uploading} onPress={upload}/>
    </View>
  );
}

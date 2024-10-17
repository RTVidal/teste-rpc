import { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface GalleryProps {
  onSelectEnd: (videoURI:string) => void,
  onSelectCancel: () => void
}

export default function Gallery({onSelectEnd, onSelectCancel}:GalleryProps){
    const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    pickVideo();
  }, [])

  const pickVideo = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if(result.canceled) return onSelectCancel();

      onSelectEnd(result.assets[0].uri);
  };

  return (
      <View style={styles.container}>
          {/* <Button title="Selecionar vídeo" onPress={pickVideo} /> */}
          {video && <Image source={{ uri: video }} style={styles.image} />}
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
  });
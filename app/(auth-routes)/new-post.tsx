import {View, Text, Button, TextInput, StyleSheet} from 'react-native';
import { useState } from 'react';
import PostPreview from '../../components/PostPreview';
import Camera from '../../components/Camera';
import Gallery from '../../components/Gallery';
import { useSession } from "../ctx";
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';

export default function NewPost(){
  const navigation = useNavigation();
  const { sessionData } = useSession();
  const [openCamera, setOpenCamera] = useState<boolean>(false);
  const [openGallery, setOpenGallery] = useState<boolean>(false);
  const [recordedVideoURI, setRecordedVideoURI] = useState<string>('');
  const [title, setTitle] = useState<string>('');    

  const handleCancel = ():void => {
    setOpenCamera(false);
    setOpenGallery(false);
  }

  const onCameraRecordEnd = (videoURI:string) => {
    setOpenCamera(false);
    setRecordedVideoURI(videoURI);
  }

  const onGallerySelectEnd = (videoURI:string) => {
    setOpenGallery(false);
    setRecordedVideoURI(videoURI);
  }

  const savePost = ():void => {
    const newPost = {
      userId: sessionData?.userId,
      userName: sessionData?.userName,
      videoURI: recordedVideoURI,
      title
    }

    api.put('post', newPost)
    .then(post => {
      alert('Post salvo com sucesso!');
      navigation.goBack();
    })
    .catch(err => {
      console.log(err);
      alert('Não foi possível salvar o post.');
    });
}

  if(openCamera) return <Camera onRecordEnd={onCameraRecordEnd} onRecordCancel={handleCancel}/>;
  if(openGallery) return <Gallery onSelectEnd={onGallerySelectEnd} onSelectCancel={handleCancel}/>;

  if(recordedVideoURI) return (
    <View>
      <Text style={styles.title}>Salvar post</Text>
      <PostPreview videoURI={recordedVideoURI}/>
      <TextInput
        style={styles.postTitleContainer}
        placeholder='Título'
        onChangeText={text => setTitle(text)}
        value={title}
      />
      <Button onPress={savePost} title="Salvar" />
    </View>
    
  );

  return(
    <View>
      {openCamera || openGallery ?
        <View style={{padding: 5}}>
          <Button
              title="Cancelar"
              onPress={handleCancel}
            />
        </View>
      :
        <View>
          <View style={{padding: 5}}>
            <Button
              title="Gravar com a câmera"
              onPress={() => setOpenCamera(true)}
            />
          </View>
          <View style={{padding: 5}}>
            <Button
                title="Selecionar da galeria"
                onPress={() => setOpenGallery(true)}
            />
          </View>  
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  postTitleContainer: {
    marginVertical: 10,
    padding: 5,
    borderColor: '#000',
    borderWidth: 0.5,
    borderStyle: 'solid'
  }
});
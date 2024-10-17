import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useState, useRef } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import NewPost from './PostPreview';

interface CameraProps {
    onRecordEnd: (videoURI:string) => void,
    onRecordCancel: () => void
}

export default function CameraComponent({onRecordEnd, onRecordCancel}:CameraProps){
    const cameraRef = useRef<any>();
    const [facing, setFacing] = useState<CameraType>('back');
    const [recording, setRecording] = useState<boolean>(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [finishingRecord, setFinishingRecord] = useState<boolean>(false)
    const [recordedVideoURI, setRecordedVideoURI] = useState<string>();

    if (!permission) return <Text>Aguardando câmera.</Text>;

    if (!permission.granted) {
        return (
          <View>
            <Text>Para continuar, precisamos da permissão para acessar a câmera.</Text>
            <Button onPress={requestPermission} title="Conceder permissão" />
          </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const recordVideo = async () => {
        const { status } = await Camera.requestMicrophonePermissionsAsync();

        if (cameraRef.current) {
            if (recording) {
            setFinishingRecord(true);
              cameraRef.current.stopRecording();
              setRecording(false);
            } else {
                setRecording(true);

                const video = cameraRef.current.recordAsync();
                video.then((video:any) => {
                    onRecordEnd(video?.uri);
                });
            }
        }
    }

    // if(recordedVideoURI){
    //   return <NewPost videoURI={recordedVideoURI} userData={sessionData}/>
    // }

    return (
        <View style={styles.container}>
          <CameraView style={styles.camera} facing={facing} mode="video" ref={cameraRef}>
            
                {finishingRecord ? 
                    <View style={styles.buttonContainer}>
                        <Text style={styles.text}>Processando vídeo. Por favor, aguarde.</Text>
                    </View>                    
                :
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={recordVideo}>
                            <Text style={styles.text}>{recording ? 'Parar gravação' : 'Gravar'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={onRecordCancel}>
                            <Text style={styles.text}>{'Cancelar'}</Text>
                        </TouchableOpacity>                    
                    </View>
                }                
            
          </CameraView>
        </View>
    );

    return(
        <View>
            <Text>NOVO POST</Text>
        </View>
    )
}

// interface VideoPreviewProps {
//   videoURI: string;
// }

// const VideoPreview = ({videoURI}:VideoPreviewProps) => {
//   const videoRef = useRef(null);

//   let videoSource = videoURI;

//   const player = useVideoPlayer(videoSource, player => {
//     player.loop = true;
//     player.muted = true;
//     //player.play();
//   });

//   return(
//     <View>
//       <Text>Vídeo gravado</Text>
//       <Text>{videoURI}</Text>
//       <VideoView
//           ref={videoRef}
//           style={{width: 350, height:275}}
//           player={player}
//           nativeControls={false}
//       />
//     </View>
//   )
// }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
      width: '100%'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
      marginTop: '90%',
    },
    button: {
        padding: 15
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
  });
import { useRef, useState } from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video';
import Ionicons from '@expo/vector-icons/Ionicons';

interface VideoProps {
    source: string,
    stop: () => void
}

export default function Video({source, stop}:VideoProps){
    const [playing, setPlaying] = useState<boolean>(true);
    const videoRef = useRef(null);

    const player = useVideoPlayer(source, player => {
        player.loop = true;
        player.play();
    });

    const togglePlay = () => {
        if(playing){
            player.pause();
        } else {
            player.play();
        }
        setPlaying(!playing);
    }

    return(
        <View style={styles.mediaContainer}>
            <VideoView
                ref={videoRef}
                style={styles.video}
                player={player}
                nativeControls={false}
            />
            <View style={styles.controlContainer}>
                <TouchableOpacity onPress={togglePlay}>
                    <View style={styles.btnPlayPauseContainer}>
                        <Ionicons name={playing ? 'pause' : 'play'} size={28} color="black" />
                    </View>                    
                </TouchableOpacity>
                <TouchableOpacity onPress={stop}>
                    <View style={styles.btnPlayPauseContainer}>
                        <Ionicons name='stop' size={28} color="black" />
                    </View>                    
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mediaContainer: {
        marginTop: 5,
        borderRadius: 15,
        paddingBottom: 2,
        width: '100%',
        backgroundColor: '#000'
    },
    video: {
        width: '100%',
        height: 300,
    },
    controlContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    },
    btnPlayPauseContainer: {
        backgroundColor: 'white',
        borderRadius: 3,
        padding: 2,
        margin: 5
    },
})
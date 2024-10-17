import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView, Image} from 'react-native';
import { IFeedPost } from '@/interfaces/feedPost';
import api from '../services/api';
import { Link, Href } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FeedItemProps {
    item: IFeedPost
    autoPlay?: boolean
}

export default function FeedItem({item, autoPlay}:FeedItemProps){
    const [playing, setPlaying] = useState<boolean>(autoPlay ? true : false);
    const videoRef = useRef(null);

    let videoSource = item.mediaURI ? item.mediaURI : require('../assets/videos/1.mp4');

    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        //player.muted = true;
        if(autoPlay) player.play();
    });

    const togglePlay = () => {
        if(playing){
            player.pause();
        } else {
            player.play();
        }
        console.log('playing', playing);
        setPlaying(!playing);
    }

    let imageSource = null;

    switch(item.userId){
        case 1:
            imageSource = require('../assets/images/avatar/1.png');
            break;
        case 2:
            imageSource = require('../assets/images/avatar/2.png');
            break;
        case 3:
            imageSource = require('../assets/images/avatar/3.png');
            break;
        default:
            imageSource = require('../assets/images/avatar/0.png');
            break;
    }

    return(
        <View style={{paddingVertical: 10}}>
            <Link href={`/user-profile/${item.userId}` as Href}>
                <View>
                    <Image source={imageSource} style={{width: 45, height: 45, margin: 5, resizeMode: 'stretch'}}></Image>
                </View>                
                <Text>{item.userName}</Text>
            </Link>                
                <View style={styles.mediaContainer}>
                    <VideoView
                        ref={videoRef}
                        style={styles.video}
                        player={player}
                        nativeControls={false}
                    />
                    <TouchableOpacity onPress={togglePlay}>
                        <View style={styles.controlContainer}>
                            <View style={styles.btnPlayPauseContainer}>
                                <Ionicons name={playing ? 'pause' : 'play'} size={28} color="black" />
                            </View>                            
                        </View>                        
                        {/* <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{playing ? 'PAUSAR' : 'PLAY'}</Text> */}
                    </TouchableOpacity>  
                </View>
                          
            <Link href={`/post/${item.id}` as Href}>
                <View style={{backgroundColor: ''}}>
                    <Text style={{textAlign: 'center'}}>{item.title}</Text>   
                </View>
                      
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    mediaContainer: {
        marginTop: 5,
        paddingVertical: 2,
        width: '100%',
        backgroundColor: 'gray',
        alignContent: 'center'
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
    }
});
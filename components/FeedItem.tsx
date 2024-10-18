import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView, Image} from 'react-native';
import { IFeedPost } from '@/interfaces/feedPost';
import api from '../services/api';
import { Link, Href, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FeedItemProps {
    item: IFeedPost
    autoPlay?: boolean,
    userId?: number | null
}

export default function FeedItem({item, autoPlay, userId}:FeedItemProps){
    const router = useRouter();
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
        <View style={styles.mainContainer}>
            {userId ?
                <View>
                    {userId.toString() === item.userId.toString() ?
                        <Text>Postado por {item.userName}</Text>
                    :
                        <Text>Compartilhado de {item.userName}</Text>
                    }
                </View>                      
            :
                <Link href={`/user-profile/${item.userId}` as Href}>
                    <View style={styles.avatarContainer}>
                        <Image source={imageSource} style={styles.avatar}></Image>
                    </View>      
                    <View style={styles.userNameContainer}>
                        <Text style={styles.userName}>{item.userName}</Text>                        
                    </View>
                </Link> 
            }                     
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
                </TouchableOpacity>
            </View>
            {/* <Link href={`/post/${item.id}` as Href}> */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => router.push(`/post/${item.id}`)}>
                    <Text style={styles.actionsLabel}>Ver (curtir | compartilhar)</Text>
                </TouchableOpacity>
            </View>
            {/* </Link> */}
            {/* <Link href={`/post/${item.id}` as Href}> */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleLabel}>{item.title}</Text>   
                </View>
            {/* </Link> */}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingVertical: 10,
        backgroundColor: '#def1ff',
        marginVertical: 5,
        padding: 5
    },
    avatarContainer: {
        marginLeft: 8,
        height: 45,
        width: 45,
        borderRadius: 40
    },
    avatar: {
        height: 45,
        width: 45,
        borderRadius: 40,
    },
    userNameContainer: {
        marginLeft: 80
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    mediaContainer: {
        marginTop: 5,
        paddingTop: 5,
        borderRadius: 15,
        paddingBottom: 2,
        width: '100%',
        backgroundColor: '#000',
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
    },
    titleContainer: {
        paddingLeft: 10
    },
    titleLabel: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    actionsContainer: {
        paddingLeft: 10
    },
    actionsLabel: {
        fontSize: 15,
        textAlign: 'right',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: 'rgb(16, 93, 147)',
        paddingBottom: 5,
        paddingRight: 5
    }
});
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { IFeedPost } from '@/interfaces/feedPost';
import { Link, Href, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import Ionicons from '@expo/vector-icons/Ionicons';
import Video from './Video';

interface FeedItemProps {
    item: IFeedPost
    autoPlay?: boolean,
    userId?: number | null,
    endPost?: boolean
}

function FeedItem({item, autoPlay, userId, endPost}:FeedItemProps){    
    const router = useRouter();
    const [playing, setPlaying] = useState<boolean>(autoPlay ? true : false);
    const videoRef = useRef(null);

    let videoSource = item.mediaURI ? item.mediaURI : require('../assets/videos/1.mp4');

    // const player = useVideoPlayer(videoSource, player => {
    //     player.loop = true;
    //     //player.muted = true;
    //     if(autoPlay) player.play();
    // });

    // const togglePlay = () => {
    //     if(playing){
    //         player.pause();
    //     } else {
    //         player.play();
    //     }
    //     setPlaying(!playing);
    // }

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
            <View>
                {playing ? 
                    <Video source={videoSource} stop={() => setPlaying(false)}/>
                :
                    <View style={[styles.mediaContainer, {backgroundColor: picRandomColor()}]}>
                        <TouchableOpacity onPress={() => setPlaying(true)}>
                            <Ionicons name={'play'} size={60} color="white" />
                            <Text style={styles.titleLabel}>{item.title}</Text> 
                        </TouchableOpacity>                
                        {/* <VideoView
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
                        </TouchableOpacity> */}
                    </View>
                }
            </View>
            
            {(!userId && !endPost) &&
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => router.push(`/post/${item.id}`)}>
                        <Text style={styles.actionsLabel}>Ver (curtir | comentar | compartilhar {userId})</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default React.memo(FeedItem);

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
        borderRadius: 15,
        paddingBottom: 2,
        paddingTop: 100,
        width: '100%',
        //backgroundColor: '#000',
        height: 300,
        alignItems: 'center'
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
        fontSize: 25,
        marginTop: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
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

const picRandomColor = ():string => {
    let code = Math.floor(Math.random() * 10);

    switch(code){
        case 0: return '#ff0000';
        case 1: return '#4287f5';        
        case 2: return '#ffa600';
        case 3: return '#ffbf00';
        case 4: return '#11b853';
        case 5: return '#d138b8';
        case 6: return '#752238';
        case 7: return '#22756a';
        case 8: return '#432275';
        case 9: return '#733a14';
        default: return '#ff0000'
    }
}
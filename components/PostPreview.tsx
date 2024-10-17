import {View, Text, Button, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useState, useRef } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system';
import { IUserData } from '@/interfaces/UserData';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VideoPreviewProps {
    videoURI: string;
}
  
export default function VideoPreview({videoURI}:VideoPreviewProps) {
    const videoRef = useRef(null);

    let videoSource = videoURI;
  
    const player = useVideoPlayer(videoSource, player => {
      player.loop = true;
      player.muted = true;
      player.play();
    });
  
    return(
        <VideoView
            ref={videoRef}
            style={{width: Dimensions.get('window').width, height: 300}}
            player={player}
            nativeControls={false}
        />
    )
}
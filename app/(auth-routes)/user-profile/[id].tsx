import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, Image} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '../../../services/api';
import { IFeedPost } from '@/interfaces/feedPost';
import FeedItem from '@/components/FeedItem';

export interface IUserProfile {
    id?: number,
    avatarURI?: string,
    name?: String
}

export default function UserProfile(){
    const {id}:string | any = useLocalSearchParams();
    const [user, setUser] = useState<IUserProfile>({});
    const [userFeed, setUserFeed] = useState<[]>([]);

    useEffect(() => {        
        loadUser(id);
        loadUserFeed(id);
    }, []);

    const loadUser = (id:number):void => {
        api.get('user', id)
        .then(user => {
            setUser(user);
        })
        .catch(err => {
            console.log(err);
            alert('Não foi possível carregar os dados do usuário');
        })
    }

    const loadUserFeed = (userId:number):void => {
        api.get('feed', {userId})
        .then(posts => {
            const feedItems:any = [];

            posts.forEach((p:IFeedPost) => {
                feedItems.push({
                    id: p.id, 
                    userId: p.userId,
                    userName: p.userName,
                    userAvatarURI: p.userAvatarURI,
                    mediaType: p.mediaType,
                    mediaURI: p.mediaURI,
                    title: p.title,
                    qtComments: p.qtComments,
                    qtLikes: p.qtLikes
                });
            });

            setUserFeed(feedItems);
        })
        .catch(err => {
            console.log(err);
            alert('Não foi possível obter os posts');
        });
    }

    let imageSource = null;

    switch(user.id){
        case 1:
            imageSource = require('../../../assets/images/avatar/1.png');
            break;
        case 2:
            imageSource = require('../../../assets/images/avatar/2.png');
            break;
        case 3:
            imageSource = require('../../../assets/images/avatar/3.png');
            break;
    }
    
    return(
        <ScrollView>
            {imageSource &&
                <Image source={imageSource} style={{width: 60, height:60, margin: 5, resizeMode: 'stretch'}}></Image>
            }            
            <Text>{user.name}</Text>
            <Text>Vídeos de {user.name}</Text>
            {userFeed.map((item, key) => (
                <FeedItem key={key} item={item}/>
            ))}
        </ScrollView>
        
    )
}
import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, Image, TouchableOpacity} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../../services/api';
import { IFeedPost } from '@/interfaces/feedPost';
import Feed from '../../../components/Feed';
import { useSession } from "../../ctx";

export interface IUserProfile {
    id?: number,
    avatarURI?: string,
    name?: String,
    email?: String
}

export default function Profile(){
    const router = useRouter();
    const { signOut, sessionData } = useSession();
    const {id}:string | any = useLocalSearchParams();
    const [user, setUser] = useState<IUserProfile>({});
    const [userFeed, setUserFeed] = useState<any[]>([]);

    useEffect(() => {        
        loadUser(id);
        loadUserFeed(id);
    }, []);

    const loadUser = (id:number):void => {
        api.get('user', sessionData?.userId)
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

    const handleExit = ():void => {
        signOut();
        router.replace('/login');
    }

    let imageSource = require('../../../assets/images/avatar/0.png');
    
    return(
        <View>
            <TouchableOpacity onPress={handleExit}>
                <Text>Saaair (desfazer login)</Text>
            </TouchableOpacity>
            <Image source={imageSource} style={{width: 60, height:60, margin: 5, resizeMode: 'stretch'}}></Image>           
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
            
            <Text>Seu feed</Text>
            <Feed userId={sessionData?.userId} />
            {/* {userFeed.map((item, key) => (
                <Text>{item.id} {item.title}</Text>
                // <FeedItem key={key} item={item}/>
            ))} */}
        </View>
        
    )
}


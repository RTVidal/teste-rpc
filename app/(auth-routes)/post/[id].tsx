import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '../../../services/api';
import { IFeedPost } from '@/interfaces/feedPost';
import FeedItem from '@/components/FeedItem';
import { useSession } from "../../ctx";

export interface IUserProfile {
    id?: number,
    avatarURI?: string,
    name?: String
}

export default function UserProfile(){
    const { sessionData } = useSession();
    const {id}:string | any = useLocalSearchParams();
    const [post, setPost] = useState<IFeedPost | any>({});
    const [liked, setLiked] = useState<boolean>(false);
    const [shared, setShared] = useState<boolean>(false);

    useEffect(() => {        
        loadPost(id);
    }, []);

    const loadPost = (id:string):void => {        
        api.get('feed/post', id)
        .then(post => {
            setPost(post);
            setLiked(post.likes.filter((p:any) => p.userId === sessionData?.userId).length);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleLike = ():void => {
        api.post('like', {userId: sessionData?.userId, postId: id})
        .then(({like}) => {
            setLiked(like);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleShare= ():void => {
        api.post('share', {userId: sessionData?.userId, postId: id})
        .then(({shared}) => {
            setShared(shared);
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    return(
        <ScrollView>
            <FeedItem item={post} autoPlay={true}/>
            <View style={styles.postOptions}>
                <TouchableOpacity onPress={handleLike}>
                    <Text style={liked ? styles.optionItemSelected : styles.optionItem}>{liked ? 'Curtido' : 'Curtir'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare}>
                    <Text style={shared ? styles.optionItemSelected : styles.optionItem}>{shared ? 'Compartilhado' : 'Compartilhar'}</Text>
                </TouchableOpacity>
            </View>
            <Text>Comentários</Text>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    postOptions: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        padding: 10,
        borderBottomColor: '#000',
        borderBottomWidth: 1
    },
    optionItem: {
        fontSize: 16
    },
    optionItemSelected: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});
import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, Button} from 'react-native';
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
    const [newComment, setNewComment] = useState<string>('');
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {        
        loadPost(id);
    }, []);

    const loadPost = (id:string):void => {        
        api.get('post', id)
        .then(post => {
            setPost(post);
            setLiked(post.likes.filter((p:any) => p.userId === sessionData?.userId).length);
            getPostComments(id);
        })
        .catch(err => {
            console.log(err);
        });
    }

    const getPostComments = (postId: string) => {
        api.get('comments', postId)
        .then(comments => {
            setComments(comments);
        })
        .catch(err => {
            console.log(err);
        });
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

    const handleShare = ():void => {
        api.post('share', {userId: sessionData?.userId, postId: id})
        .then(({shared}) => {
            setShared(shared);
        })
        .catch(err => {
            console.log(err);
        });
    }

    const sendComment = ():void => {
        api.put('comment', {userId: sessionData?.userId, userName: sessionData?.userName, postId: id, comment: newComment})
        .then(() => {
            setNewComment('');
            getPostComments(id);
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    return(
        <ScrollView style={styles.mainContainer}>
            <FeedItem item={post} endPost={true}/>
            <View style={styles.postOptions}>
                <TouchableOpacity onPress={handleLike}>
                    <Text style={liked ? styles.optionItemSelected : styles.optionItem}>{liked ? 'Curtido' : 'Curtir'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare}>
                    <Text style={shared ? styles.optionItemSelected : styles.optionItem}>{shared ? 'Compartilhado' : 'Compartilhar'}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.commentsTitle}>Comentários</Text>
            {comments.map((comment:any, key:number) => 
                <View style={styles.commentBox} key={key}>
                    <Text style={styles.commentUser}>{comment.userName}</Text>
                    <Text style={styles.commentContent}>{comment.comment}</Text>
                </View>
            )}
            <View style={styles.newCommentContainer}>
                <TextInput
                    placeholder='Novo comentário'
                    onChangeText={text => setNewComment(text)}
                    value={newComment}
                />
            </View>            
            <Button onPress={sendComment} title="Enviar comentário" />
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 5,
        paddingBottom: 15
    },
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
    },
    commentsTitle: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center'
    },
    commentBox: {
        marginVertical: 5,
        backgroundColor: '#def1ff'
    },
    commentUser: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    commentContent: {
        fontSize: 16
    },
    newCommentContainer: {
        marginVertical: 10,
        padding: 5,
        borderColor: '#000',
        borderWidth: 0.5,
        borderStyle: 'solid'
    }
});
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, ActivityIndicator, FlatList, SafeAreaView, RefreshControl} from 'react-native';
import { IFeedPost } from '@/interfaces/feedPost';
import api from '../services/api';
import FeedItem from './FeedItem';
import {useRouter} from 'expo-router';

interface FeedProps {
    userId?: number | null
}

export default function Feed({userId}:FeedProps){
    const router = useRouter();

    const [feedPage, setFeedPage] = useState<number>(1)
    const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
    const [feedItems, setFeedItems] = useState<IFeedPost[]>([]);
    const [feedEnd, setFeedEnd] = useState<boolean>(false);

    useEffect(() => {
        loadFeed(1);
    }, []);

    const handleNewPost = () => {
        router.push('/new-post');
    }

    const loadFeed = (pageLoad:number):void => {
        setLoadingFeed(true);

        const itens = pageLoad > 1 ? [...feedItems] : [];

        api.get('feed', {page: pageLoad, userId})
        .then(posts => {
            if(!posts.length){
                setFeedEnd(true);
                return;
            }

            posts.forEach((p:IFeedPost) => {
                itens.push({
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

            setFeedItems(itens);
            setFeedPage(pageLoad);
        })
        .catch(err => {
            console.log(err);
            alert('Não foi possível obter os posts');
        });

        setFeedItems(itens);
        setLoadingFeed(false);
    }

    return(
        <View>
            
            <View style={styles.feedContainer}>
                {loadingFeed ?
                    <ActivityIndicator size="large" color="#0000ff" />
                :
                    <SafeAreaView>
                        {feedEnd && <Text>Todos os posts deste feed foram carregados.</Text>}
                        <FlatList
                            data={feedItems}
                            renderItem={({item}) => <FeedItem item={item} />}
                            keyExtractor={item => item.id ? item.id.toString() : ''}
                            onEndReached={() => loadFeed(feedPage + 1)}
                            onEndReachedThreshold={0.3}
                            initialScrollIndex={0}
                            ListHeaderComponent={<Button
                                title="+ Novo post"
                                onPress={handleNewPost}
                            />}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loadingFeed}
                                    onRefresh={() => loadFeed(1)}
                                />
                            }
                        />                        
                    </SafeAreaView>                    
                }
            </View>            
        </View>
        
    )
}

const styles = StyleSheet.create({
    menuTop: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        padding: 10,
        borderBottomColor: '#000',
        borderBottomWidth: 1
    },
    menuItem: {
        fontSize: 16
    },
    menuItemSelected: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    feedContainer: {
        padding: 5
    },
    mediaContainer: {
        marginTop: 5,
        width: '100%',
        height: 300,
        backgroundColor: 'gray'
    },
    video: {
        width: 350,
        height: 275,
    },
});

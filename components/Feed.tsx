import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, RefreshControl} from 'react-native';
import { IFeedPost } from '@/interfaces/feedPost';
import api from '../services/api';
import FeedItem from './FeedItem';
import {useRouter} from 'expo-router';
//import { usePathname } from "expo-router";

interface FeedProps {
    userId?: number | null
}

export default function Feed({userId}:FeedProps){
    // const path = usePathname();
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

    const refreshFeed = ():void => {
        setFeedEnd(false);
        loadFeed(1);
    }

    const loadFeed = (pageLoad:number):void => {
        //if(feedEnd) return;

        setLoadingFeed(true);

        const itens = pageLoad > 1 ? [...feedItems] : [];

        api.get('feed', {page: pageLoad, userId})
        .then(posts => {
            setLoadingFeed(false);

            if(posts.length < 3){
                setFeedEnd(true);
                if(!posts.length) return;
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
            setLoadingFeed(false);
        });
    }

    return(
        <View>
            <View style={styles.feedContainer}>
                <SafeAreaView>
                    <FlatList
                        data={feedItems}
                        renderItem={({item}) => <FeedItem item={item} userId={userId} />}
                        keyExtractor={item => item.id ? item.id.toString() : ''}
                        onEndReached={() => {
                            if(feedItems.length >= 3) loadFeed(feedPage + 1);                            
                        }}
                        onEndReachedThreshold={0.3}
                        initialScrollIndex={0}
                        ListHeaderComponent={userId ? null : 
                            <TouchableOpacity onPress={handleNewPost}>
                                <View style={styles.btnNewPost}>
                                    <Text style={styles.btnNewPostLabel}>+ Novo post</Text>
                                </View>                                
                            </TouchableOpacity>
                            
                        }
                        ListFooterComponent={
                            <View style={{height: 300}}>
                                {feedEnd ? 
                                <Text style={styles.textFeedEnd}>(todos os posts deste feed foram carregados.)</Text> :
                                <Text style={styles.textFeedEnd}>(buscando novos posts...)</Text>
                                }
                            </View>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={loadingFeed}
                                onRefresh={refreshFeed}
                            />
                        }
                    />                        
                </SafeAreaView>
            </View>            
        </View>
        
    )
}

const styles = StyleSheet.create({
    btnNewPost: {
        textAlign: 'center',
        backgroundColor: 'rgb(16, 93, 147)',
        marginHorizontal: 30,
        padding: 10,
        borderRadius: 15
    },
    btnNewPostLabel: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    },
    menuItem: {
        fontSize: 16
    },
    menuItemSelected: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    feedContainer: {
        padding: 5,
        paddingBottom: 30
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
    textFeedEnd: {
        textAlign: 'center',
        fontSize: 12
    }
});

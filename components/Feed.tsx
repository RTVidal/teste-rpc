import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView} from 'react-native';
import { IFeedPost } from '@/interfaces/feedPost';
import api from '../services/api';
import { ScrollView } from 'react-native-gesture-handler';

export default function Feed(){
    const [feedOption, setFeedOption] = useState<string>('ALL');
    const [feedPage, setFeedPage] = useState<number>(1)
    const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
    const [feedItems, setFeedItems] = useState<IFeedPost[]>([]);
    const [feedEnd, setFeedEnd] = useState<boolean>(false);

    useEffect(() => {
        loadFeed(1);
    }, []);

    const chooseFeedOption = (option:string):void => {
        if(feedOption === option) return;
        
        setFeedEnd(false);
        setFeedOption(option);
        loadFeed(1);
    }

    const loadFeed = (pageLoad:number):void => {
        setLoadingFeed(true);
        
        const itens = pageLoad > 1 ? [...feedItems] : [];
        console.log('page', pageLoad)
        api.get('feed', {page: pageLoad})
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
                    userAvatarURI: p.userName,
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
            <View style={styles.menuTop}>
                <TouchableOpacity onPress={() => chooseFeedOption('ALL')}>
                    <Text style={feedOption === 'ALL' ? styles.menuItemSelected : styles.menuItem}>Geral</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => chooseFeedOption('FOLLOWING')}>
                    <Text style={feedOption === 'FOLLOWING' ? styles.menuItemSelected : styles.menuItem}>Seguindo</Text>
                </TouchableOpacity>
            </View>
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
                        />                        
                    </SafeAreaView>                    
                }
            </View>            
        </View>
        
    )
}

interface FeedItemProps {
    item: IFeedPost;
}

const FeedItem = ({item}:FeedItemProps) => {
    return(
        <View>
            <Text>{item.userName}</Text>
            <View style={styles.mediaContainer}></View>
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
        width: '100%',
        height: 500,
        backgroundColor: 'gray'
    }
});

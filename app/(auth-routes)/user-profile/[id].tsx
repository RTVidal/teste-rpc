import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, Image, StyleSheet} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '../../../services/api';
import { IFeedPost } from '@/interfaces/feedPost';
import Feed from '@/components/Feed';

export interface IUserProfile {
    id?: number,
    avatarURI?: string,
    name?: String
}

export default function UserProfile(){
    const {id}:string | any = useLocalSearchParams();
    const [user, setUser] = useState<IUserProfile>({});

    useEffect(() => {
        loadUser(id);
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
        default:
            imageSource = require('../../../assets/images/avatar/0.png');
            break;
    }
    
    return(
        <View style={styles.mainContainer}>
            <View style={styles.userDataContainer}>
                <View style={styles.avatarContainer}>
                    <Image source={imageSource} style={styles.avatar}></Image>
                </View>                     
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.feedTitle}>Vídeos de {user.name}</Text>
            </View>
            <Feed userId={id} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingVertical: 10,
        marginVertical: 5,
        padding: 5,
    },
    userDataContainer: {
        alignItems: 'center'
    },
    avatarContainer: {
        marginLeft: 8,
        height: 90,
        width: 90,
        borderRadius: 40,
        alignContent: 'center'
    },
    avatar: {
        height: 90,
        width: 90,
        borderRadius: 40,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    feedTitle: {
        marginTop: 20,
        fontSize: 16
    }
});
import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
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
    const [user, setUser] = useState<IUserProfile>({});

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = ():void => {
        api.get('user', sessionData?.userId)
        .then(user => {
            setUser(user);
        })
        .catch(err => {
            console.log(err);
            alert('Não foi possível carregar os dados do usuário');
        })
    }

    const handleExit = ():void => {
        signOut();
        router.replace('/login');
    }

    let imageSource = require('../../../assets/images/avatar/0.png');
    
    return(
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={handleExit}>
                <Text style={styles.btnExit}>Sair (desfazer login)</Text>
            </TouchableOpacity>
            <View style={styles.userDataContainer}>
                
                <View style={styles.avatarContainer}>
                    <Image source={imageSource} style={styles.avatar}></Image>
                </View>           
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userName}>{user.email}</Text>
                <Text style={styles.feedTitle}>Seu feed</Text>
            </View>
            
            <Feed userId={sessionData?.userId} />
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
    },
    btnExit: {
        textAlign: 'right',
        marginVertical: 10,
        fontSize: 14,
        textDecorationLine: 'underline',
        color: 'red'
    }
});
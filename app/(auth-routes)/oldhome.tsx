import React, {useContext, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import { useRouter, Link } from "expo-router";
import { useSession } from "../ctx";
import Feed from '../../components/Feed';

export default function Home(){
    const { signOut, sessionData } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log('data home', sessionData);
    }, []);

    const handleExit = ():void => {
        signOut();
        router.replace('/login');
    }

    return(
        <View>
            <Feed/>
            {/* <Link href={"/user-profile"}>IR para perfil do usuário</Link> */}
            {/* <Button
                title="Exit"
                onPress={handleExit}
            /> */}
        </View>
    )
}
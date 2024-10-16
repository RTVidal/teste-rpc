import React, {useState, useContext} from 'react';
import {View, Text, Button, KeyboardAvoidingView, SafeAreaView, TextInput} from 'react-native';
import {onSignIn} from '../auth';
import { IUserData } from '@/interfaces/UserData';
import { Link, Redirect, useRouter } from "expo-router";
import api from '../services/api';
import { useSession } from "./ctx";

export default function Login(){
    const { signIn, session, sessionData } = useSession();
    const [email, setEmail] = useState<string>('');
    const [password, setPassowrd] = useState<string>('');

    const router = useRouter();

    const handleTextInputChange = (key:string, value:string) => {
        switch(key){
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassowrd(value);
                break;
        }
    }

    const handleLogin = ():void => {
        console.log('session data', sessionData);

        if(!email || !password) return alert('Credenciais inválidas');

        
        api.post('login', {email, password})
        .then(user => {
            signIn({userId: user.id, userName: user.name});
            router.replace('/home');

            onSignIn('token')
            .then((userData:IUserData) => {
                router.replace('/');
    
                //router.push('/register');
                //navigation.goBack();
            });
        })
        .catch(() => {
            alert('Credenciais inválidas');
        })
    }

    if (session) {
        return <Redirect href="/home" />;
    }

    return(
        <View>
            <KeyboardAvoidingView style={{ paddingVertical: 15 }}>
            <SafeAreaView>
                <TextInput
                    placeholder='Email'
                    onChangeText={text => handleTextInputChange('email', text)}
                    value={email}
                />
                <TextInput
                    placeholder='Senha'
                    onChangeText={text => handleTextInputChange('password', text)}
                    secureTextEntry={true}
                    value={password}
                />
            </SafeAreaView>
            </KeyboardAvoidingView>
            <Button
                title="Login"
                onPress={handleLogin}
            />
            <Link href={'/register'}>Criar uma conta</Link>
        </View>        
    )
}
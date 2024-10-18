import React, {useState} from 'react';
import {View, Text, Button, KeyboardAvoidingView, SafeAreaView, TextInput, StyleSheet} from 'react-native';
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
        if(!email || !password) return alert('Credenciais inválidas');

        
        api.post('login', {email, password})
        .then(user => {
            signIn({userId: user.id, userName: user.name});
            router.replace('/home');
        })
        .catch(() => {
            alert('Credenciais inválidas');
        })
    }

    if (session) {
        return <Redirect href="/home" />;
    }

    return(
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Video&Video</Text>
            <Text style={styles.subtitle}>Informe seus dados de acesso para continuar!</Text>
            <KeyboardAvoidingView style={{ paddingVertical: 15 }}>
            <SafeAreaView>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        inputMode="email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder='Email'
                        onChangeText={text => handleTextInputChange('email', text)}
                        value={email}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Senha'
                        onChangeText={text => handleTextInputChange('password', text)}
                        secureTextEntry={true}
                        value={password}
                    />
                </View>
            </SafeAreaView>
            </KeyboardAvoidingView>
            <Button
                title="Login"
                onPress={handleLogin}
            />
            <View>
            </View>
            <Link style={styles.btnSignUp} href={'/register'}>
                <Text>Criar uma conta</Text>
            </Link>
        </View>        
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingTop: 80,
        paddingHorizontal: 10,
        backgroundColor: 'rgb(16, 93, 147)', 
        flex: 1
    },
    title: {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center'
    },
    subtitle: {
        marginTop: 30,
        color: '#eaeaea',
        fontSize: 16,
        textAlign: 'center'
    },
    inputContainer: {
        backgroundColor: '#fff',
        marginVertical: 15,
        padding: 10
    },
    input: {
        fontSize: 18
    },
    btnSignUp: {
        marginTop: 15,
        textAlign: 'right',
        fontSize: 20,
        color: '#fff'
    }
});
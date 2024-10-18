import React, {useState} from 'react';
import {ScrollView, View, Text, Button, KeyboardAvoidingView, StyleSheet, TextInput} from 'react-native';
import { useRouter } from "expo-router";
import api from '../services/api';

export default function Register(){
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const router = useRouter();

    const handleTextInputChange = (key:string, value:string) => {
        switch(key){
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'passwordConfirm':
                setPasswordConfirm(value);
                break;
        }
    }

    const handleRegister = ():void => {
        let isOk = true;

        if(!name){
            isOk = false;
            alert('Informe o nome.');
        }

        if(!email){
            isOk = false;
            alert('Informe o email.');
        }

        if(!password){
            isOk = false;
            alert('Informe a senha.');
        } else {
            if(password !== passwordConfirm){
                isOk = false;
                alert('A senha e a confirmação de senha não conferem.');
            }
        }
        
        if(!isOk) return;

        api.put('register', {name, email, password})
        .then(() => {
            alert('Cadastro efetuado com sucesso!');
            router.replace('/login');
        })
        .catch((err:string) => {
            if(err === 'already_exists') return alert('Usuário já cadastrado.');
            console.log(err);
            alert('Não foi possível finalizar o cadastro. Verifique os dados informados.');
        })
    }

    return(
        <ScrollView style={styles.mainContainer}>
            <KeyboardAvoidingView style={{ paddingVertical: 15 }}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Nome'
                        onChangeText={text => handleTextInputChange('name', text)}
                        value={name}
                    />
                </View>                
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
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Confirme a senha'
                        onChangeText={text => handleTextInputChange('passwordConfirm', text)}
                        secureTextEntry={true}
                        value={passwordConfirm}
                    />
                </View>
            </KeyboardAvoidingView>
            <Button
                title="Cadastrar"
                onPress={handleRegister}
            />
        </ScrollView>        
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
        fontSize: 15
    },
    btnSignUp: {
        marginTop: 15,
        textAlign: 'right',
        fontSize: 20,
        color: '#fff'
    }
});
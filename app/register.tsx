import React, {useState} from 'react';
import {ScrollView, Text, Button, KeyboardAvoidingView, SafeAreaView, TextInput} from 'react-native';
import {onSignIn} from '../auth';
import { IUserData } from '@/interfaces/UserData';
import { Link, useNavigation, useRouter } from "expo-router";
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

        api.post('register', {name, email, password})
        .then(() => {
            alert('Cadastro efetuado com sucesso!');
            router.replace('/login');
        })
        .catch((err:string) => {
            if(err === 'already_exists') return alert('Usuário já cadastrado.');

            alert('Não foi possível finalizar o cadastro. Verifique os dados informados.');
        })
    }

    return(
        <ScrollView>
            <KeyboardAvoidingView style={{ paddingVertical: 15 }}>
                {/* <SafeAreaView> */}
                    <TextInput
                        placeholder='Nome'
                        onChangeText={text => handleTextInputChange('name', text)}
                        value={name}
                    />
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
                    <TextInput
                        placeholder='Confirme a senha'
                        onChangeText={text => handleTextInputChange('passwordConfirm', text)}
                        secureTextEntry={true}
                        value={passwordConfirm}
                    />
                {/* </SafeAreaView> */}
            </KeyboardAvoidingView>
            <Button
                title="Cadastrar"
                onPress={handleRegister}
            />
        </ScrollView>        
    )
}
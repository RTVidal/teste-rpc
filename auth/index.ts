import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserData } from '../interfaces/UserData';

const TOKEN_KEY = "@TESTE-RPC:token";

export const isSignedIn = (): Promise<IUserData> => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(TOKEN_KEY)
        .then(token => {
            console.log('token', token);
            if(!token) return reject();
    
            return resolve({userId: 0, userName: ''});
        })
        .catch(err => {
            console.log(err);
            reject();
        })
    });
}

export const onSignIn = (token:string): Promise<IUserData> => {
    return new Promise(resolve => {
        AsyncStorage.setItem(TOKEN_KEY, token);
        resolve({userId: 0, userName: ''});
    });
}

export const onSignOut = (): Promise<void> => {
    return new Promise(resolve => {
        AsyncStorage.removeItem(TOKEN_KEY)
        .then(() => resolve());
    });
}

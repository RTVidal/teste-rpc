import {View, Text, Button} from 'react-native';
import {onSignOut} from '../../auth';
import { useRouter } from "expo-router";
import { useSession } from "../ctx";

export default function Profile(){
    const { signOut, sessionData } = useSession();
    const router = useRouter();

    const handleExit = ():void => {
        signOut();
        router.replace('/login');
    }

    return(
        <View>
            <Text>EXIT</Text>
            <Button
                title="Exit"
                onPress={handleExit}
            />
        </View>
    )
}
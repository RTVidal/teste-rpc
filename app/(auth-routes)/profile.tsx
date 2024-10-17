import {View, Text, Button} from 'react-native';
import { useRouter } from "expo-router";
import { useSession } from "../ctx";

export default function Profile(){
    const { signOut, sessionData } = useSession();
    const router = useRouter();

    const handleNewVideo = ():void => {
        
    }

    const handleExit = ():void => {
        signOut();
        router.replace('/login');
    }

    return(
        <View>            
            <Button
                title="Exit"
                onPress={handleExit}
            />
        </View>
    )
}
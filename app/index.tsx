import { Redirect } from "expo-router";
import { useSession } from "./ctx";

export const unstable_settings = {
  initialRouteName: "login",
};

export default function Index(){
  const { session } = useSession();

    if (session) {
      return <Redirect href="/home" />;
    } else {
      return <Redirect href="/login" />;
    }
}
import { StatusBar } from "react-native";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { NativeBaseProvider } from "native-base";
import { Loading } from "@components/loading";
import { THEME } from "./src/theme";
import { SignIn } from "@screens/SignIn";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
  
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {fontsLoaded ? <SignIn/> : <Loading />}
   
    
    </NativeBaseProvider>
  );
}

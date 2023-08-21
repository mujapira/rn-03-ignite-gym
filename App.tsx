import { Text, View, StatusBar } from "react-native";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { NativeBaseProvider } from "native-base";
import { Loading } from "@components/loading";
import { THEME } from "./src/theme";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#202024",
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {fontsLoaded ? <Text>Oi mundo</Text> : <Loading />}
   
      </View>
    </NativeBaseProvider>
  );
}

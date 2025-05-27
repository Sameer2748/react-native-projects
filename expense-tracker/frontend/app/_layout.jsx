import { Slot, Stack } from "expo-router";
import SafeScreen from "../components/safeScreen"
import { tokenCache } from '@clerk/clerk-expo/token-cache'

import { ClerkProvider } from '@clerk/clerk-expo'


export default function RootLayout() {
  return(
    <ClerkProvider tokenCache={tokenCache}>
    <SafeScreen>
    {/* <Stack screenOptions={{headerShown: false}} />; */}
      <Slot />
  </SafeScreen> 
    </ClerkProvider>  
  )
}

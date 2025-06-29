import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import InitialLayout from '@/components/InitialLayout'
import ClerkAndConvexProvider from '@/provider/ClerkAndConvexProvider'
import { SplashScreen } from 'expo-router'
import { useFonts } from 'expo-font'
import { useCallback } from 'react'

// SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    SplashScreen.hideAsync()
    // if (!fontsLoaded) SplashScreen.hideAsync()
    //   else SplashScreen.hideAsync()
  }, [fontsLoaded])

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: '#000' }}
          onLayout={onLayoutRootView}
        >
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  )
}
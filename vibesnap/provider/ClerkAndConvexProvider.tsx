import { View, Text } from 'react-native'
import React from 'react'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient("https://insightful-cuttlefish-129.convex.cloud", {
  unsavedChangesWarning: false
})

function InnerProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth()

  React.useEffect(() => {
    (async () => {
      const token = await getToken({ template: "convex" });
      console.log("Convex JWT Token:", token);
    })();
  }, [getToken]);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}

// function InnerProvider({ children }: { children: React.ReactNode }) {
//   const { getToken, signOut, isSignedIn } = useAuth()

//   React.useEffect(() => {
//     const clearSession = async () => {
//       if (isSignedIn) {
//         await signOut()
//         console.log("User signed out")
//       }
//     }

//     clearSession()
//   }, [isSignedIn])

//   return (
//     <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
//       {children}
//     </ConvexProviderWithClerk>
//   )
// }


export default function ClerkAndConvexProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <InnerProvider>
        {children}
      </InnerProvider>
    </ClerkProvider>
  )
}

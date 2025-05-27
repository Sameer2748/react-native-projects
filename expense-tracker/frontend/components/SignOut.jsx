import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { styles } from '../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/colors'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await signOut()
            } catch (error) {
              console.error('Sign out error:', error)
            }
          },
        },
      ],
      { cancelable: true }
    )
  }
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
    </TouchableOpacity>
  )
}
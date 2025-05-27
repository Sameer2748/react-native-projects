import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/theme'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/feed.styles'
import { Image } from 'expo-image'

export default function Bookmarks() {

  const bookMarks = useQuery(api.bookmarks.getBookmarkedPosts)

  if(bookMarks?.length === 0 ) return <NoBookMarkFound/>
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.headerTitle} >Bookmarks</Text>
      </View>

      {/* Posts */}
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {bookMarks?.map((post) => {
          if (!post) return null
          console.log(post);
          
          return (
            <View key={post._id} style={{ width: '33.33%', padding: 1 }}>
              <Image
                source={post.imageUrl}
                style={{ width: '100%', aspectRatio: 1 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </View>
          )
        })}
      </ScrollView>

    </View>
  )
}

const NoBookMarkFound= ()=>{

  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center", backgroundColor: COLORS.background}}>
      <Text style={{color:COLORS.primary, fontSize: 22}}>
        No BookMarks Saved yet!
      </Text>
    </View>
  )
}
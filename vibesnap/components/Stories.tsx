import Story from './Story'
import { STORIES } from '@/constants/Mock-data'
import { styles } from '@/styles/feed.styles'
import { ScrollView } from 'react-native'

const StoriesSection = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
    >
      {STORIES.map((story) => (
        <Story key={story.id} story={story} />
      ))}
    </ScrollView>
  )
}

export default StoriesSection
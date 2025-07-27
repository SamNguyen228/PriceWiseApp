import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import exploreStyle from '@/styles/exploreStyle';

interface Props {
  categories: { id: string; label: string }[];
}

export default function CategorySuggestionGrid({ categories }: Props) {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/logo.png')}
      style={exploreStyle.fullBackgroundImage}
      imageStyle={{ opacity: 0.25 }}
      resizeMode="contain"
    >
      <View style={exploreStyle.overlayContent}>
        <Text style={exploreStyle.suggestTitle}>Khám phá danh mục</Text>

        <View style={exploreStyle.suggestGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={exploreStyle.suggestBox}
              onPress={() =>
                router.push({
                  pathname: '/drawer/explore',
                  params: { categoryId: cat.id, categoryName: cat.label },
                })
              }
            >
              <Text style={exploreStyle.suggestText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

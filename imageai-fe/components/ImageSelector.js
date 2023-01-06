import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

function ImageSelector() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  let selectionAmount = 12 - images.length;

  const pickImages = async () => {
    // No permissions request is necessary for launching the image library
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      allowsMultipleSelection: true,
      selectionLimit: selectionAmount,
      aspect: [4, 3],
      quality: 1,
    });
    setIsLoading(false);
    for (let i = 0; i < result.assets.length; i++) {
      let asset = result.assets[i];
      if (!result.canceled && asset.uri) {
        setImages((prevState) => [...prevState, asset.uri]);
      }
    }
  };

  return (
    <FlatList
      data={images}
      renderItem={({ item }) => {
        console.log("item", item);
        return (
          <Image
            source={{ uri: item }}
            style={{ width: width / 2, height: 250 }}
          />
        );
      }}
      numColumns={2}
      keyExtractor={(item) => item}
      contentContainerStyle={{ marginVertical: 50, paddingBottom: 100 }}
      ListHeaderComponent={
        isLoading ? (
          <View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
            >
              Loading...
            </Text>
            <ActivityIndicator size={"large"} />
          </View>
        ) : (
          <Button
            disabled={images.length > 11}
            title="Pick images"
            onPress={pickImages}
          />
        )
      }
    />
  );
}

export default ImageSelector;

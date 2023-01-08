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
import axios from "axios";

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
      aspect: [1, 1],
      quality: 1,
    });
    setIsLoading(false);
    for (let i = 0; i < result.assets.length; i++) {
      let asset = result.assets[i];
      console.log("asset", asset);
      if (!result.canceled && asset.uri) {
        // const data = {
        //   uri: asset.ui,
        //   fileName: asset.fileName,
        //   fileType: asset.type,
        //   type: "profileAvatars",
        // };
        setImages((prevState) => [...prevState, asset.uri]);
      }
    }
  };

  const generateAiImg = (s3Key) => {
    const data = {
      key: "QG4CnkidFlqlYIVXVynUEPLKd9JuUiYLRwghDwIzxf1mBDAbSNZngxGqDHhy",
      model_id: "midjourney",
      prompt: "mdjrny-v4 style space",
      negative_prompt: null,
      init_image: `https://imagebucket-imageai.s3.amazonaws.com/${s3Key}`,
      width: "512",
      height: "512",
      samples: "1",
      num_inference_steps: "30",
      guidance: null,
      strength: null,
      seed: null,
      webhook: null,
      track_id: null,
      scheduler: "EulerAncestralDiscreteScheduler",
    };
    axios
      .post("https://stablediffusionapi.com/api/v3/dreambooth/img2img", data)
      .then((res) => {
        console.log("res::", res);
      })
      .catch(console.log);
  };

  const uploadImages = async () => {
    const url =
      "https://yntq8h8ne9.execute-api.us-east-1.amazonaws.com/dev/presigned";
    const testImage = images[0];
    const resp = await fetch(testImage);
    const imageBody = await resp.blob(); // conv uri to blob

    const presignedurl = await axios
      .get(url, { params: { contentType: resp._bodyBlob.type } })
      .then((res) => {
        return res.data;
      });
    const key = presignedurl.key;
    const result = await fetch(presignedurl.signedUrl, {
      method: "PUT",
      body: imageBody,
    });
    const data = JSON.stringify(result);
    console.log("result", JSON.stringify(result));
    generateAiImg(key);
  };

  function deleteImage(image) {
    if (images.includes(image)) {
      const filteredArrayOfImages = images.filter((img) => {
        return img !== image;
      });
      setImages(filteredArrayOfImages);
    }
  }

  return (
    <FlatList
      data={images}
      renderItem={({ item }) => {
        return (
          <View>
            <Text onPress={() => deleteImage(item)} style={styles.deleteBtn}>
              X
            </Text>
            <Image
              source={{ uri: item }}
              style={{ width: width / 2, height: 250 }}
            />
            {images && (
              <View>
                <Button title="Upload Images" onPress={uploadImages} />
              </View>
            )}
          </View>
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
const styles = StyleSheet.create({
  deleteBtn: {
    zIndex: 2,
    color: "red",
    position: "absolute",
    left: 0,
    padding: 10,
    backgroundColor: "blue",
    top: 0,
  },
});

export default ImageSelector;

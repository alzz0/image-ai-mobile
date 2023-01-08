import * as React from "react";
import { View, Text } from "react-native";
import ImageSelector from "../../components/ImageSelector";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ImageSelector />
    </View>
  );
}

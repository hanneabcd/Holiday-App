import React from "react";
import { Text, View, Image } from "react-native";
import { Header } from "react-native-elements";

export default function about() {
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor:"mistyrose" }}>
        <Text style={{padding: 20, color: 'grey', fontSize: 20, fontWeight: "bold", marginTop:150}}>VakantieApp van Hannelore Baarssen waar overzichten van vakanties te vinden zijn.</Text>
    </View>
  );
}
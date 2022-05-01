import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function settings() {
  const [Region, setRegion] = useState(getRegion);
  const setNewRegion = async (region) => {
    setRegion(region);
    try {
      await AsyncStorage.setItem("Region", region);
    } catch (e) {
      console.log(e);
    }
    console.log(region);
  };
  const getRegion = async () => {
    try {
      region = await AsyncStorage.getItem("Region");
    } catch (e) {
      console.log(e);
    }
    setRegion(region);

  };
  getRegion();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
  
      <Text style={{marginTop:250, fontWeight:"bold"}}>Kies een regio</Text>
      <View
        style={{
          borderWidth: 2,
          borderColor: "black",
          width: 350,
          justifyContent: "center"
        }}
      >
        <Picker
          selectedValue={Region}
          onValueChange={(itemValue) => setNewRegion(itemValue)}
        >
          <Picker.Item label="noord" value="Noord" />
          <Picker.Item label="midden" value="Midden" />
          <Picker.Item label="zuid" value="Zuid" />
        </Picker>
      </View>
    </View>
  );
}
import { Text, View, StyleSheet, RefreshControl, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CountDown from "react-native-countdown-component";
import { Header } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CounterTab() {
  const [HolidayData, setHolidayData] = useState([]);
  const [Available, SetAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [Region, setRegion] = useState();

  function getData() {
    axios
      .get(
        "https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/2021-2022?output=json"
      )
      .then((res) => {
        const data = {};
        let dataSet = false;
        res.data.content[0].vacations.forEach((element) => {
          let ans = calculateDays(element.regions[0].startdate);
          if (dataSet) {
            return;
          }
          if (ans <= 0) {
            return;
          }
          data.type = element.type;
          data.regions = element.regions;
          data.daysToGo = ans;
          dataSet = true;
        });
        console.log(data);
        setHolidayData(data);
        SetAvailable(true);
      });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRegion()
    getData()
    setRefreshing(false);
  }, []);

  const getRegion = async () => {
    try {
      region = await AsyncStorage.getItem("Region");
    } catch (e) {
      console.log(e);
    }
    setRegion(region);
  };

  useEffect(() => {
    getData();
    getRegion();
  }, []);

  function calculateDays(date) {
    const date1 = new Date();
    const date2 = new Date(date);
    return Math.floor((date2 - date1) / 1000);
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
    >
 
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {Available ? (
        <CountDown
          timeLabels={{d: 'dagen tot vakantie',}}
          until={(HolidayData.daysToGo)}
          digitStyle={{backgroundColor: 'mistyrose'}}
          timeToShow={['D']}
          size={75}  
        />
      ) : (
        <Text>Something went wrong</Text>
      )}
      <Text style={{}}>in regio {[region]}</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  Margintest: {
    marginTop: 210,
  },
});
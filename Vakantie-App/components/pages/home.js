import React, {useState, useEffect} from "react";
import { Text, ScrollView, StyleSheet, RefreshControl, Image } from "react-native";
import { ListItem } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function home() {
    const [HolidayData, setHolidayData] = useState([]);
    const [Loaded, SetAvailable] = useState(false);
    const [SchoolYear, SetSchoolYear] = useState("2021-2022");
    const [Region, setRegion] = useState();
    const [refreshing, setRefreshing] = useState(false);
  
    function getData() {
      axios
        .get(
          "https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/" +
            SchoolYear +
            "?output=json"
        )
        .then((res) => {
          const data = res.data.content[0];
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
    }, [SchoolYear]);
  
    return (
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
     
        <Picker
        style={{ backgroundColor: "lightgrey", color: "grey"}}
        selectedValue={SchoolYear}
        onValueChange={(itemValue, itemIndex) => SetSchoolYear(itemValue)}
      >
        <Picker.Item style={{ backgroundColor: "mistyrose", color: "grey" }}  label="2021-2022" value="2021-2022" />
        <Picker.Item style={{ backgroundColor: "lightgrey", color: "white" }}label="2024-2025" value="2024-2025" />
        <Picker.Item style={{ backgroundColor: "mistyrose", color: "grey" }} label="2023-2024" value="2023-2024" />
        <Picker.Item style={{ backgroundColor: "lightgrey", color: "white" }} label="2025-2026" value="2025-2026" />
      </Picker>
      <Text style={{ color: "grey", marginLeft:50, fontWeight: "bold" }}>Je ziet nu het overzicht van regio {[Region]}</Text>
        {Loaded ? (
          HolidayData.vacations.map((d, i) => (
            <ListItem key={i}>
              <ListItem.Content style={styles.centerText}>
                <ListItem.Title style={styles.seasonTitle}>{d.type}</ListItem.Title>
                {d.regions.map((sd, i) => (
                  <ListItem.Subtitle key={i} style={styles.ratingText}>
                    {sd.region.charAt(0).toUpperCase() + sd.region.slice(1).toLowerCase()}: {sd.startdate.slice(0, 10)} -{" "}
                    {sd.enddate.slice(0, 10)}
                  </ListItem.Subtitle>
                ))}
              </ListItem.Content>
            </ListItem>
          ))
        ) : (
          <Text>Something went wrong</Text>
        )}
      
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  centerText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'mistyrose',
    paddingBottom: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "lightgrey",
  },

  seasonTitle: {
    color: 'grey',
    marginLeft: -100,
  },
});
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import { decode } from "base-64";
import AsyncStorage from "@react-native-async-storage/async-storage";
global.atob = decode;
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const navigation = useNavigation()

  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchProfile();
  }, []);

  const logout = () => {
     clearAuthToken()
  }

  const clearAuthToken = async() => {
       await AsyncStorage.removeItem("authToken") 
       console.log("Cleared auth token") 
       navigation.replace("Login")
  }

  return (
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 10,
              backgroundColor: "#D0D0D0",
            }}
          >
            <Text>Threads.net</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 25,
          }}
        >
          <View>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                resizeMode: "contain",
              }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "400" }}>
              Creative Junkie , Sucker for Music
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "400" }}>
              Code to Create , Story Teller{" "}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "400" }}>
              SomeTimes Weird
            </Text>
          </View>
        </View>
        <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
          {user?.followers?.length} followers{" "}
        </Text>
        <View  style ={{ flexDirection : "row" , alignItems : "center" , gap : 10 , display : "flex", marginTop : 20 }}>
          <TouchableOpacity
            style={{
              flex : 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
              backgroundColor: "#000000",
            }}
          >
            <Text style ={{color : "white" , fontWeight : "bold"}}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={logout}
            style={{
              flex : 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
              backgroundColor: "#000000",
            }}
          >
            <Text style ={{color : "white" , fontWeight : "bold"}}>LogOut</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});

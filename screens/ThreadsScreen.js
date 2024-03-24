import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import { decode } from "base-64";
import axios from "axios";
global.atob = decode;

const ThreadsScreen = () => {
  const [content, setContent] = useState("");
  const { userId, setUserId } = useContext(UserType); 
  const [user, setUser] = useState("")

  useEffect(() =>{
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
  },[])

  const handlePostSubmit = () => {
    const postData = {
      userId,
    };
    if (content) {
      postData.content = content;
    }

    axios
      .post("http://10.0.2.2:3000/create-post", postData)
      .then((response) => {
        setContent("");
      })
      .catch((error) => {
        console.log("error creating post", error);
      });
  };

  return (
    <SafeAreaView style={{ paddingTop: 45, paddingLeft: 25, paddingRight: 25 }}>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text style={{fontWeight : "600"}} >{user?.name}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 10,
          marginTop: 18,
          paddingBottom: 30,
        }}
      >
        <TextInput
          onChangeText={(text) => setContent(text)}
          value={content}
          placeholderTextColor={"black"}
          placeholder="Type your message"
          multiline
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={handlePostSubmit}
          style={{
            backgroundColor: "black",
            paddingVertical: 10,
            borderRadius: 5,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            Share Post
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({});

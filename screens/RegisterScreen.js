import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post("http://10.0.2.2:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "you have been registered successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred during registration"
        );
        console.log("error", error);
      });
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ marginTop: 70 }}>
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            Register your Account
          </Text>
        </View>
        <View style={{ marginTop: 40 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <AntDesign
              style={{ marginLeft: 10 }}
              name="user"
              size={24}
              color="black"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{ color: "gray", marginVertical: 10, width: 300 }}
              placeholder="Enter your Name"
            />
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <AntDesign
              style={{ marginLeft: 10 }}
              name="mail"
              size={24}
              color="black"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{ color: "gray", marginVertical: 10, width: 300 }}
              placeholder="Enter your Email"
            />
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <AntDesign
              style={{ marginLeft: 10 }}
              name="key"
              size={24}
              color="black"
            />
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{ color: "gray", marginVertical: 10, width: 300 }}
              placeholder="Enter your Password"
            />
          </View>
        </View>

        <View style={{ marginTop: 30 }} />

        <Pressable
          onPress={handleRegister}
          style={{
            width: 200,
            backgroundColor: "black",
            padding: 15,
            marginTop: 40,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "white",
              fontSize: 17,
            }}
          >
            Register
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Already have an Account ? Login
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});

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
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"

const LoginScreen = () => { 
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("") ;
    const navigation = useNavigation()

    useEffect(()=>{
         const checkLoginStatus = async() => {
          try {
              const token = await AsyncStorage.getItem("authToken") ;
              if(token) {
                 setTimeout(()=> {
                      navigation.replace("Main")
                 },400)
              }

          } catch (error) {
             console.log("error" , error)
          }
         }
         
         checkLoginStatus() ;
    },[])
   
    const handleLogin = () => {
         const user = {
           email : email ,
           password :  password 
         }
         
         axios.post("http://10.0.2.2:3000/login",user) 
         .then((response)=> {
              console.log(response);
              const token = response.data.token  ;
              AsyncStorage.setItem("authToken",token) ;
              navigation.navigate("Main") ;
         }).catch((error)=> {
            Alert.alert("Login Error") 
            console.log("error", error) ;
         })
    }

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
            Login to your Account
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
              name="mail"
              size={24}
              color="black"
            />
            <TextInput
              value={email} 
              onChangeText={(text)=> setEmail(text)}
              style={{ color: "gray", marginVertical: 10, width: 300 }}
              placeholder="Enter your Email"
            />
          </View>
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
              name="key"
              size={24}
              color="black"
            />
            <TextInput
              secureTextEntry = {true}
              value={password}
              onChangeText={(text) => setPassword(text)} 
              style={{ color: "gray", marginVertical: 10, width: 300 }}
              placeholder="Enter your Password"
            />
          </View>
        </View>
        
        <View style={{ display : "flex" , flexDirection :"row" , alignItems :"center" , justifyContent:"space-between" , marginTop : 20  }}> 

        <Text>Keep Me Logged In</Text>
        <Text style={{fontWeight :"500" , color :"#007FFF"}}>Forgot Password ?</Text>

        </View>

        <View  style={{marginTop : 40}}/>

        <Pressable 
         onPress={handleLogin} 
          style={{
            width : 200,
            backgroundColor : "black" ,
            padding : 15 ,
            marginTop: 40 ,
            marginLeft : "auto",
            marginRight :"auto",
            borderRadius : 10 
          }}
          
          >
            <Text style={{
                textAlign : "center", 
                fontWeight :"bold" ,
                color : "white",
                fontSize : 17
             }}>Login</Text>
        </Pressable> 

        <Pressable onPress={()=> navigation.navigate("Register")} style={{marginTop : 15  }} >
            <Text style ={{textAlign :"center" , fontSize : 16 }} >Don't have an Account ? Sign Up</Text>
        </Pressable>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});

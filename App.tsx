import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import Meteor from "@meteorrn/core";
import { createClient } from "./meteor-proxy";
import type { Server } from "./server/server/main";

Meteor.connect("wss://localhost:3000/websocket", {
  AsyncStorage: {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    removeItem: SecureStore.deleteItemAsync,
  },
});

const server = createClient<Server>();

export default function App() {
  const [hello, setHello] = useState("OTHER THING");

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Hello: {hello}</Text>

      <Button
        title="Call hello"
        onPress={() => {
          server.hello().then(setHello);
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

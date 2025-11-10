import React from "react";
import { ScrollView, SafeAreaView } from "react-native";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { ImageList } from "./components/ImageList";
import { globalStyles } from "./styles/globalStyles";

export default function App() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollContent}>
        <Header />
        <ImageUploader />
        <ImageList />
      </ScrollView>
    </SafeAreaView>
  );
}

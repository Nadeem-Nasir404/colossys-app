import { AuthContext, AuthProvider } from "@/src/contexts/AuthContexts";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Redirect, Slot, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// ✅ Custom Drawer with Header, User Info & Logout
function CustomDrawerContent(props: any) {
  const { logout, user } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* 🔹 App Title */}
      <View
        style={{
          paddingVertical: 25,
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: "#e0e0e0",
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            color: "#FF4A2C",
            letterSpacing: 1,
          }}
        >
          COLOSSYS
        </Text>
      </View>

      {/* 🔹 User Info */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderColor: "#e0e0e0",
          marginBottom: 35,
        }}
      >
        {/* User Icon */}
        <Ionicons name="person-circle-outline" size={40} color="#FF4A2C" />

        {/* Name */}
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: "#000", fontSize: 13, fontWeight: "bold" }}>
            {user?.name || "User"}
          </Text>
        </View>
      </View>

      {/* Drawer Items */}
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        <DrawerItemList {...props} />
      </View>

      {/* 🚪 Logout */}
      <TouchableOpacity
        style={{
          marginTop: "auto",
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={22} color="red" />
        <Text style={{ marginLeft: 10, fontSize: 16, color: "red" }}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

// ✅ Auth Guard
function AuthGuard() {
  const { userToken, restoreSession } = useContext(AuthContext);
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      console.log("🔄 Restoring session...");
      await restoreSession();
      setLoading(false);
    };
    init();
  }, [restoreSession]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#FF4A2C" />
      </SafeAreaView>
    );
  }

  // ⛔ No token → login only
  if (!userToken) {
    if (pathname !== "/login") {
      return <Redirect href="/login" />;
    }
    return <Slot />;
  }

  // ✅ Logged in but tries login → redirect home
  if (userToken && pathname === "/login") {
    return <Redirect href="/" />;
  }

  // ✅ Drawer after login
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#FF4A2C" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#FF4A2C",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UnitWise"
        options={{
          title: "Unit Wise",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Machines"
        options={{
          title: "Machines",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

// ✅ Root Layout
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthGuard />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

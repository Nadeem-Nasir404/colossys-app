import { AuthContext, AuthProvider } from "@/src/contexts/AuthContexts";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Redirect, Slot, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text as RNText,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// ✅ Fonts
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

// ✅ Our CustomText wrapper
import CustomText from "@/src/components/CustomText";

// 🔹 Patch RNText globally to always use CustomText
(RNText as any).render = (props: any, ref: any) => {
  return <CustomText {...props} ref={ref} />;
};

// ---------------- Drawer Content ----------------
function CustomDrawerContent(props: any) {
  const { logout, user } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Title */}
      <View
        style={{
          paddingVertical: 25,
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: "#e0e0e0",
          marginBottom: 15,
        }}
      >
        <CustomText
          style={{
            fontSize: 35,
            color: "#FF4A2C",
            letterSpacing: 1,
            fontFamily: "Poppins_700Bold",
          }}
        >
          COLOSSYS
        </CustomText>
      </View>

      {/* User */}
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
        <Ionicons name="person-circle-outline" size={40} color="#FF4A2C" />
        <View style={{ marginLeft: 10 }}>
          <CustomText style={{ fontSize: 13, fontFamily: "Poppins_500Medium" }}>
            {user?.name || "User"}
          </CustomText>
        </View>
      </View>

      {/* Drawer Items */}
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        <DrawerItemList {...props} />
      </View>

      {/* Logout */}
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
        <CustomText style={{ marginLeft: 10, fontSize: 16, color: "red" }}>
          Logout
        </CustomText>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

// ---------------- Auth Guard ----------------
function AuthGuard() {
  const { userToken, restoreSession } = useContext(AuthContext);
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
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

  if (!userToken) {
    if (pathname !== "/login") return <Redirect href="/login" />;
    return <Slot />;
  }

  if (userToken && pathname === "/login") return <Redirect href="/" />;

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#512626ff" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#FF4A2C",
        drawerLabelStyle: { fontFamily: "Poppins_500Medium", fontSize: 14 },
        headerTitleStyle: { fontFamily: "Poppins_700Bold", fontSize: 18 },
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

// ---------------- Root Layout ----------------
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#FF4A2C" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthGuard />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

import { AuthContext, AuthProvider } from "@/src/contexts/AuthContexts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Slot, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text as RNText,
  StyleSheet,
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
    <LinearGradient colors={["#ffffff", "#fff5f2"]} style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flex: 1, paddingTop: 0 }}
      >
        {/* Title */}
        <View style={styles.headerBox}>
          <CustomText weight="bold" style={styles.logoText}>
            COLOSSYS
          </CustomText>
        </View>

        {/* User */}
        <View style={styles.userBox}>
          <Ionicons name="person-circle-outline" size={40} color="#FF4A2C" />
          <View style={{ marginLeft: 10 }}>
            <CustomText weight="medium" style={styles.userName}>
              {user?.name || "User"}
            </CustomText>
          </View>
        </View>

        {/* Drawer Items */}
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          {props.state.routes.map((route: any, index: number) => {
            const focused = props.state.index === index;
            const iconMap: any = {
              index: "home-outline",
              UnitWise: "analytics-outline",
              Machines: "cog-outline",
            };

            return (
              <DrawerItem
                key={route.key}
                label={({ color }) => (
                  <CustomText
                    weight="medium"
                    style={[
                      styles.drawerLabel,
                      { color: focused ? "#fff" : "#333" },
                    ]}
                  >
                    {route.name === "index" ? "Dashboard" : route.name}
                  </CustomText>
                )}
                icon={({ size }) => (
                  <Ionicons
                    name={iconMap[route.name]}
                    size={size}
                    color={focused ? "#fff" : "#FF4A2C"}
                  />
                )}
                onPress={() => props.navigation.navigate(route.name)}
                style={[styles.drawerItem, focused && styles.drawerItemActive]}
                labelStyle={{ marginLeft: -15 }}
              />
            );
          })}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="red" />
          <CustomText weight="medium" style={styles.logoutText}>
            Logout
          </CustomText>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </LinearGradient>
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
      <SafeAreaView style={styles.center}>
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
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "transparent", width: 315 },
        headerTitleStyle: {
          fontFamily: "Poppins_700Bold",
          fontSize: 18,
          color: "#fff",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerBackground: () => (
            <LinearGradient
              colors={["#343A40", "#000000ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="UnitWise"
        options={{
          title: "Unit Wise",
          headerBackground: () => (
            <LinearGradient
              colors={["#FF6A3D", "#a03826ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Machines"
        options={{
          title: "Machines",
          headerBackground: () => (
            <LinearGradient
              colors={["#FF6A3D", "#a03826ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
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
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF4A2C " />
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

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerBox: {
    paddingVertical: 25,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  logoText: {
    fontSize: 39,
    color: "#FF4A2C",
    letterSpacing: 1,
    marginTop: 35,
  },
  userBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 25,
  },
  userName: { fontSize: 14 },
  drawerItem: {
    borderRadius: 12,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  drawerItemActive: {
    backgroundColor: "#FF4A2C",
  },
  drawerLabel: {
    fontSize: 15,
  },
  logoutBtn: {
    marginTop: "auto",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "red",
  },
});

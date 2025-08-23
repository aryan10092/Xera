import { Stack } from "expo-router";

export default function TabsLayout() {
    return <Stack >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
    </Stack>
}
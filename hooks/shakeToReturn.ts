import { Accelerometer } from "expo-sensors";
import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type NavProps = NativeStackNavigationProp<RootStackParamList>;

export function useShakeToReturn() {
    const navigation = useNavigation<NavProps>();
    const enabledRef = useRef(false);
    const lastShakeRef = useRef(0);

    useEffect(() => {
        AsyncStorage.getItem('shakeToReturn').then(value => {
            enabledRef.current = value === 'true';
        });

        const sub = Accelerometer.addListener(async ({x, y, z}) => {
            if (!enabledRef.current) return;

            const now = Date.now();
            const magnitude = Math.sqrt(x*x + y*y + z*z);

            if (magnitude > 2.2 && now - lastShakeRef.current > 1000) {
                navigation.navigate('Home');
                lastShakeRef.current = now;
            }
        });

        Accelerometer.setUpdateInterval(200);
        return () => sub.remove();
    }, []);
}
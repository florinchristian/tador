import React from 'react';
import {
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Text,
    SafeAreaView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';

import PeopleScreen from './PeopleScreen';
import SettingsScreen from './SettingsScreen';
import ChangeSnapchatScreen from './ChangeSnapchatScreen';
import ReportUserScreen from './ReportUserScreen';
import RequestsScreen from './RequestsScreen';
import { RFPercentage } from 'react-native-responsive-fontsize';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SettingsStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='SettingsScreen' component={SettingsScreen}/>
            <Stack.Screen name='ChangeSnapchatScreen' component={ChangeSnapchatScreen}/>
        </Stack.Navigator>
    );
};

const RequestsStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='RequestsScreen' component={RequestsScreen}/>
            <Stack.Screen name='ReportUserScreen' component={ReportUserScreen}/>
        </Stack.Navigator>
    );
};

const PeopleStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='PeopleScreen' component={PeopleScreen}/>
            <Stack.Screen name='ReportUserScreen' component={ReportUserScreen}/>
        </Stack.Navigator>
    );
};

const TabBar = ({ state, descriptors, navigation }) => {
    const statusBarStyles = {
        'PeopleStack': 'light-content',
        'SettingsStack': 'dark-content',
        'RequestsStack': 'dark-content'
    };

    const descriptions = {
        'PeopleScreen': 'Browse people',
        'SettingsScreen': 'Your profile'
    }

    return (
        <SafeAreaView>
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-around'
            }}>
                {state.routes.map((route, index) => {
                    const label = route.name;
                    const focused = state.index == index;

                    var iconColor = 'gray';
                    var icon = null;
                    var iconSize = RFPercentage(4.3);

                    if (focused) {
                        iconColor = '#05d6d9';
                    }

                    if (label == 'PeopleStack') {
                        icon = (
                            <MaterialIcons
                                name='view-carousel'
                                color={iconColor}
                                size={iconSize}
                            />
                        );
                    }

                    if (label == 'RequestsStack') {
                        icon = <Fontisto
                            name='nav-icon-list-a'
                            color={iconColor}
                            size={RFPercentage(3.2)}
                            style={{
                                alignSelf: 'center'
                            }}
                        />
                    }

                    if (label == 'SettingsStack') {
                        icon = (
                            <Feather
                                name='user'
                                color={iconColor}
                                size={iconSize}
                            />
                        );
                    }

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!focused && !event.defaultPrevented) {
                            StatusBar.setBarStyle(statusBarStyles[label], true);
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={label}
                            activeOpacity={1}
                            style={{
                                padding: 10,
                                flexDirection: 'row'
                            }}
                            onPress={onPress}
                        >
                            {icon}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

const MainAppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
                <Tab.Screen name='PeopleStack' component={PeopleStack} />
                <Tab.Screen name='RequestsStack' component={RequestsStack} />
                <Tab.Screen name='SettingsStack' component={SettingsStack} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default MainAppNavigator;
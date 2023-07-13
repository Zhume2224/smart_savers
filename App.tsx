import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

// Import Screens
import ChallengeDashBoardScreen from './screens/ChallengeDashboardScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ChartsScreen from './screens/ChartsScreen';
import HomeScreen from './screens/HomeScreen';
import PocketsScreen from './screens/PocketsScreen';


export default function App() {

  //create stack
const Stack = createNativeStackNavigator();

  //create bottom tab
const Tab = createBottomTabNavigator();


// States
const [availableAmount, setAvailableAmount] = useState<number>(0);


// View Functions (Bottom Bar Navigation)
function GamesHub(){
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChallengeDashBoardScreen" 
        component={ChallengeDashBoardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChallengeScreen" 
        component={ChallengeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

function Habits(){
  return (
    <ChartsScreen/>
  )
}

function Pockets(){
  return (
    <PocketsScreen/>
  )
}

function Home(){
  return (
    <HomeScreen availableAmount={availableAmount} setAvailableAmount={setAvailableAmount}/>
  )
}


  return (
    <>
      <SafeAreaView style={styles.container} >
        <NavigationContainer>
          {/* //stack.navigator - initial screen = login
          //stack.screen
          //check if user
          //if yes take to home */}
          {/* <HomeScreen/> */}
            <Tab.Navigator>
                <Tab.Screen name="HO" component={Home} options={{
                  headerShown: false,
                  tabBarLabel: 'HOME',
                  tabBarShowLabel: false,
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={55} />),
                    tabBarActiveTintColor: 'orange',
                    tabBarInactiveTintColor: 'purple',
                    tabBarIconStyle: { fontSize: 80 },
                  
                }}/>
                <Tab.Screen name="DC" component={GamesHub} options={{
                  headerShown: false,
                  tabBarLabel: 'GAME',
                  tabBarShowLabel: false,
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="gamepad" color={color} size={55} />
                  ),
                  tabBarActiveTintColor: 'orange',
                  tabBarInactiveTintColor: 'purple', 
                  // tabBarIconStyle: { fontSize: 40 }
                }}/>
                <Tab.Screen name="HT" component={Habits} options={{
                  headerShown: false,
                  tabBarLabel: 'CHART',
                  tabBarShowLabel: false,
                  tabBarIcon: ({ color, size }) => (
                    <AntDesign name="barschart" color={color} size={55} />
                  ),
                  tabBarActiveTintColor: 'orange',
                  tabBarInactiveTintColor: 'purple', 
                  // tabBarIconStyle: { fontSize: 40 }
                }}/>
                <Tab.Screen name="SG" component={Pockets} options={{
                  headerShown: false,
                  tabBarLabel: 'POCKETS',
                  tabBarShowLabel: false,
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="wallet" color={color} size={55}  />
                  ),
                  tabBarActiveTintColor: 'orange',
                  tabBarInactiveTintColor: 'purple', 
                  // tabBarIconStyle: { fontSize: 40 }
                }}/>
            </Tab.Navigator>
          {/* //if no take to login page
          //end of stack navigator */}
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


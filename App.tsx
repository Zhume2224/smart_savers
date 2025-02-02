import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { LogBox } from 'react-native';



import ChallengeDashboardScreen from './screens/ChallengeDashboardScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ChartsScreen from './screens/ChartsScreen';
import HomeScreen from './screens/HomeScreen';
import PocketsScreen from './screens/PocketsScreen';
import LoginScreen from './screens/LoginScreen';


import { getUser } from './services/UserServices';
import { getTransactionsByUserId } from './services/TransactionServices';
import { getGoalsByUserId } from './services/GoalServices';

import Header from './components/Header';
import { User, onAuthStateChanged } from '@firebase/auth';
import { FirebaseAuth } from './FirebaseConfig';

LogBox.ignoreLogs([
  'Constants.platform.ios.model has been deprecated in favor of expo-device\'s Device.modelName property.',
]);



// Creating the stacks
const Stack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

type AppProps = {};

export default function App(_: AppProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userTransactions, setUserTransactions] = useState([]);

//Pocket State
  const [goals, setGoals] = useState<any[]>([]);

  // Fetch & set goals for currentUser when currentUser changes
  useEffect(() => {
    if (currentUser) {
      getGoalsByUserId(currentUser.id)
        .then((goals) => setGoals(goals))
        .catch((error) => console.log('Error fetching goals:', error));
    } else {
      // If there is no current user, reset goals to an empty array
      setGoals([]);
    }
  }, [currentUser]);

  // // Pocket State
  // const [goals, setGoals] = useState(currentUser?.goals);

  // // console.log("Goals (App) ", goals)

  // useEffect(() => {
    
  //   if (currentUser) {
  //     // console.log("Current User")
  //     // console.log(goals.length)
  //     goals.length == 0 &&
  //         getGoalsByUserId(currentUser.id) 
  //         .then((goals) => setGoals(goals))
  //         .catch((error) => console.log('Error fetching goals:', error));
  //     } else {
  //       setGoals([])
  //       console.log("empty goals")
  //     }
  //   }, [currentUser?.goals, currentUser]);



  useEffect(() => {
    onAuthStateChanged(FirebaseAuth, (user) => {
      if (user) {
        getUser(user.uid)
          .then((newUser) => {
            setCurrentUser(newUser);
          })
          .catch((error) => console.log('Error fetching user:', error));
      } else {
        setCurrentUser(null);
      }
    });
  }, []);
  

useEffect(() => {
  if (currentUser)
      getTransactionsByUserId(currentUser.id) 
        .then((transactions) => setUserTransactions(transactions))
        .catch((error) => console.log('Error fetching transactions:', userTransactions));
  }, [currentUser]);


  // Creating the component for inside stack layout
  function InsideLayout() {
    return (
      <>
      <Header/>
        <InsideStack.Navigator>
          <InsideStack.Screen name="bottomTabs" component={TabNavigator} options={{ headerShown: false }} />
        </InsideStack.Navigator>
      </>
    );
  }

  // Creating the bottom tab navigator & view functions
  const Tab = createBottomTabNavigator();

  function TabNavigator() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="HO"
          component={Home}
          options={{
            tabBarLabel: 'HOME',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={45} />
            ),
            tabBarActiveTintColor: '#35d0ba',
            tabBarInactiveTintColor: 'black',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="DC"
          options={{
            tabBarLabel: 'GAME',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="gamepad" color={color} size={45} />
            ),
            tabBarActiveTintColor: '#ff9234',
            tabBarInactiveTintColor: 'black',
            headerShown: false,
          }}>
          {(props) => <GamesHub {...props} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
        </Tab.Screen>
        <Tab.Screen
          name="HT"
          component={Habits}
          options={{
            tabBarLabel: 'CHART',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <AntDesign name="barschart" color={color} size={45} />
            ),
            tabBarActiveTintColor: '#f15c55',
            tabBarInactiveTintColor: 'black',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="SG"
          component={Pockets}
          options={{
            tabBarLabel: 'POCKETS',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="wallet" color={color} size={45} />
            ),
            tabBarActiveTintColor: '#ffcd3c',
            tabBarInactiveTintColor: 'black',
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }

  // View Functions (Bottom Bar Tabs)
  function GamesHub({ currentUser, setCurrentUser }) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ChallengeDashBoardScreen"
          component={ChallengeDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChallengeScreen"
          options={{ headerShown: false }}
        >
          {(props) => <ChallengeScreen {...props} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  function Habits() {
    return <ChartsScreen currentUser={currentUser} userTransactions={userTransactions} />;
  }

  function Pockets() {
    return <PocketsScreen currentUser={currentUser} goals={goals} setGoals={setGoals} />;
  }

  function Home() {
    const [availableAmount, setAvailableAmount] = useState<number>(0);

    return (
      <HomeScreen
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        availableAmount={availableAmount}
        setAvailableAmount={setAvailableAmount}
        userTransactions={userTransactions}
        setUserTransactions={setUserTransactions}
        goals={goals}
        setGoals={setGoals}

      />
    );
  }

  const [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('./assets/font/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Italic': require('./assets/font/OpenDyslexic-Italic.otf'),
    'OpenDyslexic-Bold': require('./assets/font/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-BoldItalic': require('./assets/font/OpenDyslexic-BoldItalic.otf'),
    
  });

  if (!fontsLoaded) {
    return null; // Render a loading indicator or return an empty view
  }
  return (

    <SafeAreaView style={styles.container}>
      <NavigationContainer >
        <LoginStack.Navigator initialRouteName="Login">
          {currentUser ? (
            <>
            <LoginStack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
            </>
          ) : (
            <LoginStack.Screen
              name="Smart Savers Login"
              options={{ headerShown: false }}>
              {(props) => (
                <LoginScreen {...props} setCurrentUser={setCurrentUser} />
              )}
            </LoginStack.Screen>

          )}
        </LoginStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
    fontFamily: 'OpenDyslexic-Regular',
    flex: 1,
    // backgroundColor: '#FDE9B1', // Pastel yellow color
  },
});


 

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { LogBox } from 'react-native';
// import { useMemo } from 'react';



// import ChallengeDashboardScreen from './screens/ChallengeDashboardScreen';
// import ChallengeScreen from './screens/ChallengeScreen';
// import ChartsScreen from './screens/ChartsScreen';
// import HomeScreen from './screens/HomeScreen';
// import PocketsScreen from './screens/PocketsScreen';
// import LoginScreen from './screens/LoginScreen';


// import { getUser } from './services/UserServices';
// import { getTransactionsByUserId } from './services/TransactionServices';
// import { getGoalsByUserId } from './services/GoalServices';

// import Header from './components/Header';
// import { User, onAuthStateChanged } from '@firebase/auth';
// import { FirebaseAuth } from './FirebaseConfig';

// LogBox.ignoreLogs([
//   'Constants.platform.ios.model has been deprecated in favor of expo-device\'s Device.modelName property.',
// 'Warning: Each child in a list should have a unique "key" prop.']);



// // Creating the stacks
// const Stack = createNativeStackNavigator();
// const LoginStack = createNativeStackNavigator();
// const InsideStack = createNativeStackNavigator();

// type AppProps = {};

// export default function App(_: AppProps) {
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [userTransactions, setUserTransactions] = useState([]);
//   //Pocket State
//   const [goals, setGoals] = useState<any[]>([]);

//   useEffect(() => {
//     // Fetch & set goals for currentUser when currentUser changes
//     if (currentUser) {
//       getGoalsByUserId(currentUser.id)
//         .then((goals) => setGoals(goals))
//         .catch((error) => console.log('Error fetching goals:', error));
//     } else {
//       // If there is no current user, reset goals to an empty array
//       setGoals([]);
//     }
//   }, [currentUser]);

//   // // Pocket State
//   // const [goals, setGoals] = useState(currentUser?.goals);

//   // // console.log("Goals (App) ", goals)

//   // useEffect(() => {
    
//   //   if (currentUser) {
//   //     // console.log("Current User")
//   //     // console.log(goals.length)
//   //     goals.length == 0 &&
//   //         getGoalsByUserId(currentUser.id) 
//   //         .then((goals) => setGoals(goals))
//   //         .catch((error) => console.log('Error fetching goals:', error));
//   //     } else {
//   //       setGoals([])
//   //       console.log("empty goals")
//   //     }
//   //   }, [currentUser?.goals, currentUser]);



//   useEffect(() => {
//     onAuthStateChanged(FirebaseAuth, (user) => {
//       if (user) {
//         getUser(user.uid)
//           .then((newUser) => {
//             setCurrentUser(newUser);
//           })
//           .catch((error) => console.log('Error fetching user:', error));
//       } else {
//         setCurrentUser(null);
//       }
//     });
//   }, []);
  

//   useEffect(() => {
//     // Fetch transactions only once when currentUser changes
//     if (currentUser) {
//       getTransactionsByUserId(currentUser.id)
//         .then((transactions) => setUserTransactions(transactions))
//         .catch((error) => console.log('Error fetching transactions:', error));
//     }
//   }, [currentUser]);

//    // Update userTransactions when goals state changes
//    useEffect(() => {
//     if (currentUser && goals.length > 0) {
//       getTransactionsByUserId(currentUser.id)
//         .then((transactions) => setUserTransactions(transactions))
//         .catch((error) => console.log('Error fetching transactions:', error));
//     }
//   }, [currentUser, goals]);


//   // Creating the component for inside stack layout
//   const InsideLayout = React.memo(() => {
//     return (
//       <>
//       <Header/>
//         <InsideStack.Navigator>
//           <InsideStack.Screen name="bottomTabs" component={TabNavigator} options={{ headerShown: false }} />
//         </InsideStack.Navigator>
//       </>
//     );
//   })

//   // Creating the bottom tab navigator & view functions
//   const Tab = createBottomTabNavigator();

//   function TabNavigator() {
//     return (
//       <Tab.Navigator>
//         <Tab.Screen
//           name="HO"
//           component={Home}
//           options={{
//             tabBarLabel: 'HOME',
//             tabBarShowLabel: false,
//             tabBarIcon: ({ color }) => (
//               <MaterialCommunityIcons name="home" color={color} size={45} />
//             ),
//             tabBarActiveTintColor: '#35d0ba',
//             tabBarInactiveTintColor: 'black',
//             headerShown: false,
//           }}
//         />
//         <Tab.Screen
//           name="DC"
//           options={{
//             tabBarLabel: 'GAME',
//             tabBarShowLabel: false,
//             tabBarIcon: ({ color }) => (
//               <MaterialCommunityIcons name="gamepad" color={color} size={45} />
//             ),
//             tabBarActiveTintColor: '#ff9234',
//             tabBarInactiveTintColor: 'black',
//             headerShown: false,
//           }}>
//           {(props) => <GamesHub {...props} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
//         </Tab.Screen>
//         <Tab.Screen
//           name="HT"
//           component={Habits}
//           options={{
//             tabBarLabel: 'CHART',
//             tabBarShowLabel: false,
//             tabBarIcon: ({ color }) => (
//               <AntDesign name="barschart" color={color} size={45} />
//             ),
//             tabBarActiveTintColor: '#f15c55',
//             tabBarInactiveTintColor: 'black',
//             headerShown: false,
//           }}
//         />
//         <Tab.Screen
//           name="SG"
//           component={Pockets}
//           options={{
//             tabBarLabel: 'POCKETS',
//             tabBarShowLabel: false,
//             tabBarIcon: ({ color }) => (
//               <MaterialCommunityIcons name="wallet" color={color} size={45} />
//             ),
//             tabBarActiveTintColor: '#ffcd3c',
//             tabBarInactiveTintColor: 'black',
//             headerShown: false,
//           }}
//         />
//       </Tab.Navigator>
//     );
//   }

//   // View Functions (Bottom Bar Tabs)
//   // Memoized components to prevent re-creation on every render
//   const GamesHub=({ currentUser, setCurrentUser }) => {
//     const memoizedGamesHub = useMemo(()=> {

//     return (
//       <Stack.Navigator>
//         <Stack.Screen
//           name="ChallengeDashBoardScreen"
//           component={ChallengeDashboardScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="ChallengeScreen"
//           options={{ headerShown: false }}
//         >
//           {(props) => <ChallengeScreen {...props} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
//         </Stack.Screen>
//       </Stack.Navigator>
//     );
//   }, [currentUser, setCurrentUser])

//   return memoizedGamesHub;
// }

// const Habits = useMemo(
//   () => () => <ChartsScreen currentUser={currentUser} userTransactions={userTransactions} />,
//   [currentUser, userTransactions]
// );

// const Pockets = useMemo(
//   () => () => <PocketsScreen currentUser={currentUser} goals={goals} setGoals={setGoals} />,
//   [currentUser, goals]
// );

// const Home = useMemo(
//   () => () => {
//     const [availableAmount, setAvailableAmount] = useState<number>(0);

//     return (
//       <HomeScreen
//         currentUser={currentUser}
//         setCurrentUser={setCurrentUser}
//         availableAmount={availableAmount}
//         setAvailableAmount={setAvailableAmount}
//         userTransactions={userTransactions}
//         setUserTransactions={setUserTransactions}
//         goals={goals}
//         setGoals={setGoals}
//       />
//     );
//   },
//   [currentUser, userTransactions, goals]
// );

//   const [fontsLoaded] = useFonts({
//     'OpenDyslexic-Regular': require('./assets/font/OpenDyslexic-Regular.otf'),
//     'OpenDyslexic-Italic': require('./assets/font/OpenDyslexic-Italic.otf'),
//     'OpenDyslexic-Bold': require('./assets/font/OpenDyslexic-Bold.otf'),
//     'OpenDyslexic-BoldItalic': require('./assets/font/OpenDyslexic-BoldItalic.otf'),
    
//   });

//   if (!fontsLoaded) {
//     return null; // Render a loading indicator or return an empty view
//   }
//   return (

//     <SafeAreaView style={styles.container}>
//       <NavigationContainer >
//         <LoginStack.Navigator initialRouteName="Login">
//           {currentUser ? (
//             <>
//             <LoginStack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
//             </>
//           ) : (
//             <LoginStack.Screen
//               name="Smart Savers Login"
//               options={{ headerShown: false }}>
//               {(props) => (
//                 <LoginScreen {...props} setCurrentUser={setCurrentUser} />
//               )}
//             </LoginStack.Screen>

//           )}
//         </LoginStack.Navigator>
//       </NavigationContainer>
//     </SafeAreaView>
//   );
// }




// const styles = StyleSheet.create({
//   container: {
//     fontFamily: 'OpenDyslexic-Regular',
//     flex: 1,
//     // backgroundColor: '#FDE9B1', // Pastel yellow color
//   },
// });



import React from 'react'
import {Alert, TouchableOpacity, View} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/Ionicons'
import TodoList from './Screen/TodoList'
import AddTodo from './Screen/AddTodo'
import EditTodo from './Screen/EditTodo'
const Stack = createStackNavigator()
function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen  name="TodoList" component={TodoList} />
          <Stack.Screen  name="AddTodo" component={AddTodo} />
           <Stack.Screen  name="EditTodo" component={EditTodo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
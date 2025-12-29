import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import CatalogueScreen from './screens/Catalogue';
import HomeScreen from './screens/HomeScreen';
import ProjectScreen from './screens/Projects';
import ProjectDetailScreen from './screens/ProjectDetail';
import PhotoDetailScreen from './screens/PhotoDetail';
import ProjectEditScreen from './screens/ProjectEdit';
import { ProjectsProvider } from './store/ProjectsContext';

enableScreens();

export type RootStackParamList = {
    Home: undefined;
    Catalogue: undefined;
    Projects: undefined;
    ProjectDetail: {projectId: string};
    PhotoDetail: {projectId: string; photoId: string};
    ProjectEdit: {projectId?: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <ProjectsProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: true, }}>
            <Stack.Screen
              name = "Home"
              component={HomeScreen}
              options={{ title: 'Home' }}/>
            <Stack.Screen
              name = "Catalogue"
              component={CatalogueScreen}
              options={{ title: 'Catalogue' }}/>
              <Stack.Screen
              name = "Projects"
              component={ProjectScreen}
              options={{ title: 'Projects' }}/>
            <Stack.Screen
              name = "ProjectDetail"
              component={ProjectDetailScreen}
              options={{ title: 'Project' }}/>
            <Stack.Screen
              name = "PhotoDetail"
              component={PhotoDetailScreen}
              options={{ title: 'Photo' }}/>
            <Stack.Screen
              name = "ProjectEdit"
              component={ProjectEditScreen}
              options={{ title: 'Project' }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ProjectsProvider>
    </SafeAreaProvider>
  );
}

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import CollectionScreen from './screens/Collection';
import HomeScreen from './screens/HomeScreen';
import ProjectScreen from './screens/Projects';
import ProjectDetailScreen from './screens/ProjectDetail';
import PhotoDetailScreen from './screens/PhotoDetail';
import ProjectEditScreen from './screens/ProjectEdit';
import PhotoFullscreenScreen from './screens/PhotoFullScreen';
import AddItemScreen from './screens/CollectionAdd';
import { ProjectsProvider } from './store/ProjectsContext';
import { CollectionProvider } from './store/CollectionContext';


enableScreens();

export type RootStackParamList = {
    Home: undefined;
    Collection: undefined;
    Projects: undefined;
    ProjectDetail: {projectId: string};
    PhotoDetail: {projectId: string; photoId: string};
    ProjectEdit: {projectId?: string} | undefined;
    PhotoFullscreen: { projectId: string; photoId: string};
    CollectionAdd: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <CollectionProvider>
        <ProjectsProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: true, }}>
              <Stack.Screen
                name = "Home"
                component={HomeScreen}
                options={{ title: 'Home' }}/>
              <Stack.Screen
                name = "Collection"
                component={CollectionScreen}
                options={{ title: 'Collection' }}/>
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
              <Stack.Screen
                name = "PhotoFullscreen"
                component={PhotoFullscreenScreen}
                options={{ headerShown: false }}/>
              <Stack.Screen
                name = "CollectionAdd"
                component={AddItemScreen}
                options={{ title: 'Add New Item' }}/>
            </Stack.Navigator>
          </NavigationContainer>
        </ProjectsProvider>
      </CollectionProvider>
    </SafeAreaProvider>
  );
}

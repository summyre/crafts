import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import CollectionScreen from './screens/Collection';
import HomeScreen from './screens/HomeScreen';
import ProjectScreen from './screens/Projects';
import ProjectDetailScreen from './screens/ProjectDetail';
import ProjectEditScreen from './screens/ProjectEdit';
import PhotoDetailScreen from './screens/PhotoDetail';
import AddItemScreen from './screens/CollectionAdd';
import StitchSessionScreen from './screens/StitchSession';
import SessionDetailScreen from './screens/SessionDetail';
import CostScreen from './screens/CostCalculator';
import PatternAnnotateScreen from './screens/PatternAnnotate';
import PatternPickerScreen from './screens/PatternPicker';
import SettingsScreen from './screens/Settings';
import ProjectDefaultsScreen from './screens/ProjectDefaults';
import HelpDocScreen from './screens/HelpDoc';
import PatternWishlistScreen from './screens/PatternWishlist';

import { ProjectsProvider } from './store/ProjectsContext';
import { CollectionProvider } from './store/CollectionContext';
import { ThemeProvider } from './theme/ThemeContext';
import { PatternsProvider } from './store/PatternsContext';
import { CurrencyProvider } from './store/CurrenciesContext';
import EditWishlistPatternScreen from './screens/EditWishlistPattern';

enableScreens();

export type RootStackParamList = {
    Home: undefined;
    Collection: undefined;
    Projects: undefined;
    Settings: undefined;
    ProjectDefaults: {projectId: string};
    HelpDoc: undefined;
    ProjectDetail: {projectId: string};
    ProjectEdit: {projectId?: string} | undefined;
    PhotoDetail: {projectId: string; photoId: string};
    StitchSession: {projectId: string};
    SessionDetail: {projectId: string; sessionId: string};
    CollectionAdd: undefined;
    Camera: {projectId: string; sessionId: string};
    CostCalculator: undefined;
    PatternPicker: {projectId: string};
    PatternAnnotate: {projectId: string; timelineItemId: string};
    PatternWishlist: {projectId: string};
    PatternEdit: {projectId: string; patternId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <CollectionProvider>
            <PatternsProvider>
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
                      name = "ProjectEdit"
                      component={ProjectEditScreen}
                      options={{ title: 'Project' }}/>
                    <Stack.Screen
                      name = "PhotoDetail"
                      component={PhotoDetailScreen}
                      options={{ title: 'Photo' }}/>
                    <Stack.Screen
                      name = "CollectionAdd"
                      component={AddItemScreen}
                      options={{ title: 'Add New Item' }}/>
                    <Stack.Screen
                      name = "StitchSession"
                      component={StitchSessionScreen}
                      options={{ title: 'Session' }}/>
                    <Stack.Screen
                      name = "SessionDetail"
                      component={SessionDetailScreen}
                      options={{ title: 'Session' }}/>
                    <Stack.Screen
                      name = "CostCalculator"
                      component={CostScreen}
                      options={{ title: 'Cost Calculator' }}/>
                    <Stack.Screen
                      name = "PatternAnnotate"
                      component={PatternAnnotateScreen}
                      options={{ title: 'Annotate Pattern' }}/>
                    <Stack.Screen
                      name = "PatternPicker"
                      component={PatternPickerScreen}
                      options={{ title: 'Pattern Picker' }}/>
                    <Stack.Screen
                      name = "PatternWishlist"
                      component={PatternWishlistScreen}
                      options={{ title: 'Pattern Wishlist' }}/>
                    <Stack.Screen
                      name = "PatternEdit"
                      component={EditWishlistPatternScreen}
                      options={{ title: 'Pattern Wishlist Edit' }}/>
                    <Stack.Screen
                      name = "Settings"
                      component={SettingsScreen}
                      options={{ title: 'Settings' }}/>
                    <Stack.Screen
                      name = "ProjectDefaults"
                      component={ProjectDefaultsScreen}
                      options={{ title: 'Project Defaults' }}/>
                    <Stack.Screen
                      name = "HelpDoc"
                      component={HelpDocScreen}
                      options={{ title: 'Help and Documentation' }}/>
                  </Stack.Navigator>
                </NavigationContainer>
              </ProjectsProvider>
            </PatternsProvider>
          </CollectionProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

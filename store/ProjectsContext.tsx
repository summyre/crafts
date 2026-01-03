import React, { createContext, useContext, useEffect, useState } from "react";
import { Project } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProjectsContextType = {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);
const STORAGE_KEY = '@projects';

export function ProjectsProvider({children}: {children: React.ReactNode}) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loaded, setLoaded] = useState(false);

    // loading
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setProjects(JSON.parse(stored));
                }

            } catch (error) {
                console.error('Failed to load projects', error);
            } finally {
                setLoaded(true);
            }
        };

        loadProjects();
    }, []);

    // saving on every change
    useEffect(() => {
        if (!loaded) return;

        const saveProjects = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            } catch (error) {
                console.error('Failed to save projects', error);
            }
        };

        saveProjects();
    }, [projects, loaded]);

    return (
        <ProjectsContext.Provider value={{ projects, setProjects }}>
            {children}
        </ProjectsContext.Provider>
    );
};

export function useProjects() {
    const ctx = useContext(ProjectsContext);
    if (!ctx) throw new Error('useProjects must be used inside provider');
    return ctx;
};
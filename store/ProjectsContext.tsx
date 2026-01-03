import React, { createContext, useContext, useEffect, useState } from "react";
import { Project } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProjectsContextType = {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({children}: {children: React.ReactNode}) {
    const [projects, setProjects] = useState<Project[]>([]);

    // loading
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const json = await AsyncStorage.getItem('@projects');
                if (json) setProjects(JSON.parse(json));
            } catch (error) {
                console.error('Failed to load projects', error);
            }
        };

        loadProjects;
    }, []);

    // saving on every change
    useEffect(() => {
        const saveProjects = async () => {
            try {
                await AsyncStorage.setItem('@projects', JSON.stringify(projects));
            } catch (error) {
                console.error('Failed to save projects', error);
            }
        };
        
        saveProjects();
    }, [projects]);

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
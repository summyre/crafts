import React, { createContext, useContext, useEffect, useState } from "react";
import { Project } from "./types";

type ProjectsContextType = {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({children}: {children: React.ReactNode}) {
    const [projects, setProjects] = useState<Project[]>([]);

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
import { createContext,  useState } from "react";

export const ProjectContext = createContext();


const ProjectContextProvider = ({children}) =>{
  const [selectedProjectId, setSelectedProjectId] = useState()
  const [isDesigner, setIsDesigner] = useState(false)

  const values = {
    selectedProjectId,
    setSelectedProjectId,
    isDesigner,
    setIsDesigner,
  };
  return (
    <ProjectContext.Provider value={values}>
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContextProvider;
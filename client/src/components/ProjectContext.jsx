import { createContext,  useState } from "react";

export const ProjectContext = createContext();


const ProjectContextProvider = ({children}) =>{
  const [selectedProjectId, setSelectedProjectId] = useState()

  const values = {
    selectedProjectId,
    setSelectedProjectId
  }
  return (
    <ProjectContext.Provider value={values}>
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContextProvider;
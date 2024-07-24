import React, { createContext, useState } from "react";

const ApiContext = createContext(false);
function ApiContextC({ children }: React.PropsWithChildren) {


  const [refresh, setRefresh] = useState(false);

  return (
    <ApiContext.Provider value={{refresh, setRefresh}}>
      {children}
    </ApiContext.Provider>
  );
}

export {ApiContextC, ApiContext};

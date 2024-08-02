import React, { createContext, useEffect, useState } from "react";

const ApiContext = createContext(false);
function ApiContextC({ children }: React.PropsWithChildren) {


  const [refresh, setRefresh] = useState(false);
setTimeout(()=>{setRefresh(!refresh)},5000)


  return (
    <ApiContext.Provider value={{refresh, setRefresh}}>
      {children}
    </ApiContext.Provider>
  );
}

export {ApiContextC, ApiContext};

import React from "react";

export const GlobalContext = React.createContext<any>(null);
export const useSimpleNavigate = () => ({ ...React.useContext(GlobalContext) });

export const DevelopContext = React.createContext(null);
export const useDevelop = () => React.useContext(DevelopContext);

export const RoutesListContext = React.createContext(null);
export const useRoutesList = () => React.useContext(RoutesListContext);

import React from "react";
import { DevelopContext, GlobalContext, RoutesListContext } from "./";

interface IRouter {
  children: React.ReactNode;
}

export const GlobalRouter = React.memo<IRouter>(({ children }) => {
  const [triggerState, setTriggerState] = React.useState(false);

  const navigateOptionsRef = React.useRef({});
  const globalValueRef = React.useRef({}); // init value ставится автоматически функцией changeGlobalValue при первом и последующих рендерах
  const historyRef = React.useRef({
    history: [],
    index: -1,
    direction: null,
  });

  const changeGlobalValue = React.useCallback((params) => {
    const forwardBackHistory = (steps, direction) => {
      historyRef.current.direction = direction;

      const historyIndex = historyRef.current.index;

      historyRef.current.index += steps;

      navigateOptionsRef.current.state =
        historyRef.current.history[historyIndex + steps].state;

      const historyValue = historyRef.current.history[historyIndex + steps];

      window.history.pushState({}, "", historyValue.pathname);
      setTriggerState((prev) => !prev);
    };

    const getNewGlobalValue = () => {
      return {
        navigate: (path: string, options) => {
          if (typeof path === "number") {
            forwardBackHistory(path, path > 0 ? "forward" : "back");
            return;
          }
          historyRef.current.direction = null;
          historyRef.current.index = historyRef.current.history.length - 1;
          Object.assign(navigateOptionsRef.current, options);
          window.history.pushState({}, "", path);
          setTriggerState((prev) => !prev);
        },
        pathname: window.location.pathname,
        query: { ...new URLSearchParams(window.location.search) },
        params: { ...params },
        state: navigateOptionsRef.current.state,
        toPrevious: (steps) => forwardBackHistory(steps || -1, "back"),
        toNext: (steps) => forwardBackHistory(steps || 1, "forward"),
      };
    };

    const clearOldValues = () => {
      Object.keys(globalValueRef.current).forEach((key) => {
        delete globalValueRef.current[key];
      });
    };

    const clearOptions = () => {
      Object.keys(navigateOptionsRef.current).forEach((key) => {
        delete navigateOptionsRef.current[key];
      });
    };

    clearOldValues();

    Object.assign(globalValueRef.current, getNewGlobalValue());

    if (historyRef.current.direction === null) {
      historyRef.current.history.push({ ...globalValueRef.current });
      historyRef.current.index++;
    }

    clearOptions();
  }, []);

  return (
    <GlobalContext.Provider value={globalValueRef.current}>
      <RoutesListContext.Provider value={triggerState}>
        <DevelopContext.Provider value={changeGlobalValue}>
          {children}
        </DevelopContext.Provider>
      </RoutesListContext.Provider>
    </GlobalContext.Provider>
  );
});

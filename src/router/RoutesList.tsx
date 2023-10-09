import React from "react";

import { useDevelop, useRoutesList } from ".";

const makeError = () => {
  console.log("Child is not a Route");
  throw new Error("Child is not a Route");
};

const checkDynamicFields = () => {
  const keys = [...PathMap.keys()];
  const currentPath = window.location.pathname.split("/");

  let params = {};

  for (let i = 0; i < keys.length; i++) {
    const targetPath = keys[i].split("/");

    for (let k = 0; k < currentPath.length; k++) {
      if (
        !(targetPath[k] === currentPath[k] || targetPath[k]?.startsWith(":"))
      ) {
        params = {};
        break;
      }

      if (targetPath[k]?.startsWith(":")) {
        params[targetPath[k].substring(1)] = currentPath[k];
      }

      if (k === currentPath.length - 1) {
        return { component: PathMap.get(keys[i]), params };
      }
    }
  }
  return null;
};

const setChildrenRoutes = (children) => {
  if (Array.isArray(children)) {
    if (children.some((item) => item.type !== Route)) {
      makeError();
    }
  } else if (children !== Route) {
    makeError();
  }

  if (Array.isArray(children)) {
    children.forEach((item) => {
      PathMap.set(item.props.path, item);
    });
  }
};

const PathMap = new Map();

export const Route = ({ component }) => component;

export const RoutesList = React.memo<any>(({ children }) => {
  const changeGlobalValue = useDevelop();
  useRoutesList(); // хук для триггера компонента RoutesList при обновлении стейта в GlobalRouter

  setChildrenRoutes(children);
  const checkResult = checkDynamicFields();

  if (!checkResult) {
    console.log("UNKNOWN ROUTE");
    throw new Error("UNKNOWN ROUTE");
  }

  changeGlobalValue(checkResult.params);

  return checkResult.component;
});

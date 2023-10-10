import React from "react";

import "./App.css";
import { Route, GlobalRouter, RoutesList, useSimpleNavigate } from "./router";

let indexTest = 0;

const KekComponent = () => {
  const { navigate, pathname, query, params, state } = useSimpleNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p>this is KekComponent</p>
      <p>state is "{state}"</p>
      <p>query is "{query && JSON.stringify(query)}"</p>
      <p>params is "{params && JSON.stringify(params)}"</p>
      <p>pathname is "{pathname}"</p>
      <button
        onClick={() =>
          navigate("/test", { state: "state from KEK" + ++indexTest })
        }
      >
        navigate to test
      </button>
      <button onClick={() => navigate(-1)}>navigate back</button>
      <button onClick={() => navigate(1)}>navigate next</button>
    </div>
  );
};

const TestComponent = () => {
  const { navigate, pathname, query, params, state } = useSimpleNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p>this is TestComponent</p>
      <p>state is "{state}"</p>
      <p>query is "{query && JSON.stringify(query)}"</p>
      <p>params is "{params && JSON.stringify(params)}"</p>
      <p>pathname is "{pathname}"</p>

      <button
        onClick={() =>
          navigate(`/kek/${crypto.randomUUID()}`, {
            state: "state from TEST" + ++indexTest,
          })
        }
      >
        navigate to kek
      </button>
      <button onClick={() => navigate(-1)}>navigate back</button>
      <button onClick={() => navigate(1)}>navigate next</button>
    </div>
  );
};

const RootPage = () => {
  const { navigate } = useSimpleNavigate();
  return (
    <div>
      This is root page
      <button
        onClick={() => navigate("/test", { state: "state from ROOT PAGE" })}
      >
        navigate to test
      </button>
    </div>
  );
};

function App() {
  return (
    <GlobalRouter>
      <RoutesList>
        <Route path="/" component={<RootPage />} />

        <Route path="/kek/:id" component={<KekComponent />} />
        <Route path="/test" component={<TestComponent />} />
      </RoutesList>
    </GlobalRouter>
  );
}

export default App;

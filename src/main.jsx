import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Toaster position="top-center" />
    <App />
  </>
);

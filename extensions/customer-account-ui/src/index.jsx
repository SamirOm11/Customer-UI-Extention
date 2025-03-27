import {
  reactExtension,
  useApi,
  Button,
} from "@shopify/ui-extensions-react/customer-account";
import App from "./App.jsx";

export default reactExtension("customer-account.order.page.render", () => (
  <App />
));


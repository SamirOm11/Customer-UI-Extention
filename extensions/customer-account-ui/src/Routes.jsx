import React from "react";
import { View, Text } from "@shopify/ui-extensions-react/customer-account";

export function Router({
  routes,
  defaultRoute,
  formData,
  setFormData,
  customerId,
  shop,
  hash,
  id,
}) {
  const [currentRoute, setCurrentRoute] = React.useState(defaultRoute);
  console.log("🚀 ~ currentRoute:", currentRoute)
  const RouteComponent = routes[currentRoute]?.component;
  console.log("🚀 ~ RouteComponent:", RouteComponent)

  if (!RouteComponent) {
    return (
      <View>
        <Text>Route component not found</Text>
      </View>
    );
  }

  return (
    <View>
      <RouteComponent
        navigate={setCurrentRoute}
        currentRoute={currentRoute}
        formData={formData}
        setFormData={setFormData}
        customerId={customerId}
        shop={shop}
        hash={hash}
        id={id}
      />
    </View>
  );
}
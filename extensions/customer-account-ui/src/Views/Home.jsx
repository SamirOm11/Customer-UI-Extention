import React from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Image,
  Divider,
  View
} from "@shopify/ui-extensions-react/customer-account";

export const Home = ({ formData, setFormData, customerId, shop, hash, navigate }) => {
  return (
    <View>
      <BlockStack spacing="loose">
        {/* Header Section */}
        <InlineStack spacing="loose" blockAlignment="center">
          <Text size="extraLarge" fontWeight="bold">Setup Wallet</Text>
         
        </InlineStack>
        <Text size="medium" fontWeight="bold">You do not have a PayU wallet. Please set up your wallet.</Text>
        <Divider />

        {/* Main Content - Using nested InlineStacks for responsive layout */}
        <InlineStack spacing="loose" blockAlignment="start" inlineAlignment="center">
          {/* Image Column */}
          <View maxWidth="33%" padding="base">
            <Image
              source="https://your-image-url.com/Scan-to-pay-amico-1-1.png"
              alt="Scan to pay illustration"
              aspectRatio={1}
              fit="contain"
            />
          </View>

          {/* User Details Column */}
          <View maxWidth="66%" padding="base">
            {/* <UserDetails 
              formData={formData} 
              setFormData={setFormData} 
              customerId={customerId} 
              shop={shop} 
              hash={hash} 
            /> */}
          </View>
        </InlineStack>
      </BlockStack>
    </View>
  );
};

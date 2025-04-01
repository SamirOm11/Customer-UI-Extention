import React from "react";
import {
  BlockStack,
  Text,
  Button, // Use Button instead of Action
  InlineStack,
  Page,
  Divider,
  View,
  Image,
} from "@shopify/ui-extensions-react/customer-account";
export function SetUp({ navigate, currentRoute }) {
  return (
    <Page
      title="Setup Wallet"
      subtitle="You do not have a PayU wallet. Please set up your wallet."
      primaryAction={
        <>
          <Button onPress={() => {}}>Cancel</Button>
        </>
      }
    >
      <BlockStack inlineAlignment="center">
        <View maxWidth="45%" padding="base">
          <Image source="https://res.cloudinary.com/dcwtuiraz/image/upload/v1743508717/855b6e9ee42f61cf590d_jtxryt.png" />
        </View>
        <Button onPress={() => navigate("home")} variant="primary" size="large">
          Setup Wallet
        </Button>
      </BlockStack>
    </Page>
  );
}

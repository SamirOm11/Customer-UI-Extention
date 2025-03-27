import React from 'react';
import { 
  BlockStack,
  Text,
  Button,  // Use Button instead of Action
  InlineStack,
  Divider
} from '@shopify/ui-extensions-react/customer-account';
export function Settings({ navigate, currentRoute }) {
    return (
      <BlockStack spacing="loose">
        <Text variant="heading">Settings Page</Text>
        <Button
          onPress={() => navigate('home')}
        >
          Back to Home
        </Button>
      </BlockStack>
    );
  }
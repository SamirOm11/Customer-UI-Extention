
import React from 'react';
import { 
  BlockStack,
  Button,
  Text,
  TextField
} from '@shopify/ui-extensions-react/customer-account';

export function Details({ 
  navigate, 
  currentRoute,
  formData,
  setFormData,
  customerId,
  shop,
  hash,
  id
}) {
  return (
    <BlockStack spacing="loose">
      <Text variant="heading">Order Details for {customerId}</Text>
      <Text>Shop: {shop}</Text>
      
      <TextField
        label="Country Code"
        value={formData.country_code}
        onChange={(value) => setFormData({...formData, country_code: value})}
      />

      <Button onPress={() => navigate('settings')}>
        Go to Settings
      </Button>
    </BlockStack>
  );
}
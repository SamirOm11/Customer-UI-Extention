import React, { useEffect, useState } from "react";
import {
  BlockStack,
  View,
  Text,
  useExtensionApi,
} from "@shopify/ui-extensions-react/customer-account";
import { Router } from "./Routes.jsx";
import CryptoJS from "crypto-js";
import { Home } from "./Views/Home.jsx";
import { Details } from "./Views/Details.jsx";
import { Settings } from "./Views/Setting.jsx"; // Fixed case sensitivity

export default function App() {
  const { extension } = useExtensionApi(); // Changed from useApi to useExtensionApi
  const [formData, setFormData] = useState({ country_code: "+91" });
  const [error, setError] = useState(false);

  // Get query parameters from Shopify extension
  const queryObject = extension.target?.queryParameters || {};
  const { h1, hash, shop, id, wallet, amount, txn_id } = queryObject;

  const hashWithSalt = (data, amount, decodedDomain, salt, wallet) => {
    let saltedData = data + decodedDomain + salt;
    if (wallet === "wallet") {
      saltedData = data + amount + decodedDomain + salt;
    }
    const utf8Data = CryptoJS.enc.Utf8.parse(saltedData);
    const hashed = CryptoJS.SHA256(utf8Data);
    return hashed.toString(CryptoJS.enc.Hex);
  };

  useEffect(() => {
    if (h1 && hash && shop) {
      const decodedId = decodeURIComponent(h1);
      const decodedDomain = decodeURIComponent(shop);
      const walletType = decodeURIComponent(wallet || "");
      const decodedHash = decodeURIComponent(hash).replace(/\s/g, "+");
      let decodeAmount = null;

      let hashedPassword = hashWithSalt(
        decodedId,
        decodeAmount,
        decodedDomain,
        process.env.SALT_CUSTOMER, // Fixed typo in env variable name
        walletType
      );

      if (wallet === "wallet" && amount) {
        decodeAmount = decodeURIComponent(amount);
        hashedPassword = hashWithSalt(
          decodedId,
          decodeAmount,
          decodedDomain,
          process.env.SALT_PAYMENT,
          walletType
        );
      }

      setError(hashedPassword !== decodedHash);
    }
  }, [h1, hash, shop, id, wallet, amount]);

  const routes = {
    home: { component: Home },
    details: { component: Details },
    settings: { component: Settings },
  };

  return (
    <View>
      {!error ? (
        <Router
          routes={routes}
          defaultRoute="home" // Added required prop
          formData={formData}
          setFormData={setFormData}
          customerId={h1}
          shop={shop}
          hash={hash}
          id={id}
        />
      ) : (
        <BlockStack spacing="loose">
          <Text>Error: Invalid access</Text>
        </BlockStack>
      )}
    </View>
  );
}
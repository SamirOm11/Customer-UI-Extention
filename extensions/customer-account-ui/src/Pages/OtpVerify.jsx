import React from "react";
import { useState, useEffect } from "react";
import {
  BlockStack,
  Button,
  Text,
  Page,
  TextField,
  Divider,
  View,
  InlineStack,
  Image,
  Pressable,
  InlineLayout,
  Card,
  Icon,
} from "@shopify/ui-extensions-react/customer-account";

export function OtpVerify({
  navigate,
  currentRoute,
  formData,
  setFormData,
  customerId,
  shop,
  hash,
  id,
}) {
  console.log("🚀 ~ formData:", formData);
  const [otp, setOtp] = useState("");
  console.log("🚀 ~ otp:", otp);
  const [errors, setErrors] = useState(false);
  console.log("🚀 ~ errors:", errors);
  const [timeLeft, setTimeLeft] = useState(180);
  console.log("🚀 ~ timeLeft:", timeLeft);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const createCustomer = async () => {
    try {
      const url = `/wallet/customer/create`;
      let payload = {
        firstName: formData.firstName,
        lastName: formData.firstName,
        customerMobile: formData.phone,
        customerEmail: formData.email,
        customerId: customerId,
      };
      try {
        const responseCustomer = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            shop: shop,
            hash: hash,
          },
          body: JSON.stringify(payload),
        });
        let response = await responseCustomer.json();
        if (responseCustomer.status == 201) {
          return true;
        } else {
          // addNotification({
          //   title: "Warning",
          //   subtitle: "This is a subtitle",
          //   message: "OTP not verified",
          //   theme: "darkblue",
          //   native: true,
          // });
          toast.error("OTP not verified", {
            position: "top-right",
          });
          navigate(redirectUrl);
        }
      } catch (error) {
        // addNotification({
        //   title: "Warning",
        //   subtitle: "This is a subtitle",
        //   message: "OTP not verified",
        //   theme: "darkblue",
        //   native: true,
        // });
        toast.error("OTP not verified", {
          position: "top-right",
        });
        navigate(redirectUrl);
        return false;
      }
    } catch (error) {
      // addNotification({
      //   title: "Warning",
      //   subtitle: "This is a subtitle",
      //   message: "OTP not verified",
      //   theme: "darkblue",
      //   native: true,
      // });
      toast.error("OTP not verified", {
        position: "top-right",
      });
      navigate(redirectUrl);
      return false;
    }
  };

  const handleChange = (e) => {
    console.log("🚀 ~ handleChange ~ e:", e.target.value);
    e.preventDefault();
    setOtp(e.target.value);
    setErrors((prev) => {
      const { otp, ...rest } = prev;
      return rest;
    });
  };

  function formatSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${
      remainingSeconds > 0 ? remainingSeconds + " sec" : ""
    }`.trim();
  }

  const handleResend = async () => {
    try {
      const url = `/otp/resend`;
      let payload = {
        mobile_number: formData.phone,
        merchant_name: "om-wallet",
        merchant_domain: shop,
      };
      try {
        const response1 = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            shop: shop,
            hash: hash,
            customerId: customerId,
          },
          body: JSON.stringify(payload),
        });
        if (response1) {
          return true;
        } else return false;
      } catch (error) {
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const verifyOTP = async (payload) => {
    try {
      const url = `/otp/verify`;
      try {
        const otpResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            shop: shop,
            hash: hash,
            customerId: customerId,
          },
          body: JSON.stringify(payload),
        });
        if (otpResponse) {
          let response = await otpResponse.json();
          if (response.data != null) {
            if (response.data.responseCode == 106) {
              setErrors((prev) => ({ ...prev, otp: "Incorrect OTP" }));
              return false;
            } else if (response.data.httpStatusCode == 200) {
              return response;
            }
          } else if (
            !response.success &&
            (response.error?.includes("400 BAD_REQUEST") ||
              response.statusCode === "INTERNAL_SERVER_ERROR")
          ) {
            setErrors((prev) => ({ ...prev, otp: "Incorrect OTP" }));
            return false;
          }
        }
      } catch (error) {
        console.log("catch error ", error.message);
        // addNotification({
        //   title: "Warning",
        //   subtitle: "This is a subtitle",
        //   message: "OTP not verified",
        //   theme: "darkblue",
        //   native: true,
        // });
        toast.warning("OTP not verified", {
          position: "top-right",
        });
        navigate(redirectUrl);
      }
    } catch (error) {
      console.log("catch error ", error.message);
      // addNotification({
      //   title: "Warning",
      //   subtitle: "This is a subtitle",
      //   message: "OTP not verified",
      //   theme: "darkblue",
      //   native: true,
      // });
      toast.warning("OTP not verified", {
        position: "top-right",
      });
      navigate(redirectUrl);
    }
  };

  const handleVerify = async (e) => {
    try {
      e.preventDefault();
      let payload = {
        mobileNumber: formData.phone_number,
        email: formData.email,
        otp: otp,
        uuid: formData.uuid,
      };
      if (otp) {
        if (!/^\d{6}$/.test(otp)) {
          setErrors((prev) => ({ ...prev, otp: "Please enter a valid OTP" }));
        } else {
          let verify = await verifyOTP(payload);
          if (verify) {
            let customer = await createCustomer();
            //             let customer = true; /*  remove this later and uncomment the above */
            if (customer) {
              if (formData.checkoutType == "checkout")
                navigate(`${process.env.REACT_APP_BASE_URL}wallet`);
              else navigate(`${process.env.REACT_APP_BASE_URL}transaction`);
            }
          } else {
            // addNotification({
            //   title: "Warning",
            //   subtitle: "This is a subtitle",
            //   message: "OTP not verified",
            //   theme: "darkblue",
            //   native: true,
            // });
            toast.warning("OTP not verified", {
              position: "top-right",
            });
            //           navigate(redirectUrl)
          }
        }
      } else {
        setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      }
    } catch (error) {
      // addNotification({
      //   title: "Warning",
      //   subtitle: "This is a subtitle",
      //   message: "OTP not verified",
      //   theme: "darkblue",
      //   native: true,
      // });
      toast.error("OTP not verified", {
        position: "top-right",
      });
      navigate(redirectUrl);
    }
  };

  return (
    <Page
      title="Setup Wallet"
      subtitle="You do not have a PayU wallet. Please set up your wallet."
      secondaryAction={
        <Button accessibilityLabel="Button" onPress={() => navigate("home")} />
      }
      primaryAction={
        <>
          <Button onPress={() => {}}>Cancel</Button>
        </>
      }
    >
      <InlineStack spacing="loose" blockAlignment="start">
        <View maxWidth="45%" padding="base">
          <Image source="https://res.cloudinary.com/dh4sxb13t/image/upload/v1743275483/5a357ef9fbd32fe462e01_t0f7yu.png" />
        </View>

        <View maxWidth="45%" padding="base">
          <Card padding="base">
            <BlockStack spacing="loose">
              <View padding="base" />
            </BlockStack>
            <InlineStack spacing="tight" blockAlignment="center">
              <Text size="extraLarge">
                We've sent an OTP to your mobile number +91
              </Text>
              <Pressable onPress={() => navigate("home")}>
                <Icon source="pen" size="large" />
              </Pressable>
            </InlineStack>
            <View padding="loose" />
            <Text size="extraLarge">Send OTP </Text>

            <View padding="base" />
            <TextField
              label="Enter OTP"
              placeholder="Enter OTP"
              // value={otp}
              onChange={(value) => handleChange(value)}
            />
            {timeLeft ? (
              <Text size="medium">
                Resend OTP in {formatSecondsToMinutes(timeLeft)}
              </Text>
            ) : (
              ""
            )}

            {!timeLeft && (
              <Text size="medium">
                <Pressable onPress={() => handleResend()}>Resend OTP</Pressable>
              </Text>
            )}

            <View padding="base" />
            <Button variant="primary" onPress={handleVerify} size="medium">
              Submit
            </Button>
          </Card>
        </View>
      </InlineStack>
    </Page>
  );
}

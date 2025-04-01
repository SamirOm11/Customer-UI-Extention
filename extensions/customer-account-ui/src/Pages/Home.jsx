import React from "react";
import { useState } from "react";
import {
  BlockStack,
  Text,
  Divider,
  View,
  Button,
  TextField,
  InlineStack,
  TextBlock,
  Modal,
  Link,
  ChoiceList,
  Image,
  Page,
  Card,
  useExtensionApi,
} from "@shopify/ui-extensions-react/customer-account";
import { handleCancel } from "../utils/utils.js";
import { ConfirmationPopup } from "./Confirmation/ConfirmationPopup.jsx";

export const Home = ({
  navigate,
  formData,
  setFormData,
  customerId,
  shop,
  hash,
}) => {
  const { extension } = useExtensionApi();
  const queryObject = extension.target?.queryParameters || {};
  console.log("🚀 ~ Home ~ queryObject:", queryObject);
  const [errors, setErrors] = useState(false);
  const [open, setOpen] = useState(false);
  // const [countryCode, setCountryCode] = React.useState(["+91"]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number (10 digits required)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const sendOTP = async () => {
    console.log("Inside send OTP");
    try {
      const url = `https://payu-backend.vcto.in/apilayer/clw/otp/send`;

      let payload = {
        mobile_number: formData.phone,
        merchant_name: "om-wallet",
        merchant_domain: shop,
      };

      try {
        console.log("Inside send OTP sendResponse");
        const sendResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json; charset=UTF-8",
            shop: shop,
            hash: hash,
            customerId: customerId,
          },
          // "Access-Control-Allow-Origin": "*",
          // mode: 'no-cors',
          body: JSON.stringify(payload),
        });
        console.log("🚀 ~ sendOTP ~ sendResponse:", sendResponse);
        let response = await sendResponse.json();
        console.log("🚀 ~ sendOTP ~ response:", response);
        if (response.data.httpStatusCode == 200) {
          if (response && response.data && response?.data?.uuid) {
            setFormData((prev) => ({ ...prev, uuid: response.data.uuid }));
            return true;
          } else return false;
        } else return false;
      } catch (error) {
        // toast.warning("Error occurred while sending OTP.", {
        //   position: "top-right",
        // });
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
        return false;
      }
    } catch (error) {
      // toast.warning("Error occurred while sending OTP.", {
      //   position: "top-right",
      // });
      console.log("error", error);

      return false;
    }
  };

  const handleSubmit = async () => {
    navigate("otpverify")
    // const isValid = validateForm();
    // console.log("isValid: ", isValid);
    // if (isValid) {
    //   let otp = await sendOTP();
    //   console.log("otp: ", otp);
    //   if (otp) {
    //     navigate("otpverify");
    //     // navigate(`${process.env.REACT_APP_BASE_URL}otpVerify`);
    //     //navigate(`${process.env.REACT_APP_BASE_URL}transaction`) /*  remove this later and uncomment the above */
    //   }
    // }
  };
  return (
    <>
      <Page
        title="Setup Wallet"
        subtitle="      You don't have a PayU wallet yet. Let's set it up for you."
        primaryActionLabel="Manage"
        primaryAction={
          <>
            <Button
              variant="primary"
              size="medium"
              onPress={() => setOpen(true)}
            >
              Cancel
            </Button>
          </>
        }
      >
        <View padding="base" />

        <InlineStack spacing="loose" blockAlignment="start">
          <View maxWidth="45%" padding="base">
            <Image source="https://res.cloudinary.com/dh4sxb13t/image/upload/v1743275483/5a357ef9fbd32fe462e01_t0f7yu.png" />
          </View>

          <View maxWidth="45%" padding="base">
            <Card padding="base">
              <BlockStack spacing="loose">
                <InlineStack spacing="base" blockAlignment="center">
                  <TextField
                    label="First Name"
                    placeholder="Enter first name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange("firstName", value)}
                    error={errors.firstName}
                    required
                  />

                  <TextField
                    label="Middle Name (optional)"
                    placeholder="Enter middle name"
                    name="middleName"
                    value={formData.middleName || ""}
                    onChange={(value) => handleInputChange("middleName", value)}
                  />

                  <TextField
                    label="Last Name"
                    placeholder="Enter last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange("lastName", value)}
                    error={errors.lastName}
                    required
                  />
                </InlineStack>

                <TextField
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  error={errors.email}
                  required
                />

                <InlineStack spacing="tight" blockAlignment="center">
                  <View flex={1}>
                    <TextField
                      label="Mobile Number"
                      placeholder="Enter mobile number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(value) => handleInputChange("phone", value)}
                      error={errors.phone}
                      required
                    />
                  </View>
                </InlineStack>

                <View padding="base" />
              </BlockStack>
              <InlineStack spacing="tight" inlineAlignment="center">
                <Button variant="primary" onPress={handleSubmit} size="medium">
                  Send OTP
                </Button>
              </InlineStack>
            </Card>
          </View>
        </InlineStack>

        {/* =================modal======================== */}

        {/* 
      <Link
        overlay={
          <Modal id="my-modal" padding title="Return policy">
            <TextBlock>
              We have a 30-day return policy, which means you have 30 days after
              receiving your item to request a return.
            </TextBlock>
            <TextBlock>
              To be eligible for a return, your item must be in the same
              condition that you received it, unworn or unused, with tags, and
              in its original packaging. You’ll also need the receipt or proof
              of purchase.
            </TextBlock>
            <Button onPress={() => ui.overlay.close("my-modal")}>Close</Button>
          </Modal>
        }
      >
        Return policy
      </Link> */}
      </Page>
      {/* {open && (
       <Modal
       id="confirmation-modal"
       padding
       title="Confirm Cancellation"
     >
       <TextBlock>
         Are you sure you want to cancel this transaction?
       </TextBlock>
       <TextBlock>
         This action cannot be undone.
       </TextBlock>
       <Button
         onPress={() => {
           handleCancel();
           ui.overlay.close('confirmation-modal');
         }}
         variant="primary"
       >
         Confirm
       </Button>
       <Button
         onPress={() => ui.overlay.close('confirmation-modal')}
       >
         Cancel
       </Button>
     </Modal>
      )} */}
    </>
  );
};

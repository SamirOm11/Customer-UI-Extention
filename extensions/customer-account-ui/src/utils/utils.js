export const handleCancel = async () => {
    const payload = {
      id: id,
    };
    const url = `${process.env.REACT_APP_API_URL}/shopify/transaction/cancel`;
    try {
      const cancelResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          shop: shop,
          hash: hash,
          customerId: customerId,
        },
        body: JSON.stringify(payload),
      });
      
      if (cancelResponse) {
        let response = await cancelResponse.json();
        console.log("response ", response);
        const redirect_url = response.redirect_url;
        if (redirect_url) {
          window.location.href = redirect_url;
        } else {
          console.error(response.data?.message || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
import {
  reactExtension,
  useApi,
  Button,
  Modal,
  TextBlock,
  useExtensionApi
} from '@shopify/ui-extensions-react/customer-account';


export const ConfirmationPopup = ({ 
  id,
  shop,
  hash,
  customerId
}) => {
  const {ui} = useApi();
  const extension = useExtensionApi();


  const handleCancel = async () => {
    const payload = { id };
    const url = `${extension.environment.apiUrl}/shopify/transaction/cancel`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          shop,
          hash,
          customerId,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.redirect_url) {
        extension.redirect.dispatch(
          extension.redirect.Action.ADMIN_PATH,
          data.redirect_url
        );
      } else {
        extension.showToast({
          message: data.message || "Operation cancelled",
          duration: 3000,
        });
      }
    } catch (error) {
      extension.showToast({
        message: error.message || "An error occurred",
        duration: 3000,
        error: true,
      });
    }
  };

  return (
    <>

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
  
    </>
  );
};


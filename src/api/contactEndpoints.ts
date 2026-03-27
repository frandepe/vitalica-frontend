import { API_ROUTES } from "@/constants";
import { ContactInquiryPayload, ContactInquiryResponse } from "@/types/contact.types";
import { apiRequest } from "./configEndpoint";

export const sendContactInquiry = async (
  data: ContactInquiryPayload,
): Promise<ContactInquiryResponse> => {
  return apiRequest({
    url: API_ROUTES.CONTACT,
    method: "POST",
    data,
  });
};

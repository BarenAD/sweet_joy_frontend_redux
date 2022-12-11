export const preparePhoneByMask = (phone: string): string => {
  const matchedPhone = phone.match(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/);
  if (!matchedPhone) {
    return phone;
  }
  return `+${matchedPhone[1]} (${matchedPhone[2]}) ${matchedPhone[3]}-${matchedPhone[4]}-${matchedPhone[5]}`;
}

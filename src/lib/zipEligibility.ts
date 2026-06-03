export type ZipEligibility = {
  isValidZip: boolean;
  isEligible: boolean;
  message: string;
};

export function getZipEligibility(zip: string): ZipEligibility {
  const normalizedZip = zip.trim();

  if (!/^\d{5}$/.test(normalizedZip)) {
    return {
      isValidZip: false,
      isEligible: false,
      message: 'Please enter a valid 5-digit ZIP code.'
    };
  }

  return {
    isValidZip: true,
    isEligible: true,
    message: 'We can help you compare life insurance options in your area.'
  };
}

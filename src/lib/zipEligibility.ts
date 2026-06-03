export type ZipEligibility = {
  isValidZip: boolean;
  isEligible: boolean;
  state?: 'IA' | 'IL';
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

  const zipNumber = Number(normalizedZip);
  const isIowa = zipNumber >= 50000 && zipNumber <= 52899;
  const isIllinois = zipNumber >= 60000 && zipNumber <= 62999;

  if (isIowa || isIllinois) {
    return {
      isValidZip: true,
      isEligible: true,
      state: isIowa ? 'IA' : 'IL',
      message: 'Good news. We can help homeowners in your area compare coverage options.'
    };
  }

  return {
    isValidZip: true,
    isEligible: false,
    message: 'Looks like we’re not available in your area yet.'
  };
}

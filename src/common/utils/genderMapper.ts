export const mapGenderToVietnamese = (gender: string | null | undefined): string => {
  if (!gender) return 'Khác';
  
  const genderMap: Record<string, string> = {
    'Male': 'Nam',
    'Female': 'Nữ',
    'Other': 'Khác'
  };
  
  return genderMap[gender] || gender;
};

export const mapGenderToEnglish = (vietnameseGender: string): string | undefined => {
  if (vietnameseGender === 'all') return undefined;
  
  const genderMap: Record<string, string> = {
    'Nam': 'Male',
    'Nữ': 'Female',
    'Khác': 'Other'
  };
  
  return genderMap[vietnameseGender] || vietnameseGender;
};

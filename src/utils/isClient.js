export const isClient = (roles = []) =>
  roles.length > 0 && roles.includes('CLIENT') && !roles.includes('LAWYER');

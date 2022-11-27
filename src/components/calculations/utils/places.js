export const canadianProvincesArray = [
  'Ontario',
  'Quebec',
  'Nova Scotia',
  'New Brunswick',
  'Manitoba',
  'British Columbia',
  'Prince Edward Island',
  'Saskatchewan',
  'Alberta',
  'Newfoundland and Labrador',
];

export const canadianProvinces = canadianProvincesArray.map((p, idx) => ({
  id: idx,
  name: p,
}));

export const canadianTerritoriesArray = ['Northwest Territories', 'Yukon', 'Nunavut'];

export const canadianTerritories = canadianTerritoriesArray.map((t, idx) => ({
  id: idx,
  name: t,
}));

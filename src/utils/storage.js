export const readStorage = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const cartTotal = (items) => {
  const mrp = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const discounted = Math.round(mrp * 0.9);
  const saving = mrp - discounted;
  const charges = items.length ? 13 : 0;
  return { mrp, discounted, saving, charges, payable: discounted + charges };
};

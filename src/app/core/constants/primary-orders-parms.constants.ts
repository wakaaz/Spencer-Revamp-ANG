// Primary Order Params
export const PRIMARY_ORDER = {
  NEW: 'new',
  PURCHASE_HISTORY: 'purchased',
  BOOKED: 'booked',
  PROCESSED: 'processed',
  EXECUTE: 'execute',
  COMPLETED: 'completed',
  RETURN_ORDER: 'return',
  CANCELED: 'cancelled',
  RETURNED: 'returned',
};

export const PRIMARY_ORDER_API_STATUS = {
  PURCHASE_HISTORY: 'purchase-history',
  BOOKED: 'pending',
  PROCESSED: 'processed',
  EXECUTE: 'executed',
  COMPLETED: 'completed',
  RETURNED: 'returned',
  CANCELED: 'cancelled',
};

export const PRIMARY_ORDER_API_STATUS_UPDATE = {
  PROCESSED: 'process',
  EXECUTE: 'execute',
  COMPLETED: 'complete',
  CANCELED: 'cancel',
};

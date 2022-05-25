// Primary Order Params
export const PRIMARY_ORDER = {
  NEW: 'new',
  BOOKED: 'booked',
  PROCESSED: 'processed',
  EXECUTE: 'execute',
  COMPLETED: 'completed',
  RETURN_ORDER: 'return',
  CANCELED: 'cancelled',
};

export const PRIMARY_ORDER_API_STATUS = {
  BOOKED: 'pending',
  PROCESSED: 'processed',
  EXECUTE: 'executed',
  COMPLETED: 'completed',
  CANCELED: 'cancelled',
};

export const PRIMARY_ORDER_API_STATUS_UPDATE = {
  PROCESSED: 'process',
  EXECUTE: 'execute',
  COMPLETED: 'complete',
  CANCELED: 'cancel',
};

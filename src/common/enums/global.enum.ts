export enum PaymentStatus {
    Paid = 'Paid',
    Due = 'Due',
    Partial = 'Partial'
}

export enum RepairStatus {
    Placed = 'Placed',
    In_Progress = 'In_Progress',
    Waiting_For_Parts = 'Waiting_For_Parts',
    Ready = 'Ready',
    Delivered = 'Delivered',
    Returned = 'Returned',
    Cancelled = 'Cancelled',
    Closed = 'Closed',
}

export enum SaleStatus {
    Placed = 'Placed',
    Completed = 'Completed',
    Returned = 'Returned',
    Cancelled = 'Cancelled',
    Closed = 'Closed',
}

export enum PaymentMethod {
    Cash = 'Cash',
    Bank_Transfer = 'Bank_Transfer',
    PayPal = 'PayPal',
    Card = 'Card',
    Online_Payment = 'Online_Payment',
    Other = 'Other'
}

export enum PaymentType {
    Sale = 'sale',
    Repair = 'repair',
    Purchase = 'purchase',
    Expense = 'expense'
}

export enum ProductType {
    Sale = 'sale',
    Repair = 'repair'
}

export enum ProductStatus {
    Active = 'active',
    Inactive = 'inactive'
}
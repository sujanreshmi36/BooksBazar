
export enum roleType {
    admin='admin',
    superAdmin='superAdmin',
    customer = 'customer',
    staff='staff'
}

export enum enrollStatus {
    approved = "approved",
    pending = "pending",
    reject="reject"
}

export enum tableStatus{
    occupied='occupied',
    available='available'
}


export enum orderStatus {
    pending='pending',
    accepted='accepted',
    completed = "completed",
    partiallyDelivered = "partiallyDelivered",
    canceled= "canceled"
}

export enum callType{
    incoming='incoming',
    outgoing='outgoing'
}

export enum documentType {
    citizenship = "citizenship",
    pan = "pan",
    drivingLicense = "drivingLicense",
    passport = "passport"
}

export enum paymentMethod {
    online = "online",
    cash = "cash",
    esewa = "esewa",
    khalti = "khalti",
    bankTransfer = "bankTransfer"
}

export enum priorityType {
    low = "low",
    medium = "medium",
    high = "high",
    critical = "critical"
}

export enum requestType {
    technicalGlitches = "technicalGlitches",
    participantManagement = "participantManagement"
}

export enum billingStatus {
    paid = "paid",
    partiallyPaid="partiallyPaid",
    unpaid = "unpaid"
}

export enum paymentStatus {
    approved = "approved",
    pending = "pending",
    reject = "reject"
}

export enum genderType {
    male = "male",
    female = "female",
    others = "others"
}

export type JwtPayload = {
    sub: string;
    role: string;
};

export interface clientEventId {
    clientId: string,
    eventId: string,
}

export enum otpRequestType {
    register="register",
    forgotPassword='forgotPassword'
}
export enum RestaurantStatus {
    active = "active",
    inactive = "inactive"
}

export enum CategoryStatus {
    available = "available",
    unavailabe = "unavailable"
}

export enum ProductStatus {
    available = "available",
    unavailabe = "unavailable"
}
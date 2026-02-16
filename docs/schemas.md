# Database Schema - Selvam Finance Tracker

## 1. User Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| name | String | User's full name |
| email | String | Unique login identifier |
| password | String | Hashed via bcrypt |

## 2. Asset Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| user | ObjectId | Ref to User (req.user._id) |
| assetType | String | e.g., Cash, Gold, FD |
| name | String | Custom identifier (e.g., "HDFC Savings") |
| value | Number | Current valuation |

## 3. Expense Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| user | ObjectId | Ref to User |
| amount | Number | Transaction value |
| category | String | Food, Rent, Transport, etc. |
| date | Date | Transaction date |
| description | String | Optional notes |

## 4. Liability Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| user | ObjectId | Ref to User |
| type | String | Loan, Credit Card, EMI |
| amount | Number | Outstanding balance |
| interestRate| Number | Annual % (Optional) |
| dueDate | Date | Payment deadline |

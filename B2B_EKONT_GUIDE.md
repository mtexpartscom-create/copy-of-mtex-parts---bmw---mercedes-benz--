# B2B System & Ekont Integration Guide

## Overview

This document describes the complete B2B business-to-business system and Ekont shipping integration implemented for MTEX PARTS. The system enables company registrations with automatic approval workflows and provides dynamic shipping location selection with cost calculation.

## Features Implemented

### 1. B2B Registration System

**User Registration Flow:**
- Authenticated users can register as B2B customers
- Registration requires company details: name, tax ID
- Registrations enter "pending" approval status
- Only approved B2B users receive 15% discount

**Database Fields:**
```typescript
userType: "b2c" | "b2b"          // Customer type
companyName: string              // Company name
companyTaxId: string             // VAT/Tax ID
b2bApprovalStatus: "pending" | "approved" | "rejected"
```

**Access Point:**
- Navbar button labeled "B2B" (visible to authenticated users)
- Opens B2BRegistrationModal with form

### 2. B2B Admin Approval Panel

**Location:** AdminDashboard → B2B Tab

**Features:**
- View pending B2B registrations
- Approve/reject registrations
- Track approval history
- Filter by status (Pending, Approved, Rejected)

**Workflow:**
1. Admin views pending B2B users
2. Reviews company details (name, tax ID, registration date)
3. Approves or rejects application
4. User receives status update

### 3. 15% B2B Discount System

**Automatic Discount Application:**
- Applies only to approved B2B users
- 15% discount on subtotal
- Displayed in cart and checkout
- Included in final order total

**Calculation:**
```
Subtotal: 100 BGN
B2B Discount (15%): -15 BGN
Subtotal after discount: 85 BGN
Shipping: +5.99 BGN
Total: 90.99 BGN
```

### 4. Ekont Shipping Integration

**Supported Cities:** 20 Bulgarian cities
- Sofia, Plovdiv, Varna, Burgas, Ruse, Stara Zagora, Pleven, Slivien, Dobrich, Shumen, Pernik, Dupnica, Sandanski, Blagoevgrad, Montana, Vidin, Kyustendil, Gabrovo, Veliko Tarnovo, Yambol

**Shipping Cost Calculation:**
```
Base Cost: 5.99 BGN
Weight Cost: 0.50 BGN per kg
Total: 5.99 + (weight × 0.50)
```

**Features:**
- Dynamic city selection
- Office selection per city
- Real-time shipping cost calculation
- Error handling for failed queries

## Technical Implementation

### Database Schema

**New Migration:** `0006_colossal_harpoon.sql`

```sql
ALTER TABLE users ADD COLUMN userType VARCHAR(10) DEFAULT 'b2c';
ALTER TABLE users ADD COLUMN companyName VARCHAR(255);
ALTER TABLE users ADD COLUMN companyTaxId VARCHAR(50);
ALTER TABLE users ADD COLUMN b2bApprovalStatus VARCHAR(20) DEFAULT 'pending';
```

### Backend Procedures

**B2B Procedures:**
```typescript
ecommerce.b2b.register(input: {
  companyName: string
  companyTaxId: string
})

ecommerce.b2b.getAllUsers(approvalStatus: "pending" | "approved" | "rejected")

ecommerce.b2b.approve(userId: number)

ecommerce.b2b.reject(userId: number)
```

**Ekont Procedures:**
```typescript
ecommerce.ekont.getCities()
// Returns: Array<{ id: string, name: string }>

ecommerce.ekont.getOffices(cityId: string)
// Returns: Array<{ id: string, name: string, address: string, cityId: string }>

ecommerce.ekont.calculateShipping(input: { cityId: string, weight?: number })
// Returns: { cost: number }
```

### Frontend Components

**B2BRegistrationModal.tsx**
- Form for B2B registration
- Company name and tax ID fields
- Integrated into Navbar
- Shows success/error messages

**B2BUsersManagement.tsx**
- Admin panel in AdminDashboard
- Lists B2B users by status
- Approve/reject buttons
- Status badges and timestamps

**EkontSelector.tsx**
- City dropdown with error handling
- Office dropdown (dependent on city)
- Shipping cost display
- Loading and error states

**ShoppingCartSidebarB2B.tsx**
- Enhanced checkout with Ekont selector
- B2B discount display
- Shipping cost calculation
- Comprehensive form validation

## Usage Guide

### For Customers

**B2B Registration:**
1. Log in to your account
2. Click "B2B" button in Navbar
3. Enter company name and tax ID
4. Submit registration
5. Wait for admin approval

**Checkout with B2B Discount:**
1. Add products to cart
2. Click checkout
3. Fill in delivery details
4. Select city and Ekont office
5. Shipping cost calculated automatically
6. 15% discount applied (if approved)
7. Submit order

### For Administrators

**Approving B2B Users:**
1. Go to AdminDashboard
2. Click "B2B" tab
3. View pending registrations
4. Click "Одобри" (Approve) or "Отхвърли" (Reject)
5. User receives status update

## Error Handling

**EkontSelector Error States:**
- City loading failure: "Грешка при зареждане"
- Office loading failure: "Грешка при зареждане"
- No cities available: "Няма налични градове"
- No offices available: "Няма налични офиси"

**Checkout Validation:**
- Missing name: "Моля, въведете вашето име"
- Missing phone: "Моля, въведете телефонния номер"
- Missing office: "Моля, изберете офис на Еконт"
- Missing city: "Моля, изберете град"
- Empty cart: "Кошницата е празна"
- Shipping not calculated: "Моля, изчакайте да се изчисли цената на доставката"

## Integration with Real Ekont API

**Current Implementation:** Mock data with 20 Bulgarian cities

**To Integrate Real API:**

1. Update `server/_core/ekont.ts`:
```typescript
export async function getCities(): Promise<EkontCity[]> {
  const response = await fetch('https://api.ekont.bg/cities', {
    headers: { 'Authorization': `Bearer ${EKONT_API_KEY}` }
  });
  return response.json();
}
```

2. Add Ekont API credentials to environment variables:
```
EKONT_API_KEY=your_api_key
EKONT_API_URL=https://api.ekont.bg
```

3. Update error handling for real API responses

## Testing Checklist

- [ ] B2B registration form validation
- [ ] B2B user approval workflow
- [ ] 15% discount calculation
- [ ] Ekont city selection
- [ ] Ekont office selection
- [ ] Shipping cost calculation
- [ ] Complete checkout flow
- [ ] Order creation with B2B discount and shipping
- [ ] Error message display
- [ ] Mobile responsiveness

## Future Enhancements

1. **Real Ekont API Integration**
   - Replace mock data with live API
   - Add real shipping cost calculation
   - Support for express delivery options

2. **B2B Features**
   - Bulk ordering discounts
   - Custom pricing per company
   - Purchase order management
   - Credit account system

3. **Shipping Options**
   - Multiple carrier support (Speedy, DHL, etc.)
   - Pickup from store option
   - Express delivery
   - International shipping

4. **Admin Features**
   - Bulk B2B user approval
   - Custom discount rules
   - Shipping cost management
   - Order tracking dashboard

## Support

For issues or questions about the B2B and Ekont integration, refer to:
- Database schema: `drizzle/schema.ts`
- Backend logic: `server/routers/ecommerce.ts`, `server/db.ts`
- Frontend components: `client/src/components/`
- API service: `server/_core/ekont.ts`

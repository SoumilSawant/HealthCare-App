# Soul Place Patient App - Implementation Guide

## Overview

This is a React Native (Expo) frontend for the Soul Place mental health patient app, built to exactly match the HTML prototype design. Currently implemented:

- ✅ Theme system with exact color palette matching prototype
- ✅ LoginScreen (Screen 02) with password-only option
- ✅ SignupScreen (phone collection + profile)
- ✅ ConsentScreen (Screen 03) for privacy policy
- ✅ ProfileSetupScreen (Screen 04) Step 1 of 3
- ✅ Frappe API service for authentication

## Tech Stack

- **Frontend**: React Native 0.85.3 with Expo 56.0.3
- **Navigation**: React Navigation v7
- **Styling**: React Native StyleSheet with theme system
- **Backend**: Frappe Framework
- **Database**: PostgreSQL (via Frappe)

## Project Structure

```
HealthCare-App/
├── src/
│   ├── screens/auth/
│   │   ├── LoginScreen.tsx          # Login with password + OTP
│   │   ├── SignupScreen.tsx         # Signup with OTP
│   │   ├── ConsentScreen.tsx        # Privacy policy consent
│   │   ├── ProfileSetupScreen.tsx   # Profile data collection (Step 1/3)
│   │   └── LanguageConsentScreen.tsx # Language selection
│   ├── components/
│   │   ├── Button.tsx               # Reusable button with variants
│   │   ├── Card.tsx                 # Card component
│   │   └── Typography.tsx           # Text component with variants
│   ├── services/
│   │   └── FrappeAuthService.ts     # Frappe API integration
│   ├── theme/
│   │   └── theme.ts                 # Design tokens & colors
│   ├── context/
│   │   └── AuthContext.tsx          # Auth state management
│   └── navigation/
│       ├── AuthStack.tsx            # Auth flow navigation
│       └── types.ts                 # Navigation types
└── package.json
```

## Color Palette (Exact from Prototype)

```
Background: #f4f1ea (warm cream)
Surface: #ffffff
Primary (Sage): #5b8a72
Accent (Gold): #c9a24b
Text: #2a2e2c
Crisis: #c5544a
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd HealthCare-App
npm install
```

### 2. Environment Variables

Create a `.env` file in the `HealthCare-App` directory:

```
REACT_APP_FRAPPE_URL=http://your-frappe-instance.com
REACT_APP_API_KEY=your_api_key
REACT_APP_API_SECRET=your_api_secret
```

### 3. Frappe Backend Setup

#### Create Custom DocTypes in Frappe:

```python
# Create Patient User DocType
# Fields:
# - mobile_number (Phone, unique)
# - full_name (Data)
# - age (Int)
# - gender (Select: Male/Female/Other)
# - living_status (Select: With family/Alone)
# - therapy_experience (Check)
# - created_timestamp (DateTime)
```

#### Create Custom API Endpoints in Frappe:

Create file: `frappe_app/soul_place/auth.py`

```python
import frappe
from frappe.utils import now
from frappe import _

@frappe.whitelist(allow_guest=True)
def login_with_password(mobile_number, password):
    """Traditional login with mobile and password"""
    # Implement password-based authentication
```

### 4. Run the App

**Web:**

```bash
npm run web
```

**iOS:**

```bash
npm run ios
```

**Android:**

```bash
npm run android
```

## Current Implementation Status

### Completed ✅

- [x] Theme system with exact HTML colors
- [x] LoginScreen (password + OTP)
- [x] SignupScreen (OTP flow)
- [x] ConsentScreen (Privacy)
- [x] ProfileSetupScreen (Step 1/3)
- [x] Frappe API service layer

### Next Steps 🔄

1. **Frappe Backend Setup**: Create DocTypes and custom API endpoints
2. **OTP Provider Integration**: Configure Twilio or AWS SNS
3. **Session Management**: Update AuthContext to use Frappe API
4. **Step 2 & 3 of Profile**: Health context & health information
5. **Home Screen**: Implement screen 05
6. **Mood Analyzer**: Implement screens 06-08
7. **Doctor Booking**: Implement screens 10-12
8. **Payment Integration**: Razorpay for India
9. **Video Consultation**: Integrate video calling
10. **Testing & Deployment**: Mobile app build & release

## Integration Checklist

- [ ] Frappe instance running
- [ ] Custom DocTypes created
- [ ] Auth API endpoints deployed
- [ ] SMS provider configured
- [ ] `.env` file with Frappe URL
- [ ] Test OTP flow end-to-end
- [ ] Update AuthContext with real API calls
- [ ] Add error handling for network failures
- [ ] Implement token refresh logic
- [ ] Add analytics tracking

## Design System Reference

All colors, spacing, and typography match the HTML prototype exactly:

- Font: Fraunces (serif display), Outfit (sans-serif body)
- Border radius: 20px (main), 14px (small), 28px (large)
- Shadows: Subtle gradients with 35% opacity black
- Spacing: 4px base unit (xs=4, s=8, m=16, ml=18, l=24, xl=32)

## Notes

- The HTML prototype contains 18 screens total
- This implementation currently covers screens 01-04 (auth flow)
- Design is mobile-first (344px effective width)
- All colors use exact hex values from prototype
- OTP validation is set to 4 digits, 5-minute expiry

## Support

For questions about Frappe integration or backend setup, refer to the Frappe Healthcare documentation at https://frappehealth.com

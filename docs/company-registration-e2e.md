# Tech company registration E2E regression

The regression suite mirrors the supplied company registration screenshots:

1. Choose **I'm a Tech Company**.
2. Complete the company account form.
3. Confirm the email-verification prompt.
4. Open the verified-company welcome page.
5. Complete company background and company details.
6. Verify the pricing-plan page without selecting or purchasing a plan.
7. Optionally complete a Starter Plan subscription in Stripe Sandbox.
8. Complete the business-plan profile step and verify the company Dashboard.

## Safe default suite

Create the local configuration once and replace all placeholder values with
dedicated test data. Every npm test command automatically reads `.env`.

```bash
cp .env.example .env
```

The `.env` file is ignored by Git. Do not commit it or use personal credentials.
The safe default suite never submits the registration form. It reads the email,
password, and other fields from `.env`, accepts the required checkboxes, and
checks that the Create Account button becomes enabled.

```bash
npm run test:e2e:company
```

## Live account-creation test

Account creation is skipped unless explicitly enabled. Use a dedicated test
mailbox and unique templates; `{timestamp}` is replaced at runtime.

```bash
RUN_ACCOUNT_CREATION=true \
E2E_COMPANY_USERNAME='company-{timestamp}' \
E2E_COMPANY_EMAIL='company+{timestamp}@your-test-domain.example' \
E2E_COMPANY_PASSWORD='replace-with-a-test-secret' \
npx playwright test tests/register/tech-company-registration.spec.ts
```

Optional values include `E2E_COMPANY_FIRST_NAME`, `E2E_COMPANY_LAST_NAME`,
`E2E_COMPANY_NAME`, `E2E_COMPANY_COUNTRY`, and `E2E_COMPANY_CATEGORY`.

## Verified onboarding test

Email retrieval is deliberately kept outside the browser test. Obtain a fresh
verification/onboarding URL through a dedicated test-mail API and inject it as
an environment variable. Never commit verification URLs or credentials.

```bash
RUN_VERIFIED_ONBOARDING=true \
E2E_COMPANY_ONBOARDING_URL='https://test-host/one-time-test-link' \
E2E_COMPANY_STAGE='your real option label' \
E2E_COMPANY_TEAM_SIZE='your real option label' \
E2E_COMPANY_FUNDING='your real option label' \
E2E_DISCOVERY_SOURCE='your real option label' \
E2E_COUNTRY_CODE='your real option label' \
E2E_MOBILE_NUMBER='test phone number' \
npx playwright test tests/register/company-onboarding.spec.ts
```

The onboarding regression stops on the pricing page. Plan selection and any
payment or subscription action should be covered separately with a payment
sandbox and explicit test authorization.

## Subscription and Dashboard regression

The subscription regression covers the selected Starter Plan state, Payment
Method page, confirmation modal, hosted Stripe Sandbox checkout, payment-success
page, the final business-plan form, and the subscribed-company Dashboard.

The full path is deliberately disabled by default because it creates a Sandbox
subscription. Use only a dedicated test company and a saved authenticated
Playwright storage state. Never provide a production card number.

```bash
RUN_STRIPE_SANDBOX=true \
E2E_STORAGE_STATE='playwright/.auth/company.json' \
E2E_COMPANY_PRICING_URL='https://test-host/company/pricing' \
npm run test:e2e:subscription
```

The test reads `E2E_STRIPE_CARD`, `E2E_STRIPE_EXPIRY`, `E2E_STRIPE_CVC`,
`E2E_STRIPE_CARDHOLDER`, and `E2E_STRIPE_COUNTRY` from `.env`. All five values
are required when `RUN_STRIPE_SANDBOX=true`; there are no card-data fallbacks in
the test source. Use only Stripe-published Sandbox test cards—never store or run
a real bank card through browser automation.

The three final profile descriptions can be supplied through
`E2E_BUSINESS_DESCRIPTION`, `E2E_PROGRESS_DESCRIPTION`, and
`E2E_NEXT_18_MONTHS_PLAN`. Built-in synthetic descriptions are each longer
than the 300-character UI minimum.

For a read-only Dashboard regression against an already subscribed test
company, leave `RUN_STRIPE_SANDBOX` unset and provide:

```bash
E2E_STORAGE_STATE='playwright/.auth/company.json' \
E2E_COMPANY_DASHBOARD_URL='https://test-host/company/dashboard' \
npm run test:e2e:subscription
```

The subscription email screenshot is represented as an external integration
checkpoint rather than browser automation. A test-mail API can assert the
message subject and plan details without exposing a personal inbox or storing
one-time links in this repository.

## Company Profile Basic Info regression

The profile regression opens **Company Profile** from the authenticated
Dashboard and verifies the Basic Info tabs, editable fields, logo dropzone,
and Save Changes action.

The read-only page check requires `E2E_STORAGE_STATE` and
`E2E_COMPANY_DASHBOARD_URL`. The update-and-save case is disabled unless the
following flag and dedicated test-company values are configured:

```bash
RUN_COMPANY_PROFILE_UPDATE=true \
E2E_PROFILE_COMPANY_NAME='E2E Regression Company' \
E2E_PROFILE_CITY='Auckland' \
E2E_PROFILE_MOBILE_NUMBER='210000000' \
E2E_PROFILE_WEBSITE='https://example.com' \
E2E_PROFILE_YOUTUBE_PITCH='https://www.youtube.com/watch?v=test' \
npm run test:e2e:profile
```

After saving, the test waits for a successful write response, reloads the
profile, and confirms that all configured values persisted. Use an isolated
test company because this case intentionally changes stored profile data.

The same profile suite also covers:

- **Social Media**: platform and full-link controls, adding a configured link,
  then reloading and confirming that it persisted.
- **Company Background**: company stage, team size, team structure, funding
  source, discovery source, Save Changes, and post-reload persistence.
- **Business Background**: all three 300-character business-plan fields, Save
  Changes, and post-reload persistence.

Configure the corresponding `E2E_PROFILE_SOCIAL_*`,
`E2E_PROFILE_COMPANY_STAGE`, `E2E_PROFILE_TEAM_SIZE`,
`E2E_PROFILE_TEAM_STRUCTURE`, `E2E_PROFILE_FUNDING_SOURCE`,
`E2E_PROFILE_DISCOVERY_SOURCE`, and `E2E_PROFILE_*_DESCRIPTION` values shown in
`.env.example`. The three Company Profile write cases share
`RUN_COMPANY_PROFILE_UPDATE=true` and run serially to avoid concurrent updates
to the same test company.

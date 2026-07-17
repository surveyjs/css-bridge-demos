import type { SchemaDefinition, SurveyJSON } from "../types";

/**
 * Multi-step checkout flow.
 *
 * Demonstrates: paged wizard (`pages` + progress bar), required validation,
 * input masks (card / expiry), conditional payment panels (`visibleIf`), and a
 * read-only review summary built from earlier answers via `{question}` piping.
 *
 * Representative V3 JSON — drop-in replaceable with a real checkout schema.
 */
export const checkoutJson: SurveyJSON = {
  title: "Checkout",
  description: "Complete your order in a few quick steps.",
  showTOC: true,
  showQuestionNumbers: "off",
  widthMode: "responsive",
  questionErrorLocation: "bottom",
  pages: [
    {
      name: "contact",
      title: "Contact",
      elements: [
        {
          type: "text",
          name: "email",
          title: "Email address",
          inputType: "email",
          isRequired: true,
          autocomplete: "email",
          placeholder: "you@example.com",
        },
        {
          type: "text",
          name: "phone",
          title: "Phone",
          inputType: "tel",
          maskType: "pattern",
          maskSettings: { pattern: "+1 (999) 999-9999" },
          placeholder: "+1 (___) ___-____",
        },
      ],
    },
    {
      name: "shipping",
      title: "Shipping",
      elements: [
        {
          type: "panel",
          name: "shippingAddress",
          title: "Shipping address",
          elements: [
            { type: "text", name: "fullName", title: "Full name", isRequired: true },
            { type: "text", name: "address1", title: "Address line 1", isRequired: true },
            { type: "text", name: "address2", title: "Address line 2" },
            {
              type: "text",
              name: "city",
              title: "City",
              isRequired: true
            },
            {
              type: "dropdown",
              name: "state",
              title: "State",
              startWithNewLine: false,
              choices: ["CA", "NY", "TX", "FL", "IL", "WA", "MA", "PA"],
            },
            {
              type: "text",
              name: "zip",
              title: "ZIP code",
              isRequired: true,
              maskType: "pattern",
              maskSettings: { pattern: "99999" },
              startWithNewLine: false,
            },
          ],
        },
        {
          type: "radiogroup",
          name: "shippingMethod",
          title: "Shipping method",
          isRequired: true,
          colCount: 1,
          defaultValue: "standard",
          choices: [
            { value: "standard", text: "Standard (3–5 business days) — Free" },
            { value: "express", text: "Express (2 business days) — $12" },
            { value: "overnight", text: "Overnight — $29" },
          ],
        },
      ],
    },
    {
      name: "payment",
      title: "Payment",
      elements: [
        {
          type: "radiogroup",
          name: "paymentMethod",
          title: "Payment method",
          isRequired: true,
          defaultValue: "card",
          choices: [
            { value: "card", text: "Credit / debit card" },
            { value: "paypal", text: "PayPal" },
          ],
        },
        {
          type: "panel",
          name: "cardPanel",
          title: "Card details",
          visibleIf: "{paymentMethod} = 'card'",
          elements: [
            {
              type: "text",
              name: "cardNumber",
              title: "Card number",
              isRequired: true,
              maskType: "pattern",
              maskSettings: { pattern: "9999 9999 9999 9999" },
              placeholder: "1234 5678 9012 3456",
            },
            {
              type: "text",
              name: "cardExpiry",
              title: "Expiry",
              isRequired: true,
              maskType: "pattern",
              maskSettings: { pattern: "99/99" },
              placeholder: "MM/YY",
            },
            {
              type: "text",
              name: "cardCvc",
              title: "CVC",
              isRequired: true,
              startWithNewLine: false,
              maskType: "pattern",
              maskSettings: { pattern: "999" },
            },
          ],
        },
        {
          type: "boolean",
          name: "billingSameAsShipping",
          title: "Billing address is the same as shipping",
          defaultValue: true,
        },
      ],
    },
    {
      name: "review",
      title: "Review",
      elements: [
        {
          type: "expression",
          name: "reviewEmail",
          title: "Email",
          expression: "{email}",
        },
        {
          type: "expression",
          name: "reviewShipTo",
          title: "Ship to",
          expression: "iif({fullName} notempty, {fullName} + ', ' + {city}, '—')",
        },
        {
          type: "comment",
          name: "orderNotes",
          title: "Order notes (optional)",
          rows: 3,
        },
        {
          type: "boolean",
          name: "acceptTerms",
          title: "I agree to the terms of sale",
          isRequired: true,
        },
      ],
    },
  ],
  completedHtml: "<h4>Thanks! Your order has been placed.</h4>",
};

export const checkoutSchema: SchemaDefinition = {
  id: "checkout",
  title: "Checkout",
  description: "Multi-step checkout wizard with masked payment fields and a review summary.",
  json: checkoutJson,
};

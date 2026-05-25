# Member 3 — Customer Management

## Your Files

```
member-3-customer-management/
├── frontend/
│   └── CustomerManagement.tsx      ← Register / Login / Profile / List
├── backend/
│   ├── User.java                   ← Abstract base (Inheritance root)
│   ├── Customer.java               ← Abstract Customer (Inheritance)
│   ├── RegularCustomer.java        ← 5 % discount
│   ├── VIPCustomer.java            ← 15 % discount
│   └── CustomerService.java        ← CRUD + persistence to customers.txt
└── styles/
    └── customer-management.css
```

## CRUD Operations

| Op | What |
|----|------|
| **CREATE** | Register new customer in `customers.txt` |
| **READ** | Search & view customer details |
| **UPDATE** | Modify contact details |
| **DELETE** | Remove customer account |

## OOP Concepts

- **Encapsulation**: `Customer` class private fields + getters/setters
- **Inheritance**: `RegularCustomer` and `VIPCustomer` extend `Customer` extends `User`
- **Polymorphism**: `calculateDiscount()` differs:
  - `RegularCustomer` → 5 % off
  - `VIPCustomer` → 15 % off

## Sri Lankan Format
- Phone: `+94 77 123 4567`
- Address: `123, Galle Road, Colombo 03`

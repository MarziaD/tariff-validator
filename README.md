# OCPI Tariff Validator

Welcome to OCPI Tariff Validator platform. This validation tool helps CPOs (Charge Point Operators) verify their tariff data against ENAPI's OCPI (Open Charge Point Interface) implementation.

## Features

- Upload and validate tariff data in multiple formats (CSV, JSON, HTML)
- Compare CPO's raw data with ENAPI's OCPI implementation
- Detailed discrepancy reporting
- Support for different pricing structures
- Real-time validation feedback

## Installation

```bash
git clone <repository-url>
cd -tariff-validator

cd backend
npm install

cd frontend
npm install

cd backend
npm run dev

cd frontend
npm run dev
```

## Tech Stack

### Frontend

Next.js

TypeScript

Tailwind CSS

NextUI

Axios

### Backend

Node.js

Express

TypeScript

Multer (file handling)

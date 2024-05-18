# AkashLink

**AkashLink** aims to seamlessly bridge traditional finance and the Akash Network, empowering users to easily access and utilize decentralized services through direct fiat payments.

## Vision

AkashLink strives to enhance the accessibility, usability, and adoption of the Akash Network by integrating a user-friendly fiat payment gateway. This system enables users to purchase and manage Akash Network services using traditional fiat currencies.

## Problem Description

AkashLink solves the complexity and accessibility barriers of transitioning from fiat currencies to blockchain networks by providing a user-friendly and secure fiat payment gateway integrated with the Akash Network.

## Features

- **Fiat Payment Integration**: Allows users to purchase AKT tokens using fiat currencies such as USD, EUR, GBP, etc.
- **Third-Party Services**: Utilizes Kado Money to convert fiat to Osmosis (OSMO) and Leap Bridge to convert OSMO to AKT tokens.
- **User-Friendly Interface**: Streamlined process for acquiring AKT tokens, including email confirmation and address verification.
- **Secure Transactions**: Ensures secure handling of user data and compliance with regulatory standards.

## How It Works

1. **Get Started with AkashLink**:
   - Users click "Get Started" on the AkashLink platform.
   - If users do not have AKT tokens, a popup button prompts them to "Buy Token Using Fiat Money."

2. **User Information Collection**:
   - Users provide their email address for confirmation.
   - Users enter their address details for verification and compliance purposes.

3. **Payment Process**:
   - AkashLink uses Kado Money as a third-party service provider to facilitate the conversion of fiat currency to Osmosis (OSMO).

4. **Token Conversion**:
   - The Osmosis (OSMO) is then converted into Akash Token (AKT) using the Leap Bridge service.

## Integration Details

### Third-Party Services

- **Kado Money**: A service that helps users convert fiat amounts into Osmosis (OSMO) cryptocurrency.
- **Leap Bridge**: A service that converts Osmosis (OSMO) tokens to Akash (AKT) tokens.

### Flow Steps

1. **User Interface Flow**:
   - Users click "Get Started" on AkashLink.
   - If they do not have AKT tokens, they are prompted with a button to "Buy Token Using Fiat Money."

2. **Information Collection**:
   - Users enter their email and address details.

3. **Payment and Conversion**:
   - Users are directed to Kado Money to process the payment and conversion from fiat to Osmosis (OSMO).
   - Kado Money handles the conversion and processes the payment.

4. **Token Acquisition**:
   - The converted OSMO tokens are bridged to AKT tokens using Leap Bridge.
   - AKT tokens are transferred to the user’s specified wallet address on the Akash Network.

## Getting Started

### Prerequisites

- A web browser
- A valid email address
- Payment method (credit/debit card, bank transfer, PayPal)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sambitsargam/Akashathon.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Akashathon
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Click on "Get Started".
3. Follow the prompts to buy AKT tokens using fiat money.
4. Enter your email and address details for confirmation and verification.
5. Complete the payment process through Kado Money.
6. Your AKT tokens will be transferred to your specified wallet address.

## Contributing

We welcome contributions to improve AkashLink! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact us at sambitsargam2003@gmail.com.

# Musify

Musify is a music streaming API built with Node.js, Express, and Sequelize. This platform allows artists to sign up and upload their music for listeners to enjoy. It provides a seamless way to manage and explore music content programmatically.

---

## Features

- **Artist Registration**: Artists can sign up and create an account.
- **Music Upload**: Artists can upload their music files for listeners.
- **Music Streaming**: Listeners can stream uploaded music.
- **Database Management**: Leveraging Sequelize ORM for database interactions.
- **Authentication**: Secure routes for artists and listeners.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/) (optional for development)
- [Cloudinary](https://cloudinary.com/) account for managing media uploads.
- [Paystack](https://paystack.com/) account for payment processing.
- Mail server configuration for sending emails.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd musify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory. Refer to the `env.example` file for the complete format. Example:
   ```env
   APP_PORT=5000
   NODE_ENV=developmentOnline
   APP_ENV=local

   DB_CONNECTION=postgres
   DEVELOPMENT_DB_CONNECTION=postgres
   DEVELOPMENT_HOSTNAME=localhost
   DEVELOPMENT_DB_NAME=musify_db
   DEVELOPMENT_USERNAME=postgres
   DEVELOPMENT_PASSWORD=postgres
   DEVELOPMENT_PORT=5432

   JWT_SECRET=abc123

   CLOUDINARY_CLOUD_NAME=kodyfy
   CLOUDINARY_API_KEY=76336***
   CLOUDINARY_API_SECRET=zvcQ***

   PAYSTACK_SECRET_KEY=sk_test_***

   MAIL_MAILER=smtp
   MAIL_HOST=127.0.0.1
   MAIL_PORT=1025
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=null
   MAIL_FROM_ADDRESS=your-email@example.com
   MAIL_FROM_NAME="${APP_NAME}"
   ```

4. Run database migrations and seeders:
   ```bash
   npm run migrate
   npm run seed
   ```

---

## Scripts

The following scripts are available in the `package.json`:

- `npm run dev`: Start the server in development mode with Nodemon.
- `npm run migrate`: Run Sequelize migrations.
- `npm run seed`: Seed the database with sample data.

---

## API Endpoints Documentation 
---

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express**: Web framework for building APIs.
- **Sequelize**: ORM for PostgreSQL.
- **JWT**: JSON Web Tokens for authentication.
- **Cloudinary**: Media storage and management.
- **Paystack**: Payment processing.
- **Mail Servers**: Email communication.
- **Nodemon**: Development utility.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add your message here'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or suggestions, feel free to reach out via email or create an issue in this repository.

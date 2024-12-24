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
   Create a `.env` file in the root directory and provide the following keys:
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_secret_key
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

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express**: Web framework for building APIs.
- **Sequelize**: ORM for PostgreSQL.
- **JWT**: JSON Web Tokens for authentication.
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

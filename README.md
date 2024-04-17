Manage, generate, and securely share passwords for various websites with ease.


# Installation

To install the Password Manager, follow these simple steps:

**1.** Configure Database URL: Before executing the setup script, ensure to update the database URL in the /Backend/.env file with your own database URL.

**2.** Configure Frontend URL: Create a .env.local file in the frontend directory with the following content:
```
REACT_APP_BACKEND_URL=http://localhost:your_own_backend_port
```
**3.** Run Setup Script: Execute the setup_and_run.sh script.

# Features

**1. Secure Encryption**: Utilizes robust encryption methods to safeguard stored passwords, ensuring maximum security.

**2. Password Generator**: Generate strong, unique passwords with adjustable length. Tailor the generation by selecting alternative characters.

**3. Password Sharing**: Share passwords securely with other users. Senders can revoke sharing at any time, while receivers have the choice to accept or reject.

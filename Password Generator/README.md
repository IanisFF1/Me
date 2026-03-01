
# Password Generator and Vault

A modern and secure web application designed to generate complex passwords and store them in a protected virtual vault. This project focuses on data security by implementing client-side encryption algorithms.

## Main Features

* **Customizable Password Generator:**
* Adjustable length between 6 and 24 characters.
* Toggleable options for uppercase letters, lowercase letters, numbers, and symbols.
* Real-time password strength indicator (Weak, Medium, Strong).


* **Secure Vault:**
* Local data storage using the browser's `localStorage`.
* **AES-256 Encryption:** Passwords are encrypted using a Master Key provided by the user via the `CryptoJS` library.
* **Integrity Verification:** A Master Key validation system to prevent unauthorized access to the stored data.


* **Modern User Interface:**
* Responsive design built with Flexbox and CSS Grid.
* Fluid transitions between the Generator, Saver, and Vault screens.
* Quick copy-to-clipboard functionality with visual feedback.
* Custom modal dialog for confirming the deletion of vault entries.


* **Session Management:**
* Optional "Remember key" feature that stores the Master Key in `sessionStorage` for the duration of the current session.



## Technologies Used

* **HTML5 and CSS3:** Semantic structure, CSS variables, and transitions.
* **JavaScript (Vanilla):** Generation logic, DOM manipulation, and event handling.
* **CryptoJS:** AES standard encryption and decryption.
* **FontAwesome:** Vector icons for the interface.

## How It Works

1. **Generation:** Configure your desired password criteria and click "Generate Password".
2. **Saving:** Open the "Password Saver" panel (you do that by pressing the **+** button in the top left corner). Enter the site name, your desired password and a Master Access Key.
* Note: For the first save, you must confirm the Master Key. This key is the only way to decrypt your passwords later.


3. **Accessing the Vault:** Open the "Password Vault" panel (you do that by pressing the **vault** icon in the top right corner). Enter your Master Key to decrypt and view your stored credentials.
4. **Management:** Within the vault, you can toggle password visibility, copy the decrypted password, or permanently delete an entry.

## Project Structure

* `index.html`: Contains the primary application structure and modal overlays.
* `style.css`: Defines the visual styling, animations, and responsive layouts.
* `script.js`: Handles the core logic, encryption processes, and UI state management.

## Security Notes

* **Zero Knowledge:** The Master Key is never sent to a server; all processing happens strictly on the client side.
* **Local Encryption:** Data in `localStorage` is stored as ciphertext. Without the correct Master Key, the data remains unreadable.

## Installation

1. Clone the repository to your local machine.
2. Open `index.html` in any modern web browser.
3. Ensure an active internet connection to load external libraries (CryptoJS and FontAwesome) via CDN.

## License

This project is open-source and available for personal use.

# UniGame - University Gamification Platform

UniGame is an interactive educational solution designed to increase student engagement through gamification mechanics. The platform converts academic results and extracurricular activities into MeritPoints (MP) and digital badges, creating a collaborative and competitive environment.
This project only illustrates user interface concepts, there is no backend involved, the values are hardcoded and, if changed, will reset on the page refresh.

## Personal Contributions

I was responsible for developing the core user flow for students, which includes:

1. **Authentication System (Login)**: Designing the interface and implementing the credential validation logic.
2. **Student Module**: Architecture and functionality of the Dashboard, Badge Management, Reward Shop, and Personal Profile pages.

---

## Key Features

### 1. Access and Security (Personal Contribution)

* **Dynamic Validation**: The login form performs real-time checks for username length (minimum 3 characters) and password complexity (minimum 6 characters, including at least one letter and one digit).
* **Role-Based Redirection**: The system identifies the account type and redirects the user to the appropriate interface for either Students or Professors.

*Note* This is a simple login page, it does not include any kind of authorization, the credentials are hardcoded and checked in the script.


### 2. Student Experience (Personal Contribution)

* **Personalized Dashboard**: A central view for tracking obtained badges and the current MeritPoints (MP) balance.
* **Performance Analysis**: Integrated comparison charts allow students to monitor their points and badges relative to the class average.
* **Badge System**:
* Students collect badges for various competencies, such as SQL Basic or Team Spirit.
* **Badge Crafting**: A specific feature allows merging basic badges (HTML, CSS, and JS) to unlock the "Front-End Master" title through interactive animations.


* **Reward Shop**: A marketplace where students spend MP on academic benefits such as "24h Deadline Extensions," "Mentorship Sessions," or cafeteria vouchers.
* **Collaboration and Portfolio**:
* Students can nominate peers for team-based badges.
* Users can generate a secure public link to share their verified badge portfolio on external platforms like LinkedIn.



### 3. Professor Administration

* **Class Monitoring**: Tools to view general group statistics and a detailed list of enrolled students.
* **Request Validation**: A dedicated panel for approving or rejecting badge requests submitted by students.
* **Resource Management**: Interfaces for professors to create, edit, or delete badges and shop items directly from the platform.

---

## Technologies Used

* **Frontend**: HTML5 and CSS3 were used for a modern, responsive, and animated interface.
* **Interactivity**: Vanilla JavaScript handles DOM manipulation and simulates backend logic.
* **Iconography**: Integration with Font Awesome 6.4.0 for intuitive visual elements.

## File Structure

* `login.html` & `login.js`: Access management and validation.
* `dashboard-student.html` & `dashboard.js`: Student activity control center.
* `insigne.html` & `insigne.js`: Progress logic and visual reward system.
* `magazin.html` & `magazin.js`: Internal platform economy.
* `profil.html` & `profil.js`: Digital identity and social interaction.


## Application Usage and Improvements Ideas

In order to test the platform yourself, you can simply open `login.html` in any browser, and type in the credentials that can be found in the `login.js` file (lines 38 to 43). You will then be redirected to a dashboard from which you will be able to navigate anywhere on the platform.

For future improvements, a backend can be implemented with real authorization and a database which can store users, badges etc.
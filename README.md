
#Skill verification system

A blockchain-based skill verification system can assist minimise the time spent on competence checks and skill verification while also increasing trust in the organization's skill and competency management. With Blockchain, an employee's talents may be documented on a public network and validated and authorised by prior managers/employers. Thus, with a blockchain-based skill chain for an employee, we can be totally certain of their abilities, experience, learning objective progress, and competency level, as well as transparency into who has approved the employees on these skills. Furthermore, this will assist organisations in maximally using trustworthy people for their unique business demands.


### Deployment

**Deployed Url** - https://skill-verification-system.vercel.app/


### Use Case

1. Can be utilised by HR to streamline the hiring process.
2. The employee can utilise it to get into the company of his dreams.
3. Can be utilised to conduct competency assessments.
4. It may be used to communicate with organisations and workers.


## Roles

In our project, we have defined several roles with specific responsibilities and permissions. Each role plays a crucial part in the system's operation and security. Here's an overview of these roles:

### 1. No Role

- **Description**: Users with no designated role have limited access to the system but can interact with admins and request specific roles.
- **Responsibilities**:
  - Submit their profiles for verification.
  - Engage in chat communication with admins.
  - Request either an employee or organization role.

### 2. Admin

- **Description**: Admins play a crucial role in maintaining the system's integrity, managing user data, and overseeing role assignments.
- **Responsibilities**:
  - Register new users on the blockchain.
  - Ensure transparency and resolve any ambiguities in the blockchain.
  - Respond to user requests for role assignments.
  - Scale and maintain user data securely.
  - Possess the authority to revoke or reassign user roles when necessary.

### 3. Employee

- **Description**: Employees are the primary users of the system, responsible for maintaining and sharing their skills and credentials.
- **Responsibilities**:
  - Store and update personal data, including name and contact information.
  - Manage their skill endorsements, which include skills, endorsement ratings (on a scale of 1-10), and certifications (verified and unverified).
  - Document work experiences (verified and unverified) with details such as organization name, job title, and description.
  - Validate educational details and ensure they match provided transcripts or API verification.

### 4. Organization Endorser

- **Description**: Organizations utilize this role to verify their employees' skills, experiences, education, and certifications, contributing to a trustworthy skill verification process.
- **Responsibilities**:
  - Store organization-specific information.
  - Manage a list of current employees who are authorized to endorse the skills, work experiences, and education of other employees.
  - Maintain a roster of HR and talent acquisition team members, along with other employees.
  - Update job titles for employees within the organization.
  - Issue certificates to employees for their achievements and display them on their profiles.
  - Utilize search features to find suitable candidates on the blockchain and invite them for interviews.


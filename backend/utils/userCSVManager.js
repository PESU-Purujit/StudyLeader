const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const bcrypt = require('bcryptjs');

// Define the path to the users CSV file
const USER_FILE_PATH = path.join(__dirname, '../data/users.csv');

class UserCSVManager {
    // Ensure file exists with proper headers
    static async ensureFileExists() {
        try {
            await fs.access(USER_FILE_PATH).catch(async () => {
                // File doesn't exist, create it with headers
                await fs.writeFile(
                    USER_FILE_PATH, 
                    'username,email,password,timeStudied,friends\n', 
                    'utf8'
                );
                console.log('Users CSV file created successfully');
            });
        } catch (error) {
            console.error('Error ensuring users file exists:', error);
            throw error;
        }
    }

    // Read users from CSV with comprehensive error handling
    static async readUsers() {
        try {
            // Ensure file exists
            await this.ensureFileExists();

            // Read file content
            const fileContent = await fs.readFile(USER_FILE_PATH, 'utf8');
            
            // Log raw file content for debugging
            console.log('Raw Users File Content:', fileContent);

            // Parse CSV content
            const users = parse(fileContent, { 
                columns: true,
                skip_empty_lines: true,
                trim: true // Trim whitespace
            });

            // Log parsed users for debugging
            console.log('Parsed Users:', users);

            return users;
        } catch (error) {
            console.error('Detailed Error Reading Users:', {
                message: error.message,
                stack: error.stack
            });
            return [];
        }
    }

    // Write users to CSV with comprehensive error handling
    static async writeUsers(users) {
        try {
            // Ensure file exists before writing
            await this.ensureFileExists();

            // Create CSV writer
            const csvWriter = createCsvWriter({
                path: USER_FILE_PATH,
                header: [
                    {id: 'username', title: 'username'},
                    {id: 'email', title: 'email'},
                    {id: 'password', title: 'password'},
                    {id: 'timeStudied', title: 'timeStudied'},
                    {id: 'friends', title: 'friends'}
                ]
            });

            // Log users being written for debugging
            console.log('Writing Users:', users);

            // Write records
            await csvWriter.writeRecords(users);
            
            console.log('Users written to CSV successfully');
        } catch (error) {
            console.error('Detailed Error Writing Users:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    // Create a new user with comprehensive validation
    static async createUser(userData) {
        try {
            // Validate input
            if (!userData.username || !userData.email || !userData.password) {
                throw new Error('Username, email, and password are required');
            }

            // Read existing users
            const users = await this.readUsers();

            // Check for existing username or email (case-insensitive)
            const existingUser = users.find(
                user => 
                    user.username.toLowerCase() === userData.username.toLowerCase() || 
                    user.email.toLowerCase() === userData.email.toLowerCase()
            );

            // Throw error if user already exists
            if (existingUser) {
                console.log('User already exists:', existingUser);
                throw new Error('Username or email already exists');
            }

            // Hash the password
            const hashedPassword = bcrypt.hashSync(userData.password, 8);

            // Prepare new user data
            const newUser = {
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                timeStudied: '0',
                friends: ''
            };

            // Add new user to the list
            users.push(newUser);

            // Write updated users back to CSV
            await this.writeUsers(users);

            console.log('New user created successfully:', newUser.username);
            return newUser;
        } catch (error) {
            console.error('Detailed Error Creating User:', {
                message: error.message,
                stack: error.stack,
                userData: userData
            });
            throw error;
        }
    }

    // Authenticate user with detailed logging
    static async authenticateUser(username, password) {
        try {
            // Read all users
            const users = await this.readUsers();

            // Log all users and attempted login for debugging
            console.log('Authentication Attempt:', { username });
            console.log('Existing Users:', users);

            // Find user by username (case-insensitive)
            const user = users.find(
                u => u.username.toLowerCase() === username.toLowerCase()
            );

            // Check if user exists
            if (!user) {
                console.log('User not found:', username);
                throw new Error('User not found');
            }

            // Compare passwords
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            
            // Log password validation result
            console.log('Password Validation:', {
                inputPassword: password,
                storedHashedPassword: user.password,
                isValid: isPasswordValid
            });

            // Throw error if password is invalid
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            // Return user details (excluding password)
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.error('Detailed Authentication Error:', {
                message: error.message,
                stack: error.stack,
                username: username
            });
            throw error;
        }
    }

    // Update user's total study time
    static async updateStudyTime(username, studyTime) {
        try {
            // Read existing users
            const users = await this.readUsers();

            // Update study time for specific user
            const updatedUsers = users.map(user => {
                if (user.username === username) {
                    return {
                        ...user,
                        timeStudied: (parseInt(user.timeStudied || 0) + parseInt(studyTime)).toString()
                    };
                }
                return user;
            });

            // Write updated users back to CSV
            await this.writeUsers(updatedUsers);

            console.log(`Study time updated for user ${username}`);
        } catch (error) {
            console.error('Error updating study time:', {
                message: error.message,
                stack: error.stack,
                username: username,
                studyTime: studyTime
            });
            throw error;
        }
    }
}

module.exports = UserCSVManager;
#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "======================================"
echo " Starting AWS EC2 Environment Setup "
echo "======================================"

# 1. Update system packages
echo ">>> Updating system packages..."
sudo apt update -y
sudo apt upgrade -y

# 2. Install Node.js (v20)
echo ">>> Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install MongoDB
echo ">>> Installing MongoDB..."
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor --yes
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# 4. Install MySQL
echo ">>> Installing MySQL Server..."
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 5. Configure MySQL Database & Schema
echo ">>> Configuring MySQL Database and User..."
# Create Database
sudo mysql -e "CREATE DATABASE IF NOT EXISTS SLOT_BOOKING;"
# Create Table
sudo mysql -e "USE SLOT_BOOKING; CREATE TABLE IF NOT EXISTS bookings (id INT AUTO_INCREMENT PRIMARY KEY, booking_date VARCHAR(255), slot VARCHAR(255), name VARCHAR(255), email VARCHAR(255), phone VARCHAR(20), gender VARCHAR(10));"
# Update Root Password (needed for app.js)
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Sri15cha10*';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 6. Install App Dependencies
echo ">>> Installing Node.js App Dependencies..."
npm install

echo "======================================"
echo " Setup Complete! "
echo " Run 'node app.js' to start your server."
echo "======================================"

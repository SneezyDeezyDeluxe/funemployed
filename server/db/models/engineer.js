const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');

const Engineer = db.define('Engineer', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    birthday: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        // Making `.password` act like a func hides it when serializing to JSON.
        // This is a hack to get around Sequelize's lack of a "private" option.
        get() {
          return () => this.getDataValue('password')
        }
    },
    salt: {
        type: Sequelize.STRING,
        // Making `.salt` act like a function hides it when serializing to JSON.
        // This is a hack to get around Sequelize's lack of a "private" option.
        get() {
          return () => this.getDataValue('salt')
        }
    },
    googleId: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});

module.exports = Engineer;

/**
 * instanceMethods
 */
Engineer.prototype.correctPassword = function(candidatePwd) {
    return Engineer.encryptPassword(candidatePwd, this.salt()) === this.password()
  }
  
  /**
   * classMethods
   */
  Engineer.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64')
  }
  
  Engineer.encryptPassword = function(plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex')
  }
  
  /**
   * hooks
   */
  const setSaltAndPassword = engineer => {
    if (engineer.changed('password')) {
      engineer.salt = Engineer.generateSalt()
      engineer.password = Engineer.encryptPassword(engineer.password(), engineer.salt())
    }
  }
  
  Engineer.beforeCreate(setSaltAndPassword)
  Engineer.beforeUpdate(setSaltAndPassword)
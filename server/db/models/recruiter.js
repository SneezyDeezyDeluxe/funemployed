const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Recruiter = db.define('recruiter', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('salt')
    }
  },
  companyName: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Recruiter

/**
 * instanceMethods
 */
Recruiter.prototype.correctPassword = function(candidatePwd) {
  return Recruiter.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 * classMethods
 */
Recruiter.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

Recruiter.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = recruiter => {
  if (recruiter.changed('password')) {
    recruiter.salt = Recruiter.generateSalt()
    recruiter.password = Recruiter.encryptPassword(recruiter.password(), recruiter.salt())
  }
}

Recruiter.beforeCreate(setSaltAndPassword)
Recruiter.beforeUpdate(setSaltAndPassword)

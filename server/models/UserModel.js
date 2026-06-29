const db = require("../db");

module.exports = {
  async create(user) {
    return await db("users").insert(user);
  },

  async findByEmail(email) {
    return await db("users").where({ email }).first();
  }
};
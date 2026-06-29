const db = require("./db");

async function init() {
  const hasUsers = await db.schema.hasTable("users");

  if (!hasUsers) {
    await db.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("name");
      table.string("email").unique();
      table.string("password");
      table.string("user_type").defaultTo('student');
      table.string("currency").defaultTo('USD');
      table.string("language").defaultTo('en');
      table.float("monthly_budget").defaultTo(0);
      table.string("subscription_plan").defaultTo('Starter');
      table.string("bank_pin").nullable();
      table.timestamps(true, true);
    });
    console.log("Users table created");
  } else {
    // Add columns if they don't exist
    const hasPlan = await db.schema.hasColumn("users", "subscription_plan");
    if (!hasPlan) {
      await db.schema.table("users", (table) => {
        table.string("subscription_plan").defaultTo('Starter');
        table.string("bank_pin").nullable();
      });
      console.log("Added Phase 3 columns to users table");
    }
    const hasTheme = await db.schema.hasColumn("users", "theme");
    if (!hasTheme) {
      await db.schema.alterTable("users", table => {
        table.string("theme").defaultTo("dark");
      });
    }
  }

  const hasExpenses = await db.schema.hasTable("expenses");
  if (!hasExpenses) {
    await db.schema.createTable("expenses", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.float("amount").notNullable();
      table.string("category").notNullable();
      table.string("description");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    console.log("Expenses table created");
  }

  const hasScheduled = await db.schema.hasTable("scheduled_payments");
  if (!hasScheduled) {
    await db.schema.createTable("scheduled_payments", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("title");
      table.float("amount");
      table.string("category");
      table.string("frequency");
      table.string("next_date");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  const hasAccounts = await db.schema.hasTable("accounts");
  if (!hasAccounts) {
    await db.schema.createTable("accounts", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("name");
      table.string("type"); // e.g. "Bank", "Wallet", "Credit Card"
      table.float("balance").defaultTo(0);
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  const hasNotifications = await db.schema.hasTable("notifications");
  if (!hasNotifications) {
    await db.schema.createTable("notifications", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("message");
      table.boolean("is_read").defaultTo(false);
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  console.log("Database initialized successfully");
  process.exit();
}

init().catch((err) => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});
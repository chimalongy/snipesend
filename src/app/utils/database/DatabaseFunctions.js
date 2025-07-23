import pool from "./db";

export default class DBFunctions {
  async findUser(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);
      return { success: true, data: result.rows[0] || null };
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  async registerUser(firstName, lastName, email, hashedPassword) {
    try {
      const insertQuery = `
                INSERT INTO users (first_name, last_name, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id, first_name, last_name, email, created_at
            `;
      const values = [firstName, lastName, email, hashedPassword];
      const result = await pool.query(insertQuery, values);

      if (result.rows.length === 0) {
        throw new Error("User registration failed");
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle unique constraint violation (duplicate email)
      if (error.code === "23505") {
        throw new Error("Email already exists");
      }

      return { success: false, data: null };
    }
  }

  async registerOTP(email, otp, expiresAt) {
    try {
      const insertQuery = `
            INSERT INTO forgot_password_otps (email, otp, expires_at)
            VALUES ($1, $2, $3)
            RETURNING id, email, otp, expires_at, created_at
        `;
      const values = [email, otp, expiresAt];
      const result = await pool.query(insertQuery, values);

      if (result.rows.length === 0) {
        throw new Error("OTP registration failed");
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Error registering OTP:", error);
      return { success: false, data: null };
    }
  }

  async verifyOTP(email, otp) {
    try {
      const selectQuery = `
            SELECT * FROM forgot_password_otps
            WHERE email = $1 AND otp = $2 AND expires_at > NOW()
            ORDER BY created_at DESC
            LIMIT 1
        `;
      const values = [email, otp];
      const result = await pool.query(selectQuery, values);

      if (result.rows.length === 0) {
        return { success: false, message: "Invalid or expired OTP" };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: "Error verifying OTP" };
    }
  }

  async deleteOTP(email) {
    try {
      const deleteQuery = `
            DELETE FROM forgot_password_otps
            WHERE email = $1
        `;
      await pool.query(deleteQuery, [email]);
      return { success: true };
    } catch (error) {
      console.error("Error deleting OTP:", error);
      return { success: false };
    }
  }

  async updatePasswordByEmail(email, newHashedPassword) {
    try {
      const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE email = $2
      RETURNING id, email
    `;
      const values = [newHashedPassword, email];
      const result = await pool.query(updateQuery, values);

      if (result.rows.length === 0) {
        throw new Error("User not found or password not updated");
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Error updating password:", error);
      return { success: false, data: null };
    }
  }


//EMAILS

async registerEmail(userId, emailAddress, password, senderName, signature, dailySendingCapacity) {
  try {
    const insertQuery = `
      INSERT INTO email_settings 
      (user_id, email_address, password, sender_name, signature, daily_sending_capacity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, email_address, sender_name, signature, daily_sending_capacity, created_at
    `;
    const values = [userId, emailAddress, password, senderName, signature, dailySendingCapacity];
    const result = await pool.query(insertQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Email settings registration failed");
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error registering email settings:", error);
    if (error.code === "23505") {
      throw new Error("Email address already exists");
    }
    return { success: false, data: null };
  }
}


async deleteEmail(id) {
  try {
    const deleteQuery = `
      DELETE FROM email_settings WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      throw new Error("Email settings not found");
    }

    return { success: true, message: "Email settings deleted successfully" };
  } catch (error) {
    console.error("Error deleting email settings:", error);
    return { success: false, message: "Failed to delete email settings" };
  }
}

async updateEmail(id, updateFields) {
  try {
    const keys = Object.keys(updateFields);
    if (keys.length === 0) {
      throw new Error("No fields to update");
    }

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = Object.values(updateFields);
    values.push(id);

    const updateQuery = `
      UPDATE email_settings SET ${setClause}
      WHERE id = $${values.length}
      RETURNING id, user_id, email_address, sender_name, signature, daily_sending_capacity, created_at
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Email settings not found");
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error updating email settings:", error);
    return { success: false, data: null };
  }
}

async getUserEmails(userId) {
  try {
    const query = `
      SELECT *
      FROM email_settings
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);

    return { success: true, data: result.rows };
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return { success: false, data: null };
  }
}

async findEmailById(id) {
  try {
    const query = `
      SELECT id, user_id, email_address, sender_name, signature, daily_sending_capacity, created_at
      FROM email_settings
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { success: false, data: null, message: "Email not found" };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error fetching email by ID:", error);
    return { success: false, data: null, message: "Error fetching email" };
  }
}


async registerOutbound(userId, outboundName, initialEmailList, deletedEmailList, listAllocations) {
  try {
    const insertQuery = `
      INSERT INTO outbound_settings 
      (user_id, outbound_name, initial_email_list, deleted_email_list, list_allocations)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, outbound_name, initial_email_list, deleted_email_list, list_allocations, created_at;
    `;

    const values = [
      userId,
      outboundName,
      initialEmailList,
      deletedEmailList, // this will be "[]"
      listAllocations
    ];

    const result = await pool.query(insertQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Outbound registration failed");
    }

    return { success: true, data: result.rows[0] };

  } catch (error) {
    console.error("Error registering outbound:", error);
    return { success: false, data: null };
  }
}


async deleteOutbound(id) {
  try {
    const deleteQuery = `
      DELETE FROM outbound_settings WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      throw new Error("Outbound not found");
    }

    return { success: true, message: "Outbound deleted successfully" };
  } catch (error) {
    console.error("Error deleting outbound:", error);
    return { success: false, message: "Failed to delete outbound" };
  }
}

async getOutboundsByUserId(userId) {
  try {
    const selectQuery = `
      SELECT 
        id, user_id, outbound_name, initial_email_list, 
        deleted_email_list, list_allocations, created_at
      FROM outbound_settings
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(selectQuery, [userId]);

    return { success: true, data: result.rows };
  } catch (error) {
    console.error("Error fetching outbounds by userId:", error);
    return { success: false, data: [] };
  }
}

async findOutbound(id) {
  try {
    const selectQuery = `
      SELECT 
        id, user_id, outbound_name, initial_email_list, 
        deleted_email_list, list_allocations, created_at
      FROM outbound_settings
      WHERE id = $1
    `;
    const result = await pool.query(selectQuery, [id]);

    if (result.rows.length === 0) {
      return { success: false, message: "Outbound setting not found", data: null };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error finding outbound setting:", error);
    return { success: false, data: null };
  }
}
















}

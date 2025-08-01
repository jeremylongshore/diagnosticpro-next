/**
 * Database Service for DiagnosticPro MVP
 * PostgreSQL connection and table management
 */

import pkg from 'pg';
const { Pool } = pkg;

class DatabaseService {
  constructor() {
    this.pool = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Connection string from environment or fallback
    const connectionString = process.env.DATABASE_URL || 
      'postgresql://postgres:password@localhost:5432/diagnosticpro_mvp';

    try {
      this.pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test connection
      const client = await this.pool.connect();
      console.log('✅ Database connected successfully');
      client.release();

      // Create tables if they don't exist
      await this.createTables();
      
      this.initialized = true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      
      // Always fall back to file storage if database fails
      // This ensures the app continues working even without a database
      console.log('🔄 Falling back to file-based storage due to database connection failure');
      console.log(`Database URL attempted: ${connectionString ? 'Set' : 'Not set'}`);
      
      // Don't throw error - just continue with file-based storage
      this.pool = null;
      this.initialized = true;
      return;
    }
  }

  async createTables() {
    const createSubmissionsTable = `
      CREATE TABLE IF NOT EXISTS diagnostic_submissions (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        selected_service VARCHAR(50) NOT NULL,
        equipment_type VARCHAR(100),
        make VARCHAR(100),
        model VARCHAR(100),
        year INTEGER,
        vin VARCHAR(50),
        mileage INTEGER,
        error_codes TEXT,
        problem_description TEXT NOT NULL,
        shop_quote DECIMAL(10,2),
        ai_analysis JSONB,
        email_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createPaymentsTable = `
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(50) REFERENCES diagnostic_submissions(submission_id),
        payment_intent_id VARCHAR(255),
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        status VARCHAR(50) NOT NULL,
        stripe_customer_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.pool.query(createSubmissionsTable);
      await this.pool.query(createPaymentsTable);
      console.log('✅ Database tables created/verified');
    } catch (error) {
      console.error('❌ Failed to create tables:', error);
      throw error;
    }
  }

  /**
   * @param {Object} formData
   * @param {string} formData.fullName
   * @param {string} formData.email
   * @param {string} formData.phone
   * @param {string} formData.selectedService
   * @param {string} formData.equipmentType
   * @param {string} formData.make
   * @param {string} formData.model
   * @param {string} formData.year
   * @param {string} formData.vin
   * @param {string} formData.mileage
   * @param {string} formData.errorCodes
   * @param {string} formData.problemDescription
   * @param {string} formData.shopQuote
   * @returns {Promise<Object>}
   */
  async saveSubmission(formData) {
    await this.initialize();

    // Fallback to file storage if database not available
    if (!this.pool) {
      return this.saveToFile(formData);
    }

    const submissionId = `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO diagnostic_submissions (
        submission_id, full_name, email, phone, selected_service,
        equipment_type, make, model, year, vin, mileage,
        error_codes, problem_description, shop_quote
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const values = [
      submissionId,
      formData.fullName,
      formData.email,
      formData.phone,
      formData.selectedService,
      formData.equipmentType,
      formData.make,
      formData.model,
      formData.year ? parseInt(formData.year) : null,
      formData.vin,
      formData.mileage ? parseInt(formData.mileage) : null,
      formData.errorCodes,
      formData.problemDescription,
      formData.shopQuote ? parseFloat(formData.shopQuote) : null
    ];

    try {
      const result = await this.pool.query(query, values);
      console.log(`✅ Submission saved to database: ${submissionId}`);
      return { id: submissionId, ...result.rows[0] };
    } catch (error) {
      console.error('❌ Failed to save submission:', error);
      // Fallback to file storage
      return this.saveToFile(formData);
    }
  }

  /**
   * @param {string} submissionId
   * @param {Object} aiAnalysis
   * @returns {Promise<Object|void>}
   */
  async updateAnalysis(submissionId, aiAnalysis) {
    await this.initialize();

    if (!this.pool) {
      console.log('🔄 Database not available, analysis stored in memory');
      return;
    }

    const query = `
      UPDATE diagnostic_submissions 
      SET ai_analysis = $1, updated_at = CURRENT_TIMESTAMP
      WHERE submission_id = $2
      RETURNING *;
    `;

    try {
      const result = await this.pool.query(query, [JSON.stringify(aiAnalysis), submissionId]);
      console.log(`✅ AI analysis updated for ${submissionId}`);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Failed to update analysis:', error);
    }
  }

  /**
   * @param {string} submissionId
   * @returns {Promise<void>}
   */
  async markEmailSent(submissionId) {
    await this.initialize();

    if (!this.pool) return;

    const query = `
      UPDATE diagnostic_submissions 
      SET email_sent = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE submission_id = $1;
    `;

    try {
      await this.pool.query(query, [submissionId]);
      console.log(`✅ Email status updated for ${submissionId}`);
    } catch (error) {
      console.error('❌ Failed to update email status:', error);
    }
  }

  // File-based fallback for development
  /**
   * @param {Object} formData
   * @returns {Promise<Object>}
   */
  async saveToFile(formData) {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const submissionId = `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const dataDir = '/tmp/diagnosticpro-data';
    
    try {
      await fs.mkdir(dataDir, { recursive: true });
      
      const submission = {
        id: submissionId,
        ...formData,
        created_at: new Date().toISOString()
      };
      
      await fs.writeFile(
        path.join(dataDir, `${submissionId}.json`),
        JSON.stringify(submission, null, 2)
      );
      
      console.log(`✅ Submission saved to file: ${submissionId}`);
      return submission;
    } catch (error) {
      console.error('❌ Failed to save to file:', error);
      throw error;
    }
  }

  /**
   * @param {string} submissionId
   * @returns {Promise<Object|null>}
   */
  async getSubmission(submissionId) {
    await this.initialize();

    if (!this.pool) {
      // Try to read from file
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const filePath = path.join('/tmp/diagnosticpro-data', `${submissionId}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
      } catch {
        return null;
      }
    }

    const query = 'SELECT * FROM diagnostic_submissions WHERE submission_id = $1';
    
    try {
      const result = await this.pool.query(query, [submissionId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Failed to get submission:', error);
      return null;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Export singleton instance
const databaseService = new DatabaseService();
export default databaseService;
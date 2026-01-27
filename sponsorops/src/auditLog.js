import { supabase } from './supabaseClient';

/**
 * Log an audit entry to the audit_log table (WORM - append only)
 *
 * @param {Object} params
 * @param {string} params.userId - UUID of the user making the change
 * @param {string} params.userEmail - Email of the user making the change
 * @param {string} params.tableName - Name of the table being modified
 * @param {string} params.recordId - UUID of the record being modified
 * @param {string} params.operation - Type of operation: INSERT, UPDATE, ARCHIVE, RESTORE
 * @param {Object} params.oldValues - Previous values (null for INSERT)
 * @param {Object} params.newValues - New values (null for ARCHIVE)
 */
export async function logAudit({
  userId,
  userEmail,
  tableName,
  recordId,
  operation,
  oldValues = null,
  newValues = null
}) {
  try {
    const { error } = await supabase.from('audit_log').insert([{
      user_id: userId,
      user_email: userEmail,
      table_name: tableName,
      record_id: recordId,
      operation,
      old_values: oldValues,
      new_values: newValues
    }]);

    if (error) {
      console.error('Error logging audit entry:', error);
      // Don't throw - audit failure shouldn't block the main operation
    }
  } catch (err) {
    console.error('Audit logging failed:', err);
  }
}

/**
 * Fetch audit history for a specific record
 *
 * @param {string} tableName - Name of the table
 * @param {string} recordId - UUID of the record
 * @returns {Promise<Array>} Array of audit log entries
 */
export async function getAuditHistory(tableName, recordId) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .eq('table_name', tableName)
    .eq('record_id', recordId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching audit history:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch recent activity across all tables
 *
 * @param {number} limit - Maximum number of entries to return
 * @returns {Promise<Array>} Array of recent audit log entries
 */
export async function getRecentActivity(limit = 50) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }

  return data || [];
}

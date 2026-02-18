import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-67367fc1`;

/**
 * Test CRM data import capability
 * Tests if the server can import CRM data without modifying the database
 */
export async function testCRMImport(): Promise<{
  status: string;
  message?: string;
  counts?: {
    karyawan: number;
    clients: number;
    partners: number;
  };
  error?: string;
}> {
  try {
    console.log('🧪 Testing CRM data import...');
    console.log('🌐 API URL:', `${API_URL}/test-crm-import`);
    
    const response = await fetch(`${API_URL}/test-crm-import`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey,
      },
    });

    console.log('📥 Test response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Test error response:', errorText);
      return {
        status: 'error',
        error: `HTTP error! status: ${response.status} - ${errorText}`,
      };
    }

    const result = await response.json();
    console.log('✅ Test result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error testing CRM import:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Failed to test',
    };
  }
}

/**
 * Populate CRM dummy data (Karyawan, Client, Partner) to Supabase
 * This function calls the backend endpoint to create dummy data in the database
 */
export async function populateCRMDummyData(accessToken?: string): Promise<{
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  errorDetails?: any;
}> {
  try {
    // Always use publicAnonKey for populate endpoint (no auth required for demo data)
    const token = publicAnonKey;
    
    console.log('🔄 Calling populate-crm-dummy endpoint...');
    console.log('🔑 Access token:', accessToken ? 'Present' : 'None');
    console.log('🌐 API URL:', `${API_URL}/populate-crm-dummy`);
    
    const response = await fetch(`${API_URL}/populate-crm-dummy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': publicAnonKey, // Add apikey header for Supabase Edge Functions
      },
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);
    console.log('📥 Response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response text:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error('❌ Error response JSON:', errorJson);
        return {
          success: false,
          error: errorJson.error || `HTTP ${response.status}: ${response.statusText}`,
          errorDetails: errorJson.errorDetails,
        };
      } catch {
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText || response.statusText}`,
        };
      }
    }

    const result = await response.json();
    console.log('✅ Populate result:', result);
    
    if (result.success) {
      console.log('✅ CRM Dummy Data populated successfully:', result.data);
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } else {
      console.error('❌ Failed to populate CRM dummy data:', result.error);
      return {
        success: false,
        error: result.error || 'Unknown server error',
        errorDetails: result.errorDetails,
      };
    }
  } catch (error) {
    console.error('❌ Error calling populate endpoint:', error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : undefined);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch - possible network or server error',
      errorDetails: {
        errorType: error instanceof Error ? error.name : 'Unknown',
      },
    };
  }
}
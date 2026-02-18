import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { karyawanDummyData, clientDummyData, partnerDummyData, opportunityDummyData } from "./crm_dummy_data.tsx";
import { productDummyData } from "./product_dummy_data.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to create Supabase client with service role
const getServiceClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  );
};

// Helper function to verify user authentication
const verifyAuth = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  const accessToken = authHeader?.split(' ')[1];
  
  if (!accessToken) {
    console.log('⚠️ No access token provided');
    return null;
  }
  
  // Allow demo access tokens for testing
  if (accessToken.startsWith('demo-access-token-')) {
    console.log('✅ Demo access token detected');
    return { id: 'demo-user', email: 'demo@salesmonitor.com' };
  }
  
  // Allow public anon key (untuk populate dan public endpoints)
  const publicAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  if (accessToken === publicAnonKey) {
    console.log('✅ Public anon key detected - allowing access');
    return { id: 'public-user', email: 'public@salesmonitor.com' };
  }
  
  // Verify JWT token dengan Supabase
  try {
    const supabase = getServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error) {
      console.error('❌ JWT verification error:', error.message);
      return null;
    }
    
    if (!user) {
      console.log('⚠️ No user found for token');
      return null;
    }
    
    console.log('✅ User authenticated:', user.email);
    return user;
  } catch (error: any) {
    console.error('❌ Exception during auth verification:', error.message);
    return null;
  }
};

// Health check endpoint
app.get("/make-server-67367fc1/health", (c) => {
  return c.json({ status: "ok", message: "Sales Monitoring API is running" });
});

// Initialize database with dummy data
app.post("/make-server-67367fc1/initialize", async (c) => {
  try {
    const body = await c.req.json();
    
    // Store all data in KV store
    if (body.leads) await kv.set("leads", body.leads);
    if (body.products) await kv.set("products", body.products);
    if (body.demos) await kv.set("demos", body.demos);
    if (body.contracts) await kv.set("contracts", body.contracts);
    if (body.salesTeam) await kv.set("salesTeam", body.salesTeam);
    if (body.users) await kv.set("users", body.users);
    if (body.auditTrail) await kv.set("auditTrail", body.auditTrail);
    if (body.opportunities) await kv.set("opportunities", body.opportunities);
    
    console.log("✅ Database initialized successfully!");
    console.log(`  - Leads: ${body.leads?.length || 0}`);
    console.log(`  - Products: ${body.products?.length || 0}`);
    console.log(`  - Demos: ${body.demos?.length || 0}`);
    console.log(`  - Contracts: ${body.contracts?.length || 0}`);
    console.log(`  - Sales Team: ${body.salesTeam?.length || 0}`);
    console.log(`  - Users: ${body.users?.length || 0}`);
    console.log(`  - Audit Logs: ${body.auditTrail?.length || 0}`);
    console.log(`  - Opportunities: ${body.opportunities?.length || 0}`);
    
    return c.json({ 
      success: true, 
      message: "Database initialized successfully",
      counts: {
        leads: body.leads?.length || 0,
        products: body.products?.length || 0,
        demos: body.demos?.length || 0,
        contracts: body.contracts?.length || 0,
        salesTeam: body.salesTeam?.length || 0,
        users: body.users?.length || 0,
        auditTrail: body.auditTrail?.length || 0,
        opportunities: body.opportunities?.length || 0,
      }
    });
  } catch (error) {
    console.log("Error initializing database:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test endpoint for CRM data import
app.get("/make-server-67367fc1/test-crm-import", (c) => {
  try {
    return c.json({ 
      status: "ok", 
      message: "CRM data imported successfully",
      counts: {
        karyawan: karyawanDummyData?.length || 0,
        clients: clientDummyData?.length || 0,
        partners: partnerDummyData?.length || 0,
      }
    });
  } catch (error) {
    return c.json({ 
      status: "error", 
      message: error?.message || "Failed to import CRM data",
      error: String(error)
    }, 500);
  }
});

// ===== LEADS ENDPOINTS =====
app.get("/make-server-67367fc1/leads", async (c) => {
  try {
    const leads = await kv.get("leads") || [];
    return c.json({ success: true, data: leads });
  } catch (error) {
    console.log("Error fetching leads:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-67367fc1/leads", async (c) => {
  try {
    const body = await c.req.json();
    const leads = await kv.get("leads") || [];
    
    const newLead = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    leads.push(newLead);
    await kv.set("leads", leads);
    
    return c.json({ success: true, data: newLead });
  } catch (error) {
    console.log("Error creating lead:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-67367fc1/leads/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const leads = await kv.get("leads") || [];
    
    const index = leads.findIndex((l: any) => l.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Lead not found" }, 404);
    }
    
    leads[index] = {
      ...leads[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("leads", leads);
    return c.json({ success: true, data: leads[index] });
  } catch (error) {
    console.log("Error updating lead:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-67367fc1/leads/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const leads = await kv.get("leads") || [];
    
    const filteredLeads = leads.filter((l: any) => l.id !== id);
    await kv.set("leads", filteredLeads);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting lead:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Clear all leads
app.delete("/make-server-67367fc1/leads", async (c) => {
  try {
    await kv.set("leads", []);
    console.log("✅ All leads cleared successfully");
    return c.json({ success: true, message: "All leads cleared" });
  } catch (error) {
    console.log("Error clearing leads:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== OPPORTUNITIES ENDPOINTS =====
app.get("/make-server-67367fc1/opportunities", async (c) => {
  try {
    let opportunities = await kv.get("opportunities") || [];
    
    // Initialize with dummy data if empty
    if (opportunities.length === 0) {
      opportunities = opportunityDummyData;
      await kv.set("opportunities", opportunities);
      console.log("✅ Initialized opportunities with dummy data");
    }
    
    return c.json({ success: true, data: opportunities });
  } catch (error) {
    console.log("Error fetching opportunities:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-67367fc1/opportunities", async (c) => {
  try {
    const body = await c.req.json();
    const opportunities = await kv.get("opportunities") || [];
    
    const newOpportunity = {
      id: `OPP-${Date.now()}`,
      ...body,
      status: body.status || 'open',
      probability: body.probability || 50,
      reminderSent: false,
      activities: body.activities || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    opportunities.push(newOpportunity);
    await kv.set("opportunities", opportunities);
    
    console.log(`✅ Created opportunity: ${newOpportunity.name}`);
    return c.json({ success: true, data: newOpportunity });
  } catch (error) {
    console.log("Error creating opportunity:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-67367fc1/opportunities/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const opportunities = await kv.get("opportunities") || [];
    
    const index = opportunities.findIndex((o: any) => o.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Opportunity not found" }, 404);
    }
    
    opportunities[index] = {
      ...opportunities[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("opportunities", opportunities);
    console.log(`✅ Updated opportunity: ${id}`);
    return c.json({ success: true, data: opportunities[index] });
  } catch (error) {
    console.log("Error updating opportunity:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-67367fc1/opportunities/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const opportunities = await kv.get("opportunities") || [];
    
    const filteredOpportunities = opportunities.filter((o: any) => o.id !== id);
    await kv.set("opportunities", filteredOpportunities);
    
    console.log(`✅ Deleted opportunity: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting opportunity:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Convert Lead to Opportunity
app.post("/make-server-67367fc1/opportunities/convert-lead/:leadId", async (c) => {
  try {
    const leadId = c.req.param("leadId");
    const body = await c.req.json();
    
    const leads = await kv.get("leads") || [];
    const opportunities = await kv.get("opportunities") || [];
    
    const leadIndex = leads.findIndex((l: any) => l.id === leadId);
    if (leadIndex === -1) {
      return c.json({ success: false, error: "Lead not found" }, 404);
    }
    
    const lead = leads[leadIndex];
    
    // Create opportunity from lead
    const newOpportunity = {
      id: `OPP-${Date.now()}`,
      name: body.name || `${lead.company} - ${lead.name}`,
      leadId: lead.id,
      clientName: lead.company,
      contactPerson: lead.name,
      email: lead.email,
      phone: lead.phone,
      ...body,
      status: 'open',
      stage: body.stage || 'prospecting',
      probability: body.probability || 30,
      reminderSent: false,
      activities: [{
        id: `ACT-${Date.now()}`,
        type: 'converted',
        description: `Converted from lead: ${lead.name}`,
        createdAt: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    opportunities.push(newOpportunity);
    await kv.set("opportunities", opportunities);
    
    // Update lead status to converted
    leads[leadIndex] = {
      ...lead,
      status: 'won',
      updatedAt: new Date().toISOString(),
    };
    await kv.set("leads", leads);
    
    console.log(`✅ Converted lead ${leadId} to opportunity ${newOpportunity.id}`);
    return c.json({ success: true, data: newOpportunity });
  } catch (error) {
    console.log("Error converting lead to opportunity:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get opportunities with reminders due
app.get("/make-server-67367fc1/opportunities/reminders", async (c) => {
  try {
    const opportunitiesData = await kv.get("opportunities");
    const opportunities = Array.isArray(opportunitiesData) ? opportunitiesData : [];
    const now = new Date();
    
    const reminders = opportunities
      .filter((opp: any) => {
        if (opp.status !== 'open') return false;
        if (!opp.closeDate) return false;
        
        const closeDate = new Date(opp.closeDate);
        const daysUntilClose = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Reminder triggers: 7 days, 3 days, 1 day before, or overdue
        return daysUntilClose <= 7 && daysUntilClose >= -30;
      })
      .map((opp: any) => {
        const closeDate = new Date(opp.closeDate);
        const daysUntilClose = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        let priority = 'low';
        let message = '';
        
        if (daysUntilClose < 0) {
          priority = 'urgent';
          message = `Opportunity overdue by ${Math.abs(daysUntilClose)} days!`;
        } else if (daysUntilClose === 1) {
          priority = 'high';
          message = 'Urgent: Close deal tomorrow!';
        } else if (daysUntilClose <= 3) {
          priority = 'medium';
          message = 'Follow-up proposal needed';
        } else if (daysUntilClose <= 7) {
          priority = 'low';
          message = 'Time to send proposal';
        }
        
        return {
          ...opp,
          daysUntilClose,
          priority,
          reminderMessage: message,
        };
      });
    
    return c.json({ success: true, data: reminders });
  } catch (error: any) {
    console.log("Error fetching reminders:", error);
    return c.json({ success: false, error: error?.message || String(error) }, 500);
  }
});

// ===== PRODUCTS ENDPOINTS =====
app.get("/make-server-67367fc1/products", async (c) => {
  try {
    console.log("🔄 Fetching products from KV store...");
    let products = await kv.get("products") || [];
    
    // Initialize with dummy data if empty
    if (products.length === 0) {
      console.log("📦 No products found, initializing with dummy data...");
      products = productDummyData;
      await kv.set("products", products);
      console.log("✅ Initialized products with dummy data");
    }
    
    console.log(`✅ Returning ${products.length} products`);
    return c.json({ success: true, data: products });
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return c.json({ 
      success: false, 
      error: `Failed to fetch products: ${error.message}` 
    }, 500);
  }
});

// Create product
app.post("/make-server-67367fc1/products", async (c) => {
  try {
    console.log("🔄 Creating new product...");
    const body = await c.req.json();
    const products = await kv.get("products") || [];
    
    const newProduct = {
      id: `PROD-${Date.now()}`,
      ...body,
      sold: body.sold || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    await kv.set("products", products);
    
    console.log("✅ Product created successfully:", newProduct.id);
    return c.json({ success: true, data: newProduct });
  } catch (error: any) {
    console.error("❌ Error creating product:", error);
    return c.json({ 
      success: false, 
      error: `Failed to create product: ${error.message}` 
    }, 500);
  }
});

// Update product
app.put("/make-server-67367fc1/products/:id", async (c) => {
  try {
    console.log("🔄 Updating product...");
    const id = c.req.param("id");
    const body = await c.req.json();
    const products = await kv.get("products") || [];
    
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      console.error("❌ Product not found:", id);
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    
    products[index] = {
      ...products[index],
      ...body,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("products", products);
    
    console.log("✅ Product updated successfully:", id);
    return c.json({ success: true, data: products[index] });
  } catch (error: any) {
    console.error("❌ Error updating product:", error);
    return c.json({ 
      success: false, 
      error: `Failed to update product: ${error.message}` 
    }, 500);
  }
});

// Delete product
app.delete("/make-server-67367fc1/products/:id", async (c) => {
  try {
    console.log("🔄 Deleting product...");
    const id = c.req.param("id");
    const products = await kv.get("products") || [];
    
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      console.error("❌ Product not found:", id);
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    
    products.splice(index, 1);
    await kv.set("products", products);
    
    console.log("✅ Product deleted successfully:", id);
    return c.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting product:", error);
    return c.json({ 
      success: false, 
      error: `Failed to delete product: ${error.message}` 
    }, 500);
  }
});

// Reset products with dummy data
app.post("/make-server-67367fc1/products/populate", async (c) => {
  try {
    console.log("🔄 Populating products with dummy data...");
    await kv.set("products", productDummyData);
    console.log(`✅ Successfully populated ${productDummyData.length} products`);
    return c.json({ 
      success: true, 
      message: "Products populated successfully",
      count: productDummyData.length 
    });
  } catch (error: any) {
    console.error("❌ Error populating products:", error);
    return c.json({ 
      success: false, 
      error: `Failed to populate products: ${error.message}` 
    }, 500);
  }
});

// ===== CLIENTS ENDPOINTS =====
app.get("/make-server-67367fc1/clients", async (c) => {
  try {
    console.log("🔄 Fetching clients from KV store...");
    let clients = await kv.get("clients") || [];
    
    // Initialize with dummy data if empty
    if (clients.length === 0) {
      console.log("📦 No clients found, initializing with dummy data...");
      clients = clientDummyData;
      await kv.set("clients", clients);
      console.log("✅ Initialized clients with dummy data");
    }
    
    console.log(`✅ Returning ${clients.length} clients`);
    return c.json({ success: true, data: clients });
  } catch (error: any) {
    console.error("❌ Error fetching clients:", error);
    console.error("❌ Error stack:", error.stack);
    return c.json({ 
      success: false, 
      error: `Failed to fetch clients: ${error.message}` 
    }, 500);
  }
});

app.post("/make-server-67367fc1/clients", async (c) => {
  try {
    const body = await c.req.json();
    const clients = await kv.get("clients") || [];
    
    const newClient = {
      id: `CLI-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    clients.push(newClient);
    await kv.set("clients", clients);
    
    console.log(`✅ Created client: ${newClient.id}`);
    return c.json({ success: true, data: newClient });
  } catch (error) {
    console.log("Error creating client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-67367fc1/clients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const clients = await kv.get("clients") || [];
    
    const index = clients.findIndex((client: any) => client.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Client not found" }, 404);
    }
    
    clients[index] = {
      ...clients[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("clients", clients);
    
    console.log(`✅ Updated client: ${id}`);
    return c.json({ success: true, data: clients[index] });
  } catch (error) {
    console.log("Error updating client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-67367fc1/clients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let clients = await kv.get("clients") || [];
    
    clients = clients.filter((client: any) => client.id !== id);
    await kv.set("clients", clients);
    
    console.log(`✅ Deleted client: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== PARTNERS ENDPOINTS =====
app.get("/make-server-67367fc1/partners", async (c) => {
  try {
    console.log("🔄 Fetching partners from KV store...");
    let partners = await kv.get("partners") || [];
    
    // Initialize with dummy data if empty
    if (partners.length === 0) {
      console.log("📦 No partners found, initializing with dummy data...");
      partners = partnerDummyData;
      await kv.set("partners", partners);
      console.log("✅ Initialized partners with dummy data");
    }
    
    console.log(`✅ Returning ${partners.length} partners`);
    return c.json({ success: true, data: partners });
  } catch (error: any) {
    console.error("❌ Error fetching partners:", error);
    console.error("❌ Error stack:", error.stack);
    return c.json({ 
      success: false, 
      error: `Failed to fetch partners: ${error.message}` 
    }, 500);
  }
});

app.post("/make-server-67367fc1/partners", async (c) => {
  try {
    const body = await c.req.json();
    const partners = await kv.get("partners") || [];
    
    const newPartner = {
      id: `PAR-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    partners.push(newPartner);
    await kv.set("partners", partners);
    
    console.log(`✅ Created partner: ${newPartner.id}`);
    return c.json({ success: true, data: newPartner });
  } catch (error) {
    console.log("Error creating partner:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-67367fc1/partners/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const partners = await kv.get("partners") || [];
    
    const index = partners.findIndex((partner: any) => partner.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Partner not found" }, 404);
    }
    
    partners[index] = {
      ...partners[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("partners", partners);
    
    console.log(`✅ Updated partner: ${id}`);
    return c.json({ success: true, data: partners[index] });
  } catch (error) {
    console.log("Error updating partner:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-67367fc1/partners/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let partners = await kv.get("partners") || [];
    
    partners = partners.filter((partner: any) => partner.id !== id);
    await kv.set("partners", partners);
    
    console.log(`✅ Deleted partner: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting partner:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== EMPLOYEES ENDPOINTS =====
app.get("/make-server-67367fc1/employees", async (c) => {
  try {
    let employees = await kv.get("employees") || [];
    
    // Initialize with dummy data if empty
    if (employees.length === 0) {
      employees = karyawanDummyData;
      await kv.set("employees", employees);
      console.log("✅ Initialized employees with dummy data");
    }
    
    return c.json({ success: true, data: employees });
  } catch (error) {
    console.log("Error fetching employees:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-67367fc1/employees", async (c) => {
  try {
    const body = await c.req.json();
    const employees = await kv.get("employees") || [];
    
    const newEmployee = {
      id: `EMP-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    employees.push(newEmployee);
    await kv.set("employees", employees);
    
    console.log(`✅ Created employee: ${newEmployee.id}`);
    return c.json({ success: true, data: newEmployee });
  } catch (error) {
    console.log("Error creating employee:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-67367fc1/employees/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const employees = await kv.get("employees") || [];
    
    const index = employees.findIndex((employee: any) => employee.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Employee not found" }, 404);
    }
    
    employees[index] = {
      ...employees[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("employees", employees);
    
    console.log(`✅ Updated employee: ${id}`);
    return c.json({ success: true, data: employees[index] });
  } catch (error) {
    console.log("Error updating employee:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-67367fc1/employees/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let employees = await kv.get("employees") || [];
    
    employees = employees.filter((employee: any) => employee.id !== id);
    await kv.set("employees", employees);
    
    console.log(`✅ Deleted employee: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting employee:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== DEMOS ENDPOINTS =====
app.get("/make-server-67367fc1/demos", async (c) => {
  try {
    let demos = await kv.get("demos") || [];
    
    // Check if ALL demos have complete advanced scheduling data
    // Must have attendees, resources, bufferTime, AND rating for completed demos
    const hasCompleteAdvancedScheduling = demos.length > 0 && demos.every((demo: any) => 
      demo.attendees && 
      demo.attendees.length > 0 &&
      demo.resources && 
      demo.resources.length > 0 &&
      demo.bufferTime &&
      demo.bufferTime.before !== undefined &&
      demo.bufferTime.after !== undefined &&
      // Completed demos must have rating
      (demo.status !== 'completed' || (demo.rating && demo.rating > 0))
    );
    
    // If incomplete or empty, use dummy data from file
    if (!hasCompleteAdvancedScheduling || demos.length === 0) {
      console.log("⚠️ Incomplete or missing advanced scheduling data in backend, using demo dummy data...");
      const completedWithoutRating = demos.filter((d: any) => d.status === 'completed' && (!d.rating || d.rating === 0));
      if (completedWithoutRating.length > 0) {
        console.log(`📌 Found ${completedWithoutRating.length} completed demo(s) without rating:`, completedWithoutRating.map((d: any) => d.title));
      }
      const { demoDummyData } = await import("./demo_dummy_data.tsx");
      demos = demoDummyData;
      await kv.set("demos", demos);
      console.log("✅ Initialized demos with COMPLETE advanced scheduling data including ratings");
      console.log(`📊 Total demos: ${demos.length}`);
    } else {
      console.log("✅ All demos have complete advanced scheduling data");
    }
    
    return c.json({ success: true, data: demos });
  } catch (error) {
    console.log("Error fetching demos:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-67367fc1/demos", async (c) => {
  try {
    const body = await c.req.json();
    const demos = await kv.get("demos") || [];
    
    const newDemo = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    demos.push(newDemo);
    await kv.set("demos", demos);
    
    return c.json({ success: true, data: newDemo });
  } catch (error) {
    console.log("Error creating demo:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Clear all demos (force reset)
app.delete("/make-server-67367fc1/demos", async (c) => {
  try {
    await kv.set("demos", []);
    console.log("✅ Cleared all demos");
    return c.json({ success: true, message: "All demos cleared" });
  } catch (error) {
    console.log("Error clearing demos:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== CONTRACTS ENDPOINTS =====
app.get("/make-server-67367fc1/contracts", async (c) => {
  try {
    const contracts = await kv.get("contracts") || [];
    return c.json({ success: true, data: contracts });
  } catch (error) {
    console.log("Error fetching contracts:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-67367fc1/contracts", async (c) => {
  try {
    console.log('📥 POST /contracts - creating new contract...');
    const body = await c.req.json();
    const contracts = await kv.get("contracts") || [];
    
    const newContract = {
      id: `C${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    contracts.push(newContract);
    await kv.set("contracts", contracts);
    
    console.log(`✅ Created new contract: ${newContract.contractNumber}`);
    return c.json({ success: true, data: newContract });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error creating contract:", errorMsg);
    return c.json({ success: false, error: `Failed to create contract: ${errorMsg}` }, 500);
  }
});

app.put("/make-server-67367fc1/contracts/:id", async (c) => {
  try {
    console.log('📝 PUT /contracts/:id - updating contract...');
    const id = c.req.param("id");
    const body = await c.req.json();
    const contracts = await kv.get("contracts") || [];
    
    const index = contracts.findIndex((contract: any) => contract.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Contract not found" }, 404);
    }
    
    contracts[index] = {
      ...contracts[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("contracts", contracts);
    console.log(`✅ Updated contract: ${contracts[index].contractNumber}`);
    return c.json({ success: true, data: contracts[index] });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error updating contract:", errorMsg);
    return c.json({ success: false, error: `Failed to update contract: ${errorMsg}` }, 500);
  }
});

app.delete("/make-server-67367fc1/contracts/:id", async (c) => {
  try {
    console.log('🗑️ DELETE /contracts/:id - deleting contract...');
    const id = c.req.param("id");
    const contracts = await kv.get("contracts") || [];
    
    const filteredContracts = contracts.filter((contract: any) => contract.id !== id);
    
    if (filteredContracts.length === contracts.length) {
      return c.json({ success: false, error: "Contract not found" }, 404);
    }
    
    await kv.set("contracts", filteredContracts);
    console.log(`✅ Deleted contract with id: ${id}`);
    return c.json({ success: true, message: "Contract deleted successfully" });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error deleting contract:", errorMsg);
    return c.json({ success: false, error: `Failed to delete contract: ${errorMsg}` }, 500);
  }
});

// ===== SALES TEAM ENDPOINTS =====
app.get("/make-server-67367fc1/sales-team", async (c) => {
  try {
    const team = await kv.get("sales-team") || [];
    return c.json({ success: true, data: team });
  } catch (error) {
    console.log("Error fetching sales team:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== KARYAWAN ENDPOINTS =====
app.get("/make-server-67367fc1/karyawan", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    console.log('📥 GET /karyawan - fetching data...');
    
    const karyawan = await kv.get("karyawan") || [];
    console.log(`✅ Fetched ${karyawan.length} karyawan records`);
    return c.json({ success: true, data: karyawan });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error fetching karyawan:", errorMsg);
    return c.json({ success: false, error: `Failed to fetch karyawan: ${errorMsg}` }, 500);
  }
});

app.post("/make-server-67367fc1/karyawan", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const body = await c.req.json();
    const karyawan = await kv.get("karyawan") || [];
    
    const newKaryawan = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    karyawan.push(newKaryawan);
    await kv.set("karyawan", karyawan);
    
    console.log(`✅ Created new karyawan: ${newKaryawan.nama_lengkap}`);
    return c.json({ success: true, data: newKaryawan });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error creating karyawan:", errorMsg);
    return c.json({ success: false, error: `Failed to create karyawan: ${errorMsg}` }, 500);
  }
});

app.put("/make-server-67367fc1/karyawan/:id", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const id = c.req.param("id");
    const body = await c.req.json();
    const karyawan = await kv.get("karyawan") || [];
    
    const index = karyawan.findIndex((k: any) => k.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Karyawan not found" }, 404);
    }
    
    karyawan[index] = {
      ...karyawan[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("karyawan", karyawan);
    console.log(`✅ Updated karyawan: ${karyawan[index].nama_lengkap}`);
    return c.json({ success: true, data: karyawan[index] });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error updating karyawan:", errorMsg);
    return c.json({ success: false, error: `Failed to update karyawan: ${errorMsg}` }, 500);
  }
});

app.delete("/make-server-67367fc1/karyawan/:id", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const id = c.req.param("id");
    const karyawan = await kv.get("karyawan") || [];
    
    const filteredKaryawan = karyawan.filter((k: any) => k.id !== id);
    await kv.set("karyawan", filteredKaryawan);
    
    console.log(`✅ Deleted karyawan with ID: ${id}`);
    return c.json({ success: true });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error deleting karyawan:", errorMsg);
    return c.json({ success: false, error: `Failed to delete karyawan: ${errorMsg}` }, 500);
  }
});

// ===== CLIENT ENDPOINTS =====
app.get("/make-server-67367fc1/clients", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    console.log('📥 GET /clients - fetching data...');
    
    const clients = await kv.get("clients") || [];
    console.log(`✅ Fetched ${clients.length} client records`);
    return c.json({ success: true, data: clients });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error fetching clients:", errorMsg);
    return c.json({ success: false, error: `Failed to fetch clients: ${errorMsg}` }, 500);
  }
});

app.post("/make-server-67367fc1/clients", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const body = await c.req.json();
    const clients = await kv.get("clients") || [];
    
    const newClient = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    clients.push(newClient);
    await kv.set("clients", clients);
    
    console.log(`✅ Created new client: ${newClient.nama_entitas}`);
    return c.json({ success: true, data: newClient });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error creating client:", errorMsg);
    return c.json({ success: false, error: `Failed to create client: ${errorMsg}` }, 500);
  }
});

app.put("/make-server-67367fc1/clients/:id", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const id = c.req.param("id");
    const body = await c.req.json();
    const clients = await kv.get("clients") || [];
    
    const index = clients.findIndex((cl: any) => cl.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Client not found" }, 404);
    }
    
    clients[index] = {
      ...clients[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("clients", clients);
    console.log(`✅ Updated client: ${clients[index].nama_entitas}`);
    return c.json({ success: true, data: clients[index] });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error updating client:", errorMsg);
    return c.json({ success: false, error: `Failed to update client: ${errorMsg}` }, 500);
  }
});

app.delete("/make-server-67367fc1/clients/:id", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const id = c.req.param("id");
    const clients = await kv.get("clients") || [];
    
    const filteredClients = clients.filter((cl: any) => cl.id !== id);
    await kv.set("clients", filteredClients);
    
    console.log(`✅ Deleted client with ID: ${id}`);
    return c.json({ success: true });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error deleting client:", errorMsg);
    return c.json({ success: false, error: `Failed to delete client: ${errorMsg}` }, 500);
  }
});

// ===== PARTNER ENDPOINTS =====
app.get("/make-server-67367fc1/partners", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    console.log('📥 GET /partners - fetching data...');
    
    const partners = await kv.get("partners") || [];
    console.log(`✅ Fetched ${partners.length} partner records`);
    return c.json({ success: true, data: partners });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error fetching partners:", errorMsg);
    return c.json({ success: false, error: `Failed to fetch partners: ${errorMsg}` }, 500);
  }
});

app.post("/make-server-67367fc1/partners", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const body = await c.req.json();
    const partners = await kv.get("partners") || [];
    
    const newPartner = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    partners.push(newPartner);
    await kv.set("partners", partners);
    
    console.log(`✅ Created new partner: ${newPartner.nama_perusahaan}`);
    return c.json({ success: true, data: newPartner });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error creating partner:", errorMsg);
    return c.json({ success: false, error: `Failed to create partner: ${errorMsg}` }, 500);
  }
});

app.put("/make-server-67367fc1/partners/:id", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const id = c.req.param("id");
    const body = await c.req.json();
    const partners = await kv.get("partners") || [];
    
    const index = partners.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "Partner not found" }, 404);
    }
    
    partners[index] = {
      ...partners[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("partners", partners);
    console.log(`✅ Updated partner: ${partners[index].nama_perusahaan}`);
    return c.json({ success: true, data: partners[index] });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error updating partner:", errorMsg);
    return c.json({ success: false, error: `Failed to update partner: ${errorMsg}` }, 500);
  }
});

app.delete("/make-server-67367fc1/partners/:id", async (c) => {
  try {
    // Allow public access for demo purposes (no auth required)
    const id = c.req.param("id");
    const partners = await kv.get("partners") || [];
    
    const filteredPartners = partners.filter((p: any) => p.id !== id);
    await kv.set("partners", filteredPartners);
    
    console.log(`✅ Deleted partner with ID: ${id}`);
    return c.json({ success: true });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error("❌ Error deleting partner:", errorMsg);
    return c.json({ success: false, error: `Failed to delete partner: ${errorMsg}` }, 500);
  }
});

// ===== REPORTS ENDPOINTS =====
app.get("/make-server-67367fc1/reports/overview", async (c) => {
  try {
    const leads = await kv.get("leads") || [];
    const contracts = await kv.get("contracts") || [];
    const team = await kv.get("sales-team") || [];
    
    const overview = {
      totalLeads: leads.length,
      totalContracts: contracts.length,
      totalRevenue: contracts.reduce((sum: number, c: any) => sum + (c.value || 0), 0),
      teamPerformance: team.reduce((sum: number, t: any) => sum + (t.performance || 0), 0) / (team.length || 1),
    };
    
    return c.json({ success: true, data: overview });
  } catch (error) {
    console.log("Error fetching reports overview:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== AUTHENTICATION ENDPOINTS =====
app.post("/make-server-67367fc1/signup", async (c) => {
  try {
    const supabase = getServiceClient();
    const body = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      user_metadata: { name: body.name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log("Sign up error:", error);
      return c.json({ success: false, error: error.message }, 400);
    }
    
    return c.json({ success: true, data: data.user });
  } catch (error) {
    console.log("Signup error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== USER MANAGEMENT ENDPOINTS =====
app.get("/make-server-67367fc1/users", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    
    const users = await kv.get("users") || [];
    return c.json({ success: true, data: users });
  } catch (error) {
    console.log("Error fetching users:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-67367fc1/users", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    
    const body = await c.req.json();
    const users = await kv.get("users") || [];
    
    const newUser = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await kv.set("users", users);
    
    return c.json({ success: true, data: newUser });
  } catch (error) {
    console.log("Error creating user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-67367fc1/users/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    
    const id = c.req.param("id");
    const body = await c.req.json();
    const users = await kv.get("users") || [];
    
    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    
    users[index] = {
      ...users[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set("users", users);
    return c.json({ success: true, data: users[index] });
  } catch (error) {
    console.log("Error updating user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-67367fc1/users/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    
    const id = c.req.param("id");
    const users = await kv.get("users") || [];
    
    const filteredUsers = users.filter((u: any) => u.id !== id);
    await kv.set("users", filteredUsers);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== AUDIT TRAIL ENDPOINTS =====
app.get("/make-server-67367fc1/audit-trail", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    
    const auditTrail = await kv.get("audit-trail") || [];
    return c.json({ success: true, data: auditTrail });
  } catch (error) {
    console.log("Error fetching audit trail:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-67367fc1/audit-trail", async (c) => {
  try {
    const body = await c.req.json();
    const auditTrail = await kv.get("audit-trail") || [];
    
    const newEntry = {
      id: Date.now().toString(),
      ...body,
      timestamp: new Date().toISOString(),
    };
    
    auditTrail.push(newEntry);
    await kv.set("audit-trail", auditTrail);
    
    return c.json({ success: true, data: newEntry });
  } catch (error) {
    console.log("Error creating audit trail entry:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== SEED DATA ENDPOINT (for initialization) =====
app.post("/make-server-67367fc1/seed-data", async (c) => {
  try {
    const body = await c.req.json();
    const { key, data } = body;
    
    if (!key || !data) {
      return c.json({ success: false, error: "Key and data are required" }, 400);
    }
    
    await kv.set(key, data);
    console.log(`Seeded data for key: ${key}, items: ${data.length}`);
    
    return c.json({ success: true, message: `Seeded ${data.length} items for ${key}` });
  } catch (error) {
    console.log("Error seeding data:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== INITIALIZE DATABASE =====
app.post("/make-server-67367fc1/init-db", async (c) => {
  try {
    // Initialize basic data structures
    const existingLeads = await kv.get("leads");
    if (!existingLeads) {
      await kv.set("leads", []);
    }
    
    const existingProducts = await kv.get("products");
    if (!existingProducts) {
      await kv.set("products", []);
    }
    
    const existingDemos = await kv.get("demos");
    if (!existingDemos) {
      await kv.set("demos", []);
    }
    
    const existingContracts = await kv.get("contracts");
    if (!existingContracts) {
      await kv.set("contracts", []);
    }
    
    const existingUsers = await kv.get("users");
    if (!existingUsers) {
      await kv.set("users", []);
    }
    
    const existingAuditTrail = await kv.get("audit-trail");
    if (!existingAuditTrail) {
      await kv.set("audit-trail", []);
    }

    // Initialize CRM data structures
    const existingKaryawan = await kv.get("karyawan");
    if (!existingKaryawan) {
      await kv.set("karyawan", []);
    }

    const existingClients = await kv.get("clients");
    if (!existingClients) {
      await kv.set("clients", []);
    }

    const existingPartners = await kv.get("partners");
    if (!existingPartners) {
      await kv.set("partners", []);
    }
    
    return c.json({ 
      success: true, 
      message: "Database initialized successfully" 
    });
  } catch (error) {
    console.log("Error initializing database:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===== POPULATE CRM DUMMY DATA =====
app.post("/make-server-67367fc1/populate-crm-dummy", async (c) => {
  try {
    console.log('📥 Populate CRM dummy data endpoint called');
    
    // Add timestamps to imported data
    const now = new Date().toISOString();
    
    console.log('🔄 Processing Karyawan data...');
    const karyawanData = karyawanDummyData.map(k => ({
      ...k,
      createdAt: now,
      updatedAt: now,
    }));
    console.log(`✅ Karyawan data processed: ${karyawanData.length} items`);
    
    console.log('🔄 Processing Client data...');
    const clientData = clientDummyData.map(cl => ({
      ...cl,
      createdAt: now,
      updatedAt: now,
    }));
    console.log(`✅ Client data processed: ${clientData.length} items`);
    
    console.log('🔄 Processing Partner data...');
    const partnerData = partnerDummyData.map(p => ({
      ...p,
      createdAt: now,
      updatedAt: now,
    }));
    console.log(`✅ Partner data processed: ${partnerData.length} items`);

    // Save to database
    console.log('💾 Saving Karyawan to database...');
    await kv.set("karyawan", karyawanData);
    console.log('✅ Karyawan saved');
    
    console.log('💾 Saving Clients to database...');
    await kv.set("clients", clientData);
    console.log('✅ Clients saved');
    
    console.log('💾 Saving Partners to database...');
    await kv.set("partners", partnerData);
    console.log('✅ Partners saved');

    console.log('✅ CRM Dummy Data saved successfully');
    console.log(`Karyawan: ${karyawanData.length}, Clients: ${clientData.length}, Partners: ${partnerData.length}`);

    return c.json({
      success: true,
      message: "CRM dummy data populated successfully",
      data: {
        karyawan: karyawanData.length,
        clients: clientData.length,
        partners: partnerData.length,
      }
    });
  } catch (error) {
    console.log("❌ Error populating CRM dummy data:");
    console.log("Error name:", error?.name);
    console.log("Error message:", error?.message);
    console.log("Error stack:", error?.stack);
    return c.json({ 
      success: false, 
      error: error?.message || "Unknown error occurred",
      errorDetails: {
        name: error?.name,
        stack: error?.stack
      }
    }, 500);
  }
});

// ===== INITIALIZE DATABASE WITH ALL DUMMY DATA =====
app.post("/make-server-67367fc1/initialize", async (c) => {
  try {
    console.log('📥 Initialize database endpoint called');
    
    const body = await c.req.json();
    const { leads, products, demos, contracts, salesTeam, users, auditTrail } = body;

    console.log('💾 Saving all dummy data to database...');
    
    // Save all data to respective keys
    if (leads) {
      await kv.set("leads", leads);
      console.log(`✅ Saved ${leads.length} leads`);
    }
    
    if (products) {
      await kv.set("products", products);
      console.log(`✅ Saved ${products.length} products`);
    }
    
    if (demos) {
      await kv.set("demos", demos);
      console.log(`✅ Saved ${demos.length} demos`);
    }
    
    if (contracts) {
      await kv.set("contracts", contracts);
      console.log(`✅ Saved ${contracts.length} contracts`);
    }
    
    if (salesTeam) {
      await kv.set("sales-team", salesTeam);
      console.log(`✅ Saved ${salesTeam.length} sales team members`);
    }
    
    if (users) {
      await kv.set("users", users);
      console.log(`✅ Saved ${users.length} users`);
    }
    
    if (auditTrail) {
      await kv.set("audit-trail", auditTrail);
      console.log(`✅ Saved ${auditTrail.length} audit trail entries`);
    }

    console.log('✅ Database initialized successfully');

    return c.json({
      success: true,
      message: "Database initialized with all dummy data",
      data: {
        leads: leads?.length || 0,
        products: products?.length || 0,
        demos: demos?.length || 0,
        contracts: contracts?.length || 0,
        salesTeam: salesTeam?.length || 0,
        users: users?.length || 0,
        auditTrail: auditTrail?.length || 0,
      }
    });
  } catch (error) {
    console.log("❌ Error initializing database:");
    console.log("Error message:", error?.message);
    console.log("Error stack:", error?.stack);
    return c.json({ 
      success: false, 
      error: error?.message || "Unknown error occurred"
    }, 500);
  }
});

// OLD CODE - BACKUP (to be removed after testing)
/*
app.post("/make-server-67367fc1/populate-crm-dummy-OLD", async (c) => {
  try {
    console.log('📥 Populate CRM dummy data endpoint called');
    console.log('Headers:', c.req.header());
    
    // Data Dummy Karyawan (5 data) - Updated to match interface
    const karyawanDataOLD = [
      {
        id: "KRY001",
        nik: "EMP2024001",
        nama_lengkap: "Ahmad Rizki Pratama",
        tempat_lahir: "Jakarta",
        tanggal_lahir: "1990-05-15",
        jenis_kelamin: "Laki-laki",
        alamat: "Jl. Sudirman No. 123, Jakarta Pusat",
        nomor_wa: "081234567890",
        email_pribadi: "ahmad.rizki.personal@gmail.com",
        divisi: "Sales & Marketing",
        jabatan: "Senior Sales Manager",
        level_jabatan: "Manager",
        status_karyawan: "Permanent",
        tanggal_bergabung: "2020-01-15",
        nama_atasan: "Direktur Sales",
        npwp: "12.345.678.9-012.000",
        nomor_rekening: "1234567890",
        nama_bank: "BCA",
        bpjs_ketenagakerjaan: "BP1234567890",
        bpjs_kesehatan: "0001234567890",
        email_kantor: "ahmad.rizki@company.com",
        nda_signed: true,
        tanggal_nda: "2020-01-10",
        level_akses: "Manager Level",
        aset_perusahaan: "Laptop Dell XPS 15, iPhone 14 Pro",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "KRY002",
        nik: "EMP2024002",
        nama_lengkap: "Siti Nurhaliza",
        tempat_lahir: "Bandung",
        tanggal_lahir: "1992-08-22",
        jenis_kelamin: "Perempuan",
        alamat: "Jl. Gatot Subroto No. 45, Jakarta Selatan",
        nomor_wa: "081345678901",
        email_pribadi: "siti.nurhaliza88@gmail.com",
        divisi: "Sales & Marketing",
        jabatan: "Account Executive",
        level_jabatan: "Staff",
        status_karyawan: "Permanent",
        tanggal_bergabung: "2021-03-20",
        nama_atasan: "Ahmad Rizki Pratama",
        npwp: "12.345.678.9-013.000",
        nomor_rekening: "1234567891",
        nama_bank: "Mandiri",
        bpjs_ketenagakerjaan: "BP1234567891",
        bpjs_kesehatan: "0001234567891",
        email_kantor: "siti.nurhaliza@company.com",
        nda_signed: true,
        tanggal_nda: "2021-03-15",
        level_akses: "Staff Level",
        aset_perusahaan: "Laptop Asus VivoBook, Smartphone Samsung",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "KRY003",
        nik: "EMP2024003",
        nama_lengkap: "Budi Santoso",
        tempat_lahir: "Surabaya",
        tanggal_lahir: "1988-11-30",
        jenis_kelamin: "Laki-laki",
        alamat: "Jl. Rasuna Said No. 78, Jakarta Selatan",
        nomor_wa: "081456789012",
        email_pribadi: "budi.santoso.tech@gmail.com",
        divisi: "Technical Support",
        jabatan: "Solution Architect",
        level_jabatan: "Senior Staff",
        status_karyawan: "Permanent",
        tanggal_bergabung: "2019-06-10",
        nama_atasan: "CTO",
        npwp: "12.345.678.9-014.000",
        nomor_rekening: "1234567892",
        nama_bank: "BNI",
        bpjs_ketenagakerjaan: "BP1234567892",
        bpjs_kesehatan: "0001234567892",
        email_kantor: "budi.santoso@company.com",
        nda_signed: true,
        tanggal_nda: "2019-06-05",
        level_akses: "Technical Lead",
        aset_perusahaan: "Laptop MacBook Pro 16, iPad Pro, iPhone 13",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "KRY004",
        nik: "EMP2024004",
        nama_lengkap: "Dewi Anggraini",
        tempat_lahir: "Yogyakarta",
        tanggal_lahir: "1994-03-18",
        jenis_kelamin: "Perempuan",
        alamat: "Jl. Thamrin No. 56, Jakarta Pusat",
        nomor_wa: "081567890123",
        email_pribadi: "dewi.anggraini@gmail.com",
        divisi: "Customer Success",
        jabatan: "Customer Success Manager",
        level_jabatan: "Manager",
        status_karyawan: "Contract",
        tanggal_bergabung: "2022-09-01",
        nama_atasan: "Head of Customer Success",
        npwp: "12.345.678.9-015.000",
        nomor_rekening: "1234567893",
        nama_bank: "BCA",
        bpjs_ketenagakerjaan: "BP1234567893",
        bpjs_kesehatan: "0001234567893",
        email_kantor: "dewi.anggraini@company.com",
        nda_signed: true,
        tanggal_nda: "2022-08-25",
        level_akses: "Manager Level",
        aset_perusahaan: "Laptop HP EliteBook, iPhone 12",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "KRY005",
        nik: "EMP2024005",
        nama_lengkap: "Rendra Mahendra",
        tempat_lahir: "Semarang",
        tanggal_lahir: "1991-07-25",
        jenis_kelamin: "Laki-laki",
        alamat: "Jl. Kuningan No. 99, Jakarta Selatan",
        nomor_wa: "081678901234",
        email_pribadi: "rendra.mahendra@yahoo.com",
        divisi: "Sales & Marketing",
        jabatan: "Business Development",
        level_jabatan: "Senior Staff",
        status_karyawan: "Permanent",
        tanggal_bergabung: "2021-11-15",
        nama_atasan: "Ahmad Rizki Pratama",
        npwp: "12.345.678.9-016.000",
        nomor_rekening: "1234567894",
        nama_bank: "Mandiri",
        bpjs_ketenagakerjaan: "BP1234567894",
        bpjs_kesehatan: "0001234567894",
        email_kantor: "rendra.mahendra@company.com",
        nda_signed: true,
        tanggal_nda: "2021-11-10",
        level_akses: "Senior Staff Level",
        aset_perusahaan: "Laptop Lenovo ThinkPad, Smartphone Xiaomi",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Data Dummy Client (10 data)
    const clientData = [
      {
        id: "CLI001",
        nama_perusahaan: "RS Harapan Sehat",
        tipe_organisasi: "Rumah Sakit Swasta",
        bidang_usaha: "Healthcare",
        skala_perusahaan: "Enterprise",
        pic_utama: "Dr. Michael Hartono",
        email_pic: "michael.hartono@rsharapansehat.com",
        no_telepon_pic: "021-5551234",
        status_client: "Active",
        tanggal_akuisisi: "2023-02-15",
        alamat_kantor_pusat: "Jl. Sudirman Kav. 52, Jakarta",
        jumlah_cabang: "8",
        npwp_perusahaan: "01.234.567.8-901.000",
        website: "www.rsharapansehat.com",
        tahun_berdiri: "2015",
        jumlah_karyawan: "850",
        pic_keuangan: "Ibu Sarah - CFO",
        pic_teknis: "Bapak Agus - IT Manager",
        produk_digunakan: "HMS Enterprise, Telemedicine Pro",
        nilai_kontrak_tahunan: "850000000",
        metode_pembayaran: "Monthly",
        account_manager: "Ahmad Rizki Pratama",
        tanggal_renewal: "2026-02-15",
        sumber_leads: "Partnership",
        rating_kepuasan: "4.8",
        catatan_penting: "VIP Client - High priority support",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI002",
        nama_perusahaan: "Klinik Medika Prima",
        tipe_organisasi: "Klinik",
        bidang_usaha: "Healthcare",
        skala_perusahaan: "Mid-Market",
        pic_utama: "Dr. Kartika Dewi",
        email_pic: "kartika@medikaprima.com",
        no_telepon_pic: "021-5552345",
        status_client: "Active",
        tanggal_akuisisi: "2023-06-20",
        alamat_kantor_pusat: "Jl. Gatot Subroto No. 88, Jakarta",
        jumlah_cabang: "4",
        npwp_perusahaan: "01.234.567.8-902.000",
        website: "www.medikaprima.com",
        tahun_berdiri: "2018",
        jumlah_karyawan: "120",
        pic_keuangan: "Bapak Doni - Finance Manager",
        pic_teknis: "Ibu Lina - Admin IT",
        produk_digunakan: "Clinic Management Basic",
        nilai_kontrak_tahunan: "180000000",
        metode_pembayaran: "Quarterly",
        account_manager: "Siti Nurhaliza",
        tanggal_renewal: "2025-06-20",
        sumber_leads: "Digital Marketing",
        rating_kepuasan: "4.5",
        catatan_penting: "Potential for upsell to Pro version",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI003",
        nama_perusahaan: "Apotek Sehat Bersama",
        tipe_organisasi: "Apotek Chain",
        bidang_usaha: "Pharmacy",
        skala_perusahaan: "Small Business",
        pic_utama: "Apt. Rina Susanti",
        email_pic: "rina@apoteksehat.com",
        no_telepon_pic: "021-5553456",
        status_client: "Trial",
        tanggal_akuisisi: "2025-01-10",
        alamat_kantor_pusat: "Jl. Thamrin No. 45, Jakarta",
        jumlah_cabang: "3",
        npwp_perusahaan: "01.234.567.8-903.000",
        website: "www.apoteksehat.com",
        tahun_berdiri: "2020",
        jumlah_karyawan: "35",
        pic_keuangan: "Bapak Hendra - Owner",
        pic_teknis: "Ibu Sari - Store Manager",
        produk_digunakan: "Pharmacy POS (Trial)",
        nilai_kontrak_tahunan: "0",
        metode_pembayaran: "Trial Period",
        account_manager: "Dewi Anggraini",
        tanggal_renewal: "2025-03-10",
        sumber_leads: "Referral",
        rating_kepuasan: "4.0",
        catatan_penting: "In trial period - follow up weekly",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI004",
        nama_perusahaan: "Laboratorium Diagnostik Utama",
        tipe_organisasi: "Laboratorium Klinik",
        bidang_usaha: "Medical Laboratory",
        skala_perusahaan: "Mid-Market",
        pic_utama: "Dr. Bambang Suryanto",
        email_pic: "bambang@labdiagnostik.com",
        no_telepon_pic: "021-5554567",
        status_client: "Active",
        tanggal_akuisisi: "2024-03-10",
        alamat_kantor_pusat: "Jl. Rasuna Said Kav. 12, Jakarta",
        jumlah_cabang: "6",
        npwp_perusahaan: "01.234.567.8-904.000",
        website: "www.labdiagnostik.com",
        tahun_berdiri: "2016",
        jumlah_karyawan: "180",
        pic_keuangan: "Ibu Yuni - CFO",
        pic_teknis: "Bapak Rudi - IT Head",
        produk_digunakan: "LIS Pro, Patient Portal",
        nilai_kontrak_tahunan: "420000000",
        metode_pembayaran: "Annual",
        account_manager: "Rendra Mahendra",
        tanggal_renewal: "2025-03-10",
        sumber_leads: "Cold Outreach",
        rating_kepuasan: "4.6",
        catatan_penting: "Interested in adding AI diagnostics module",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI005",
        nama_perusahaan: "Medical Center Indonesia",
        tipe_organisasi: "Klinik Spesialis",
        bidang_usaha: "Specialist Healthcare",
        skala_perusahaan: "Enterprise",
        pic_utama: "Prof. Dr. Andri Wijaya",
        email_pic: "andri@medicalcenter.co.id",
        no_telepon_pic: "021-5555678",
        status_client: "Active",
        tanggal_akuisisi: "2022-11-05",
        alamat_kantor_pusat: "Jl. Kuningan Barat No. 77, Jakarta",
        jumlah_cabang: "10",
        npwp_perusahaan: "01.234.567.8-905.000",
        website: "www.medicalcenter.co.id",
        tahun_berdiri: "2010",
        jumlah_karyawan: "650",
        pic_keuangan: "Bapak Andi - Finance Director",
        pic_teknis: "Ibu Mega - CIO",
        produk_digunakan: "HMS Enterprise, Analytics Dashboard",
        nilai_kontrak_tahunan: "1200000000",
        metode_pembayaran: "Monthly",
        account_manager: "Ahmad Rizki Pratama",
        tanggal_renewal: "2025-11-05",
        sumber_leads: "Event/Expo",
        rating_kepuasan: "4.9",
        catatan_penting: "Premium client - 24/7 dedicated support",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI006",
        nama_perusahaan: "Puskesmas Ceria Sehat",
        tipe_organisasi: "Puskesmas",
        bidang_usaha: "Public Healthcare",
        skala_perusahaan: "Government",
        pic_utama: "Dr. Sinta Melati",
        email_pic: "sinta.puskesmas@gmail.com",
        no_telepon_pic: "021-5556789",
        status_client: "Active",
        tanggal_akuisisi: "2024-07-20",
        alamat_kantor_pusat: "Jl. Pemuda No. 123, Jakarta Timur",
        jumlah_cabang: "1",
        npwp_perusahaan: "01.234.567.8-906.000",
        website: "-",
        tahun_berdiri: "2005",
        jumlah_karyawan: "45",
        pic_keuangan: "Bendahara Puskesmas",
        pic_teknis: "Bapak Joko - IT Support",
        produk_digunakan: "Clinic Management Basic",
        nilai_kontrak_tahunan: "0",
        metode_pembayaran: "Government Funding",
        account_manager: "Siti Nurhaliza",
        tanggal_renewal: "2025-07-20",
        sumber_leads: "Government Partnership",
        rating_kepuasan: "4.3",
        catatan_penting: "CSR Program - Free tier with basic support",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI007",
        nama_perusahaan: "RS Bunda Kasih",
        tipe_organisasi: "Rumah Sakit Ibu & Anak",
        bidang_usaha: "Maternity Hospital",
        skala_perusahaan: "Mid-Market",
        pic_utama: "Dr. Maya Kusuma",
        email_pic: "maya@rsbundakasih.com",
        no_telepon_pic: "021-5557890",
        status_client: "Inactive",
        tanggal_akuisisi: "2023-01-15",
        alamat_kantor_pusat: "Jl. Cendana Raya No. 88, Tangerang",
        jumlah_cabang: "2",
        npwp_perusahaan: "01.234.567.8-907.000",
        website: "www.rsbundakasih.com",
        tahun_berdiri: "2017",
        jumlah_karyawan: "150",
        pic_keuangan: "Ibu Ratna - Finance",
        pic_teknis: "Bapak Hadi - IT",
        produk_digunakan: "HMS Basic (Expired)",
        nilai_kontrak_tahunan: "0",
        metode_pembayaran: "Contract Ended",
        account_manager: "Dewi Anggraini",
        tanggal_renewal: "-",
        sumber_leads: "Referral",
        rating_kepuasan: "3.8",
        catatan_penting: "Contract ended - attempt re-engagement",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI008",
        nama_perusahaan: "Klinik Gigi Senyum Sehat",
        tipe_organisasi: "Klinik Gigi",
        bidang_usaha: "Dental Clinic",
        skala_perusahaan: "Small Business",
        pic_utama: "drg. Putri Andini",
        email_pic: "putri@klinikgigi.com",
        no_telepon_pic: "021-5558901",
        status_client: "Active",
        tanggal_akuisisi: "2024-09-12",
        alamat_kantor_pusat: "Jl. Mekar Sari No. 34, Bekasi",
        jumlah_cabang: "2",
        npwp_perusahaan: "01.234.567.8-908.000",
        website: "www.klinikgigisenyumsehat.com",
        tahun_berdiri: "2021",
        jumlah_karyawan: "18",
        pic_keuangan: "Bapak Yoga - Co-owner",
        pic_teknis: "Ibu Dian - Admin",
        produk_digunakan: "Dental Clinic Software",
        nilai_kontrak_tahunan: "72000000",
        metode_pembayaran: "Annual",
        account_manager: "Siti Nurhaliza",
        tanggal_renewal: "2025-09-12",
        sumber_leads: "Social Media Ads",
        rating_kepuasan: "4.7",
        catatan_penting: "Happy client - potential referral source",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI009",
        nama_perusahaan: "Optical Center Vision",
        tipe_organisasi: "Klinik Mata",
        bidang_usaha: "Optical/Eye Care",
        skala_perusahaan: "Small Business",
        pic_utama: "Dr. Rina Optical",
        email_pic: "rina@opticalvision.com",
        no_telepon_pic: "021-5559012",
        status_client: "Prospective",
        tanggal_akuisisi: "2025-01-15",
        alamat_kantor_pusat: "Jl. Sudirman No. 200, Jakarta",
        jumlah_cabang: "3",
        npwp_perusahaan: "01.234.567.8-909.000",
        website: "www.opticalvision.com",
        tahun_berdiri: "2019",
        jumlah_karyawan: "28",
        pic_keuangan: "Bapak Rio - Owner",
        pic_teknis: "-",
        produk_digunakan: "-",
        nilai_kontrak_tahunan: "0",
        metode_pembayaran: "-",
        account_manager: "Rendra Mahendra",
        tanggal_renewal: "-",
        sumber_leads: "Webinar",
        rating_kepuasan: "-",
        catatan_penting: "In negotiation phase - send proposal this week",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CLI010",
        nama_perusahaan: "Wellness Center Harmony",
        tipe_organisasi: "Wellness & Spa",
        bidang_usaha: "Wellness",
        skala_perusahaan: "Small Business",
        pic_utama: "Ibu Shanty Wijaya",
        email_pic: "shanty@wellnessharmony.com",
        no_telepon_pic: "021-5550123",
        status_client: "Active",
        tanggal_akuisisi: "2024-05-08",
        alamat_kantor_pusat: "Jl. Kemang Raya No. 99, Jakarta Selatan",
        jumlah_cabang: "5",
        npwp_perusahaan: "01.234.567.8-910.000",
        website: "www.wellnessharmony.com",
        tahun_berdiri: "2022",
        jumlah_karyawan: "65",
        pic_keuangan: "Bapak Tony - Finance",
        pic_teknis: "Ibu Lisa - Operations",
        produk_digunakan: "Wellness Management System",
        nilai_kontrak_tahunan: "150000000",
        metode_pembayaran: "Bi-Annual",
        account_manager: "Dewi Anggraini",
        tanggal_renewal: "2025-11-08",
        sumber_leads: "Partnership",
        rating_kepuasan: "4.4",
        catatan_penting: "Expanding to 3 new locations - upsell opportunity",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Data Dummy Partner (10 data)
    const partnerData = [
      {
        id: "PTR001",
        nama_perusahaan: "Oracle Cloud Indonesia",
        tipe_partner: "Technology Partner",
        spesialisasi: "Cloud Infrastructure & Database Services",
        account_manager_internal: "Rendra Mahendra",
        pic_partner: "Bapak Adi Nugroho - Partner Manager",
        kontak_darurat: "021-29998888 / adi.nugroho@oracle.com",
        alamat_kantor: "Oracle Tower, SCBD Lot 28, Jakarta",
        status_kemitraan: "Active",
        masa_berlaku_mou_start: "2024-01-01",
        masa_berlaku_mou_end: "2026-12-31",
        file_mou_nda: "/documents/mou-oracle-2024.pdf",
        tingkat_kemitraan: "Platinum",
        api_endpoint: "https://api.oracle.cloud.com/v1",
        api_key_reference: "OCI_PROD_KEY_2024_ENCRYPTED",
        sla_requirement: "99.99% Uptime, <100ms Response Time",
        status_integrasi: "Production",
        skema_komisi: "Percentage",
        total_leads_generated: "45",
        total_deals_closed: "28",
        rating_partner: "5",
        rekening_pembayaran: "Bank Mandiri - 1370012345678",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR002",
        nama_perusahaan: "SatuSehat Kemkes",
        tipe_partner: "Technology Partner",
        spesialisasi: "Healthcare Interoperability Platform",
        account_manager_internal: "Ahmad Rizki Pratama",
        pic_partner: "Ibu Dr. Sari - Technical Lead",
        kontak_darurat: "021-5221227 / satusehat@kemkes.go.id",
        alamat_kantor: "Kementerian Kesehatan RI, Jakarta Pusat",
        status_kemitraan: "Active",
        masa_berlaku_mou_start: "2023-06-01",
        masa_berlaku_mou_end: "2025-05-31",
        file_mou_nda: "/documents/mou-satusehat-2023.pdf",
        tingkat_kemitraan: "Gold",
        api_endpoint: "https://api.satusehat.kemkes.go.id/fhir-r4/v1",
        api_key_reference: "SATUSEHAT_PROD_2023_ENC",
        sla_requirement: "99.5% Uptime, <500ms Response Time",
        status_integrasi: "Production",
        skema_komisi: "Fixed Rate",
        total_leads_generated: "120",
        total_deals_closed: "85",
        rating_partner: "5",
        rekening_pembayaran: "Bank BNI - Government Account",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR003",
        nama_perusahaan: "Privy E-Sign Indonesia",
        tipe_partner: "Service Partner",
        spesialisasi: "Digital Signature & Document Verification",
        account_manager_internal: "Siti Nurhaliza",
        pic_partner: "Bapak Marshall - BD Manager",
        kontak_darurat: "021-50914000 / support@privy.id",
        alamat_kantor: "Equity Tower, SCBD Lot 9, Jakarta Selatan",
        status_kemitraan: "Active",
        masa_berlaku_mou_start: "2024-03-15",
        masa_berlaku_mou_end: "2026-03-14",
        file_mou_nda: "/documents/mou-privy-2024.pdf",
        tingkat_kemitraan: "Silver",
        api_endpoint: "https://api.privy.id/v2",
        api_key_reference: "PRIVY_API_KEY_2024_ENC",
        sla_requirement: "99.9% Uptime, <200ms Response",
        status_integrasi: "Production",
        skema_komisi: "Percentage",
        total_leads_generated: "32",
        total_deals_closed: "22",
        rating_partner: "4",
        rekening_pembayaran: "Bank BCA - 8880012345",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR004",
        nama_perusahaan: "Xendit Payment Gateway",
        tipe_partner: "Service Partner",
        spesialisasi: "Payment Processing & Billing",
        account_manager_internal: "Rendra Mahendra",
        pic_partner: "Ibu Tara - Partnership Manager",
        kontak_darurat: "021-50939380 / partnerships@xendit.co",
        alamat_kantor: "South Quarter Tower B, Jakarta Selatan",
        status_kemitraan: "Active",
        masa_berlaku_mou_start: "2023-11-01",
        masa_berlaku_mou_end: "2025-10-31",
        file_mou_nda: "/documents/mou-xendit-2023.pdf",
        tingkat_kemitraan: "Gold",
        api_endpoint: "https://api.xendit.co/v2",
        api_key_reference: "XENDIT_LIVE_KEY_2023_ENC",
        sla_requirement: "99.95% Uptime, <150ms",
        status_integrasi: "Production",
        skema_komisi: "Percentage",
        total_leads_generated: "18",
        total_deals_closed: "15",
        rating_partner: "5",
        rekening_pembayaran: "Bank Mandiri - 1300099887766",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR005",
        nama_perusahaan: "Mitra Reseller Jabodetabek",
        tipe_partner: "Channel Partner",
        spesialisasi: "Reseller & Distribution",
        account_manager_internal: "Dewi Anggraini",
        pic_partner: "Bapak Hendra Gunawan - Director",
        kontak_darurat: "081234998877 / hendra@mitrareseller.com",
        alamat_kantor: "Ruko Melawai Blok C-12, Jakarta Selatan",
        status_kemitraan: "Active",
        masa_berlaku_mou_start: "2024-02-01",
        masa_berlaku_mou_end: "2025-01-31",
        file_mou_nda: "/documents/mou-mitrareseller-2024.pdf",
        tingkat_kemitraan: "Bronze",
        api_endpoint: "-",
        api_key_reference: "-",
        sla_requirement: "Response within 24 hours",
        status_integrasi: "-",
        skema_komisi: "Percentage",
        total_leads_generated: "28",
        total_deals_closed: "12",
        rating_partner: "4",
        rekening_pembayaran: "Bank BCA - 5551234567",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR006",
        nama_perusahaan: "Agensales Indonesia",
        tipe_partner: "Channel Partner",
        spesialisasi: "Sales Agent Network",
        account_manager_internal: "Siti Nurhaliza",
        pic_partner: "Ibu Rina Susanti - CEO",
        kontak_darurat: "081345776655 / rina@agensales.id",
        alamat_kantor: "Gedung Graha Simatupang Lt. 5, Jakarta",
        status_kemitraan: "On-Hold",
        masa_berlaku_mou_start: "2023-08-01",
        masa_berlaku_mou_end: "2024-07-31",
        file_mou_nda: "/documents/mou-agensales-2023.pdf",
        tingkat_kemitraan: "Bronze",
        api_endpoint: "-",
        api_key_reference: "-",
        sla_requirement: "48 hours response time",
        status_integrasi: "-",
        skema_komisi: "Fixed Rate",
        total_leads_generated: "8",
        total_deals_closed: "3",
        rating_partner: "3",
        rekening_pembayaran: "Bank Mandiri - 1440055667788",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR007",
        nama_perusahaan: "Medis Equipment Supplier",
        tipe_partner: "Hardware Partner",
        spesialisasi: "Medical Devices & Laboratory Equipment",
        account_manager_internal: "Ahmad Rizki Pratama",
        pic_partner: "Bapak Gunawan - Sales Director",
        kontak_darurat: "021-7654321 / gunawan@medisequip.com",
        alamat_kantor: "Kawasan Industri Jababeka, Bekasi",
        status_kemitraan: "Active",
        masa_berlaku_mou_start: "2024-01-10",
        masa_berlaku_mou_end: "2026-01-09",
        file_mou_nda: "/documents/mou-medisequip-2024.pdf",
        tingkat_kemitraan: "Silver",
        api_endpoint: "-",
        api_key_reference: "-",
        sla_requirement: "Delivery within 14 days",
        status_integrasi: "-",
        skema_komisi: "Percentage",
        total_leads_generated: "15",
        total_deals_closed: "11",
        rating_partner: "4",
        rekening_pembayaran: "Bank BNI - 9990011223344",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR008",
        nama_perusahaan: "Pharma Distribution Network",
        tipe_partner: "Hardware Partner",
        spesialisasi: "Pharmaceutical Products Distribution",
        account_manager_internal: "Rendra Mahendra",
        pic_partner: "Apt. Dewi Lestari - Head of Partnership",
        kontak_darurat: "021-8889900 / dewi@pharmadist.com",
        alamat_kantor: "Jl. Raya Cakung Cilincing, Jakarta Utara",
        status_kemitraan: "Active",
        masa_berlaku_mou_start: "2023-09-15",
        masa_berlaku_mou_end: "2025-09-14",
        file_mou_nda: "/documents/mou-pharmadist-2023.pdf",
        tingkat_kemitraan: "Gold",
        api_endpoint: "https://api.pharmadist.com/v1",
        api_key_reference: "PHARMA_API_2023_ENC",
        sla_requirement: "Same-day delivery (Jabodetabek)",
        status_integrasi: "Sandbox",
        skema_komisi: "Fixed Rate",
        total_leads_generated: "52",
        total_deals_closed: "38",
        rating_partner: "5",
        rekening_pembayaran: "Bank Mandiri - 1550099887766",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR009",
        nama_perusahaan: "Tech Innovate Solutions",
        tipe_partner: "Technology Partner",
        spesialisasi: "Custom Software Development",
        account_manager_internal: "Dewi Anggraini",
        pic_partner: "Bapak Fajar - CTO",
        kontak_darurat: "021-6677888 / fajar@techinnovate.id",
        alamat_kantor: "Cyber 2 Tower, Kuningan, Jakarta Selatan",
        status_kemitraan: "Potential",
        masa_berlaku_mou_start: "",
        masa_berlaku_mou_end: "",
        file_mou_nda: "-",
        tingkat_kemitraan: "Bronze",
        api_endpoint: "-",
        api_key_reference: "-",
        sla_requirement: "To be discussed",
        status_integrasi: "Development",
        skema_komisi: "Percentage",
        total_leads_generated: "0",
        total_deals_closed: "0",
        rating_partner: "-",
        rekening_pembayaran: "-",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "PTR010",
        nama_perusahaan: "Global Tech Alliance",
        tipe_partner: "Technology Partner",
        spesialisasi: "AI & Machine Learning Solutions",
        account_manager_internal: "Ahmad Rizki Pratama",
        pic_partner: "Dr. Michael Chen - Head of AI",
        kontak_darurat: "+65-9988-7766 / michael@globaltech.sg",
        alamat_kantor: "Singapore (Regional Partner)",
        status_kemitraan: "Active",
        masa_berlaku_mou_start: "2024-06-01",
        masa_berlaku_mou_end: "2027-05-31",
        file_mou_nda: "/documents/mou-globaltech-2024.pdf",
        tingkat_kemitraan: "Platinum",
        api_endpoint: "https://api.globaltech.ai/v2",
        api_key_reference: "GT_AI_API_2024_ENCRYPTED",
        sla_requirement: "99.99% Uptime, <50ms latency",
        status_integrasi: "Production",
        skema_komisi: "Percentage",
        total_leads_generated: "62",
        total_deals_closed: "48",
        rating_partner: "5",
        rekening_pembayaran: "HSBC Singapore - USD Account",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Save to database - OLD
    await kv.set("karyawan", karyawanDataOLD);
    await kv.set("clients", clientDataOLD);
    await kv.set("partners", partnerDataOLD);

    return c.json({
      success: true,
      message: "CRM dummy data populated successfully (OLD)",
      data: {
        karyawan: karyawanDataOLD.length,
        clients: clientDataOLD.length,
        partners: partnerDataOLD.length,
      }
    });
  } catch (error) {
    console.log("Error populating CRM dummy data (OLD):", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});
*/

// ========================================
// PROPOSAL ROUTES
// ========================================

// Get all proposals
app.get('/make-server-67367fc1/proposals', async (c) => {
  try {
    console.log('📄 GET /proposals - Fetching all proposals');
    
    const proposals = await kv.getByPrefix('proposal_');
    
    return c.json({
      success: true,
      data: proposals.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error('❌ Error fetching proposals:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Get single proposal by ID
app.get('/make-server-67367fc1/proposals/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('📄 GET /proposals/:id - Fetching proposal:', id);
    
    const proposal = await kv.get(`proposal_${id}`);
    
    if (!proposal) {
      return c.json({
        success: false,
        error: 'Proposal not found',
      }, 404);
    }
    
    return c.json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    console.error('❌ Error fetching proposal:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Create new proposal
app.post('/make-server-67367fc1/proposals', async (c) => {
  try {
    const body = await c.req.json();
    console.log('📄 POST /proposals - Creating new proposal:', body);
    
    const { clientName, clientCompany, items, discount, notes, subtotal, total } = body;
    
    if (!clientName || !clientCompany || !items || items.length === 0) {
      return c.json({
        success: false,
        error: 'Missing required fields',
      }, 400);
    }
    
    const proposalId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const proposal = {
      id: proposalId,
      clientName,
      clientCompany,
      items,
      discount: discount || 0,
      notes: notes || '',
      subtotal,
      total,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`proposal_${proposalId}`, proposal);
    
    return c.json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    console.error('❌ Error creating proposal:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Update proposal
app.put('/make-server-67367fc1/proposals/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    console.log('📄 PUT /proposals/:id - Updating proposal:', id);
    
    const existingProposal = await kv.get(`proposal_${id}`);
    
    if (!existingProposal) {
      return c.json({
        success: false,
        error: 'Proposal not found',
      }, 404);
    }
    
    const updatedProposal = {
      ...existingProposal,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`proposal_${id}`, updatedProposal);
    
    return c.json({
      success: true,
      data: updatedProposal,
    });
  } catch (error) {
    console.error('❌ Error updating proposal:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Delete proposal
app.delete('/make-server-67367fc1/proposals/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('📄 DELETE /proposals/:id - Deleting proposal:', id);
    
    await kv.del(`proposal_${id}`);
    
    return c.json({
      success: true,
      message: 'Proposal deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting proposal:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Send proposal via email (mock implementation)
app.post('/make-server-67367fc1/proposals/:id/send', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    console.log('📧 POST /proposals/:id/send - Sending proposal:', id);
    
    const proposal = await kv.get(`proposal_${id}`);
    
    if (!proposal) {
      return c.json({
        success: false,
        error: 'Proposal not found',
      }, 404);
    }
    
    const { recipientEmail } = body;
    
    if (!recipientEmail) {
      return c.json({
        success: false,
        error: 'Recipient email is required',
      }, 400);
    }
    
    // Update proposal status
    const updatedProposal = {
      ...proposal,
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentTo: recipientEmail,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`proposal_${id}`, updatedProposal);
    
    // TODO: Implement actual email sending using Supabase Edge Functions
    // For now, we'll just log it
    console.log(`📧 Email would be sent to: ${recipientEmail}`);
    console.log(`📄 Proposal: ${proposal.clientName} - ${proposal.clientCompany}`);
    
    return c.json({
      success: true,
      message: `Proposal berhasil dikirim ke ${recipientEmail}`,
      data: updatedProposal,
    });
  } catch (error) {
    console.error('❌ Error sending proposal:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

Deno.serve(app.fetch);
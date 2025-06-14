
import { Project } from "@/types/Project";

export const sampleProjects: Project[] = [
  {
    id: "customer-data",
    name: "Customer Data Management",
    description: "Customer relationship and order management system",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    entities: [
      {
        id: "customer",
        name: "Customer",
        position: { x: 100, y: 100 },
        visible: true,
        columns: [
          { id: "cust-1", name: "customer_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "cust-2", name: "first_name", dataType: "VARCHAR(255)" },
          { id: "cust-3", name: "last_name", dataType: "VARCHAR(255)" },
          { id: "cust-4", name: "email", dataType: "VARCHAR(255)" },
          { id: "cust-5", name: "phone", dataType: "VARCHAR(20)" },
          { id: "cust-6", name: "created_at", dataType: "TIMESTAMP" }
        ]
      },
      {
        id: "order",
        name: "Order",
        position: { x: 500, y: 100 },
        visible: true,
        columns: [
          { id: "ord-1", name: "order_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "ord-2", name: "customer_id", dataType: "INTEGER", isForeignKey: true },
          { id: "ord-3", name: "order_date", dataType: "DATE" },
          { id: "ord-4", name: "total_amount", dataType: "DECIMAL(10,2)" },
          { id: "ord-5", name: "status", dataType: "VARCHAR(50)" }
        ]
      },
      {
        id: "address",
        name: "Address",
        position: { x: 100, y: 350 },
        visible: true,
        columns: [
          { id: "addr-1", name: "address_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "addr-2", name: "customer_id", dataType: "INTEGER", isForeignKey: true },
          { id: "addr-3", name: "street", dataType: "VARCHAR(255)" },
          { id: "addr-4", name: "city", dataType: "VARCHAR(100)" },
          { id: "addr-5", name: "state", dataType: "VARCHAR(50)" },
          { id: "addr-6", name: "zip_code", dataType: "VARCHAR(10)" },
          { id: "addr-7", name: "address_type", dataType: "VARCHAR(20)" }
        ]
      },
      {
        id: "order_item",
        name: "Order Item",
        position: { x: 500, y: 350 },
        visible: true,
        columns: [
          { id: "oi-1", name: "order_item_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "oi-2", name: "order_id", dataType: "INTEGER", isForeignKey: true },
          { id: "oi-3", name: "product_id", dataType: "INTEGER", isForeignKey: true },
          { id: "oi-4", name: "quantity", dataType: "INTEGER" },
          { id: "oi-5", name: "unit_price", dataType: "DECIMAL(10,2)" },
          { id: "oi-6", name: "total_price", dataType: "DECIMAL(10,2)" }
        ]
      },
      {
        id: "product",
        name: "Product",
        position: { x: 800, y: 250 },
        visible: true,
        columns: [
          { id: "prod-1", name: "product_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "prod-2", name: "name", dataType: "VARCHAR(255)" },
          { id: "prod-3", name: "description", dataType: "TEXT" },
          { id: "prod-4", name: "price", dataType: "DECIMAL(10,2)" },
          { id: "prod-5", name: "stock_quantity", dataType: "INTEGER" },
          { id: "prod-6", name: "category_id", dataType: "INTEGER", isForeignKey: true }
        ]
      },
      {
        id: "category",
        name: "Category",
        position: { x: 800, y: 450 },
        visible: true,
        columns: [
          { id: "cat-1", name: "category_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "cat-2", name: "name", dataType: "VARCHAR(255)" },
          { id: "cat-3", name: "description", dataType: "TEXT" }
        ]
      }
    ]
  },
  {
    id: "agent-data",
    name: "Real Estate Agent System",
    description: "Agent and property management for real estate",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    entities: [
      {
        id: "agent",
        name: "Agent",
        position: { x: 200, y: 50 },
        visible: true,
        columns: [
          { id: "ag-1", name: "agent_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "ag-2", name: "first_name", dataType: "VARCHAR(255)" },
          { id: "ag-3", name: "last_name", dataType: "VARCHAR(255)" },
          { id: "ag-4", name: "license_number", dataType: "VARCHAR(50)" },
          { id: "ag-5", name: "commission_rate", dataType: "DECIMAL(5,4)" },
          { id: "ag-6", name: "hire_date", dataType: "DATE" },
          { id: "ag-7", name: "office_id", dataType: "INTEGER", isForeignKey: true }
        ]
      },
      {
        id: "property",
        name: "Property",
        position: { x: 600, y: 50 },
        visible: true,
        columns: [
          { id: "prop-1", name: "property_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "prop-2", name: "address", dataType: "VARCHAR(255)" },
          { id: "prop-3", name: "price", dataType: "DECIMAL(12,2)" },
          { id: "prop-4", name: "bedrooms", dataType: "INTEGER" },
          { id: "prop-5", name: "bathrooms", dataType: "DECIMAL(3,1)" },
          { id: "prop-6", name: "square_feet", dataType: "INTEGER" },
          { id: "prop-7", name: "listing_date", dataType: "DATE" },
          { id: "prop-8", name: "property_type_id", dataType: "INTEGER", isForeignKey: true }
        ]
      },
      {
        id: "listing",
        name: "Listing",
        position: { x: 400, y: 250 },
        visible: true,
        columns: [
          { id: "list-1", name: "listing_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "list-2", name: "agent_id", dataType: "INTEGER", isForeignKey: true },
          { id: "list-3", name: "property_id", dataType: "INTEGER", isForeignKey: true },
          { id: "list-4", name: "listing_price", dataType: "DECIMAL(12,2)" },
          { id: "list-5", name: "status", dataType: "VARCHAR(50)" },
          { id: "list-6", name: "created_at", dataType: "TIMESTAMP" }
        ]
      },
      {
        id: "office",
        name: "Office",
        position: { x: 200, y: 300 },
        visible: true,
        columns: [
          { id: "off-1", name: "office_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "off-2", name: "name", dataType: "VARCHAR(255)" },
          { id: "off-3", name: "address", dataType: "VARCHAR(255)" },
          { id: "off-4", name: "phone", dataType: "VARCHAR(20)" },
          { id: "off-5", name: "manager_id", dataType: "INTEGER", isForeignKey: true }
        ]
      },
      {
        id: "property_type",
        name: "Property Type",
        position: { x: 600, y: 300 },
        visible: true,
        columns: [
          { id: "pt-1", name: "property_type_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "pt-2", name: "type_name", dataType: "VARCHAR(100)" },
          { id: "pt-3", name: "description", dataType: "TEXT" }
        ]
      },
      {
        id: "client",
        name: "Client",
        position: { x: 50, y: 450 },
        visible: true,
        columns: [
          { id: "cl-1", name: "client_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "cl-2", name: "first_name", dataType: "VARCHAR(255)" },
          { id: "cl-3", name: "last_name", dataType: "VARCHAR(255)" },
          { id: "cl-4", name: "email", dataType: "VARCHAR(255)" },
          { id: "cl-5", name: "phone", dataType: "VARCHAR(20)" },
          { id: "cl-6", name: "budget_min", dataType: "DECIMAL(12,2)" },
          { id: "cl-7", name: "budget_max", dataType: "DECIMAL(12,2)" }
        ]
      },
      {
        id: "showing",
        name: "Showing",
        position: { x: 350, y: 450 },
        visible: true,
        columns: [
          { id: "sh-1", name: "showing_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "sh-2", name: "agent_id", dataType: "INTEGER", isForeignKey: true },
          { id: "sh-3", name: "client_id", dataType: "INTEGER", isForeignKey: true },
          { id: "sh-4", name: "property_id", dataType: "INTEGER", isForeignKey: true },
          { id: "sh-5", name: "showing_date", dataType: "DATETIME" },
          { id: "sh-6", name: "feedback", dataType: "TEXT" }
        ]
      }
    ]
  },
  {
    id: "ecom-data",
    name: "E-commerce Platform",
    description: "Product catalog and order processing system",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
    entities: [
      {
        id: "user",
        name: "User",
        position: { x: 50, y: 80 },
        visible: true,
        columns: [
          { id: "user-1", name: "user_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "user-2", name: "username", dataType: "VARCHAR(255)" },
          { id: "user-3", name: "email", dataType: "VARCHAR(255)" },
          { id: "user-4", name: "password_hash", dataType: "VARCHAR(255)" },
          { id: "user-5", name: "first_name", dataType: "VARCHAR(255)" },
          { id: "user-6", name: "last_name", dataType: "VARCHAR(255)" },
          { id: "user-7", name: "created_at", dataType: "TIMESTAMP" }
        ]
      },
      {
        id: "product",
        name: "Product",
        position: { x: 350, y: 80 },
        visible: true,
        columns: [
          { id: "prod-1", name: "product_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "prod-2", name: "name", dataType: "VARCHAR(255)" },
          { id: "prod-3", name: "description", dataType: "TEXT" },
          { id: "prod-4", name: "price", dataType: "DECIMAL(10,2)" },
          { id: "prod-5", name: "stock_quantity", dataType: "INTEGER" },
          { id: "prod-6", name: "category_id", dataType: "INTEGER", isForeignKey: true },
          { id: "prod-7", name: "vendor_id", dataType: "INTEGER", isForeignKey: true }
        ]
      },
      {
        id: "category",
        name: "Category",
        position: { x: 650, y: 80 },
        visible: true,
        columns: [
          { id: "cat-1", name: "category_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "cat-2", name: "name", dataType: "VARCHAR(255)" },
          { id: "cat-3", name: "description", dataType: "TEXT" },
          { id: "cat-4", name: "parent_category_id", dataType: "INTEGER", isForeignKey: true }
        ]
      },
      {
        id: "vendor",
        name: "Vendor",
        position: { x: 350, y: 300 },
        visible: true,
        columns: [
          { id: "vend-1", name: "vendor_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "vend-2", name: "company_name", dataType: "VARCHAR(255)" },
          { id: "vend-3", name: "contact_email", dataType: "VARCHAR(255)" },
          { id: "vend-4", name: "contact_phone", dataType: "VARCHAR(20)" },
          { id: "vend-5", name: "address", dataType: "VARCHAR(255)" }
        ]
      },
      {
        id: "cart",
        name: "Shopping Cart",
        position: { x: 50, y: 300 },
        visible: true,
        columns: [
          { id: "cart-1", name: "cart_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "cart-2", name: "user_id", dataType: "INTEGER", isForeignKey: true },
          { id: "cart-3", name: "created_at", dataType: "TIMESTAMP" },
          { id: "cart-4", name: "updated_at", dataType: "TIMESTAMP" }
        ]
      },
      {
        id: "cart-item",
        name: "Cart Item",
        position: { x: 50, y: 500 },
        visible: true,
        columns: [
          { id: "ci-1", name: "cart_item_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "ci-2", name: "cart_id", dataType: "INTEGER", isForeignKey: true },
          { id: "ci-3", name: "product_id", dataType: "INTEGER", isForeignKey: true },
          { id: "ci-4", name: "quantity", dataType: "INTEGER" },
          { id: "ci-5", name: "added_at", dataType: "TIMESTAMP" }
        ]
      },
      {
        id: "order",
        name: "Order",
        position: { x: 650, y: 300 },
        visible: true,
        columns: [
          { id: "order-1", name: "order_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "order-2", name: "user_id", dataType: "INTEGER", isForeignKey: true },
          { id: "order-3", name: "order_date", dataType: "TIMESTAMP" },
          { id: "order-4", name: "total_amount", dataType: "DECIMAL(12,2)" },
          { id: "order-5", name: "status", dataType: "VARCHAR(50)" },
          { id: "order-6", name: "shipping_address", dataType: "TEXT" }
        ]
      },
      {
        id: "order-item",
        name: "Order Item",
        position: { x: 650, y: 500 },
        visible: true,
        columns: [
          { id: "orderitem-1", name: "order_item_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "orderitem-2", name: "order_id", dataType: "INTEGER", isForeignKey: true },
          { id: "orderitem-3", name: "product_id", dataType: "INTEGER", isForeignKey: true },
          { id: "orderitem-4", name: "quantity", dataType: "INTEGER" },
          { id: "orderitem-5", name: "unit_price", dataType: "DECIMAL(10,2)" },
          { id: "orderitem-6", name: "total_price", dataType: "DECIMAL(10,2)" }
        ]
      },
      {
        id: "review",
        name: "Product Review",
        position: { x: 350, y: 500 },
        visible: true,
        columns: [
          { id: "rev-1", name: "review_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "rev-2", name: "user_id", dataType: "INTEGER", isForeignKey: true },
          { id: "rev-3", name: "product_id", dataType: "INTEGER", isForeignKey: true },
          { id: "rev-4", name: "rating", dataType: "INTEGER" },
          { id: "rev-5", name: "comment", dataType: "TEXT" },
          { id: "rev-6", name: "review_date", dataType: "TIMESTAMP" }
        ]
      }
    ]
  }
];

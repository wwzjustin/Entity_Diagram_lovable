
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
        position: { x: 400, y: 100 },
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
        position: { x: 100, y: 300 },
        visible: true,
        columns: [
          { id: "addr-1", name: "address_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "addr-2", name: "customer_id", dataType: "INTEGER", isForeignKey: true },
          { id: "addr-3", name: "street", dataType: "VARCHAR(255)" },
          { id: "addr-4", name: "city", dataType: "VARCHAR(100)" },
          { id: "addr-5", name: "state", dataType: "VARCHAR(50)" },
          { id: "addr-6", name: "zip_code", dataType: "VARCHAR(10)" }
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
          { id: "ag-6", name: "hire_date", dataType: "DATE" }
        ]
      },
      {
        id: "property",
        name: "Property",
        position: { x: 500, y: 50 },
        visible: true,
        columns: [
          { id: "prop-1", name: "property_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "prop-2", name: "address", dataType: "VARCHAR(255)" },
          { id: "prop-3", name: "price", dataType: "DECIMAL(12,2)" },
          { id: "prop-4", name: "bedrooms", dataType: "INTEGER" },
          { id: "prop-5", name: "bathrooms", dataType: "DECIMAL(3,1)" },
          { id: "prop-6", name: "square_feet", dataType: "INTEGER" },
          { id: "prop-7", name: "listing_date", dataType: "DATE" }
        ]
      },
      {
        id: "listing",
        name: "Listing",
        position: { x: 350, y: 250 },
        visible: true,
        columns: [
          { id: "list-1", name: "listing_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "list-2", name: "agent_id", dataType: "INTEGER", isForeignKey: true },
          { id: "list-3", name: "property_id", dataType: "INTEGER", isForeignKey: true },
          { id: "list-4", name: "listing_price", dataType: "DECIMAL(12,2)" },
          { id: "list-5", name: "status", dataType: "VARCHAR(50)" },
          { id: "list-6", name: "created_at", dataType: "TIMESTAMP" }
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
        id: "product",
        name: "Product",
        position: { x: 150, y: 80 },
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
        position: { x: 150, y: 300 },
        visible: true,
        columns: [
          { id: "cat-1", name: "category_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "cat-2", name: "name", dataType: "VARCHAR(255)" },
          { id: "cat-3", name: "description", dataType: "TEXT" },
          { id: "cat-4", name: "parent_category_id", dataType: "INTEGER", isForeignKey: true }
        ]
      },
      {
        id: "cart",
        name: "Shopping Cart",
        position: { x: 450, y: 150 },
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
        position: { x: 450, y: 350 },
        visible: true,
        columns: [
          { id: "ci-1", name: "cart_item_id", dataType: "INTEGER", isPrimaryKey: true },
          { id: "ci-2", name: "cart_id", dataType: "INTEGER", isForeignKey: true },
          { id: "ci-3", name: "product_id", dataType: "INTEGER", isForeignKey: true },
          { id: "ci-4", name: "quantity", dataType: "INTEGER" },
          { id: "ci-5", name: "added_at", dataType: "TIMESTAMP" }
        ]
      }
    ]
  }
];

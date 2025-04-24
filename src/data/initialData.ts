
import { Node, Edge } from "@xyflow/react";

export const initialNodes: Node[] = [
  {
    id: "users",
    type: "entity",
    data: {
      label: "Users",
      columns: [
        { id: "user-id", name: "id", type: "INTEGER", isPrimaryKey: true, isForeignKey: false },
        { id: "user-name", name: "username", type: "VARCHAR(255)", isPrimaryKey: false, isForeignKey: false },
        { id: "user-email", name: "email", type: "VARCHAR(255)", isPrimaryKey: false, isForeignKey: false },
        { id: "user-password", name: "password_hash", type: "VARCHAR(255)", isPrimaryKey: false, isForeignKey: false },
        { id: "user-created", name: "created_at", type: "TIMESTAMP", isPrimaryKey: false, isForeignKey: false },
      ]
    },
    position: { x: 100, y: 100 }
  },
  {
    id: "posts",
    type: "entity",
    data: {
      label: "Posts",
      columns: [
        { id: "post-id", name: "id", type: "INTEGER", isPrimaryKey: true, isForeignKey: false },
        { id: "post-title", name: "title", type: "VARCHAR(255)", isPrimaryKey: false, isForeignKey: false },
        { id: "post-content", name: "content", type: "TEXT", isPrimaryKey: false, isForeignKey: false },
        { id: "post-user-id", name: "user_id", type: "INTEGER", isPrimaryKey: false, isForeignKey: true },
        { id: "post-created", name: "created_at", type: "TIMESTAMP", isPrimaryKey: false, isForeignKey: false },
      ]
    },
    position: { x: 500, y: 100 }
  },
  {
    id: "comments",
    type: "entity",
    data: {
      label: "Comments",
      columns: [
        { id: "comment-id", name: "id", type: "INTEGER", isPrimaryKey: true, isForeignKey: false },
        { id: "comment-text", name: "content", type: "TEXT", isPrimaryKey: false, isForeignKey: false },
        { id: "comment-post-id", name: "post_id", type: "INTEGER", isPrimaryKey: false, isForeignKey: true },
        { id: "comment-user-id", name: "user_id", type: "INTEGER", isPrimaryKey: false, isForeignKey: true },
        { id: "comment-created", name: "created_at", type: "TIMESTAMP", isPrimaryKey: false, isForeignKey: false },
      ]
    },
    position: { x: 500, y: 350 }
  },
  {
    id: "categories",
    type: "entity",
    data: {
      label: "Categories",
      columns: [
        { id: "cat-id", name: "id", type: "INTEGER", isPrimaryKey: true, isForeignKey: false },
        { id: "cat-name", name: "name", type: "VARCHAR(100)", isPrimaryKey: false, isForeignKey: false },
        { id: "cat-description", name: "description", type: "TEXT", isPrimaryKey: false, isForeignKey: false },
      ]
    },
    position: { x: 100, y: 350 }
  },
  {
    id: "post_categories",
    type: "entity",
    data: {
      label: "Post_Categories",
      columns: [
        { id: "pc-id", name: "id", type: "INTEGER", isPrimaryKey: true, isForeignKey: false },
        { id: "pc-post-id", name: "post_id", type: "INTEGER", isPrimaryKey: false, isForeignKey: true },
        { id: "pc-cat-id", name: "category_id", type: "INTEGER", isPrimaryKey: false, isForeignKey: true },
      ]
    },
    position: { x: 300, y: 220 }
  }
];

export const initialEdges: Edge[] = [
  {
    id: "users-posts",
    source: "users",
    target: "posts",
    label: "1:N",
    className: "relation-one-to-many",
    type: "smoothstep",
    style: { stroke: "#94a3b8", strokeWidth: 2 }
  },
  {
    id: "posts-comments",
    source: "posts",
    target: "comments",
    label: "1:N",
    className: "relation-one-to-many",
    type: "smoothstep",
    style: { stroke: "#94a3b8", strokeWidth: 2 }
  },
  {
    id: "users-comments",
    source: "users",
    target: "comments",
    label: "1:N",
    className: "relation-one-to-many",
    type: "smoothstep",
    style: { stroke: "#94a3b8", strokeWidth: 2 }
  },
  {
    id: "posts-categories",
    source: "posts",
    target: "post_categories",
    label: "1:N",
    className: "relation-one-to-many",
    type: "smoothstep",
    style: { stroke: "#94a3b8", strokeWidth: 2 }
  },
  {
    id: "categories-post_categories",
    source: "categories",
    target: "post_categories",
    label: "1:N",
    className: "relation-one-to-many",
    type: "smoothstep",
    style: { stroke: "#94a3b8", strokeWidth: 2 }
  }
];

package com.example.demo.model;

/**
 * Mapped to Prisma's User_role enum.
 * Supports all administrative Roles.
 */
public enum UserRole {
    SUPER_ADMIN,
    ADMIN_STAFF,
    CONTENT_EDITOR,
    CHURCH_USER,
    NORMAL_USER,
    USER
}

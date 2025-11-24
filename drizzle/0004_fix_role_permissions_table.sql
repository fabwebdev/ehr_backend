-- Migration to fix role_has_permissions table with composite primary key
DROP TABLE IF EXISTS "role_has_permissions";

CREATE TABLE "role_has_permissions"
(
    "permission_id" bigint NOT NULL,
    "role_id" bigint NOT NULL,
    CONSTRAINT "role_has_permissions_permission_id_role_id_pk" PRIMARY KEY("permission_id","role_id")
);
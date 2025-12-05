-- Idempotent fix for model_has_roles primary key constraint
DO
$migration$
DECLARE
    existing_constraint text;
BEGIN
    SELECT tc.constraint_name
    INTO existing_constraint
    FROM information_schema.table_constraints tc
    WHERE tc.table_name = 'model_has_roles'
        AND tc.constraint_type = 'PRIMARY KEY'
    LIMIT 1;

IF existing_constraint IS NOT NULL
    AND existing_constraint = 'model_has_roles_role_id_model_type_model_id_pk' THEN
        RAISE NOTICE 'model_has_roles primary key already correct, skipping.';
RETURN;
END
IF;

    IF existing_constraint IS NOT NULL THEN
EXECUTE format
('ALTER TABLE model_has_roles DROP CONSTRAINT %I', existing_constraint);
        RAISE NOTICE 'Dropped existing constraint %', existing_constraint;
END
IF;

    ALTER TABLE "model_has_roles"
        ADD CONSTRAINT "model_has_roles_role_id_model_type_model_id_pk"
        PRIMARY KEY("role_id","model_type","model_id");

RAISE NOTICE 'Added primary key constraint model_has_roles_role_id_model_type_model_id_pk.';
END $migration$;
const sql = require("./db.js");


async function createAll(){
// SCHEMA: public

// DROP SCHEMA IF EXISTS public ;


    await sql`CREATE SCHEMA IF NOT EXISTS public
        AUTHORIZATION pg_database_owner;`

     await sql`COMMENT ON SCHEMA public
        IS 'standard public schema';`

     await sql`GRANT USAGE ON SCHEMA public TO PUBLIC;`

     await sql`GRANT ALL ON SCHEMA public TO pg_database_owner;`

    //---------------------------------------------------------

    //-- Table: public.Users

    //-- DROP TABLE IF EXISTS public."Users";

    await sql`CREATE TABLE IF NOT EXISTS public."Users"
    (
        "Username" character varying(40) COLLATE pg_catalog."default" NOT NULL,
        "CreatedDate" timestamp with time zone NOT NULL,
        "IsAdmin" boolean DEFAULT false,
        "IsContributor" boolean DEFAULT false,
        "IsShadowed" boolean DEFAULT false,
        "Salt" bytea,
        "Password" bytea NOT NULL,
        "Email" text COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT "Users_pkey" PRIMARY KEY ("Username")
    )

    TABLESPACE pg_default;`

     await sql`ALTER TABLE IF EXISTS public."Users"
        OWNER to postgres;`

     await sql`GRANT ALL ON TABLE public."Users" TO postgres;`

    //----------------------------------------------------------

    //-- Table: public.Formats

    //-- DROP TABLE IF EXISTS public."Formats";

    await sql`CREATE TABLE IF NOT EXISTS public."Formats"
    (
        "Creator" text COLLATE pg_catalog."default" NOT NULL,
        "ID" integer NOT NULL,
        "Formatting" jsonb NOT NULL,
        "Description" text COLLATE pg_catalog."default",
        CONSTRAINT "Formats_pkey" PRIMARY KEY ("ID"),
        CONSTRAINT "CreatorIsUser" FOREIGN KEY ("Creator")
            REFERENCES public."Users" ("Username") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
    )

    TABLESPACE pg_default;`

     await sql`ALTER TABLE IF EXISTS public."Formats"
        OWNER to postgres;`


    //--------------------------------------------------------------

    //-- Table: public.Content

    //-- DROP TABLE IF EXISTS public."Content";

    await sql`CREATE TABLE IF NOT EXISTS public."Content"
    (
        "Creator" text COLLATE pg_catalog."default" NOT NULL,
        "CreatedDate" timestamp with time zone NOT NULL,
        "UpdatedDate" timestamp with time zone NOT NULL,
        "LiveDate" timestamp with time zone,
        "IsVisible" boolean NOT NULL,
        "Key" text COLLATE pg_catalog."default" NOT NULL,
        "Data" jsonb NOT NULL,
        "Format" integer NOT NULL,
        CONSTRAINT "Content_pkey" PRIMARY KEY ("Key"),
        CONSTRAINT "CreatorIsUser" FOREIGN KEY ("Creator")
            REFERENCES public."Users" ("Username") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT "HasValidFormat" FOREIGN KEY ("Format")
            REFERENCES public."Formats" ("ID") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            DEFERRABLE INITIALLY DEFERRED
    )

    TABLESPACE pg_default;`

     await sql`ALTER TABLE IF EXISTS public."Content"
        OWNER to postgres;`

    //-- Index: fki_CreatorIsUser

    //-- DROP INDEX IF EXISTS public."fki_CreatorIsUser";

    await sql`CREATE INDEX IF NOT EXISTS "fki_CreatorIsUser"
        ON public."Content" USING btree
        ("Creator" COLLATE pg_catalog."default" ASC NULLS LAST)
        WITH (fillfactor=100, deduplicate_items=True)
        TABLESPACE pg_default;`
    //-- Index: fki_HasValidFormat

    //-- DROP INDEX IF EXISTS public."fki_HasValidFormat";

     await sql`CREATE INDEX IF NOT EXISTS "fki_HasValidFormat"
        ON public."Content" USING btree
        ("Format" ASC NULLS LAST)
        WITH (fillfactor=100, deduplicate_items=True)
        TABLESPACE pg_default;`

    //----------------------------------------------------------------

    //-- SEQUENCE: public.ContentKey

    //-- DROP SEQUENCE IF EXISTS public."ContentKey";

    await sql`CREATE SEQUENCE IF NOT EXISTS public."ContentKey"
        INCREMENT 1
        START 1
        MINVALUE 1
        MAXVALUE 9223372036854775807
        CACHE 1;`

     await sql`ALTER SEQUENCE public."ContentKey"
        OWNED BY public."Content"."Key";`

     await sql`ALTER SEQUENCE public."ContentKey"
        OWNER TO postgres;`

     await sql`GRANT ALL ON SEQUENCE public."ContentKey" TO postgres;`

    //---------------------------------------------------------------

    //-- SEQUENCE: public.FormatKey

    //-- DROP SEQUENCE IF EXISTS public."FormatKey";

    await sql`CREATE SEQUENCE IF NOT EXISTS public."FormatKey"
        INCREMENT 1
        START 1
        MINVALUE 1
        MAXVALUE 9223372036854775807
        CACHE 1;`

     await sql`ALTER SEQUENCE public."FormatKey"
        OWNED BY public."Formats"."ID";`

     await sql`ALTER SEQUENCE public."FormatKey"
        OWNER TO postgres;`

    //-- Table: public.Components

    //-- DROP TABLE IF EXISTS public."Components";

    await sql`CREATE TABLE IF NOT EXISTS public."Components"
    (
        "Creator" text COLLATE pg_catalog."default" NOT NULL,
        "ID" integer NOT NULL,
        "Data" jsonb NOT NULL,
        "Name" text NOT NULL,
        "Description" text COLLATE pg_catalog."default",
        CONSTRAINT "Components_pkey" PRIMARY KEY ("ID"),
        CONSTRAINT "CreatorIsUser" FOREIGN KEY ("Creator")
            REFERENCES public."Users" ("Username") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
    )

    TABLESPACE pg_default;`

     await sql`ALTER TABLE IF EXISTS public."Components"
        OWNER to postgres;`

    //-- SEQUENCE: public.ComponentKey

    //-- DROP SEQUENCE IF EXISTS public."ComponentKey";

    await sql`CREATE SEQUENCE IF NOT EXISTS public."ComponentKey"
        INCREMENT 1
        START 1
        MINVALUE 1
        MAXVALUE 9223372036854775807
        CACHE 1;`

     await sql`ALTER SEQUENCE public."ComponentKey"
        OWNED BY public."Components"."ID";`

     await sql`ALTER SEQUENCE public."ComponentKey"
        OWNER TO postgres;`

    //-- Table: public.ComponentMappings

    //-- DROP TABLE IF EXISTS public."ComponentMappings";

    await sql`CREATE TABLE IF NOT EXISTS public."component_content_mapping" (
            content_id text NOT NULL,
            component_id int NOT NULL,
            CONSTRAINT component_content_mapping_pk PRIMARY KEY (content_id,component_id),
            CONSTRAINT "component_content_mapping_content_fk" FOREIGN KEY ("content_id")
            REFERENCES public."Content" ("Key") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE,
            CONSTRAINT "component_content_mapping_components_fk" FOREIGN KEY ("component_id")
            REFERENCES public."Components" ("ID") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
        );`

    
    await sql`CREATE TABLE IF NOT EXISTS public."component_format_mapping" (
            format_id int NOT NULL,
            component_id int NOT NULL,
            CONSTRAINT component_format_mapping_pk PRIMARY KEY (format_id,component_id),
            CONSTRAINT "component_format_mapping_format_fk" FOREIGN KEY ("format_id")
            REFERENCES public."Formats" ("ID") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE,
            CONSTRAINT "component_format_mapping_components_fk" FOREIGN KEY ("component_id")
            REFERENCES public."Components" ("ID") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
        );`
}

module.exports = createAll

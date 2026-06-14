import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ja', 'en');
  CREATE TYPE "public"."enum_icons_category" AS ENUM('general', 'messaging', 'alerts', 'time');
  CREATE TYPE "public"."enum_ui_copy_keys_translations_locale" AS ENUM('ja', 'en');
  CREATE TYPE "public"."enum_landing_sections_blocks_hero_primary_c_t_a_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_landing_sections_blocks_hero_primary_c_t_a_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum_landing_sections_blocks_hero_primary_c_t_a_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum_landing_sections_blocks_hero_secondary_c_t_a_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_landing_sections_blocks_hero_secondary_c_t_a_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum_landing_sections_blocks_hero_secondary_c_t_a_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum_landing_sections_blocks_hero_right_visual" AS ENUM('chat', 'image');
  CREATE TYPE "public"."enum_landing_sections_blocks_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_landing_sections_blocks_pricing_plans_style_preset" AS ENUM('style1', 'style2', 'style3', 'style4', 'style5');
  CREATE TYPE "public"."enum_landing_sections_blocks_pricing_plans_cta_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_landing_sections_blocks_pricing_plans_cta_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum_landing_sections_blocks_pricing_plans_cta_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum_landing_sections_blocks_contact_footer_items_kind" AS ENUM('text', 'link', 'button');
  CREATE TYPE "public"."v" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."i" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."t" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum_landing_sections_blocks_section_background" AS ENUM('default', 'subtle');
  CREATE TYPE "public"."enum_landing_sections_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_hero_primary_c_t_a_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_hero_primary_c_t_a_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_hero_primary_c_t_a_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_hero_secondary_c_t_a_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_hero_secondary_c_t_a_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_hero_secondary_c_t_a_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_hero_right_visual" AS ENUM('chat', 'image');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_pricing_plans_style_preset" AS ENUM('style1', 'style2', 'style3', 'style4', 'style5');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_pricing_plans_cta_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_pricing_plans_cta_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_pricing_plans_cta_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_contact_footer_items_kind" AS ENUM('text', 'link', 'button');
  CREATE TYPE "public"."enum__landing_sections_v_blocks_section_background" AS ENUM('default', 'subtle');
  CREATE TYPE "public"."enum__landing_sections_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_sections_v_published_locale" AS ENUM('ja', 'en');
  CREATE TYPE "public"."enum_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_pages_v_published_locale" AS ENUM('ja', 'en');
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_primary_c_t_a_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_hero_primary_c_t_a_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum_pages_blocks_hero_primary_c_t_a_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_hero_right_visual" AS ENUM('chat', 'image');
  CREATE TYPE "public"."enum_pages_blocks_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_style_preset" AS ENUM('style1', 'style2', 'style3', 'style4', 'style5');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_cta_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_cta_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_cta_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_contact_footer_items_kind" AS ENUM('text', 'link', 'button');
  CREATE TYPE "public"."enum_pages_blocks_section_background" AS ENUM('default', 'subtle');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_primary_c_t_a_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_primary_c_t_a_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_primary_c_t_a_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_right_visual" AS ENUM('chat', 'image');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_columns" AS ENUM('2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_style_preset" AS ENUM('style1', 'style2', 'style3', 'style4', 'style5');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_cta_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_cta_icon" AS ENUM('arrowRight', 'mail', 'phone');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_cta_type" AS ENUM('anchor', 'internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_footer_items_kind" AS ENUM('text', 'link', 'button');
  CREATE TYPE "public"."enum__pages_v_blocks_section_background" AS ENUM('default', 'subtle');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('ja', 'en');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('ja', 'en');
  CREATE TYPE "public"."enum_form_rate_limits_window" AS ENUM('minute', 'hour');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom', 'homepageAnchor');
  CREATE TYPE "public"."enum_header_login_c_t_a_type" AS ENUM('reference', 'custom', 'homepageAnchor');
  CREATE TYPE "public"."enum_header_consultation_c_t_a_type" AS ENUM('reference', 'custom', 'homepageAnchor');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom', 'homepageAnchor');
  CREATE TABLE "icons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"lucide_name" varchar NOT NULL,
  	"category" "enum_icons_category",
  	"is_enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ui_copy_keys_translations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"locale" "enum_ui_copy_keys_translations_locale" NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "ui_copy_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"group" varchar NOT NULL,
  	"description" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ui_copy_keys_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_variant" "enum_landing_sections_blocks_hero_primary_c_t_a_variant" DEFAULT 'primary',
  	"primary_c_t_a_with_icon" boolean DEFAULT false,
  	"primary_c_t_a_icon" "enum_landing_sections_blocks_hero_primary_c_t_a_icon",
  	"primary_c_t_a_type" "enum_landing_sections_blocks_hero_primary_c_t_a_type" DEFAULT 'internal',
  	"primary_c_t_a_anchor" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_variant" "enum_landing_sections_blocks_hero_secondary_c_t_a_variant",
  	"secondary_c_t_a_with_icon" boolean DEFAULT false,
  	"secondary_c_t_a_icon" "enum_landing_sections_blocks_hero_secondary_c_t_a_icon",
  	"secondary_c_t_a_type" "enum_landing_sections_blocks_hero_secondary_c_t_a_type",
  	"secondary_c_t_a_anchor" varchar,
  	"secondary_c_t_a_url" varchar,
  	"right_visual" "enum_landing_sections_blocks_hero_right_visual" DEFAULT 'chat',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"sub" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"columns" "enum_landing_sections_blocks_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"sub" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_flow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" numeric,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_pricing_plans_contents" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tooltip" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"plan_name" varchar,
  	"recommended" boolean DEFAULT false,
  	"plan_sub" varchar,
  	"price" numeric,
  	"price_disclaimer" varchar,
  	"style_preset" "enum_landing_sections_blocks_pricing_plans_style_preset" DEFAULT 'style1',
  	"cta_label" varchar,
  	"cta_variant" "enum_landing_sections_blocks_pricing_plans_cta_variant",
  	"cta_with_icon" boolean DEFAULT false,
  	"cta_icon" "enum_landing_sections_blocks_pricing_plans_cta_icon",
  	"cta_type" "enum_landing_sections_blocks_pricing_plans_cta_type",
  	"cta_anchor" varchar,
  	"cta_url" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"name" varchar,
  	"place" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "landing_sections_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_company_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_company" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"company_name" varchar,
  	"ceo" varchar,
  	"address" varchar,
  	"contact" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_contact_footer_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_landing_sections_blocks_contact_footer_items_kind" DEFAULT 'text',
  	"icon_id" integer,
  	"text" varchar,
  	"link_label" varchar,
  	"link_variant" "v",
  	"link_with_icon" boolean DEFAULT false,
  	"link_icon" "i",
  	"link_type" "t",
  	"link_anchor" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"form_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"heading" varchar,
  	"subheading" varchar,
  	"background" "enum_landing_sections_blocks_section_background" DEFAULT 'default',
  	"disclaimer_icon_id" integer,
  	"disclaimer_text" varchar,
  	"show_in_progress" boolean DEFAULT true,
  	"progress_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_landing_sections_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "landing_sections_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"landing_pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_landing_sections_v_blocks_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_variant" "enum__landing_sections_v_blocks_hero_primary_c_t_a_variant" DEFAULT 'primary',
  	"primary_c_t_a_with_icon" boolean DEFAULT false,
  	"primary_c_t_a_icon" "enum__landing_sections_v_blocks_hero_primary_c_t_a_icon",
  	"primary_c_t_a_type" "enum__landing_sections_v_blocks_hero_primary_c_t_a_type" DEFAULT 'internal',
  	"primary_c_t_a_anchor" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_variant" "enum__landing_sections_v_blocks_hero_secondary_c_t_a_variant",
  	"secondary_c_t_a_with_icon" boolean DEFAULT false,
  	"secondary_c_t_a_icon" "enum__landing_sections_v_blocks_hero_secondary_c_t_a_icon",
  	"secondary_c_t_a_type" "enum__landing_sections_v_blocks_hero_secondary_c_t_a_type",
  	"secondary_c_t_a_anchor" varchar,
  	"secondary_c_t_a_url" varchar,
  	"right_visual" "enum__landing_sections_v_blocks_hero_right_visual" DEFAULT 'chat',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"sub" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"columns" "enum__landing_sections_v_blocks_grid_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"sub" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_flow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" numeric,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_pricing_plans_contents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tooltip" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"plan_name" varchar,
  	"recommended" boolean DEFAULT false,
  	"plan_sub" varchar,
  	"price" numeric,
  	"price_disclaimer" varchar,
  	"style_preset" "enum__landing_sections_v_blocks_pricing_plans_style_preset" DEFAULT 'style1',
  	"cta_label" varchar,
  	"cta_variant" "enum__landing_sections_v_blocks_pricing_plans_cta_variant",
  	"cta_with_icon" boolean DEFAULT false,
  	"cta_icon" "enum__landing_sections_v_blocks_pricing_plans_cta_icon",
  	"cta_type" "enum__landing_sections_v_blocks_pricing_plans_cta_type",
  	"cta_anchor" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"name" varchar,
  	"place" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_company_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_company" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"company_name" varchar,
  	"ceo" varchar,
  	"address" varchar,
  	"contact" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_contact_footer_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__landing_sections_v_blocks_contact_footer_items_kind" DEFAULT 'text',
  	"icon_id" integer,
  	"text" varchar,
  	"link_label" varchar,
  	"link_variant" "v",
  	"link_with_icon" boolean DEFAULT false,
  	"link_icon" "i",
  	"link_type" "t",
  	"link_anchor" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"heading" varchar,
  	"subheading" varchar,
  	"background" "enum__landing_sections_v_blocks_section_background" DEFAULT 'default',
  	"disclaimer_icon_id" integer,
  	"disclaimer_text" varchar,
  	"show_in_progress" boolean DEFAULT true,
  	"progress_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_landing_sections_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__landing_sections_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__landing_sections_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_landing_sections_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"landing_pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "landing_pages_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" integer
  );
  
  CREATE TABLE "landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"meta_image_u_r_l" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_landing_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "landing_pages_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "landing_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"landing_sections_id" integer
  );
  
  CREATE TABLE "_landing_pages_v_version_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_meta_image_u_r_l" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__landing_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__landing_pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_landing_pages_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_landing_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"landing_sections_id" integer
  );
  
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_variant" "enum_pages_blocks_hero_primary_c_t_a_variant" DEFAULT 'primary',
  	"primary_c_t_a_with_icon" boolean DEFAULT false,
  	"primary_c_t_a_icon" "enum_pages_blocks_hero_primary_c_t_a_icon",
  	"primary_c_t_a_type" "enum_pages_blocks_hero_primary_c_t_a_type" DEFAULT 'internal',
  	"primary_c_t_a_anchor" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_variant" "enum_pages_blocks_hero_secondary_c_t_a_variant",
  	"secondary_c_t_a_with_icon" boolean DEFAULT false,
  	"secondary_c_t_a_icon" "enum_pages_blocks_hero_secondary_c_t_a_icon",
  	"secondary_c_t_a_type" "enum_pages_blocks_hero_secondary_c_t_a_type",
  	"secondary_c_t_a_anchor" varchar,
  	"secondary_c_t_a_url" varchar,
  	"right_visual" "enum_pages_blocks_hero_right_visual" DEFAULT 'chat',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"sub" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"columns" "enum_pages_blocks_grid_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"sub" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_flow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" numeric,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans_contents" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tooltip" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"plan_name" varchar,
  	"recommended" boolean DEFAULT false,
  	"plan_sub" varchar,
  	"price" numeric,
  	"price_disclaimer" varchar,
  	"style_preset" "enum_pages_blocks_pricing_plans_style_preset" DEFAULT 'style1',
  	"cta_label" varchar,
  	"cta_variant" "enum_pages_blocks_pricing_plans_cta_variant",
  	"cta_with_icon" boolean DEFAULT false,
  	"cta_icon" "enum_pages_blocks_pricing_plans_cta_icon",
  	"cta_type" "enum_pages_blocks_pricing_plans_cta_type",
  	"cta_anchor" varchar,
  	"cta_url" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"name" varchar,
  	"place" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_company_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_company" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"company_name" varchar,
  	"ceo" varchar,
  	"address" varchar,
  	"contact" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_footer_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_pages_blocks_contact_footer_items_kind" DEFAULT 'text',
  	"icon_id" integer,
  	"text" varchar,
  	"link_label" varchar,
  	"link_variant" "v",
  	"link_with_icon" boolean DEFAULT false,
  	"link_icon" "i",
  	"link_type" "t",
  	"link_anchor" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"form_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"heading" varchar,
  	"subheading" varchar,
  	"background" "enum_pages_blocks_section_background" DEFAULT 'default',
  	"disclaimer_icon_id" integer,
  	"disclaimer_text" varchar,
  	"show_in_progress" boolean DEFAULT true,
  	"progress_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_page_anchor" varchar,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"toc_title" varchar,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"divider" boolean
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_table_of_contents_headings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"meta_image_u_r_l" varchar,
  	"published_at" timestamp(3) with time zone,
  	"show_table_of_contents" boolean DEFAULT false,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"landing_pages_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_variant" "enum__pages_v_blocks_hero_primary_c_t_a_variant" DEFAULT 'primary',
  	"primary_c_t_a_with_icon" boolean DEFAULT false,
  	"primary_c_t_a_icon" "enum__pages_v_blocks_hero_primary_c_t_a_icon",
  	"primary_c_t_a_type" "enum__pages_v_blocks_hero_primary_c_t_a_type" DEFAULT 'internal',
  	"primary_c_t_a_anchor" varchar,
  	"primary_c_t_a_url" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_variant" "enum__pages_v_blocks_hero_secondary_c_t_a_variant",
  	"secondary_c_t_a_with_icon" boolean DEFAULT false,
  	"secondary_c_t_a_icon" "enum__pages_v_blocks_hero_secondary_c_t_a_icon",
  	"secondary_c_t_a_type" "enum__pages_v_blocks_hero_secondary_c_t_a_type",
  	"secondary_c_t_a_anchor" varchar,
  	"secondary_c_t_a_url" varchar,
  	"right_visual" "enum__pages_v_blocks_hero_right_visual" DEFAULT 'chat',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"sub" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"columns" "enum__pages_v_blocks_grid_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problems_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"sub" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_flow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" numeric,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans_contents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tooltip" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"plan_name" varchar,
  	"recommended" boolean DEFAULT false,
  	"plan_sub" varchar,
  	"price" numeric,
  	"price_disclaimer" varchar,
  	"style_preset" "enum__pages_v_blocks_pricing_plans_style_preset" DEFAULT 'style1',
  	"cta_label" varchar,
  	"cta_variant" "enum__pages_v_blocks_pricing_plans_cta_variant",
  	"cta_with_icon" boolean DEFAULT false,
  	"cta_icon" "enum__pages_v_blocks_pricing_plans_cta_icon",
  	"cta_type" "enum__pages_v_blocks_pricing_plans_cta_type",
  	"cta_anchor" varchar,
  	"cta_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"name" varchar,
  	"place" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_company_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_company" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"company_name" varchar,
  	"ceo" varchar,
  	"address" varchar,
  	"contact" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_footer_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__pages_v_blocks_contact_footer_items_kind" DEFAULT 'text',
  	"icon_id" integer,
  	"text" varchar,
  	"link_label" varchar,
  	"link_variant" "v",
  	"link_with_icon" boolean DEFAULT false,
  	"link_icon" "i",
  	"link_type" "t",
  	"link_anchor" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"heading" varchar,
  	"subheading" varchar,
  	"background" "enum__pages_v_blocks_section_background" DEFAULT 'default',
  	"disclaimer_icon_id" integer,
  	"disclaimer_text" varchar,
  	"show_in_progress" boolean DEFAULT true,
  	"progress_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_page_anchor" varchar,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"toc_title" varchar,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"divider" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" boolean,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_table_of_contents_headings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_rich_text" jsonb,
  	"version_hero_media_id" integer,
  	"version_meta_image_u_r_l" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_show_table_of_contents" boolean DEFAULT false,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"landing_pages_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "posts_table_of_contents_headings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"meta_image_u_r_l" varchar,
  	"published_at" timestamp(3) with time zone,
  	"show_table_of_contents" boolean DEFAULT false,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_table_of_contents_headings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_image_u_r_l" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_show_table_of_contents" boolean DEFAULT false,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_rate_limits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"form_id" integer NOT NULL,
  	"ip_hash" varchar NOT NULL,
  	"window" "enum_form_rate_limits_window" NOT NULL,
  	"window_start" timestamp(3) with time zone NOT NULL,
  	"count" numeric DEFAULT 0 NOT NULL,
  	"blocked_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_icon_id" integer,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"icons_id" integer,
  	"ui_copy_keys_id" integer,
  	"landing_sections_id" integer,
  	"landing_pages_id" integer,
  	"pages_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"form_rate_limits_id" integer,
  	"users_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"search_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_homepage_anchor" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_login_c_t_a" boolean DEFAULT true,
  	"login_c_t_a_type" "enum_header_login_c_t_a_type" DEFAULT 'reference',
  	"login_c_t_a_new_tab" boolean,
  	"login_c_t_a_url" varchar,
  	"login_c_t_a_homepage_anchor" varchar,
  	"login_c_t_a_label" varchar,
  	"show_consultation_c_t_a" boolean DEFAULT true,
  	"consultation_c_t_a_type" "enum_header_consultation_c_t_a_type" DEFAULT 'reference',
  	"consultation_c_t_a_new_tab" boolean,
  	"consultation_c_t_a_url" varchar,
  	"consultation_c_t_a_homepage_anchor" varchar,
  	"consultation_c_t_a_label" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_homepage_anchor" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  ALTER TABLE "ui_copy_keys_translations" ADD CONSTRAINT "ui_copy_keys_translations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_copy_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_copy_keys_texts" ADD CONSTRAINT "ui_copy_keys_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ui_copy_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_hero_highlights" ADD CONSTRAINT "landing_sections_blocks_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_hero" ADD CONSTRAINT "landing_sections_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_hero" ADD CONSTRAINT "landing_sections_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_grid_items" ADD CONSTRAINT "landing_sections_blocks_grid_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_grid_items" ADD CONSTRAINT "landing_sections_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_grid" ADD CONSTRAINT "landing_sections_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_problems_items" ADD CONSTRAINT "landing_sections_blocks_problems_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_problems_items" ADD CONSTRAINT "landing_sections_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_problems" ADD CONSTRAINT "landing_sections_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_services_items" ADD CONSTRAINT "landing_sections_blocks_services_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_services_items" ADD CONSTRAINT "landing_sections_blocks_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_services" ADD CONSTRAINT "landing_sections_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_flow_steps" ADD CONSTRAINT "landing_sections_blocks_flow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_flow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_flow" ADD CONSTRAINT "landing_sections_blocks_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_pricing_plans_contents" ADD CONSTRAINT "landing_sections_blocks_pricing_plans_contents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_pricing_plans" ADD CONSTRAINT "landing_sections_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_pricing" ADD CONSTRAINT "landing_sections_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_faq_items" ADD CONSTRAINT "landing_sections_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_faq" ADD CONSTRAINT "landing_sections_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_testimonials_items" ADD CONSTRAINT "landing_sections_blocks_testimonials_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_testimonials_items" ADD CONSTRAINT "landing_sections_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_testimonials" ADD CONSTRAINT "landing_sections_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_company_services" ADD CONSTRAINT "landing_sections_blocks_company_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_company" ADD CONSTRAINT "landing_sections_blocks_company_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_contact_footer_items" ADD CONSTRAINT "landing_sections_blocks_contact_footer_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_contact_footer_items" ADD CONSTRAINT "landing_sections_blocks_contact_footer_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_contact" ADD CONSTRAINT "landing_sections_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_contact" ADD CONSTRAINT "landing_sections_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_section" ADD CONSTRAINT "landing_sections_blocks_section_disclaimer_icon_id_icons_id_fk" FOREIGN KEY ("disclaimer_icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_sections_blocks_section" ADD CONSTRAINT "landing_sections_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_rels" ADD CONSTRAINT "landing_sections_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_rels" ADD CONSTRAINT "landing_sections_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_rels" ADD CONSTRAINT "landing_sections_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_rels" ADD CONSTRAINT "landing_sections_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_hero_highlights" ADD CONSTRAINT "_landing_sections_v_blocks_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_hero" ADD CONSTRAINT "_landing_sections_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_hero" ADD CONSTRAINT "_landing_sections_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_grid_items" ADD CONSTRAINT "_landing_sections_v_blocks_grid_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_grid_items" ADD CONSTRAINT "_landing_sections_v_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_grid" ADD CONSTRAINT "_landing_sections_v_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_problems_items" ADD CONSTRAINT "_landing_sections_v_blocks_problems_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_problems_items" ADD CONSTRAINT "_landing_sections_v_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_problems" ADD CONSTRAINT "_landing_sections_v_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_services_items" ADD CONSTRAINT "_landing_sections_v_blocks_services_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_services_items" ADD CONSTRAINT "_landing_sections_v_blocks_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_services" ADD CONSTRAINT "_landing_sections_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_flow_steps" ADD CONSTRAINT "_landing_sections_v_blocks_flow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_flow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_flow" ADD CONSTRAINT "_landing_sections_v_blocks_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_pricing_plans_contents" ADD CONSTRAINT "_landing_sections_v_blocks_pricing_plans_contents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_pricing_plans" ADD CONSTRAINT "_landing_sections_v_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_pricing" ADD CONSTRAINT "_landing_sections_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_faq_items" ADD CONSTRAINT "_landing_sections_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_faq" ADD CONSTRAINT "_landing_sections_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_testimonials_items" ADD CONSTRAINT "_landing_sections_v_blocks_testimonials_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_testimonials_items" ADD CONSTRAINT "_landing_sections_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_testimonials" ADD CONSTRAINT "_landing_sections_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_company_services" ADD CONSTRAINT "_landing_sections_v_blocks_company_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_company" ADD CONSTRAINT "_landing_sections_v_blocks_company_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_contact_footer_items" ADD CONSTRAINT "_landing_sections_v_blocks_contact_footer_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_contact_footer_items" ADD CONSTRAINT "_landing_sections_v_blocks_contact_footer_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_contact" ADD CONSTRAINT "_landing_sections_v_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_contact" ADD CONSTRAINT "_landing_sections_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_section" ADD CONSTRAINT "_landing_sections_v_blocks_section_disclaimer_icon_id_icons_id_fk" FOREIGN KEY ("disclaimer_icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_blocks_section" ADD CONSTRAINT "_landing_sections_v_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v" ADD CONSTRAINT "_landing_sections_v_parent_id_landing_sections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_rels" ADD CONSTRAINT "_landing_sections_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_sections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_rels" ADD CONSTRAINT "_landing_sections_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_rels" ADD CONSTRAINT "_landing_sections_v_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_sections_v_rels" ADD CONSTRAINT "_landing_sections_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_section_items" ADD CONSTRAINT "landing_pages_section_items_section_id_landing_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."landing_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_section_items" ADD CONSTRAINT "landing_pages_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_locales" ADD CONSTRAINT "landing_pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_locales" ADD CONSTRAINT "landing_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_rels" ADD CONSTRAINT "landing_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_rels" ADD CONSTRAINT "landing_pages_rels_landing_sections_fk" FOREIGN KEY ("landing_sections_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_section_items" ADD CONSTRAINT "_landing_pages_v_version_section_items_section_id_landing_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."landing_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_version_section_items" ADD CONSTRAINT "_landing_pages_v_version_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v" ADD CONSTRAINT "_landing_pages_v_parent_id_landing_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_locales" ADD CONSTRAINT "_landing_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_locales" ADD CONSTRAINT "_landing_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_rels" ADD CONSTRAINT "_landing_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_pages_v_rels" ADD CONSTRAINT "_landing_pages_v_rels_landing_sections_fk" FOREIGN KEY ("landing_sections_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_highlights" ADD CONSTRAINT "pages_blocks_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid_items" ADD CONSTRAINT "pages_blocks_grid_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid_items" ADD CONSTRAINT "pages_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid" ADD CONSTRAINT "pages_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problems_items" ADD CONSTRAINT "pages_blocks_problems_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_problems_items" ADD CONSTRAINT "pages_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_problems" ADD CONSTRAINT "pages_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_items" ADD CONSTRAINT "pages_blocks_services_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_items" ADD CONSTRAINT "pages_blocks_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_flow_steps" ADD CONSTRAINT "pages_blocks_flow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_flow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_flow" ADD CONSTRAINT "pages_blocks_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans_contents" ADD CONSTRAINT "pages_blocks_pricing_plans_contents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans" ADD CONSTRAINT "pages_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_company_services" ADD CONSTRAINT "pages_blocks_company_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_company" ADD CONSTRAINT "pages_blocks_company_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_footer_items" ADD CONSTRAINT "pages_blocks_contact_footer_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_footer_items" ADD CONSTRAINT "pages_blocks_contact_footer_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_section" ADD CONSTRAINT "pages_blocks_section_disclaimer_icon_id_icons_id_fk" FOREIGN KEY ("disclaimer_icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_section" ADD CONSTRAINT "pages_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_table_of_contents_headings" ADD CONSTRAINT "pages_table_of_contents_headings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_highlights" ADD CONSTRAINT "_pages_v_blocks_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grid_items" ADD CONSTRAINT "_pages_v_blocks_grid_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grid_items" ADD CONSTRAINT "_pages_v_blocks_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grid" ADD CONSTRAINT "_pages_v_blocks_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problems_items" ADD CONSTRAINT "_pages_v_blocks_problems_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problems_items" ADD CONSTRAINT "_pages_v_blocks_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_problems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_problems" ADD CONSTRAINT "_pages_v_blocks_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_items" ADD CONSTRAINT "_pages_v_blocks_services_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_items" ADD CONSTRAINT "_pages_v_blocks_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flow_steps" ADD CONSTRAINT "_pages_v_blocks_flow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_flow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flow" ADD CONSTRAINT "_pages_v_blocks_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans_contents" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_contents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_company_services" ADD CONSTRAINT "_pages_v_blocks_company_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_company" ADD CONSTRAINT "_pages_v_blocks_company_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_footer_items" ADD CONSTRAINT "_pages_v_blocks_contact_footer_items_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_footer_items" ADD CONSTRAINT "_pages_v_blocks_contact_footer_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section" ADD CONSTRAINT "_pages_v_blocks_section_disclaimer_icon_id_icons_id_fk" FOREIGN KEY ("disclaimer_icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section" ADD CONSTRAINT "_pages_v_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_table_of_contents_headings" ADD CONSTRAINT "_pages_v_version_table_of_contents_headings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_table_of_contents_headings" ADD CONSTRAINT "posts_table_of_contents_headings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_table_of_contents_headings" ADD CONSTRAINT "_posts_v_version_table_of_contents_headings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_rate_limits" ADD CONSTRAINT "form_rate_limits_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms" ADD CONSTRAINT "forms_submit_button_icon_id_icons_id_fk" FOREIGN KEY ("submit_button_icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_icons_fk" FOREIGN KEY ("icons_id") REFERENCES "public"."icons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ui_copy_keys_fk" FOREIGN KEY ("ui_copy_keys_id") REFERENCES "public"."ui_copy_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_landing_sections_fk" FOREIGN KEY ("landing_sections_id") REFERENCES "public"."landing_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_rate_limits_fk" FOREIGN KEY ("form_rate_limits_id") REFERENCES "public"."form_rate_limits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "icons_name_idx" ON "icons" USING btree ("name");
  CREATE UNIQUE INDEX "icons_lucide_name_idx" ON "icons" USING btree ("lucide_name");
  CREATE INDEX "icons_updated_at_idx" ON "icons" USING btree ("updated_at");
  CREATE INDEX "icons_created_at_idx" ON "icons" USING btree ("created_at");
  CREATE INDEX "ui_copy_keys_translations_order_idx" ON "ui_copy_keys_translations" USING btree ("_order");
  CREATE INDEX "ui_copy_keys_translations_parent_id_idx" ON "ui_copy_keys_translations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_copy_keys_key_idx" ON "ui_copy_keys" USING btree ("key");
  CREATE INDEX "ui_copy_keys_group_idx" ON "ui_copy_keys" USING btree ("group");
  CREATE INDEX "ui_copy_keys_updated_at_idx" ON "ui_copy_keys" USING btree ("updated_at");
  CREATE INDEX "ui_copy_keys_created_at_idx" ON "ui_copy_keys" USING btree ("created_at");
  CREATE INDEX "ui_copy_keys_texts_order_parent" ON "ui_copy_keys_texts" USING btree ("order","parent_id");
  CREATE INDEX "landing_sections_blocks_hero_highlights_order_idx" ON "landing_sections_blocks_hero_highlights" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_hero_highlights_parent_id_idx" ON "landing_sections_blocks_hero_highlights" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_hero_highlights_locale_idx" ON "landing_sections_blocks_hero_highlights" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_hero_order_idx" ON "landing_sections_blocks_hero" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_hero_parent_id_idx" ON "landing_sections_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_hero_path_idx" ON "landing_sections_blocks_hero" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_hero_locale_idx" ON "landing_sections_blocks_hero" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_hero_image_idx" ON "landing_sections_blocks_hero" USING btree ("image_id");
  CREATE INDEX "landing_sections_blocks_grid_items_order_idx" ON "landing_sections_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_grid_items_parent_id_idx" ON "landing_sections_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_grid_items_locale_idx" ON "landing_sections_blocks_grid_items" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_grid_items_icon_idx" ON "landing_sections_blocks_grid_items" USING btree ("icon_id");
  CREATE INDEX "landing_sections_blocks_grid_order_idx" ON "landing_sections_blocks_grid" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_grid_parent_id_idx" ON "landing_sections_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_grid_path_idx" ON "landing_sections_blocks_grid" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_grid_locale_idx" ON "landing_sections_blocks_grid" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_problems_items_order_idx" ON "landing_sections_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_problems_items_parent_id_idx" ON "landing_sections_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_problems_items_locale_idx" ON "landing_sections_blocks_problems_items" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_problems_items_icon_idx" ON "landing_sections_blocks_problems_items" USING btree ("icon_id");
  CREATE INDEX "landing_sections_blocks_problems_order_idx" ON "landing_sections_blocks_problems" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_problems_parent_id_idx" ON "landing_sections_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_problems_path_idx" ON "landing_sections_blocks_problems" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_problems_locale_idx" ON "landing_sections_blocks_problems" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_services_items_order_idx" ON "landing_sections_blocks_services_items" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_services_items_parent_id_idx" ON "landing_sections_blocks_services_items" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_services_items_locale_idx" ON "landing_sections_blocks_services_items" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_services_items_icon_idx" ON "landing_sections_blocks_services_items" USING btree ("icon_id");
  CREATE INDEX "landing_sections_blocks_services_order_idx" ON "landing_sections_blocks_services" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_services_parent_id_idx" ON "landing_sections_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_services_path_idx" ON "landing_sections_blocks_services" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_services_locale_idx" ON "landing_sections_blocks_services" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_flow_steps_order_idx" ON "landing_sections_blocks_flow_steps" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_flow_steps_parent_id_idx" ON "landing_sections_blocks_flow_steps" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_flow_steps_locale_idx" ON "landing_sections_blocks_flow_steps" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_flow_order_idx" ON "landing_sections_blocks_flow" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_flow_parent_id_idx" ON "landing_sections_blocks_flow" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_flow_path_idx" ON "landing_sections_blocks_flow" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_flow_locale_idx" ON "landing_sections_blocks_flow" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_pricing_plans_contents_order_idx" ON "landing_sections_blocks_pricing_plans_contents" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_pricing_plans_contents_parent_id_idx" ON "landing_sections_blocks_pricing_plans_contents" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_pricing_plans_contents_locale_idx" ON "landing_sections_blocks_pricing_plans_contents" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_pricing_plans_order_idx" ON "landing_sections_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_pricing_plans_parent_id_idx" ON "landing_sections_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_pricing_plans_locale_idx" ON "landing_sections_blocks_pricing_plans" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_pricing_order_idx" ON "landing_sections_blocks_pricing" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_pricing_parent_id_idx" ON "landing_sections_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_pricing_path_idx" ON "landing_sections_blocks_pricing" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_pricing_locale_idx" ON "landing_sections_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_faq_items_order_idx" ON "landing_sections_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_faq_items_parent_id_idx" ON "landing_sections_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_faq_items_locale_idx" ON "landing_sections_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_faq_order_idx" ON "landing_sections_blocks_faq" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_faq_parent_id_idx" ON "landing_sections_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_faq_path_idx" ON "landing_sections_blocks_faq" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_faq_locale_idx" ON "landing_sections_blocks_faq" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_testimonials_items_order_idx" ON "landing_sections_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_testimonials_items_parent_id_idx" ON "landing_sections_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_testimonials_items_locale_idx" ON "landing_sections_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_testimonials_items_image_idx" ON "landing_sections_blocks_testimonials_items" USING btree ("image_id");
  CREATE INDEX "landing_sections_blocks_testimonials_order_idx" ON "landing_sections_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_testimonials_parent_id_idx" ON "landing_sections_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_testimonials_path_idx" ON "landing_sections_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_testimonials_locale_idx" ON "landing_sections_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_company_services_order_idx" ON "landing_sections_blocks_company_services" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_company_services_parent_id_idx" ON "landing_sections_blocks_company_services" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_company_services_locale_idx" ON "landing_sections_blocks_company_services" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_company_order_idx" ON "landing_sections_blocks_company" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_company_parent_id_idx" ON "landing_sections_blocks_company" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_company_path_idx" ON "landing_sections_blocks_company" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_company_locale_idx" ON "landing_sections_blocks_company" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_contact_footer_items_order_idx" ON "landing_sections_blocks_contact_footer_items" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_contact_footer_items_parent_id_idx" ON "landing_sections_blocks_contact_footer_items" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_contact_footer_items_locale_idx" ON "landing_sections_blocks_contact_footer_items" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_contact_footer_items_icon_idx" ON "landing_sections_blocks_contact_footer_items" USING btree ("icon_id");
  CREATE INDEX "landing_sections_blocks_contact_order_idx" ON "landing_sections_blocks_contact" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_contact_parent_id_idx" ON "landing_sections_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_contact_path_idx" ON "landing_sections_blocks_contact" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_contact_locale_idx" ON "landing_sections_blocks_contact" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_contact_form_idx" ON "landing_sections_blocks_contact" USING btree ("form_id");
  CREATE INDEX "landing_sections_blocks_section_order_idx" ON "landing_sections_blocks_section" USING btree ("_order");
  CREATE INDEX "landing_sections_blocks_section_parent_id_idx" ON "landing_sections_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "landing_sections_blocks_section_path_idx" ON "landing_sections_blocks_section" USING btree ("_path");
  CREATE INDEX "landing_sections_blocks_section_locale_idx" ON "landing_sections_blocks_section" USING btree ("_locale");
  CREATE INDEX "landing_sections_blocks_section_disclaimer_disclaimer_ic_idx" ON "landing_sections_blocks_section" USING btree ("disclaimer_icon_id");
  CREATE INDEX "landing_sections_updated_at_idx" ON "landing_sections" USING btree ("updated_at");
  CREATE INDEX "landing_sections_created_at_idx" ON "landing_sections" USING btree ("created_at");
  CREATE INDEX "landing_sections__status_idx" ON "landing_sections" USING btree ("_status");
  CREATE INDEX "landing_sections_rels_order_idx" ON "landing_sections_rels" USING btree ("order");
  CREATE INDEX "landing_sections_rels_parent_idx" ON "landing_sections_rels" USING btree ("parent_id");
  CREATE INDEX "landing_sections_rels_path_idx" ON "landing_sections_rels" USING btree ("path");
  CREATE INDEX "landing_sections_rels_locale_idx" ON "landing_sections_rels" USING btree ("locale");
  CREATE INDEX "landing_sections_rels_pages_id_idx" ON "landing_sections_rels" USING btree ("pages_id","locale");
  CREATE INDEX "landing_sections_rels_landing_pages_id_idx" ON "landing_sections_rels" USING btree ("landing_pages_id","locale");
  CREATE INDEX "landing_sections_rels_posts_id_idx" ON "landing_sections_rels" USING btree ("posts_id","locale");
  CREATE INDEX "_landing_sections_v_blocks_hero_highlights_order_idx" ON "_landing_sections_v_blocks_hero_highlights" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_hero_highlights_parent_id_idx" ON "_landing_sections_v_blocks_hero_highlights" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_hero_highlights_locale_idx" ON "_landing_sections_v_blocks_hero_highlights" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_hero_order_idx" ON "_landing_sections_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_hero_parent_id_idx" ON "_landing_sections_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_hero_path_idx" ON "_landing_sections_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_hero_locale_idx" ON "_landing_sections_v_blocks_hero" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_hero_image_idx" ON "_landing_sections_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_landing_sections_v_blocks_grid_items_order_idx" ON "_landing_sections_v_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_grid_items_parent_id_idx" ON "_landing_sections_v_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_grid_items_locale_idx" ON "_landing_sections_v_blocks_grid_items" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_grid_items_icon_idx" ON "_landing_sections_v_blocks_grid_items" USING btree ("icon_id");
  CREATE INDEX "_landing_sections_v_blocks_grid_order_idx" ON "_landing_sections_v_blocks_grid" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_grid_parent_id_idx" ON "_landing_sections_v_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_grid_path_idx" ON "_landing_sections_v_blocks_grid" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_grid_locale_idx" ON "_landing_sections_v_blocks_grid" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_problems_items_order_idx" ON "_landing_sections_v_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_problems_items_parent_id_idx" ON "_landing_sections_v_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_problems_items_locale_idx" ON "_landing_sections_v_blocks_problems_items" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_problems_items_icon_idx" ON "_landing_sections_v_blocks_problems_items" USING btree ("icon_id");
  CREATE INDEX "_landing_sections_v_blocks_problems_order_idx" ON "_landing_sections_v_blocks_problems" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_problems_parent_id_idx" ON "_landing_sections_v_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_problems_path_idx" ON "_landing_sections_v_blocks_problems" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_problems_locale_idx" ON "_landing_sections_v_blocks_problems" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_services_items_order_idx" ON "_landing_sections_v_blocks_services_items" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_services_items_parent_id_idx" ON "_landing_sections_v_blocks_services_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_services_items_locale_idx" ON "_landing_sections_v_blocks_services_items" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_services_items_icon_idx" ON "_landing_sections_v_blocks_services_items" USING btree ("icon_id");
  CREATE INDEX "_landing_sections_v_blocks_services_order_idx" ON "_landing_sections_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_services_parent_id_idx" ON "_landing_sections_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_services_path_idx" ON "_landing_sections_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_services_locale_idx" ON "_landing_sections_v_blocks_services" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_flow_steps_order_idx" ON "_landing_sections_v_blocks_flow_steps" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_flow_steps_parent_id_idx" ON "_landing_sections_v_blocks_flow_steps" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_flow_steps_locale_idx" ON "_landing_sections_v_blocks_flow_steps" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_flow_order_idx" ON "_landing_sections_v_blocks_flow" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_flow_parent_id_idx" ON "_landing_sections_v_blocks_flow" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_flow_path_idx" ON "_landing_sections_v_blocks_flow" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_flow_locale_idx" ON "_landing_sections_v_blocks_flow" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_pricing_plans_contents_order_idx" ON "_landing_sections_v_blocks_pricing_plans_contents" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_pricing_plans_contents_parent_id_idx" ON "_landing_sections_v_blocks_pricing_plans_contents" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_pricing_plans_contents_locale_idx" ON "_landing_sections_v_blocks_pricing_plans_contents" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_pricing_plans_order_idx" ON "_landing_sections_v_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_pricing_plans_parent_id_idx" ON "_landing_sections_v_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_pricing_plans_locale_idx" ON "_landing_sections_v_blocks_pricing_plans" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_pricing_order_idx" ON "_landing_sections_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_pricing_parent_id_idx" ON "_landing_sections_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_pricing_path_idx" ON "_landing_sections_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_pricing_locale_idx" ON "_landing_sections_v_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_faq_items_order_idx" ON "_landing_sections_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_faq_items_parent_id_idx" ON "_landing_sections_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_faq_items_locale_idx" ON "_landing_sections_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_faq_order_idx" ON "_landing_sections_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_faq_parent_id_idx" ON "_landing_sections_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_faq_path_idx" ON "_landing_sections_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_faq_locale_idx" ON "_landing_sections_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_testimonials_items_order_idx" ON "_landing_sections_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_testimonials_items_parent_id_idx" ON "_landing_sections_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_testimonials_items_locale_idx" ON "_landing_sections_v_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_testimonials_items_image_idx" ON "_landing_sections_v_blocks_testimonials_items" USING btree ("image_id");
  CREATE INDEX "_landing_sections_v_blocks_testimonials_order_idx" ON "_landing_sections_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_testimonials_parent_id_idx" ON "_landing_sections_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_testimonials_path_idx" ON "_landing_sections_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_testimonials_locale_idx" ON "_landing_sections_v_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_company_services_order_idx" ON "_landing_sections_v_blocks_company_services" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_company_services_parent_id_idx" ON "_landing_sections_v_blocks_company_services" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_company_services_locale_idx" ON "_landing_sections_v_blocks_company_services" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_company_order_idx" ON "_landing_sections_v_blocks_company" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_company_parent_id_idx" ON "_landing_sections_v_blocks_company" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_company_path_idx" ON "_landing_sections_v_blocks_company" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_company_locale_idx" ON "_landing_sections_v_blocks_company" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_contact_footer_items_order_idx" ON "_landing_sections_v_blocks_contact_footer_items" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_contact_footer_items_parent_id_idx" ON "_landing_sections_v_blocks_contact_footer_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_contact_footer_items_locale_idx" ON "_landing_sections_v_blocks_contact_footer_items" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_contact_footer_items_icon_idx" ON "_landing_sections_v_blocks_contact_footer_items" USING btree ("icon_id");
  CREATE INDEX "_landing_sections_v_blocks_contact_order_idx" ON "_landing_sections_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_contact_parent_id_idx" ON "_landing_sections_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_contact_path_idx" ON "_landing_sections_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_contact_locale_idx" ON "_landing_sections_v_blocks_contact" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_contact_form_idx" ON "_landing_sections_v_blocks_contact" USING btree ("form_id");
  CREATE INDEX "_landing_sections_v_blocks_section_order_idx" ON "_landing_sections_v_blocks_section" USING btree ("_order");
  CREATE INDEX "_landing_sections_v_blocks_section_parent_id_idx" ON "_landing_sections_v_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "_landing_sections_v_blocks_section_path_idx" ON "_landing_sections_v_blocks_section" USING btree ("_path");
  CREATE INDEX "_landing_sections_v_blocks_section_locale_idx" ON "_landing_sections_v_blocks_section" USING btree ("_locale");
  CREATE INDEX "_landing_sections_v_blocks_section_disclaimer_disclaimer_idx" ON "_landing_sections_v_blocks_section" USING btree ("disclaimer_icon_id");
  CREATE INDEX "_landing_sections_v_parent_idx" ON "_landing_sections_v" USING btree ("parent_id");
  CREATE INDEX "_landing_sections_v_version_version_updated_at_idx" ON "_landing_sections_v" USING btree ("version_updated_at");
  CREATE INDEX "_landing_sections_v_version_version_created_at_idx" ON "_landing_sections_v" USING btree ("version_created_at");
  CREATE INDEX "_landing_sections_v_version_version__status_idx" ON "_landing_sections_v" USING btree ("version__status");
  CREATE INDEX "_landing_sections_v_created_at_idx" ON "_landing_sections_v" USING btree ("created_at");
  CREATE INDEX "_landing_sections_v_updated_at_idx" ON "_landing_sections_v" USING btree ("updated_at");
  CREATE INDEX "_landing_sections_v_snapshot_idx" ON "_landing_sections_v" USING btree ("snapshot");
  CREATE INDEX "_landing_sections_v_published_locale_idx" ON "_landing_sections_v" USING btree ("published_locale");
  CREATE INDEX "_landing_sections_v_latest_idx" ON "_landing_sections_v" USING btree ("latest");
  CREATE INDEX "_landing_sections_v_autosave_idx" ON "_landing_sections_v" USING btree ("autosave");
  CREATE INDEX "_landing_sections_v_rels_order_idx" ON "_landing_sections_v_rels" USING btree ("order");
  CREATE INDEX "_landing_sections_v_rels_parent_idx" ON "_landing_sections_v_rels" USING btree ("parent_id");
  CREATE INDEX "_landing_sections_v_rels_path_idx" ON "_landing_sections_v_rels" USING btree ("path");
  CREATE INDEX "_landing_sections_v_rels_locale_idx" ON "_landing_sections_v_rels" USING btree ("locale");
  CREATE INDEX "_landing_sections_v_rels_pages_id_idx" ON "_landing_sections_v_rels" USING btree ("pages_id","locale");
  CREATE INDEX "_landing_sections_v_rels_landing_pages_id_idx" ON "_landing_sections_v_rels" USING btree ("landing_pages_id","locale");
  CREATE INDEX "_landing_sections_v_rels_posts_id_idx" ON "_landing_sections_v_rels" USING btree ("posts_id","locale");
  CREATE INDEX "landing_pages_section_items_order_idx" ON "landing_pages_section_items" USING btree ("_order");
  CREATE INDEX "landing_pages_section_items_parent_id_idx" ON "landing_pages_section_items" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_section_items_section_idx" ON "landing_pages_section_items" USING btree ("section_id");
  CREATE UNIQUE INDEX "landing_pages_slug_idx" ON "landing_pages" USING btree ("slug");
  CREATE INDEX "landing_pages_updated_at_idx" ON "landing_pages" USING btree ("updated_at");
  CREATE INDEX "landing_pages_created_at_idx" ON "landing_pages" USING btree ("created_at");
  CREATE INDEX "landing_pages__status_idx" ON "landing_pages" USING btree ("_status");
  CREATE INDEX "landing_pages_meta_meta_image_idx" ON "landing_pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "landing_pages_locales_locale_parent_id_unique" ON "landing_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "landing_pages_rels_order_idx" ON "landing_pages_rels" USING btree ("order");
  CREATE INDEX "landing_pages_rels_parent_idx" ON "landing_pages_rels" USING btree ("parent_id");
  CREATE INDEX "landing_pages_rels_path_idx" ON "landing_pages_rels" USING btree ("path");
  CREATE INDEX "landing_pages_rels_landing_sections_id_idx" ON "landing_pages_rels" USING btree ("landing_sections_id");
  CREATE INDEX "_landing_pages_v_version_section_items_order_idx" ON "_landing_pages_v_version_section_items" USING btree ("_order");
  CREATE INDEX "_landing_pages_v_version_section_items_parent_id_idx" ON "_landing_pages_v_version_section_items" USING btree ("_parent_id");
  CREATE INDEX "_landing_pages_v_version_section_items_section_idx" ON "_landing_pages_v_version_section_items" USING btree ("section_id");
  CREATE INDEX "_landing_pages_v_parent_idx" ON "_landing_pages_v" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_version_version_slug_idx" ON "_landing_pages_v" USING btree ("version_slug");
  CREATE INDEX "_landing_pages_v_version_version_updated_at_idx" ON "_landing_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_landing_pages_v_version_version_created_at_idx" ON "_landing_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_landing_pages_v_version_version__status_idx" ON "_landing_pages_v" USING btree ("version__status");
  CREATE INDEX "_landing_pages_v_created_at_idx" ON "_landing_pages_v" USING btree ("created_at");
  CREATE INDEX "_landing_pages_v_updated_at_idx" ON "_landing_pages_v" USING btree ("updated_at");
  CREATE INDEX "_landing_pages_v_snapshot_idx" ON "_landing_pages_v" USING btree ("snapshot");
  CREATE INDEX "_landing_pages_v_published_locale_idx" ON "_landing_pages_v" USING btree ("published_locale");
  CREATE INDEX "_landing_pages_v_latest_idx" ON "_landing_pages_v" USING btree ("latest");
  CREATE INDEX "_landing_pages_v_autosave_idx" ON "_landing_pages_v" USING btree ("autosave");
  CREATE INDEX "_landing_pages_v_version_meta_version_meta_image_idx" ON "_landing_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_landing_pages_v_locales_locale_parent_id_unique" ON "_landing_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_landing_pages_v_rels_order_idx" ON "_landing_pages_v_rels" USING btree ("order");
  CREATE INDEX "_landing_pages_v_rels_parent_idx" ON "_landing_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_landing_pages_v_rels_path_idx" ON "_landing_pages_v_rels" USING btree ("path");
  CREATE INDEX "_landing_pages_v_rels_landing_sections_id_idx" ON "_landing_pages_v_rels" USING btree ("landing_sections_id");
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_highlights_order_idx" ON "pages_blocks_hero_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_highlights_parent_id_idx" ON "pages_blocks_hero_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_grid_items_order_idx" ON "pages_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_grid_items_parent_id_idx" ON "pages_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grid_items_icon_idx" ON "pages_blocks_grid_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_grid_order_idx" ON "pages_blocks_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_grid_parent_id_idx" ON "pages_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grid_path_idx" ON "pages_blocks_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_problems_items_order_idx" ON "pages_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_problems_items_parent_id_idx" ON "pages_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problems_items_icon_idx" ON "pages_blocks_problems_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_problems_order_idx" ON "pages_blocks_problems" USING btree ("_order");
  CREATE INDEX "pages_blocks_problems_parent_id_idx" ON "pages_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_problems_path_idx" ON "pages_blocks_problems" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_items_order_idx" ON "pages_blocks_services_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_items_parent_id_idx" ON "pages_blocks_services_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_items_icon_idx" ON "pages_blocks_services_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_services_order_idx" ON "pages_blocks_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_parent_id_idx" ON "pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_path_idx" ON "pages_blocks_services" USING btree ("_path");
  CREATE INDEX "pages_blocks_flow_steps_order_idx" ON "pages_blocks_flow_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_flow_steps_parent_id_idx" ON "pages_blocks_flow_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_flow_order_idx" ON "pages_blocks_flow" USING btree ("_order");
  CREATE INDEX "pages_blocks_flow_parent_id_idx" ON "pages_blocks_flow" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_flow_path_idx" ON "pages_blocks_flow" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_plans_contents_order_idx" ON "pages_blocks_pricing_plans_contents" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_contents_parent_id_idx" ON "pages_blocks_pricing_plans_contents" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_order_idx" ON "pages_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_parent_id_idx" ON "pages_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_image_idx" ON "pages_blocks_testimonials_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_company_services_order_idx" ON "pages_blocks_company_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_company_services_parent_id_idx" ON "pages_blocks_company_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_company_order_idx" ON "pages_blocks_company" USING btree ("_order");
  CREATE INDEX "pages_blocks_company_parent_id_idx" ON "pages_blocks_company" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_company_path_idx" ON "pages_blocks_company" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_footer_items_order_idx" ON "pages_blocks_contact_footer_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_footer_items_parent_id_idx" ON "pages_blocks_contact_footer_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_footer_items_icon_idx" ON "pages_blocks_contact_footer_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_idx" ON "pages_blocks_contact" USING btree ("form_id");
  CREATE INDEX "pages_blocks_section_order_idx" ON "pages_blocks_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_section_parent_id_idx" ON "pages_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_section_path_idx" ON "pages_blocks_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_section_disclaimer_disclaimer_icon_idx" ON "pages_blocks_section" USING btree ("disclaimer_icon_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_table_of_contents_headings_order_idx" ON "pages_table_of_contents_headings" USING btree ("_order");
  CREATE INDEX "pages_table_of_contents_headings_parent_id_idx" ON "pages_table_of_contents_headings" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_landing_pages_id_idx" ON "pages_rels" USING btree ("landing_pages_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_highlights_order_idx" ON "_pages_v_blocks_hero_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_highlights_parent_id_idx" ON "_pages_v_blocks_hero_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_grid_items_order_idx" ON "_pages_v_blocks_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_grid_items_parent_id_idx" ON "_pages_v_blocks_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_grid_items_icon_idx" ON "_pages_v_blocks_grid_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_grid_order_idx" ON "_pages_v_blocks_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_grid_parent_id_idx" ON "_pages_v_blocks_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_grid_path_idx" ON "_pages_v_blocks_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_problems_items_order_idx" ON "_pages_v_blocks_problems_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problems_items_parent_id_idx" ON "_pages_v_blocks_problems_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problems_items_icon_idx" ON "_pages_v_blocks_problems_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_problems_order_idx" ON "_pages_v_blocks_problems" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_problems_parent_id_idx" ON "_pages_v_blocks_problems" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_problems_path_idx" ON "_pages_v_blocks_problems" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_items_order_idx" ON "_pages_v_blocks_services_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_items_parent_id_idx" ON "_pages_v_blocks_services_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_items_icon_idx" ON "_pages_v_blocks_services_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_services_order_idx" ON "_pages_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_parent_id_idx" ON "_pages_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_path_idx" ON "_pages_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_flow_steps_order_idx" ON "_pages_v_blocks_flow_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_flow_steps_parent_id_idx" ON "_pages_v_blocks_flow_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_flow_order_idx" ON "_pages_v_blocks_flow" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_flow_parent_id_idx" ON "_pages_v_blocks_flow" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_flow_path_idx" ON "_pages_v_blocks_flow" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_plans_contents_order_idx" ON "_pages_v_blocks_pricing_plans_contents" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_contents_parent_id_idx" ON "_pages_v_blocks_pricing_plans_contents" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_plans_order_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_parent_id_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_image_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_company_services_order_idx" ON "_pages_v_blocks_company_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_company_services_parent_id_idx" ON "_pages_v_blocks_company_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_company_order_idx" ON "_pages_v_blocks_company" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_company_parent_id_idx" ON "_pages_v_blocks_company" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_company_path_idx" ON "_pages_v_blocks_company" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_footer_items_order_idx" ON "_pages_v_blocks_contact_footer_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_footer_items_parent_id_idx" ON "_pages_v_blocks_contact_footer_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_footer_items_icon_idx" ON "_pages_v_blocks_contact_footer_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_idx" ON "_pages_v_blocks_contact" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_section_order_idx" ON "_pages_v_blocks_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_section_parent_id_idx" ON "_pages_v_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_section_path_idx" ON "_pages_v_blocks_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_section_disclaimer_disclaimer_icon_idx" ON "_pages_v_blocks_section" USING btree ("disclaimer_icon_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_version_table_of_contents_headings_order_idx" ON "_pages_v_version_table_of_contents_headings" USING btree ("_order");
  CREATE INDEX "_pages_v_version_table_of_contents_headings_parent_id_idx" ON "_pages_v_version_table_of_contents_headings" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_landing_pages_id_idx" ON "_pages_v_rels" USING btree ("landing_pages_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "posts_table_of_contents_headings_order_idx" ON "posts_table_of_contents_headings" USING btree ("_order");
  CREATE INDEX "posts_table_of_contents_headings_parent_id_idx" ON "posts_table_of_contents_headings" USING btree ("_parent_id");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_table_of_contents_headings_order_idx" ON "_posts_v_version_table_of_contents_headings" USING btree ("_order");
  CREATE INDEX "_posts_v_version_table_of_contents_headings_parent_id_idx" ON "_posts_v_version_table_of_contents_headings" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "form_rate_limits_key_idx" ON "form_rate_limits" USING btree ("key");
  CREATE INDEX "form_rate_limits_form_idx" ON "form_rate_limits" USING btree ("form_id");
  CREATE INDEX "form_rate_limits_ip_hash_idx" ON "form_rate_limits" USING btree ("ip_hash");
  CREATE INDEX "form_rate_limits_updated_at_idx" ON "form_rate_limits" USING btree ("updated_at");
  CREATE INDEX "form_rate_limits_created_at_idx" ON "form_rate_limits" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_submit_button_icon_idx" ON "forms" USING btree ("submit_button_icon_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_icons_id_idx" ON "payload_locked_documents_rels" USING btree ("icons_id");
  CREATE INDEX "payload_locked_documents_rels_ui_copy_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("ui_copy_keys_id");
  CREATE INDEX "payload_locked_documents_rels_landing_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("landing_sections_id");
  CREATE INDEX "payload_locked_documents_rels_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("landing_pages_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_form_rate_limits_id_idx" ON "payload_locked_documents_rels" USING btree ("form_rate_limits_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "icons" CASCADE;
  DROP TABLE "ui_copy_keys_translations" CASCADE;
  DROP TABLE "ui_copy_keys" CASCADE;
  DROP TABLE "ui_copy_keys_texts" CASCADE;
  DROP TABLE "landing_sections_blocks_hero_highlights" CASCADE;
  DROP TABLE "landing_sections_blocks_hero" CASCADE;
  DROP TABLE "landing_sections_blocks_grid_items" CASCADE;
  DROP TABLE "landing_sections_blocks_grid" CASCADE;
  DROP TABLE "landing_sections_blocks_problems_items" CASCADE;
  DROP TABLE "landing_sections_blocks_problems" CASCADE;
  DROP TABLE "landing_sections_blocks_services_items" CASCADE;
  DROP TABLE "landing_sections_blocks_services" CASCADE;
  DROP TABLE "landing_sections_blocks_flow_steps" CASCADE;
  DROP TABLE "landing_sections_blocks_flow" CASCADE;
  DROP TABLE "landing_sections_blocks_pricing_plans_contents" CASCADE;
  DROP TABLE "landing_sections_blocks_pricing_plans" CASCADE;
  DROP TABLE "landing_sections_blocks_pricing" CASCADE;
  DROP TABLE "landing_sections_blocks_faq_items" CASCADE;
  DROP TABLE "landing_sections_blocks_faq" CASCADE;
  DROP TABLE "landing_sections_blocks_testimonials_items" CASCADE;
  DROP TABLE "landing_sections_blocks_testimonials" CASCADE;
  DROP TABLE "landing_sections_blocks_company_services" CASCADE;
  DROP TABLE "landing_sections_blocks_company" CASCADE;
  DROP TABLE "landing_sections_blocks_contact_footer_items" CASCADE;
  DROP TABLE "landing_sections_blocks_contact" CASCADE;
  DROP TABLE "landing_sections_blocks_section" CASCADE;
  DROP TABLE "landing_sections" CASCADE;
  DROP TABLE "landing_sections_rels" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_hero_highlights" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_hero" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_grid_items" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_grid" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_problems_items" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_problems" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_services_items" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_services" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_flow_steps" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_flow" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_pricing_plans_contents" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_pricing_plans" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_pricing" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_faq_items" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_faq" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_testimonials" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_company_services" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_company" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_contact_footer_items" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_contact" CASCADE;
  DROP TABLE "_landing_sections_v_blocks_section" CASCADE;
  DROP TABLE "_landing_sections_v" CASCADE;
  DROP TABLE "_landing_sections_v_rels" CASCADE;
  DROP TABLE "landing_pages_section_items" CASCADE;
  DROP TABLE "landing_pages" CASCADE;
  DROP TABLE "landing_pages_locales" CASCADE;
  DROP TABLE "landing_pages_rels" CASCADE;
  DROP TABLE "_landing_pages_v_version_section_items" CASCADE;
  DROP TABLE "_landing_pages_v" CASCADE;
  DROP TABLE "_landing_pages_v_locales" CASCADE;
  DROP TABLE "_landing_pages_v_rels" CASCADE;
  DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_blocks_hero_highlights" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_grid_items" CASCADE;
  DROP TABLE "pages_blocks_grid" CASCADE;
  DROP TABLE "pages_blocks_problems_items" CASCADE;
  DROP TABLE "pages_blocks_problems" CASCADE;
  DROP TABLE "pages_blocks_services_items" CASCADE;
  DROP TABLE "pages_blocks_services" CASCADE;
  DROP TABLE "pages_blocks_flow_steps" CASCADE;
  DROP TABLE "pages_blocks_flow" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans_contents" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans" CASCADE;
  DROP TABLE "pages_blocks_pricing" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_company_services" CASCADE;
  DROP TABLE "pages_blocks_company" CASCADE;
  DROP TABLE "pages_blocks_contact_footer_items" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "pages_blocks_section" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_table_of_contents_headings" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_problems_items" CASCADE;
  DROP TABLE "_pages_v_blocks_problems" CASCADE;
  DROP TABLE "_pages_v_blocks_services_items" CASCADE;
  DROP TABLE "_pages_v_blocks_services" CASCADE;
  DROP TABLE "_pages_v_blocks_flow_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_flow" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans_contents" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_company_services" CASCADE;
  DROP TABLE "_pages_v_blocks_company" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_footer_items" CASCADE;
  DROP TABLE "_pages_v_blocks_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_section" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_version_table_of_contents_headings" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts_table_of_contents_headings" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_table_of_contents_headings" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "form_rate_limits" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_icons_category";
  DROP TYPE "public"."enum_ui_copy_keys_translations_locale";
  DROP TYPE "public"."enum_landing_sections_blocks_hero_primary_c_t_a_variant";
  DROP TYPE "public"."enum_landing_sections_blocks_hero_primary_c_t_a_icon";
  DROP TYPE "public"."enum_landing_sections_blocks_hero_primary_c_t_a_type";
  DROP TYPE "public"."enum_landing_sections_blocks_hero_secondary_c_t_a_variant";
  DROP TYPE "public"."enum_landing_sections_blocks_hero_secondary_c_t_a_icon";
  DROP TYPE "public"."enum_landing_sections_blocks_hero_secondary_c_t_a_type";
  DROP TYPE "public"."enum_landing_sections_blocks_hero_right_visual";
  DROP TYPE "public"."enum_landing_sections_blocks_grid_columns";
  DROP TYPE "public"."enum_landing_sections_blocks_pricing_plans_style_preset";
  DROP TYPE "public"."enum_landing_sections_blocks_pricing_plans_cta_variant";
  DROP TYPE "public"."enum_landing_sections_blocks_pricing_plans_cta_icon";
  DROP TYPE "public"."enum_landing_sections_blocks_pricing_plans_cta_type";
  DROP TYPE "public"."enum_landing_sections_blocks_contact_footer_items_kind";
  DROP TYPE "public"."v";
  DROP TYPE "public"."i";
  DROP TYPE "public"."t";
  DROP TYPE "public"."enum_landing_sections_blocks_section_background";
  DROP TYPE "public"."enum_landing_sections_status";
  DROP TYPE "public"."enum__landing_sections_v_blocks_hero_primary_c_t_a_variant";
  DROP TYPE "public"."enum__landing_sections_v_blocks_hero_primary_c_t_a_icon";
  DROP TYPE "public"."enum__landing_sections_v_blocks_hero_primary_c_t_a_type";
  DROP TYPE "public"."enum__landing_sections_v_blocks_hero_secondary_c_t_a_variant";
  DROP TYPE "public"."enum__landing_sections_v_blocks_hero_secondary_c_t_a_icon";
  DROP TYPE "public"."enum__landing_sections_v_blocks_hero_secondary_c_t_a_type";
  DROP TYPE "public"."enum__landing_sections_v_blocks_hero_right_visual";
  DROP TYPE "public"."enum__landing_sections_v_blocks_grid_columns";
  DROP TYPE "public"."enum__landing_sections_v_blocks_pricing_plans_style_preset";
  DROP TYPE "public"."enum__landing_sections_v_blocks_pricing_plans_cta_variant";
  DROP TYPE "public"."enum__landing_sections_v_blocks_pricing_plans_cta_icon";
  DROP TYPE "public"."enum__landing_sections_v_blocks_pricing_plans_cta_type";
  DROP TYPE "public"."enum__landing_sections_v_blocks_contact_footer_items_kind";
  DROP TYPE "public"."enum__landing_sections_v_blocks_section_background";
  DROP TYPE "public"."enum__landing_sections_v_version_status";
  DROP TYPE "public"."enum__landing_sections_v_published_locale";
  DROP TYPE "public"."enum_landing_pages_status";
  DROP TYPE "public"."enum__landing_pages_v_version_status";
  DROP TYPE "public"."enum__landing_pages_v_published_locale";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_hero_primary_c_t_a_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_primary_c_t_a_icon";
  DROP TYPE "public"."enum_pages_blocks_hero_primary_c_t_a_type";
  DROP TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_icon";
  DROP TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_type";
  DROP TYPE "public"."enum_pages_blocks_hero_right_visual";
  DROP TYPE "public"."enum_pages_blocks_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_style_preset";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_cta_icon";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_cta_type";
  DROP TYPE "public"."enum_pages_blocks_contact_footer_items_kind";
  DROP TYPE "public"."enum_pages_blocks_section_background";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_hero_primary_c_t_a_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_primary_c_t_a_icon";
  DROP TYPE "public"."enum__pages_v_blocks_hero_primary_c_t_a_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_icon";
  DROP TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_right_visual";
  DROP TYPE "public"."enum__pages_v_blocks_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_style_preset";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_cta_icon";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_contact_footer_items_kind";
  DROP TYPE "public"."enum__pages_v_blocks_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_form_rate_limits_window";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_header_login_c_t_a_type";
  DROP TYPE "public"."enum_header_consultation_c_t_a_type";
  DROP TYPE "public"."enum_footer_nav_items_link_type";`)
}

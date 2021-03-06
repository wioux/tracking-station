# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160314055912) do

  create_table "bodies", force: :cascade do |t|
    t.string   "name",                       null: false
    t.string   "classification",             null: false
    t.float    "radius_km"
    t.float    "inner_ring_radius_km"
    t.float    "outer_ring_radius_km"
    t.float    "north_pole_right_ascension"
    t.float    "north_pole_declination"
    t.string   "color"
    t.string   "texture"
    t.string   "ring_texture"
    t.integer  "parent_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.text     "info"
    t.string   "sprite"
    t.string   "horizons_id"
  end

  create_table "ephemerides", force: :cascade do |t|
    t.integer "satellite_id",                            null: false
    t.integer "central_body_id",                         null: false
    t.decimal "jd",              precision: 8, scale: 8, null: false
    t.decimal "ec",              precision: 8, scale: 8, null: false
    t.decimal "ma",              precision: 8, scale: 8, null: false
    t.decimal "ta",              precision: 8, scale: 8, null: false
    t.decimal "n",               precision: 8, scale: 8, null: false
    t.decimal "a",               precision: 8, scale: 8, null: false
    t.decimal "qr",              precision: 8, scale: 8, null: false
    t.decimal "ad",              precision: 8, scale: 8, null: false
    t.decimal "inc",             precision: 8, scale: 8, null: false
    t.decimal "om",              precision: 8, scale: 8, null: false
    t.decimal "w",               precision: 8, scale: 8, null: false
    t.decimal "pr",              precision: 8, scale: 8, null: false
    t.decimal "tp",              precision: 8, scale: 8, null: false
  end

  create_table "timeline_events", force: :cascade do |t|
    t.integer "body_id"
    t.string  "description",                         null: false
    t.decimal "jd",          precision: 8, scale: 8, null: false
  end

end

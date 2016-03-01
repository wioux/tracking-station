class CreateEphemerides < ActiveRecord::Migration
  def change
    create_table :ephemerides do |t|
      t.references :satellite, null: false
      t.references :central_body, null: false

      t.decimal :jd , precision: 8, scale: 8, null: false
      t.decimal :ec , precision: 8, scale: 8, null: false
      t.decimal :ma , precision: 8, scale: 8, null: false
      t.decimal :ta , precision: 8, scale: 8, null: false
      t.decimal :n  , precision: 8, scale: 8, null: false
      t.decimal :a  , precision: 8, scale: 8, null: false
      t.decimal :qr , precision: 8, scale: 8, null: false
      t.decimal :ad , precision: 8, scale: 8, null: false
      t.decimal :inc, precision: 8, scale: 8, null: false
      t.decimal :om , precision: 8, scale: 8, null: false
      t.decimal :w  , precision: 8, scale: 8, null: false
      t.decimal :pr , precision: 8, scale: 8, null: false
      t.decimal :tp , precision: 8, scale: 8, null: false
    end
  end
end

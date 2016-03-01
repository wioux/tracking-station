class CreateBodies < ActiveRecord::Migration
  def change
    create_table :bodies do |t|
      t.string :name, null: false
      t.string :classification, null: false
      t.float :radius_km

      t.string :color
      t.string :texture

      t.references :parent # temporary

      t.timestamps null: false
    end
  end
end

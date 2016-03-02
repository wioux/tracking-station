class CreateBodies < ActiveRecord::Migration
  def change
    create_table :bodies do |t|
      t.string :name, null: false
      t.string :classification, null: false

      t.float :radius_km
      t.float :inner_ring_radius_km
      t.float :outer_ring_radius_km

      t.float :north_pole_right_ascension
      t.float :north_pole_declination

      t.string :color
      t.string :texture
      t.string :ring_texture

      t.references :parent # temporary

      t.timestamps null: false
    end
  end
end

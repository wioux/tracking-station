class AddHorizonsIdToBodies < ActiveRecord::Migration
  def change
    add_column :bodies, :horizons_id, :string
  end
end

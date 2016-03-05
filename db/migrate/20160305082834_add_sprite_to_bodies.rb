class AddSpriteToBodies < ActiveRecord::Migration
  def change
    add_column :bodies, :sprite, :string
  end
end

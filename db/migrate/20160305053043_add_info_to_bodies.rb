class AddInfoToBodies < ActiveRecord::Migration
  def change
    add_column :bodies, :info, :text
  end
end

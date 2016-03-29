class CreateTimelineEvents < ActiveRecord::Migration
  def change
    create_table :timeline_events do |t|
      t.references :body
      t.string :description, null: false
      t.decimal :jd, precision: 8, scale: 8, null: false
    end
  end
end

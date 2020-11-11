class CreateWords < ActiveRecord::Migration[5.2]
  def self.up
    create_table :words do |t|
      t.string :word
      t.integer :times
      t.integer :passes

      t.timestamps
    end
  end

  def self.down
    drop_table :words
  end
end

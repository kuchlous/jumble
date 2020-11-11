class CreateWordBox < ActiveRecord::Migration[5.2]
  def self.up
    create_table :word_boxes do |t|
      t.text :word_array_json
      t.text :words_fit_json
      t.timestamps
    end
  end

  def self.down
    drop_table :word_boxes
  end
end

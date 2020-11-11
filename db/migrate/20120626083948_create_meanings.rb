class CreateMeanings < ActiveRecord::Migration[5.2]
  def change
    create_table :meanings do |t|
      t.integer :word_id
      t.string  :gtype
      t.string  :meaning

      t.timestamps
    end
  end
end
